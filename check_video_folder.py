import os

video_folder = os.path.join('static', 'video')
print(f"Contents of {video_folder}:")
for file in os.listdir(video_folder):
    print(file)
