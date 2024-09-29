import os
import magic

video_path = 'static/video/background.mp4'
if os.path.exists(video_path):
    print(f"Video file exists. Size: {os.path.getsize(video_path)} bytes")
else:
    print("Video file does not exist.")

# Check file permissions
print(f"File permissions: {oct(os.stat(video_path).st_mode)[-3:]}")

# Check file type
file_type = magic.from_file(video_path)
print(f"File type: {file_type}")
