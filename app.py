from flask import Flask, render_template, send_from_directory
import os
import logging
import random

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_random_file(folder, file_types):
    files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f)) and f.lower().endswith(file_types)]
    logger.info(f"Available files in {folder}: {files}")
    return random.choice(files) if files else None

@app.route('/')
def index():
    logger.info("Serving index page")
    video_folder = os.path.join(app.root_path, 'static', 'video')
    audio_folder = os.path.join(app.root_path, 'static', 'audio')
    
    # Log the contents of the video folder
    video_files = os.listdir(video_folder)
    logger.info(f"Contents of video folder: {video_files}")
    
    random_video = get_random_file(video_folder, ('.mp4', '.webm', '.ogg', '.mov'))
    random_audio = get_random_file(audio_folder, ('.mp3', '.ogg'))
    logger.info(f"Selected video file: {random_video}")
    logger.info(f"Selected audio file: {random_audio}")
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
