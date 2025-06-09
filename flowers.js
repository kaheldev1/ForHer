onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};

document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (backgroundMusic) {
        function tryPlayMusic() {
            backgroundMusic.play()
                .then(() => {
                    document.removeEventListener('click', tryPlayMusic);
                    document.removeEventListener('keypress', tryPlayMusic);
                })
                .catch(error => {
                    console.error("Autoplay prevented:", error);
                    document.addEventListener('click', tryPlayMusic);
                    document.addEventListener('keypress', tryPlayMusic);
                });
        }

        tryPlayMusic();
    }
});
