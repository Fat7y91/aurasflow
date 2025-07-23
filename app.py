import os
from flask import Flask, render_template, request, session, redirect, send_from_directory
from openai import OpenAI
from dotenv import load_dotenv
from flask import make_response
from fpdf import FPDF

# تحميل المتغيرات من .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "default_secret_123")
api_key_value = os.getenv("DEEPSEEK_API_KEY")

# التحقق من المفتاح
if not api_key_value:
    print("❌ لم يتم العثور على DEEPSEEK_API_KEY")

# الترجمات
translations = {
    'ar': {
        'title': 'مصمم المنشورات بالذكاء الاصطناعي',
        'placeholder': 'اكتب وصف التصميم المطلوب...',
        'button': '<i class="fas fa-magic"></i> أنشئ التصميم',
        'result_title': '✅ التصميم الجاهز:',
        'switch_ar': 'عربي',
        'switch_en': 'English',
        'footer': 'تم التطوير بحب باستخدام Aurasflow & DeepSeek',
        'creativity_label': 'درجة الإبداع',
        'creativity_low': 'منخفض',
        'creativity_medium': 'متوسط',
        'creativity_high': 'مرتفع',
        'copy_alert': 'تم النسخ!',
        'download_pdf': 'تحميل PDF'
    },
    'en': {
        'title': 'AI Post Design Generator',
        'placeholder': 'Describe your design idea...',
        'button': '<i class="fas fa-magic"></i> Generate Design',
        'result_title': '✅ Generated Result:',
        'switch_ar': 'عربي',
        'switch_en': 'English',
        'footer': 'Built with ♥ using Aurasflow & DeepSeek',
        'creativity_label': 'Creativity Level',
        'creativity_low': 'Low',
        'creativity_medium': 'Medium',
        'creativity_high': 'High',
        'copy_alert': 'Copied!',
        'download_pdf': 'Download PDF'
    }
}

# تحديد اللغة
def get_current_language():
    return session.get('lang', 'ar')

# الرئيسية
@app.route('/')
def home():
    lang = get_current_language()
    return render_template('index.html', lang=lang, translations=translations)

# تغيير اللغة
@app.route('/set_lang/<language>')
def set_language(language):
    if language in ['ar', 'en']:
        session['lang'] = language
    return redirect('/')

# توليد التصميم
@app.route('/generate', methods=['POST'])
def generate_design():
    lang = get_current_language()
    prompt = request.form.get('prompt', '')
    creativity = request.form.get('creativity', 'medium')

    if not api_key_value:
        error_msg = "❌ لم يتم تعيين مفتاح API" if lang == 'ar' else "❌ API key not set"
        return render_template('index.html', result=error_msg, lang=lang, translations=translations)

    full_prompt = f"{prompt.strip()} (ابداع {creativity})" if lang == 'ar' else f"{prompt.strip()} (creativity: {creativity})"

    client = OpenAI(api_key=api_key_value, base_url="https://api.deepseek.com/v1")

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": full_prompt}],
            max_tokens=2000
        )
        result_text = response.choices[0].message.content.strip()
    except Exception as e:
        result_text = f"🚫 خطأ: {str(e)}" if lang == 'ar' else f"🚫 Error: {str(e)}"

    return render_template(
        'index.html',
        result=result_text,
        prompt=prompt,
        lang=lang,
        translations=translations,
        creativity=creativity
    )

# تحميل PDF
@app.route('/download_pdf', methods=['POST'])
def download_pdf():
    result_text = request.form.get('result_text', '')
    lang = get_current_language()

    pdf = FPDF()
    pdf.add_page()
    pdf.add_font("Arial", '', 'arial.ttf', uni=True)
    pdf.set_font("Arial", size=14)
    pdf.multi_cell(0, 10, result_text)

    response = make_response(pdf.output(dest='S').encode('latin1'))
    response.headers.set('Content-Disposition', 'attachment', filename='design_result.pdf')
    response.headers.set('Content-Type', 'application/pdf')
    return response

# تشغيل
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)