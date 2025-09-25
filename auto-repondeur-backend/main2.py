import google.generativeai as genai

genai.configure(api_key="AIzaSyAsEAMk1yoBDIlwoDQaFgGSUBtCFYq219E")

models = genai.list_models()
print("Modèles disponibles :")
for model in models:
    print(model)
