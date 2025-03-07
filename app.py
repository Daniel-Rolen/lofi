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
    return files

@app.route('/')
def index():
    logger.info("Serving index page")
    video_folder = os.path.join(app.static_folder, 'video')
    audio_folder = os.path.join(app.static_folder, 'audio')
    
    video_files = get_random_file(video_folder, ('.mp4', '.webm', '.ogg', '.mov'))
    audio_files = get_random_file(audio_folder, ('.mp3', '.ogg'))
    
    random_video = random.choice(video_files) if video_files else None
    
    if random_video:
        full_video_path = os.path.join(video_folder, random_video)
        logger.info(f"Full path of selected video file: {full_video_path}")
        logger.info(f"Video file exists: {os.path.exists(full_video_path)}")
    else:
        logger.warning("No video file selected")
    
    # Check if the logo file exists
    logo_file = 'example_logo.png'
    logo_path = os.path.join(app.static_folder, 'logo', logo_file)
    logo_exists = os.path.exists(logo_path)
    logger.info(f"Logo file path: {logo_path}")
    logger.info(f"Logo file exists: {logo_exists}")
    
    logger.info(f"Selected video file: {random_video}")
    logger.info(f"Available audio files: {audio_files}")
    return render_template('index.html', video_file=random_video, audio_files=audio_files, logo_file=logo_file, logo_exists=logo_exists)

@app.route('/static/video/<path:filename>')
def serve_video(filename):
    logger.info(f"Serving video file: {filename}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'video'), filename)

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    logger.info(f"Serving audio file: {filename}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'audio'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
