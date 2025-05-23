import openai
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

openai.api_key = "secret key"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    try:
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=100
        )
        answer = response.choices[0].message.content
    except Exception as e:
        answer = f"Błąd: {e}"

    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)



