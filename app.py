from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

PORT = 3000
TARGET = 1000000000
FLAG = "FLAG{y0u_4re_G4Y_1_kn0w}"

@app.route('/')
@app.route('/index.html')
def index():
    html_path = os.path.join(os.path.dirname(__file__), 'index.html')
    if not os.path.exists(html_path):
        return "index.html not found", 404
    with open(html_path, 'r', encoding='utf-8') as f:
        return f.read(), 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/gay.html')
def gay():
    html_path = os.path.join(os.path.dirname(__file__), 'gay.html')
    if not os.path.exists(html_path):
        return "gay.html not found", 404
    with open(html_path, 'r', encoding='utf-8') as f:
        return f.read(), 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/api/claim', methods=['POST'])
def claim():
    try:
        data = request.get_json() or {}
        score = float(data.get('score', 0))
        time_left = float(data.get('timeLeft', 0))
    except (ValueError, TypeError):
        return jsonify({'ok': False, 'error': 'bad input'}), 400

    if score >= TARGET and time_left >= 0:
        return jsonify({'ok': True, 'flag': FLAG}), 200
    else:
        return jsonify({'ok': False, 'error': 'not enough'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)