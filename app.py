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

        # إعداد الطلب لـ DeepSeek API
        DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        payload = {
            "model":
            "deepseek-chat",
            "messages": [{
                "role":
                "system",
                "content":
                "You are a creative UI/UX designer assistant."
            }, {
                "role": "user",
                "content": prompt
            }],
            "temperature":
            temperature,
            "max_tokens":
            600
        }

        response = requests.post("https://api.deepseek.com/chat/completions",
                                 headers=headers,
                                 data=json.dumps(payload))

        if response.status_code == 200:
            result = response.json()["choices"][0]["message"]["content"].strip(
            )
        else:
            result = "حدث خطأ أثناء الاتصال بـ DeepSeek API."

    return render_template("index.html",
                           lang=lang,
                           idea=idea,
                           creativity=creativity,
                           result=result)
