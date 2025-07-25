import os
from flask import Flask, render_template, request, jsonify
import openai
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# إعداد المفاتيح من البيئة
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    creativity = data.get('creativity', 'متوسط')
    model = data.get('model', 'DeepSeek')
    mode = data.get('mode', 'focused')
    ui_language = data.get('ui_language', 'ar')

    if not prompt.strip():
        return jsonify({'error': 'الرجاء إدخال وصف الفكرة أو التصميم'}), 400

    # تحديد درجة الإبداع
    temperature = {
        'منخفض': 0.3,
        'متوسط': 0.6,
        'مرتفع': 0.9
    }.get(creativity, 0.6)

    # تحديد اللغة تلقائيًا بناءً على الأحرف
    def detect_language(text):
        arabic_chars = sum(1 for c in text if '\u0600' <= c <= '\u06FF')
        return 'ar' if arabic_chars > len(text) / 2 else 'en'

    content_language = detect_language(prompt)

    # نمط التفكير
    if mode == 'creative':
        instruction = {
            'ar': "اكتب بأسلوب إبداعي وفني.",
            'en': "Write in a creative and artistic style."
        }
    else:
        instruction = {
            'ar': "اكتب بأسلوب مباشر وواضح ومفيد.",
            'en': "Write in a direct, clear, and useful tone."
        }

    prompt_instruction = instruction[content_language]

    full_prompt = f"{prompt_instruction}\n\n{prompt}"

    try:
        if model == "DeepSeek":
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [{
                        "role": "user",
                        "content": full_prompt
                    }],
                    "temperature": temperature
                })
            result_text = response.json()["choices"][0]["message"]["content"]

        elif model == "ChatGPT":
            openai.api_key = OPENAI_API_KEY
            response = openai.ChatCompletion.create(model="gpt-3.5-turbo",
                                                    messages=[{
                                                        "role":
                                                        "user",
                                                        "content":
                                                        full_prompt
                                                    }],
                                                    temperature=temperature)
            result_text = response.choices[0].message.content

        else:
            return jsonify({'error': 'نموذج غير مدعوم'}), 400

        return jsonify({'result': result_text.strip()})

    except Exception as e:
        return jsonify({'error': f'حدث خطأ: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
