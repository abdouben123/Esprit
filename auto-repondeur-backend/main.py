from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-2.0-flash"

def load_context():
    with open("context.txt", "r", encoding="utf-8") as f:
        return f.read()

# Historique global sous forme de liste de chaînes
conversation_history = []

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt_user = data.get("prompt", "")

    if not prompt_user:
        return jsonify({"error": "Le champ 'prompt' est requis."}), 400

    global conversation_history
    # Ajoute la question utilisateur à l'historique
    conversation_history.append(f"Étudiant : {prompt_user}")

    # Charge le contexte de base
    context = load_context()

    # Construit le prompt complet : contexte + historique + nouvelle question
    full_prompt = context + "\n\n" + "\n".join(conversation_history) + "\nAssistant :"

    try:
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(full_prompt)
        answer = response.text.strip()

        # Ajoute la réponse à l'historique
        conversation_history.append(f"Assistant : {answer}")

        # Optionnel : limite la taille de l'historique pour éviter un prompt trop long
        if len(conversation_history) > 20:
            conversation_history = conversation_history[-20:]

        return jsonify({"response": answer})

    except Exception as e:
        print(f"Erreur Gemini API : {e}")
        return jsonify({"error": f"Erreur Gemini API : {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)