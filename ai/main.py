import pandas as pd
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from concurrent.futures import ProcessPoolExecutor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from functional_bug_analysis import analyze_bug

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI") or "mongodb+srv://agampreet392:g8iVr9om6tgUSpnM@bug-tracker.ir1ey.mongodb.net/?retryWrites=true&w=majority&appName=Bug-Tracker"
client = MongoClient(MONGO_URI)
db = client["bug-tracker"]
collection = db["bugs_final"]

# Initialize FastAPI
app = FastAPI()

# CORS Middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NLTK setup
nltk.download("punkt")
nltk.download("wordnet")
nltk.download("stopwords")

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    if not isinstance(text, str) or text.strip() == "":
        return ""
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word.isalnum() and word not in stop_words]
    return " ".join(tokens)

def parallel_preprocessing(text_list):
    with ProcessPoolExecutor() as executor:
        return list(executor.map(preprocess_text, text_list))

class BugReport(BaseModel):
    Summary: str
    description: str

@app.post("/api/detect_duplicates")
async def detect_duplicates(report: BugReport):
    try:
        # Fetch existing bugs from MongoDB, using 'Summary' and 'description' fields
        bugs = list(collection.find({}, {"_id": 0, "Summary": 1, "description": 1}))

        if not bugs:
            return {"message": "No bug reports found in the database."}

        # Combine Summary and description for each bug, create processed text
        for bug in bugs:
            bug["text"] = (str(bug.get("Summary", "")) + " " + str(bug.get("description", ""))).strip()

        for bug in bugs:
            bug["processed_text"] = preprocess_text(bug["text"])

        # Prepare corpus for TF-IDF: existing bugs + new bug description
        corpus = [bug["processed_text"] for bug in bugs] + [preprocess_text(report.Summary + " " + report.description)]

        tfidf_matrix = TfidfVectorizer().fit_transform(corpus)

        similarity_matrix = cosine_similarity(tfidf_matrix)
        new_bug_index = len(bugs)
        similar_bugs = [
            {"Existing Report": bug["Summary"], "Similarity": round(similarity_matrix[new_bug_index, i], 2)}
            for i, bug in enumerate(bugs)
            if similarity_matrix[new_bug_index, i] > 0.8
        ]

        # Functional analysis using both Summary and description
        analysis = analyze_bug(report.Summary, report.description)

        return {
            "duplicates": similar_bugs if similar_bugs else "No duplicates found.",
            "is_functional": analysis["is_functional"],
            "bug_type": analysis["bug_type"],
            "severity": analysis["severity"]
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/api/detect_duplicates_csv")
async def detect_duplicates_csv(file: UploadFile = File(...)):
    try:
        CHUNK_SIZE = 5000
        df_iter = pd.read_csv(io.BytesIO(await file.read()), chunksize=CHUNK_SIZE)

        all_processed_texts = []
        all_indexes = []

        for chunk in df_iter:
            chunk["text"] = chunk["Summary"].astype(str) + " " + chunk["Description"].astype(str)
            chunk = chunk[chunk["text"].str.strip() != ""].reset_index(drop=True)

            if chunk.empty:
                continue

            chunk["processed_text"] = parallel_preprocessing(chunk["text"].tolist())

            all_processed_texts.extend(chunk["processed_text"].tolist())
            all_indexes.extend(chunk.index.tolist())

        if not all_processed_texts:
            return {"message": "No valid bug reports found."}

        vectorizer = TfidfVectorizer(max_features=20000)
        tfidf_matrix = vectorizer.fit_transform(all_processed_texts)

        if tfidf_matrix.shape[0] < 2:
            return {"message": "Not enough bug reports for comparison."}

        similarity_matrix = cosine_similarity(tfidf_matrix)

        duplicates = [
            {"Bug1": all_indexes[i], "Bug2": all_indexes[j], "Similarity": round(similarity_matrix[i, j], 2)}
            for i in range(len(all_indexes))
            for j in range(i + 1, len(all_indexes))
            if similarity_matrix[i, j] > 0.8
        ]

        return {"duplicates": duplicates} if duplicates else {"message": "No duplicates found."}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Bug Tracker API"}
