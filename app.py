from flask import Flask, render_template, send_from_directory
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    logger.info("Serving index page")
    return render_template('index.html')

@app.route('/static/video/<path:filename>')
def serve_video(filename):
    logger.info(f"Serving video file: {filename}")
    full_path = os.path.join(app.root_path, 'static', 'video', filename)
    if os.path.exists(full_path):
        file_size = os.path.getsize(full_path)
        logger.info(f"Video file size: {file_size} bytes")
    else:
        logger.warning(f"Video file not found: {full_path}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'video'),
                               filename, mimetype='video/mp4')

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    logger.info(f"Serving audio file: {filename}")
    full_path = os.path.join(app.root_path, 'static', 'audio', filename)
    if os.path.exists(full_path):
        file_size = os.path.getsize(full_path)
        logger.info(f"Audio file size: {file_size} bytes")
    else:
        logger.warning(f"Audio file not found: {full_path}")
    return send_from_directory(os.path.join(app.root_path, 'static', 'audio'),
                               filename, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
