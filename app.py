from flask import Flask, request, jsonify
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import base64
from detect import analyze_frame

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Allow large images

@app.route('/')
def home():
    return jsonify({"status": "Backend is running"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json.get('image')
    if not data:
        return jsonify({"error": "No image provided"}), 400

    try:
        header, encoded = data.split(",", 1)
        img_data = base64.b64decode(encoded)
        img = Image.open(BytesIO(img_data))
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        result = analyze_frame(frame)
        return jsonify(result)

    except Exception as e:
        print("Error processing frame:", str(e))
        return jsonify({"error": "Frame processing failed"}), 500

if __name__ == '__main__':
    from flask_cors import CORS
    CORS(app)
    app.run(host='0.0.0.0', port=5000, debug=True)