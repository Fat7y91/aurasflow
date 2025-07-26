# app.py
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aurasflow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

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
    projects = db.relationship('Project', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# نموذج المشروع
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(200))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(50))
    target_audience = db.Column(db.String(100))
    social_links = db.relationship('SocialLink', backref='project', lazy=True, cascade='all, delete-orphan')
    marketing_plans = db.relationship('MarketingPlan', backref='project', lazy=True, cascade='all, delete-orphan')

# نموذج حسابات التواصل الاجتماعي
class SocialLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    platform = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(100))
    url = db.Column(db.String(200))
    api_key = db.Column(db.String(200))
    api_secret = db.Column(db.String(200))
    access_token = db.Column(db.String(200))
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

# نموذج الخطة التسويقية (جديد)
class MarketingPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    items = db.relationship('PlanItem', backref='plan', lazy=True, cascade='all, delete-orphan')

# نموذج عنصر الخطة (جديد)
class PlanItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey('marketing_plan.id'), nullable=False)
    type = db.Column(db.String(20))
    content = db.Column(db.Text)
    platform = db.Column(db.String(50))
    scheduled_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')
    generated_content = db.Column(db.Text)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# المسارات الأساسية
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            flash('اسم المستخدم أو البريد الإلكتروني موجود مسبقاً', 'danger')
            return redirect(url_for('register'))
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('تم إنشاء حسابك بنجاح! يمكنك تسجيل الدخول الآن', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            user.last_login = datetime.utcnow()
            db.session.commit()
            return redirect(url_for('dashboard'))
        
        flash('بيانات الدخول غير صحيحة', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', projects=projects)

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        current_user.username = request.form['username']
        current_user.email = request.form['email']
        
        new_password = request.form.get('new_password')
        if new_password:
            current_user.set_password(new_password)
        
        db.session.commit()
        flash('تم تحديث الملف الشخصي بنجاح', 'success')
        return redirect(url_for('profile'))
    
    return render_template('profile.html')

# مسارات المشاريع
@app.route('/projects')
@login_required
def projects():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    return render_template('projects.html', projects=projects)

@app.route('/projects/create', methods=['GET', 'POST'])
@login_required
def create_project():
    if request.method == 'POST':
        name = request.form['name']
        website = request.form['website']
        description = request.form['description']
        project_type = request.form['type']
        target_audience = request.form['target_audience']
        
        new_project = Project(
            name=name,
            website=website,
            description=description,
            user_id=current_user.id,
            type=project_type,
            target_audience=target_audience
        )
        db.session.add(new_project)
        db.session.commit()
        
        flash('تم إنشاء المشروع بنجاح', 'success')
        return redirect(url_for('project_detail', project_id=new_project.id))
    
    return render_template('create_project.html')

@app.route('/projects/<int:project_id>')
@login_required
def project_detail(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    return render_template('project_detail.html', project=project)

@app.route('/projects/<int:project_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    if request.method == 'POST':
        project.name = request.form['name']
        project.website = request.form['website']
        project.description = request.form['description']
        project.type = request.form['type']
        project.target_audience = request.form['target_audience']
        
        db.session.commit()
        flash('تم تحديث المشروع بنجاح', 'success')
        return redirect(url_for('project_detail', project_id=project.id))
    
    return render_template('edit_project.html', project=project)

@app.route('/projects/<int:project_id>/delete', methods=['POST'])
@login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    db.session.delete(project)
    db.session.commit()
    flash('تم حذف المشروع بنجاح', 'success')
    return redirect(url_for('projects'))

@app.route('/projects/<int:project_id>/social', methods=['GET', 'POST'])
@login_required
def manage_social(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    if request.method == 'POST':
        platform = request.form['platform']
        username = request.form['username']
        url = request.form['url']
        api_key = request.form.get('api_key', '')
        api_secret = request.form.get('api_secret', '')
        access_token = request.form.get('access_token', '')
        
        new_link = SocialLink(
            platform=platform,
            username=username,
            url=url,
            api_key=api_key,
            api_secret=api_secret,
            access_token=access_token,
            project_id=project.id
        )
        db.session.add(new_link)
        db.session.commit()
        flash('تم إضافة حساب التواصل بنجاح', 'success')
        return redirect(url_for('manage_social', project_id=project.id))
    
    return render_template('manage_social.html', project=project)

# مسارات توليد المحتوى
@app.route('/projects/<int:project_id>/generate-content', methods=['GET', 'POST'])
@login_required
def generate_content(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    if request.method == 'POST':
        # حساب التكلفة
        designs = int(request.form.get('designs', 0))
        videos = int(request.form.get('videos', 0))
        articles = int(request.form.get('articles', 0))
        
        cost = (designs * 5) + (videos * 15) + (articles * 10)
        
        if current_user.credits < cost:
            flash('نقاطك غير كافية لإتمام العملية', 'danger')
            return redirect(url_for('generate_content', project_id=project.id))
        
        # توليد المحتوى (سيتم استبدال هذا بمولد حقيقي لاحقاً)
        generated_content = [
            {"type": "design", "content": "تصميم 1", "cost": 5},
            {"type": "design", "content": "تصميم 2", "cost": 5},
            {"type": "video", "content": "فيديو 1", "cost": 15},
            {"type": "article", "content": "مقال 1", "cost": 10},
        ]
        
        # خصم النقاط
        current_user.credits -= cost
        db.session.commit()
        
        # حفظ المحتوى في الجلسة مؤقتاً
        session['generated_content'] = generated_content
        return redirect(url_for('content_results', project_id=project.id))
    
    return render_template('generate_content.html', project=project)

@app.route('/projects/<int:project_id>/content-results')
@login_required
def content_results(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return render_template('403.html'), 403
    
    generated_content = session.get('generated_content', [])
    if not generated_content:
        flash('لا يوجد محتوى معروض حالياً', 'warning')
        return redirect(url_for('generate_content', project_id=project.id))
    
    return render_template('content_results.html', project=project, content=generated_content)

# مسارات الخطة التسويقية (جديدة)
@app.route('/projects/<int:project_id>/generate-plan', methods=['GET', 'POST'])
@login_required
def generate_marketing_plan(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        flash('غير مسموح بالوصول إلى هذا المشروع', 'danger')
        return redirect(url_for('dashboard'))
    
    current_date = datetime.utcnow()
    current_month = current_date.month
    current_year = current_date.year

    if request.method == 'POST':
        # التحقق من رصيد المستخدم
        if current_user.credits < 50:
            flash('نقاطك غير كافية، يلزم 50 نقطة لتوليد الخطة', 'danger')
            return redirect(url_for('generate_marketing_plan', project_id=project.id))
        
        # قراءة البيانات من النموذج
        month = int(request.form['month'])
        year = int(request.form['year'])
        notes = request.form.get('notes', '')
        platforms = request.form.getlist('platforms')
        
        # إنشاء خطة تسويقية جديدة
        plan = MarketingPlan(
            project_id=project.id,
            month=month,
            year=year
        )
        db.session.add(plan)
        db.session.commit()
        
        # خصم النقاط
        current_user.credits -= 50
        db.session.commit()
        
        # توليد عناصر الخطة (سيتم استبدال هذا بمولد حقيقي لاحقاً)
        start_date = datetime(year, month, 1)
        for i in range(30):
            item = PlanItem(
                plan_id=plan.id,
                type='design',
                content=f"فكرة تصميم #{i+1}",
                platform='instagram',
                scheduled_time=start_date + timedelta(days=i, hours=12),
                status='pending'
            )
            db.session.add(item)
        
        db.session.commit()
        flash('تم إنشاء الخطة بنجاح!', 'success')
        return redirect(url_for('view_marketing_plan', plan_id=plan.id))
    
    return render_template('generate_plan.html', project=project, current_month=current_month, current_year=current_year)

@app.route('/plans/<int:plan_id>')
@login_required
def view_marketing_plan(plan_id):
    plan = MarketingPlan.query.get_or_404(plan_id)
    if plan.project.user_id != current_user.id:
        flash('غير مسموح بالوصول إلى هذه الخطة', 'danger')
        return redirect(url_for('dashboard'))
    
    # ترتيب العناصر حسب الوقت المبرمج
    plan.items.sort(key=lambda x: x.scheduled_time)
    return render_template('view_plan.html', plan=plan)

@app.route('/plans/<int:plan_id>/approve', methods=['POST'])
@login_required
def approve_marketing_plan(plan_id):
    plan = MarketingPlan.query.get_or_404(plan_id)
    if plan.project.user_id != current_user.id:
        return jsonify({'success': False, 'message': 'غير مسموح'}), 403
    
    plan.status = 'approved'
    plan.approved_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'success': True})

# معالجة الأخطاء
@app.errorhandler(400)
def bad_request_error(error):
    return render_template('400.html'), 400

@app.errorhandler(401)
def unauthorized_error(error):
    return render_template('401.html'), 401

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('403.html'), 403

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)