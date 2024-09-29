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

    logMessage(`Video file exists: ${await fetch(video.src).then(response => response.ok)}`);
    logMessage(`Audio file exists: ${await fetch(audio.src).then(response => response.ok)}`);
    logMessage(`Initial video ready state: ${video.readyState}`);
    logMessage(`Initial audio ready state: ${audio.readyState}`);

    video.addEventListener('error', (e) => {
        const errorTypes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
        const error = video.error;
        logError(`Video error: ${errorTypes[error.code - 1]}, ${error.message}`);
    });
    audio.addEventListener('error', (e) => logError(`Audio error: ${audio.error.message}`));

    function showOverlay() {
        overlay.style.display = 'flex';
        overlay.addEventListener('click', startMedia);
    }

    // Check if video file exists and log its size
    fetch(video.src)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        logMessage(`Video file size: ${blob.size} bytes`);
      })
      .catch(e => logError(`Error fetching video: ${e.message}`));

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
        videoLoaded = true;
        if (audioLoaded) startMedia();
    });

    audio.addEventListener('loadstart', () => logMessage('Audio load started'));
    audio.addEventListener('durationchange', () => logMessage(`Audio duration set: ${audio.duration}`));
    audio.addEventListener('loadedmetadata', () => {
        logMessage('Audio metadata loaded');
        logNetworkState(audio, 'Audio');
    });
    audio.addEventListener('canplay', () => {
        logMessage('Audio can start playing');
        audioLoaded = true;
        if (videoLoaded) startMedia();
    });

    video.addEventListener('play', () => logMessage('Video play event'));
    video.addEventListener('pause', () => logMessage('Video pause event'));
    audio.addEventListener('play', () => logMessage('Audio play event'));
    audio.addEventListener('pause', () => logMessage('Audio pause event'));

    // Check if video and audio sources are set correctly
    logMessage(`Video source: ${video.currentSrc}`);
    logMessage(`Audio source: ${audio.currentSrc}`);

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

    // We don't need to call startMedia() here anymore as it will be called when both video and audio are loaded
});
