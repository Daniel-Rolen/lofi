from flask import Flask, render_template, send_from_directory
import os
import logging
import random

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_random_file(folder):
    files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]
    return random.choice(files) if files else None

@app.route('/')
def index():
    logger.info("Serving index page")
    video_folder = os.path.join(app.root_path, 'static', 'video')
    audio_folder = os.path.join(app.root_path, 'static', 'audio')
    random_video = get_random_file(video_folder)
    random_audio = get_random_file(audio_folder)
    return render_template('index.html', video_file=random_video, audio_file=random_audio)

@app.route('/static/video/<path:filename>')
def serve_video(filename):
    logger.info(f"Serving video file: {filename}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'video'),
                               filename)

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    logger.info(f"Serving audio file: {filename}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'audio'),
                               filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
