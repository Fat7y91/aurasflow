from flask import Flask, render_template, request
from markupsafe import Markup
import requests
import json
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")


@app.route("/", methods=["GET", "POST"])
def index():
    lang = request.args.get("lang", "ar")
    idea = ""
    creativity = "medium"
    result = ""

    if request.method == "POST":
        idea = request.form.get("idea", "")
        creativity = request.form.get("creativity", "medium")

        temperature = {
            "low": 0.2,
            "medium": 0.7,
            "high": 1.0
        }.get(creativity, 0.7)

        prompt = f"""Please generate a UI design idea based on the following description:
{idea}

Your answer should be clear, well-structured, and helpful for designers.
"""

        # Check for API keys
        DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
        OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
        
        if not DEEPSEEK_API_KEY and not OPENAI_API_KEY:
            if lang == "ar":
                result = "يرجى إعداد مفتاح API للذكاء الاصطناعي (DEEPSEEK_API_KEY أو OPENAI_API_KEY) في متغيرات البيئة."
            else:
                result = "Please set up an AI API key (DEEPSEEK_API_KEY or OPENAI_API_KEY) in environment variables."
        else:
            try:
                if DEEPSEEK_API_KEY:
                    # Use DeepSeek API
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
                    }

                    payload = {
                        "model": "deepseek-chat",
                        "messages": [{
                            "role": "system",
                            "content": "You are a creative UI/UX designer assistant."
                        }, {
                            "role": "user",
                            "content": prompt
                        }],
                        "temperature": temperature,
                        "max_tokens": 600
                    }

                    response = requests.post("https://api.deepseek.com/chat/completions",
                                           headers=headers,
                                           json=payload,
                                           timeout=30)

                    if response.status_code == 200:
                        result = response.json()["choices"][0]["message"]["content"].strip()
                    else:
                        if lang == "ar":
                            result = f"خطأ في API DeepSeek: {response.status_code} - {response.text}"
                        else:
                            result = f"DeepSeek API error: {response.status_code} - {response.text}"
                            
                elif OPENAI_API_KEY:
                    # Use OpenAI API as fallback
                    from openai import OpenAI
                    client = OpenAI(api_key=OPENAI_API_KEY)
                    
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": "You are a creative UI/UX designer assistant."},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=temperature,
                        max_tokens=600
                    )
                    
                    result = response.choices[0].message.content.strip()
                    
            except requests.exceptions.Timeout:
                if lang == "ar":
                    result = "انتهت مهلة الاتصال بـ API. يرجى المحاولة مرة أخرى."
                else:
                    result = "API request timed out. Please try again."
            except requests.exceptions.RequestException as e:
                if lang == "ar":
                    result = f"خطأ في الاتصال: {str(e)}"
                else:
                    result = f"Connection error: {str(e)}"
            except Exception as e:
                if lang == "ar":
                    result = f"حدث خطأ غير متوقع: {str(e)}"
                else:
                    result = f"Unexpected error: {str(e)}"

    return render_template("index.html",
                           lang=lang,
                           idea=idea,
                           creativity=creativity,
                           result=result)
