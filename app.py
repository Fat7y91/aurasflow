from flask import Flask, render_template, request, Markup
from deepseek import DeepSeek
import os

app = Flask(__name__)

# استخدم مفتاح API من المتغيرات البيئية
deepseek = DeepSeek(api_key=os.environ.get("DEEPSEEK_API_KEY"))


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

        response = deepseek.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "system",
                "content": "You are a creative UI/UX designer assistant."
            }, {
                "role": "user",
                "content": prompt
            }],
            temperature=temperature,
            max_tokens=600)

        result = response.choices[0].message.content.strip()

    return render_template("index.html",
                           lang=lang,
                           idea=idea,
                           creativity=creativity,
                           result=result)
