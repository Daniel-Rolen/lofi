document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const overlay = document.querySelector('.overlay');

    function startMedia() {
        video.muted = false;
        video.play().then(() => {
            console.log('Video started playing');
            return audio.play();
        }).then(() => {
            console.log('Audio started playing');
            overlay.style.display = 'none';
        }).catch(error => {
            console.error('Media playback failed:', error);
            // If autoplay is prevented, we'll need user interaction
            overlay.addEventListener('click', function() {
                video.muted = false;
                video.play();
                audio.play();
                overlay.style.display = 'none';
            });
        });
    }

    startMedia();

    // Log events for debugging
    video.addEventListener('play', () => console.log('Video play event'));
    video.addEventListener('pause', () => console.log('Video pause event'));
    audio.addEventListener('play', () => console.log('Audio play event'));
    audio.addEventListener('pause', () => console.log('Audio pause event'));
});
