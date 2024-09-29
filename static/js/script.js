document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');

    // Function to start both video and audio
    function startMedia() {
        // Start video without audio
        video.muted = true;
        video.play().then(() => {
            console.log("Video started playing");
            // Unmute video and play audio on user interaction
            document.body.addEventListener('click', function() {
                video.muted = false;
                audio.play().catch(error => {
                    console.error("Audio playback failed:", error);
                });
            }, { once: true });
        }).catch(error => {
            console.error("Video playback failed:", error);
        });
    }

    // Start media on page load
    startMedia();

    // Ensure video stays fullscreen on resize
    window.addEventListener('resize', function() {
        if (video.style.width !== "100%" || video.style.height !== "100%") {
            video.style.width = "100%";
            video.style.height = "100%";
        }
    });

    // Restart media if it ends (shouldn't happen due to loop attribute, but just in case)
    video.addEventListener('ended', startMedia);
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error("Audio replay failed:", error);
        });
    });

    // Restart audio when video loops (to keep them in sync)
    video.addEventListener('loop', function() {
        audio.currentTime = 0;
    });
});
