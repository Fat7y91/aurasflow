import os
import logging
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key-here")

# Initialize DeepSeek client (compatible with OpenAI API)
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
if not DEEPSEEK_API_KEY:
    logging.error("No API key found. Please set DEEPSEEK_API_KEY in environment variables.")

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)

# Language translations
TRANSLATIONS = {
    'en': {
        'title': 'AurasFlow - AI Design Generator',
        'subtitle': 'Generate stunning marketing designs with AI',
        'prompt_placeholder': 'Describe your marketing design in detail (e.g., "Create a modern social media post for a coffee shop with warm colors and elegant typography")',
        'generate_btn': 'Generate Design',
        'language': 'Language',
        'arabic': 'العربية',
        'english': 'English',
        'generating': 'Generating your design...',
        'error': 'Error',
        'error_no_prompt': 'Please enter a design description.',
        'error_api': 'Failed to generate design. Please try again.',
        'design_result': 'Generated Design Concept',
        'new_design': 'Generate New Design'
    },
    'ar': {
        'title': 'أوراس فلو - مولد التصاميم بالذكاء الاصطناعي',
        'subtitle': 'أنشئ تصاميم تسويقية مذهلة بالذكاء الاصطناعي',
        'prompt_placeholder': 'اوصف تصميمك التسويقي بالتفصيل (مثال: "أنشئ منشور حديث لوسائل التواصل الاجتماعي لمقهى بألوان دافئة وخط أنيق")',
        'generate_btn': 'إنشاء التصميم',
        'language': 'اللغة',
        'arabic': 'العربية',
        'english': 'English',
        'generating': 'جاري إنشاء تصميمك...',
        'error': 'خطأ',
        'error_no_prompt': 'يرجى إدخال وصف للتصميم.',
        'error_api': 'فشل في إنشاء التصميم. يرجى المحاولة مرة أخرى.',
        'design_result': 'مفهوم التصميم المُنشأ',
        'new_design': 'إنشاء تصميم جديد'
    }
}

def get_current_language():
    """Get the current language from session, default to English"""
    return session.get('language', 'en')

def get_translations(lang=None):
    """Get translations for the current or specified language"""
    if lang is None:
        lang = get_current_language()
    return TRANSLATIONS.get(lang, TRANSLATIONS['en'])

@app.route('/')
def index():
    """Main page route"""
    lang = get_current_language()
    translations = get_translations(lang)
    return render_template('index.html', 
                         translations=translations, 
                         current_lang=lang)

@app.route('/set_lang/<lang>')
def set_language(lang):
    """Set the language and redirect back to main page"""
    if lang in ['en', 'ar']:
        session['language'] = lang
        logging.debug(f"Language set to: {lang}")
    return redirect(url_for('index'))

@app.route('/generate', methods=['POST'])
def generate_design():
    """Generate design using OpenAI API"""
    try:
        # Get form data
        prompt = request.form.get('prompt', '').strip()
        lang = get_current_language()
        translations = get_translations(lang)
        
        if not prompt:
            return render_template('index.html', 
                                 translations=translations,
                                 current_lang=lang,
                                 error=translations['error_no_prompt'])
        
        logging.debug(f"Generating design for prompt: {prompt} (language: {lang})")
        
        # Create AI prompt based on language
        if lang == 'ar':
            system_prompt = """أنت مصمم جرافيك خبير ومستشار تسويقي. ستتلقى وصفاً لتصميم تسويقي وعليك أن تقدم مفهوماً تفصيلياً ومهنياً للتصميم.

يجب أن تشمل استجابتك:
1. المفهوم العام للتصميم
2. نظام الألوان المقترح
3. الخطوط والتايبوغرافي
4. العناصر البصرية والتخطيط
5. نصائح للتنفيذ

قدم استجابة مفصلة ومهنية باللغة العربية."""
            
            user_prompt = f"أريد تصميماً تسويقياً بالمواصفات التالية: {prompt}"
        else:
            system_prompt = """You are an expert graphic designer and marketing consultant. You will receive a description of a marketing design and need to provide a detailed, professional design concept.

Your response should include:
1. Overall design concept
2. Suggested color scheme
3. Typography and fonts
4. Visual elements and layout
5. Implementation tips

Provide a detailed and professional response in English."""
            
            user_prompt = f"I want a marketing design with the following specifications: {prompt}"
        
        # Call DeepSeek API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        design_concept = response.choices[0].message.content
        logging.debug("Design generated successfully")
        
        return render_template('index.html',
                             translations=translations,
                             current_lang=lang,
                             design_result=design_concept,
                             original_prompt=prompt)
        
    except Exception as e:
        logging.error(f"Error generating design: {str(e)}")
        translations = get_translations()
        return render_template('index.html',
                             translations=translations,
                             current_lang=get_current_language(),
                             error=translations['error_api'])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
