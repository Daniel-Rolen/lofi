import os

def check_file(file_path):
    if os.path.exists(file_path):
        print(f"File exists: {file_path}")
        print(f"File size: {os.path.getsize(file_path)} bytes")
        print(f"File permissions: {oct(os.stat(file_path).st_mode)[-3:]}")
    else:
        print(f"File does not exist: {file_path}")

video_path = os.path.join('static', 'video', 'background.mp4')
audio_path = os.path.join('static', 'audio', 'background.mp3')

print("Checking video file:")
check_file(video_path)

print("\nChecking audio file:")
check_file(audio_path)
