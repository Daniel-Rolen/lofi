document.addEventListener('DOMContentLoaded', async function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    const overlay = document.querySelector('.overlay');

    function logMessage(message) {
        console.log(message);
        const logElement = document.createElement('div');
        logElement.textContent = message;
        logElement.style.position = 'fixed';
        logElement.style.top = '10px';
        logElement.style.left = '10px';
        logElement.style.color = 'white';
        logElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        logElement.style.padding = '5px';
        logElement.style.zIndex = '9999';
        document.body.appendChild(logElement);
    }

    function logError(error) {
        console.error('Error:', error);
        logMessage(`Error: ${error}`);
    }

    function logNetworkState(element, type) {
        const states = ['NETWORK_EMPTY', 'NETWORK_IDLE', 'NETWORK_LOADING', 'NETWORK_NO_SOURCE'];
        logMessage(`${type} network state: ${states[element.networkState]}`);
    }

    function checkMediaLoaded(element, type) {
        if (element.readyState >= 3) {
            logMessage(`${type} is loaded and can be played`);
            return true;
        } else {
            logMessage(`${type} is not yet loaded (readyState: ${element.readyState})`);
            return false;
        }
    }

    async function checkFileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            logError(`Error checking file existence: ${error.message}`);
            return false;
        }
    }

    function retryMediaLoad(element, type, maxRetries = 3, delay = 2000) {
        let retries = 0;
        function attemptLoad() {
            if (checkMediaLoaded(element, type)) {
                return;
            }
            if (retries < maxRetries) {
                retries++;
                logMessage(`Retrying ${type} load (attempt ${retries}/${maxRetries})...`);
                element.load();
                setTimeout(attemptLoad, delay);
            } else {
                logError(`Failed to load ${type} after ${maxRetries} attempts`);
            }
        }
        attemptLoad();
    }

    logMessage(`Video source: ${video.currentSrc}`);
    logMessage(`Audio source: ${audio.currentSrc}`);

    const videoExists = await checkFileExists(video.currentSrc);
    const audioExists = await checkFileExists(audio.currentSrc);

    logMessage(`Video file exists: ${videoExists}`);
    logMessage(`Audio file exists: ${audioExists}`);

    logMessage(`Initial video ready state: ${video.readyState}`);
    logMessage(`Initial audio ready state: ${audio.readyState}`);

    video.addEventListener('error', (e) => {
        const errorTypes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
        const error = video.error;
        logError(`Video error: ${errorTypes[error.code - 1]}, ${error.message}`);
        logError(`Video error details: ${JSON.stringify(error)}`);
    });

    audio.addEventListener('error', (e) => {
        const errorTypes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
        const error = audio.error;
        logError(`Audio error: ${errorTypes[error.code - 1]}, ${error.message}`);
        logError(`Audio error details: ${JSON.stringify(error)}`);
    });

    function showOverlay() {
        overlay.style.display = 'flex';
        overlay.addEventListener('click', startMedia);
    }

    let videoLoaded = false;
    let audioLoaded = false;

    video.addEventListener('loadstart', () => logMessage('Video load started'));
    video.addEventListener('durationchange', () => logMessage(`Video duration set: ${video.duration}`));
    video.addEventListener('loadedmetadata', () => {
        logMessage('Video metadata loaded');
        logMessage(`Video width: ${video.videoWidth}, height: ${video.videoHeight}`);
        logNetworkState(video, 'Video');
    });
    video.addEventListener('canplay', () => {
        logMessage('Video can start playing');
        videoLoaded = checkMediaLoaded(video, 'Video');
        if (videoLoaded && audioLoaded) startMedia();
    });

    audio.addEventListener('loadstart', () => logMessage('Audio load started'));
    audio.addEventListener('durationchange', () => logMessage(`Audio duration set: ${audio.duration}`));
    audio.addEventListener('loadedmetadata', () => {
        logMessage('Audio metadata loaded');
        logNetworkState(audio, 'Audio');
    });
    audio.addEventListener('canplay', () => {
        logMessage('Audio can start playing');
        audioLoaded = checkMediaLoaded(audio, 'Audio');
        if (videoLoaded && audioLoaded) startMedia();
    });

    video.addEventListener('play', () => logMessage('Video play event'));
    video.addEventListener('pause', () => logMessage('Video pause event'));
    audio.addEventListener('play', () => logMessage('Audio play event'));
    audio.addEventListener('pause', () => logMessage('Audio pause event'));

    function startMedia() {
        logMessage('Attempting to start media...');
        if (videoLoaded && audioLoaded) {
            Promise.all([
                video.play().catch(logError),
                audio.play().catch(logError)
            ]).then(() => {
                logMessage('Both video and audio started successfully');
                overlay.style.display = 'none';
            }).catch((error) => {
                logError(error);
                showOverlay();
            });
        } else {
            logMessage('Waiting for video and audio to load...');
        }
    }

    // Initial check for media loaded state
    videoLoaded = checkMediaLoaded(video, 'Video');
    audioLoaded = checkMediaLoaded(audio, 'Audio');

    // Retry loading if media is not loaded
    if (!videoLoaded) retryMediaLoad(video, 'Video');
    if (!audioLoaded) retryMediaLoad(audio, 'Audio');

    if (videoLoaded && audioLoaded) startMedia();
});
