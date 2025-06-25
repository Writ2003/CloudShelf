import os
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["test"]
book_collection = db["books"]
PORT = int(os.getenv("PORT",5050));

# Recommendation function

def recommend_books(user_history_ids, limit):
    print("🧠 Incoming history IDs:", user_history_ids)

    # Step 1: Convert to ObjectIds
    try:
        object_ids = [ObjectId(_id) for _id in user_history_ids]
    except Exception as e:
        print("❌ Invalid ObjectId in history:", e)
        return []

    # Step 2: Fetch books from MongoDB
    user_books = list(book_collection.find({"_id": {"$in": object_ids}}))
    all_books = list(book_collection.find())

    if not user_books or not all_books:
        print("⚠️ Empty user_books or all_books")
        return []

    # Step 3: Convert to DataFrame
    books_df = pd.DataFrame(all_books)

    # Make sure 'genre' and 'author' fields exist and are strings
    books_df["genre"] = books_df["genre"].astype(str)
    books_df["author"] = books_df["author"].astype(str)
    books_df["features"] = books_df["genre"] + " " + books_df["author"]

    # Step 4: Build user profile
    user_genres = [str(book.get("genre", "")) for book in user_books]
    user_authors = [str(book.get("author", "")) for book in user_books]
    
    user_profile = " ".join(user_genres + user_authors)
    print("👤 User profile string:", user_profile)

    # Step 5: TF-IDF and similarity
    vectorizer = TfidfVectorizer()
    book_vectors = vectorizer.fit_transform(books_df["features"])
    user_vector = vectorizer.transform([user_profile])
    similarities = cosine_similarity(user_vector, book_vectors).flatten()

    # Step 6: Score and return
    books_df["similarity"] = similarities
    recommended_books = books_df.sort_values(by="similarity", ascending=False).head(limit)

    # Convert _id to string for JSON serialization
    recommended_books["_id"] = recommended_books["_id"].astype(str)

    return recommended_books.drop(columns=["features", "similarity"]).to_dict(orient="records")


# Flask route
@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        print("📩 Request received:", data)
        user_history = data.get("history", [])
        limit = int(data.get("limit", 5))  # default = 5
        recommendations = recommend_books(user_history, limit)
        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print("❌ ERROR in /recommend:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
