import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, abort, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from langdetect import detect
from flask_caching import Cache
from flask_migrate import Migrate

# التصحيح: تحديد مسارات المجلدات بشكل صريح
app = Flask(__name__, 
            static_folder='static', 
            template_folder='templates')

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# إعداد نظام التخزين المؤقت
cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
cache.init_app(app)

# إعداد قاعدة البيانات
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# إعداد نظام تسجيل الدخول
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# إعداد نظام تسجيل الأخطاء
logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

# نموذج المستخدم
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    credits = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# نماذج إضافية للمشاريع وروابط التواصل الاجتماعي
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(200))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    social_links = db.relationship('SocialLink', backref='project', lazy=True, cascade='all, delete-orphan')

class SocialLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    platform = db.Column(db.String(50), nullable=False)  # instagram, tiktok, x, facebook, etc.
    url = db.Column(db.String(200), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    api_key = db.Column(db.String(200))  # لتخزين مفاتيح API
    api_secret = db.Column(db.String(200))
    access_token = db.Column(db.String(200))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def get_language(prompt):
    try:
        lang = detect(prompt)
        return 'arabic' if lang == 'ar' else 'english'
    except:
        return 'english'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
@login_required
@cache.memoize(timeout=300)
def generate():
    # التحقق من أن المستخدم لديه رصيد كافي
    if current_user.credits < 5:
        return jsonify({'error': 'رصيدك غير كافي. يرجى شحن النقاط.'}), 400
    
    data = request.get_json()
    prompt = data.get('prompt', '').strip()
    creativity = data.get('creativity', 'medium')
    selected_language = data.get('language', 'auto')
    
    # التحقق من صحة الإدخال
    if not prompt or len(prompt) < 10:
        app.logger.warning(f"إدخال غير صالح: {prompt}")
        abort(400, "الرجاء إدخال وصف مفصل (10 أحرف على الأقل)")
    
    # تحديد اللغة
    if selected_language == 'auto':
        language = get_language(prompt)
    else:
        language = selected_language
    
    # محاكاة توليد المحتوى
    result = {
        "ideas": [
            "فكرة تصميم 1 بناءً على: " + prompt,
            "فكرة تصميم 2 مستوحاة من: " + prompt
        ],
        "language": language,
        "creativity": creativity
    }
    
    # خصم النقاط (5 نقاط لكل توليد)
    current_user.credits -= 5
    db.session.commit()
    
    return jsonify(result)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # التحقق من تطابق كلمات المرور
        if password != confirm_password:
            return render_template('register.html', error='كلمات المرور غير متطابقة')
        
        # التحقق من عدم وجود مستخدم بنفس البيانات
        if User.query.filter_by(username=username).first():
            return render_template('register.html', error='اسم المستخدم موجود مسبقاً')
            
        if User.query.filter_by(email=email).first():
            return render_template('register.html', error='البريد الإلكتروني موجود مسبقاً')
            
        # إنشاء مستخدم جديد
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        flash('تم تسجيل الحساب بنجاح!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return render_template('login.html', error='بيانات الدخول غير صحيحة')
            
        login_user(user)
        user.last_login = datetime.utcnow()
        db.session.commit()
        flash('تم تسجيل الدخول بنجاح!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('تم تسجيل الخروج بنجاح', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        # تحديث معلومات المستخدم
        current_user.email = request.form['email']
        
        # تحديث كلمة المرور إذا تم إدخالها
        new_password = request.form.get('new_password')
        if new_password:
            if len(new_password) < 8:
                flash('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'danger')
            else:
                current_user.set_password(new_password)
                flash('تم تحديث كلمة المرور بنجاح', 'success')
        
        db.session.commit()
        flash('تم تحديث الملف الشخصي بنجاح', 'success')
        return redirect(url_for('profile'))
    
    return render_template('profile.html', user=current_user)

@app.route('/user/credits')
@login_required
def get_user_credits():
    return jsonify({'credits': current_user.credits})

# مسارات جديدة لإدارة المشاريع
@app.route('/projects')
@login_required
def projects():
    user_projects = Project.query.filter_by(user_id=current_user.id).all()
    return render_template('projects.html', projects=user_projects)

@app.route('/projects/create', methods=['GET', 'POST'])
@login_required
def create_project():
    if request.method == 'POST':
        name = request.form['name']
        website = request.form.get('website', '')
        description = request.form.get('description', '')
        
        # إنشاء مشروع جديد
        new_project = Project(
            name=name, 
            website=website,
            description=description,
            user_id=current_user.id
        )
        
        db.session.add(new_project)
        db.session.commit()
        
        flash('تم إنشاء المشروع بنجاح!', 'success')
        return redirect(url_for('project_detail', project_id=new_project.id))
    
    return render_template('create_project.html')

@app.route('/projects/<int:project_id>')
@login_required
def project_detail(project_id):
    project = Project.query.get_or_404(project_id)
    
    # التحقق من أن المشروع للمستخدم الحالي
    if project.user_id != current_user.id:
        abort(403)
    
    return render_template('project_detail.html', project=project)

@app.route('/projects/<int:project_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    
    # التحقق من أن المشروع للمستخدم الحالي
    if project.user_id != current_user.id:
        abort(403)
    
    if request.method == 'POST':
        project.name = request.form['name']
        project.website = request.form.get('website', '')
        project.description = request.form.get('description', '')
        
        db.session.commit()
        flash('تم تحديث المشروع بنجاح!', 'success')
        return redirect(url_for('project_detail', project_id=project.id))
    
    return render_template('edit_project.html', project=project)

@app.route('/projects/<int:project_id>/delete', methods=['POST'])
@login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        abort(403)
    
    db.session.delete(project)
    db.session.commit()
    flash('تم حذف المشروع بنجاح!', 'success')
    return redirect(url_for('projects'))

@app.route('/projects/<int:project_id>/social', methods=['GET', 'POST'])
@login_required
def manage_social_links(project_id):
    project = Project.query.get_or_404(project_id)
    
    # التحقق من أن المشروع للمستخدم الحالي
    if project.user_id != current_user.id:
        abort(403)
    
    platforms = ['instagram', 'tiktok', 'x', 'facebook', 'youtube', 'linkedin']
    
    if request.method == 'POST':
        # حذف الروابط الحالية وإضافة الجديدة
        SocialLink.query.filter_by(project_id=project.id).delete()
        
        for platform in platforms:
            url = request.form.get(f'url_{platform}', '')
            api_key = request.form.get(f'api_key_{platform}', '')
            api_secret = request.form.get(f'api_secret_{platform}', '')
            access_token = request.form.get(f'access_token_{platform}', '')
            
            if url:
                new_link = SocialLink(
                    platform=platform,
                    url=url,
                    api_key=api_key,
                    api_secret=api_secret,
                    access_token=access_token,
                    project_id=project.id
                )
                db.session.add(new_link)
        
        db.session.commit()
        flash('تم تحديث روابط التواصل الاجتماعي بنجاح!', 'success')
        return redirect(url_for('project_detail', project_id=project.id))
    
    # جمع الروابط الحالية في قاموس للعرض
    social_links = {link.platform: link for link in project.social_links}
    
    return render_template('manage_social.html', 
                           project=project, 
                           platforms=platforms,
                           social_links=social_links)

@app.route('/projects/<int:project_id>/generate-content', methods=['GET', 'POST'])
@login_required
def generate_content(project_id):
    project = Project.query.get_or_404(project_id)
    
    # التحقق من أن المشروع للمستخدم الحالي
    if project.user_id != current_user.id:
        abort(403)
    
    if request.method == 'POST':
        # جمع بيانات النموذج
        content_type = request.form.get('content_type')
        project_type = request.form.get('project_type')
        target_audience = request.form.get('target_audience')
        content_tone = request.form.get('content_tone')
        num_designs = int(request.form.get('num_designs', 0))
        num_videos = int(request.form.get('num_videos', 0))
        num_articles = int(request.form.get('num_articles', 0))
        notes = request.form.get('notes', '')
        
        # التحقق من توفر النقاط الكافية
        total_cost = (num_designs * 5) + (num_videos * 15) + (num_articles * 10)
        if current_user.credits < total_cost:
            flash('رصيدك غير كافي لتنفيذ هذه الكمية من المحتوى', 'danger')
            return redirect(url_for('generate_content', project_id=project_id))
        
        # بناء الـ prompt
        prompt = f"""
        ## معلومات المشروع:
        - اسم المشروع: {project.name}
        - نوع المشروع: {project_type}
        - الجمهور المستهدف: {target_audience}
        - نغمة المحتوى: {content_tone}
        - ملاحظات إضافية: {notes}
        
        ## المحتوى المطلوب:
        - تصميمات: {num_designs}
        - فيديوهات: {num_videos}
        - مقالات: {num_articles}
        
        ## التعليمات:
        قم بتوليد أفكار إبداعية للمحتوى بناءً على المعلومات أعلاه.
        """
        
        # محاكاة توليد المحتوى (سيتم استبدالها بالتكامل الفعلي مع الذكاء الاصطناعي)
        result = {
            "designs": [f"تصميم {i+1} لمشروع {project.name}" for i in range(num_designs)],
            "videos": [f"فكرة فيديو {i+1} لمشروع {project.name}" for i in range(num_videos)],
            "articles": [f"مقال {i+1} لمشروع {project.name}" for i in range(num_articles)],
        }
        
        # خصم النقاط
        current_user.credits -= total_cost
        db.session.commit()
        
        # حفظ النتائج في الجلسة لعرضها
        flash('تم توليد المحتوى بنجاح!', 'success')
        return render_template('content_results.html', 
                               project=project, 
                               result=result,
                               total_cost=total_cost)
    
    # قوائم الاختيارات
    project_types = [
        'تجزئة', 'خدمات', 'تكنولوجيا', 'تعليم', 'صحة وجمال',
        'طعام ومشروبات', 'سياحة وسفر', 'عقارات', 'تسويق', 'أخرى'
    ]
    
    target_audiences = [
        'الجميع', 'المراهقين', 'الشباب (18-25)', 'البالغين (25-40)', 'كبار السن (40+)',
        'النساء', 'الرجال', 'الأطفال', 'المهنيين', 'رواد الأعمال'
    ]
    
    content_tones = [
        'احترافي', 'ودود', 'متحمس', 'مضحك', 'مؤثر',
        'تعليمي', 'إخباري', 'تحفيزي', 'ترفيهي', 'رسمي'
    ]
    
    return render_template('generate_content.html', 
                           project=project,
                           project_types=project_types,
                           target_audiences=target_audiences,
                           content_tones=content_tones)

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': error.description}), 400

@app.errorhandler(401)
def unauthorized(error):
    return redirect(url_for('login'))

@app.errorhandler(403)
def forbidden(error):
    return render_template('403.html'), 403

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"خطأ في الخادم: {error}")
    return render_template('500.html'), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)