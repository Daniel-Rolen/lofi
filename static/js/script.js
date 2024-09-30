document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const debugArea = document.getElementById('debug-area');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const logoContainer = document.querySelector('.logo-container');

    let emptyCount = 0;
    const MAX_EMPTY_ATTEMPTS = 5;

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

    function resetVideoSource() {
        const videoSrc = video.querySelector('source').src;
        video.src = videoSrc;
        video.load();
        emptyCount = 0;
    }

    function checkVideoSource() {
        logMessage(`Checking video source - Video src: ${video.src}`);
        logMessage(`Checking video source - Video currentSrc: ${video.currentSrc}`);
        logMessage(`Checking video source - Video readyState: ${video.readyState}`);
        if (!video.src || !video.currentSrc) {
            logError('Video source is empty');
            resetVideoSource();
        }
    }

    let videoLoaded = false;
    let audioLoaded = false;

    logMessage(`Initial video src: ${video.src}`);
    logMessage(`Initial video currentSrc: ${video.currentSrc}`);
    logMessage(`Video dimensions: ${video.offsetWidth}x${video.offsetHeight}`);
    logMessage(`Video visibility: ${window.getComputedStyle(video).display}`);

    // Check if logo is present in the DOM
    if (logoContainer) {
        logMessage('Logo container is present in the DOM');
        const logoImg = logoContainer.querySelector('img');
        if (logoImg) {
            logMessage(`Logo image src: ${logoImg.src}`);
        } else {
            logError('Logo image not found in the logo container');
        }
    } else {
        logError('Logo container not found in the DOM');
    }

    video.addEventListener('loadstart', () => {
        logMessage('Video load started');
        logMessage(`Video src at loadstart: ${video.src}`);
        logMessage(`Video currentSrc at loadstart: ${video.currentSrc}`);
    });

    video.addEventListener('loadedmetadata', () => {
        logMessage('Video metadata loaded');
        logMessage(`Video src: ${video.src}`);
        logMessage(`Video width: ${video.videoWidth}, height: ${video.videoHeight}`);
    });

    video.addEventListener('loadeddata', () => {
        logMessage('Video data loaded');
        logMessage(`Video src after data loaded: ${video.src}`);
        logMessage(`Video currentSrc after data loaded: ${video.currentSrc}`);
    });

    video.addEventListener('error', (e) => {
        logError(`Video error: ${video.error ? video.error.message : 'Unknown error'}`);
        resetVideoSource();
    });

    video.addEventListener('canplay', () => {
        logMessage('Video can start playing');
        videoLoaded = checkMediaLoaded(video, 'Video');
        logMessage(`Video loaded: ${videoLoaded}`);
        logMessage(`Video src: ${video.src}`);
        logMessage(`Video currentSrc: ${video.currentSrc}`);
        logMessage(`Video readyState: ${video.readyState}`);
        if (videoLoaded && video.src && video.currentSrc) {
            videoPlaceholder.style.display = 'none';
            video.style.display = 'block';
            video.play().catch(logError);
        } else {
            logMessage('Video not available or not loaded, showing placeholder');
            videoPlaceholder.style.display = 'block';
            video.style.display = 'none';
        }
        checkVideoSource();
    });

    video.addEventListener('emptied', () => {
        logMessage('Video source has been emptied');
        logMessage(`Video src after emptied: ${video.src}`);
        logMessage(`Video currentSrc after emptied: ${video.currentSrc}`);
        
        if (emptyCount < MAX_EMPTY_ATTEMPTS) {
            emptyCount++;
            video.load();
        } else {
            logError('Max empty attempts reached. Please refresh the page.');
        }
    });

    video.addEventListener('abort', () => {
        logError('Video loading aborted');
        checkVideoSource();
    });

    audio.addEventListener('canplay', () => {
        logMessage('Audio can start playing');
        audioLoaded = checkMediaLoaded(audio, 'Audio');
        startMedia();
    });

    function startMedia() {
        logMessage('Attempting to start media...');
        checkVideoSource();
        if (audioLoaded) {
            audio.play().catch(logError);
            logMessage('Audio started successfully');
        }
        
        if (videoLoaded && video.src && video.currentSrc) {
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
        if (!videoLoaded || !video.src || !video.currentSrc) return;

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

    setInterval(() => {
        logMessage(`Periodic check - Video src: ${video.src}`);
        logMessage(`Periodic check - Video currentSrc: ${video.currentSrc}`);
        logMessage(`Periodic check - Video readyState: ${video.readyState}`);
        checkVideoSource();
    }, 5000);
});
