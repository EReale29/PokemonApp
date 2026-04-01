"""
DevSecOps Demo API - PokemonApp
Cours : 5DVSCOPS - ÉSTIAM 2025/2026
Auteur : Enzo Reale
"""
from flask import Flask, jsonify, request
from datetime import datetime
import os

app = Flask(__name__)

POKEMONS = [
    {"id": 1, "name": "Pikachu",    "type": "Electric", "hp": 35},
    {"id": 2, "name": "Bulbasaur",  "type": "Grass",    "hp": 45},
    {"id": 3, "name": "Charmander", "type": "Fire",      "hp": 39},
]

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "PokemonApp DevSecOps API",
        "version": "1.0.0",
        "endpoints": ["GET /", "GET /health",
                      "GET /api/pokemons", "POST /api/pokemons"]
    }), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": os.getenv("APP_ENV", "development"),
    }), 200

@app.route("/api/pokemons", methods=["GET"])
def get_pokemons():
    return jsonify({"pokemons": POKEMONS, "count": len(POKEMONS)}), 200

@app.route("/api/pokemons", methods=["POST"])
def create_pokemon():
    data = request.get_json()
    if not data or not all(k in data for k in ("name", "type", "hp")):
        return jsonify({"error": "Champs requis : name, type, hp"}), 400
    new_pokemon = {
        "id": len(POKEMONS) + 1,
        "name": data["name"],
        "type": data["type"],
        "hp": int(data["hp"]),
    }
    POKEMONS.append(new_pokemon)
    return jsonify(new_pokemon), 201

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
