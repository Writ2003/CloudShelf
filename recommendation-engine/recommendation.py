import random
import os
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Sample dataset (Replace with actual DB data)
books = pd.DataFrame([
    {"id": 1, "title": "Book A", "genre": "Fantasy", "author": "Author X"},
    {"id": 2, "title": "Book B", "genre": "Sci-Fi", "author": "Author Y"},
    {"id": 3, "title": "Book C", "genre": "Fantasy", "author": "Author Z"},
    {"id": 4, "title": "Book D", "genre": "Sci-Fi", "author": "Author X"},
    {"id": 5, "title": "Book E", "genre": "Mystery", "author": "Author Y"},
])

app = Flask(__name__)

PORT = int(os.getenv("PORT", 5001))  # Convert to integer

# Function to recommend books
def recommend_books(user_history):
    if not user_history:
        return books.sample(n=3).to_dict(orient="records")  # Random books for first-time users

    user_genres = [book["genre"] for book in user_history]
    user_authors = [book["author"] for book in user_history]

    books["features"] = books["genre"] + " " + books["author"]
    vectorizer = TfidfVectorizer()
    book_vectors = vectorizer.fit_transform(books["features"])
    
    user_profile = " ".join(user_genres + user_authors)
    user_vector = vectorizer.transform([user_profile])
    
    similarities = cosine_similarity(user_vector, book_vectors).flatten()
    books["similarity"] = similarities

    recommended_books = books.sort_values(by="similarity", ascending=False).head(3)
    return recommended_books.drop(columns=["features", "similarity"]).to_dict(orient="records")

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    user_history = data.get("history", [])
    recommendations = recommend_books(user_history)
    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(port=PORT)
