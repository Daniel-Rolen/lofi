document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
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

    let videoLoaded = false;
    let audioLoaded = false;

    logMessage(`Initial video src: ${video.src}`);
    logMessage(`Initial video currentSrc: ${video.currentSrc}`);
    logMessage(`Video dimensions: ${video.offsetWidth}x${video.offsetHeight}`);
    logMessage(`Video visibility: ${window.getComputedStyle(video).display}`);

    video.addEventListener('loadedmetadata', () => {
        logMessage('Video metadata loaded');
        logMessage(`Video src: ${video.src}`);
        logMessage(`Video width: ${video.videoWidth}, height: ${video.videoHeight}`);
    });

    video.addEventListener('error', (e) => {
        logError(`Video loading error: ${video.error ? video.error.message : 'Unknown error'}`);
    });

    video.addEventListener('canplay', () => {
        logMessage('Video can start playing');
        videoLoaded = checkMediaLoaded(video, 'Video');
        logMessage(`Video loaded: ${videoLoaded}`);
        logMessage(`Video src: ${video.src}`);
        logMessage(`Video currentSrc: ${video.currentSrc}`);
        logMessage(`Video readyState: ${video.readyState}`);
        if (videoLoaded && video.src) {
            videoPlaceholder.style.display = 'none';
            video.style.display = 'block';
            video.play().catch(logError);
        } else {
            logMessage('Video not available or not loaded, showing placeholder');
            videoPlaceholder.style.display = 'block';
            video.style.display = 'none';
        }
    });

    video.addEventListener('emptied', () => {
        logMessage('Video source has been emptied');
        logMessage(`Video src after emptied: ${video.src}`);
        logMessage(`Video currentSrc after emptied: ${video.currentSrc}`);
    });

    audio.addEventListener('canplay', () => {
        logMessage('Audio can start playing');
        audioLoaded = checkMediaLoaded(audio, 'Audio');
        startMedia();
    });

    function startMedia() {
        logMessage('Attempting to start media...');
        if (audioLoaded) {
            audio.play().catch(logError);
            logMessage('Audio started successfully');
        }
        
        if (videoLoaded && video.src) {
            video.play().catch(logError);
            logMessage('Video started successfully');
            logMessage(`Video src in startMedia: ${video.src}`);
            logMessage(`Video currentSrc in startMedia: ${video.currentSrc}`);
            logMessage(`Video dimensions: ${video.offsetWidth}x${video.offsetHeight}`);
            logMessage(`Video visibility: ${window.getComputedStyle(video).display}`);
            videoPlaceholder.style.display = 'none';
            video.style.display = 'block';
        } else {
            logMessage('Video not available or not loaded, showing placeholder');
            logMessage(`Video src in startMedia (not loaded): ${video.src}`);
            logMessage(`Video currentSrc in startMedia (not loaded): ${video.currentSrc}`);
            videoPlaceholder.style.display = 'block';
            video.style.display = 'none';
        }
    }

    function fadeEffect() {
        if (!videoLoaded || !video.src) return;

        const fadeDuration = 2;
        const fadeStart = fadeDuration;

        if (video.currentTime > video.duration - fadeStart) {
            const fadeAmount = 1 - (video.duration - video.currentTime) / fadeStart;
            video.style.opacity = 1 - fadeAmount;
        } else if (video.currentTime < fadeStart) {
            video.style.opacity = video.currentTime / fadeStart;
        } else {
            video.style.opacity = 1;
        }

        requestAnimationFrame(fadeEffect);
    }

    video.addEventListener('play', () => {
        fadeEffect();
    });

    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play().catch(logError);
    });
});
