document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const overlay = document.querySelector('.overlay');

    function logError(error) {
        console.error('Error:', error.name, error.message);
        console.error('Error details:', error);
    }

    function showOverlay() {
        overlay.style.display = 'flex';
        overlay.addEventListener('click', startMedia);
    }

    function startMedia() {
        console.log('Attempting to start media...');
        Promise.all([
            video.play().catch(logError),
            audio.play().catch(logError)
        ]).then(() => {
            console.log('Both video and audio started successfully');
            overlay.style.display = 'none';
        }).catch((error) => {
            logError(error);
            showOverlay();
        });
    }

    video.addEventListener('loadedmetadata', () => console.log('Video metadata loaded'));
    audio.addEventListener('loadedmetadata', () => console.log('Audio metadata loaded'));

    video.addEventListener('play', () => console.log('Video play event'));
    video.addEventListener('pause', () => console.log('Video pause event'));
    audio.addEventListener('play', () => console.log('Audio play event'));
    audio.addEventListener('pause', () => console.log('Audio pause event'));

    // Attempt to start media immediately
    startMedia();
});
