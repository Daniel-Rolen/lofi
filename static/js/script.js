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
        console.error('Error:', error.name, error.message);
        console.error('Error details:', error);
        logMessage(`Error: ${error.name} - ${error.message}`);
    }

    logMessage(`Video file exists: ${await fetch(video.src).then(response => response.ok)}`);
    logMessage(`Audio file exists: ${await fetch(audio.src).then(response => response.ok)}`);
    logMessage(`Video ready state: ${video.readyState}`);
    logMessage(`Audio ready state: ${audio.readyState}`);

    video.addEventListener('error', (e) => logError(`Video error: ${video.error.message}`));
    audio.addEventListener('error', (e) => logError(`Audio error: ${audio.error.message}`));

    function showOverlay() {
        overlay.style.display = 'flex';
        overlay.addEventListener('click', startMedia);
    }

    function startMedia() {
        logMessage('Attempting to start media...');
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
    }

    video.addEventListener('loadedmetadata', () => logMessage('Video metadata loaded'));
    audio.addEventListener('loadedmetadata', () => logMessage('Audio metadata loaded'));

    video.addEventListener('play', () => logMessage('Video play event'));
    video.addEventListener('pause', () => logMessage('Video pause event'));
    audio.addEventListener('play', () => logMessage('Audio play event'));
    audio.addEventListener('pause', () => logMessage('Audio pause event'));

    // Check if video and audio sources are set correctly
    logMessage(`Video source: ${video.currentSrc}`);
    logMessage(`Audio source: ${audio.currentSrc}`);

    // Attempt to start media immediately
    startMedia();
});
