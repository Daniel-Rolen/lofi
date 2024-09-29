document.addEventListener('DOMContentLoaded', async function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const overlay = document.querySelector('.overlay');
    const debugArea = document.getElementById('debug-area');
    const videoPlaceholder = document.getElementById('video-placeholder');

    function logMessage(message) {
        console.log(message);
        const logElement = document.createElement('div');
        logElement.textContent = message;
        debugArea.appendChild(logElement);
        debugArea.scrollTop = debugArea.scrollHeight;
    }

    function logError(error) {
        console.error('Error:', error);
        const errorElement = document.createElement('div');
        errorElement.textContent = `Error: ${error}`;
        errorElement.style.color = 'red';
        debugArea.appendChild(errorElement);
        debugArea.scrollTop = debugArea.scrollHeight;
    }

    function checkMediaLoaded(element, type) {
        if (element.readyState >= 3) {
            logMessage(`${type} is loaded and can be played (readyState: ${element.readyState})`);
            return true;
        } else {
            logMessage(`${type} is not yet loaded (readyState: ${element.readyState})`);
            return false;
        }
    }

    function showOverlay() {
        overlay.style.display = 'flex';
        overlay.addEventListener('click', startMedia);
    }

    let videoLoaded = false;
    let audioLoaded = false;

    video.addEventListener('loadedmetadata', () => {
        logMessage('Video metadata loaded');
        logMessage(`Video width: ${video.videoWidth}, height: ${video.videoHeight}`);
    });

    video.addEventListener('canplay', () => {
        logMessage('Video can start playing');
        videoLoaded = checkMediaLoaded(video, 'Video');
        if (videoLoaded) {
            videoPlaceholder.style.display = 'none';
            video.style.display = 'block';
        }
        if (audioLoaded) startMedia();
    });

    audio.addEventListener('canplay', () => {
        logMessage('Audio can start playing');
        audioLoaded = checkMediaLoaded(audio, 'Audio');
        if (audioLoaded) startMedia();
    });

    function startMedia() {
        logMessage('Attempting to start media...');
        if (audioLoaded) {
            audio.play().catch(logError);
            logMessage('Audio started successfully');
        }
        
        if (videoLoaded) {
            video.play().catch(logError);
            logMessage('Video started successfully');
            overlay.style.display = 'none';
        } else {
            logMessage('Video not loaded, showing placeholder');
            videoPlaceholder.style.display = 'block';
            video.style.display = 'none';
        }
    }

    // Set timeout for video loading
    setTimeout(() => {
        if (!videoLoaded) {
            logMessage('Video loading timeout reached (10 seconds)');
            videoPlaceholder.style.display = 'block';
            video.style.display = 'none';
        }
    }, 10000);

    // Initial check for media loaded state
    videoLoaded = checkMediaLoaded(video, 'Video');
    audioLoaded = checkMediaLoaded(audio, 'Audio');

    if (audioLoaded) startMedia();

    // Add fade-in/fade-out effect
    function fadeEffect() {
        if (video.currentTime > video.duration - 1) {
            video.style.opacity = 1 - (video.duration - video.currentTime);
        } else if (video.currentTime < 1) {
            video.style.opacity = video.currentTime;
        } else {
            video.style.opacity = 1;
        }
    }

    video.addEventListener('timeupdate', fadeEffect);

    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
});
