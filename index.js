(function() {
    const DOM = {
        birthdayButton: document.getElementById('birthdayButton'),
        birthdayContainer: document.querySelector('.birthday-container'),
        memoriesSection: document.getElementById('memoriesSection'),
        memoryGrid: document.getElementById('memoryGrid'),
        closeMemoriesButton: document.getElementById('closeMemories'),
        nextButton: document.getElementById('nextButton'),
        letterOverlay: document.getElementById('letterOverlay'),
        closeLetterButton: document.getElementById('closeLetter')
    };

    DOM.letterContainer = DOM.letterOverlay ? DOM.letterOverlay.querySelector('.letter-container') : null;
    DOM.envelope = DOM.letterContainer ? DOM.letterContainer.querySelector('.envelope') : null;
    DOM.letterContentElement = DOM.envelope ? DOM.envelope.querySelector('#letterContent') : null;

    const memoriesData = [
        { image: 'images/IMG_4180.JPEG', text: 'Ito yung date na gusto ko sa lahat.' },
        { image: 'images/IMG_2987.JPG', text: 'Ang ganda mo dito.' },
        { image: 'images/FullSizeRender.jpg', text: 'Cute lang natin dito' },
        { image: 'images/IMG_6316.JPEG', text: 'Lasang Milo talaga yon.' },
        { image: 'images/IMG_6688.PNG', text: 'Sana ma-ulit to.' },
        { image: 'images/IMG_4188.JPEG', text: 'Fav mirrorshot with you.' }
    ];

    const fullLetter = `Baby,

Happy birthday! happy birthday ngani!


`;

    let charIndex = 0;
    let typingTimeout;
    const typingSpeed = 50;
    const paragraphDelay = 500;

    function createMemoryItem(memory) {
        const memoryItem = document.createElement('div');
        memoryItem.classList.add('memory-item');

        const img = document.createElement('img');
        img.src = memory.image;
        img.alt = memory.text;
        img.loading = 'lazy';

        const p = document.createElement('p');
        p.classList.add('memory-text');
        p.textContent = memory.text;

        memoryItem.appendChild(img);
        memoryItem.appendChild(p);
        return memoryItem;
    }

    function loadMemories() {
        if (!DOM.memoryGrid) {
            console.error('Memory grid element not found.');
            return;
        }

        DOM.memoryGrid.innerHTML = '';

        const memoryElements = memoriesData.map(createMemoryItem);

        memoryElements.forEach((item, index) => {
            DOM.memoryGrid.appendChild(item);
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }

    function toggleSectionVisibility(showElement, hideElement) {
        if (!showElement || !hideElement) {
            console.error('Missing elements for visibility toggle.');
            return;
        }

        hideElement.classList.add('hidden');

        const transitionDurationMs = 500;
        setTimeout(() => {
            showElement.classList.remove('hidden');
            showElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, transitionDurationMs);
    }

    function typeLetterAnimation() {
        if (!DOM.letterContentElement) return;

        if (charIndex < fullLetter.length) {
            const char = fullLetter.charAt(charIndex);
            DOM.letterContentElement.textContent += char;
            charIndex++;

            if (char === '\n' && fullLetter.charAt(charIndex) === '\n') {
                typingTimeout = setTimeout(typeLetterAnimation, paragraphDelay);
            } else {
                typingTimeout = setTimeout(typeLetterAnimation, typingSpeed);
            }
        } else {
            if (DOM.envelope) {
                const letterDiv = DOM.envelope.querySelector('.letter');
                if (letterDiv) {
                    letterDiv.classList.add('typing-finished');
                }
            }
        }
    }

    function resetLetterTyping() {
        clearTimeout(typingTimeout);
        charIndex = 0;
        if (DOM.letterContentElement) {
            DOM.letterContentElement.textContent = '';
            if (DOM.envelope) {
                const letterDiv = DOM.envelope.querySelector('.letter');
                if (letterDiv) {
                    letterDiv.classList.remove('typing-finished');
                }
            }
        }
    }

    function triggerConfetti() {
        const confettiCount = 50;
        const colors = ['#FF6F91', '#845EF7', '#F0E68C', '#B9F6CA', '#82B1FF', '#FFD700'];
        const shapes = ['square', 'circle', 'triangle'];

        let confettiContainer = document.querySelector('.js-confetti');
        if (!confettiContainer) {
            confettiContainer = document.createElement('div');
            confettiContainer.classList.add('js-confetti');
            document.body.appendChild(confettiContainer);
        } else {
            confettiContainer.innerHTML = '';
        }


        for (let i = 0; i < confettiCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('confetti-particle');

            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                particle.style.borderRadius = '50%';
            } else if (shape === 'triangle') {

            }

            const size = Math.random() * 8 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const buttonRect = DOM.birthdayButton.getBoundingClientRect();
            const startX = buttonRect.left + buttonRect.width / 2;
            const startY = buttonRect.top + buttonRect.height / 2;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            const endX = startX + (Math.random() - 0.5) * 600;
            const endY = startY + (Math.random() * 400 - 200);
            const finalRotation = Math.random() * 1000 - 500;

            particle.style.setProperty('--initial-x', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--initial-y', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--initial-rot', `${Math.random() * 360}deg`);
            particle.style.setProperty('--final-x', `${endX - startX}px`);
            particle.style.setProperty('--final-y', `${window.innerHeight + 100 - startY}px`);
            particle.style.setProperty('--final-rot', `${finalRotation}deg`);

            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            particle.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;

            confettiContainer.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particle.remove();
                if (confettiContainer.children.length === 0) {
                    confettiContainer.remove();
                }
            });
        }
    }

    function handleBirthdayButtonClick() {
        toggleSectionVisibility(DOM.memoriesSection, DOM.birthdayContainer);
        loadMemories();
        triggerConfetti();
        if (DOM.birthdayButton) {
            DOM.birthdayButton.textContent = "Surprise Revealed!";
            DOM.birthdayButton.disabled = true;
        }
    }

    function handleCloseMemoriesButtonClick() {
        toggleSectionVisibility(DOM.birthdayContainer, DOM.memoriesSection);
        if (DOM.birthdayButton) {
            DOM.birthdayButton.textContent = "Unwrap Your Surprise!";
            DOM.birthdayButton.disabled = false;
        }
    }

    function handleNextButtonClick() {
        if (DOM.letterOverlay) {
            DOM.letterOverlay.classList.add('visible');
            setTimeout(() => {
                if (DOM.envelope) {
                    DOM.envelope.classList.add('open');
                }
                setTimeout(typeLetterAnimation, 800);
            }, 300);
        }
    }

    function handleCloseLetterButtonClick() {
        if (DOM.letterOverlay) {
            DOM.letterOverlay.classList.remove('visible');
            if (DOM.envelope) {
                DOM.envelope.classList.remove('open');
            }
            resetLetterTyping();
        }
    }

    function init() {
        if (DOM.birthdayButton) {
            DOM.birthdayButton.addEventListener('click', handleBirthdayButtonClick);
        } else {
            console.warn('Birthday button not found.');
        }

        if (DOM.closeMemoriesButton) {
            DOM.closeMemoriesButton.addEventListener('click', handleCloseMemoriesButtonClick);
        } else {
            console.warn('Close memories button not found.');
        }

        if (DOM.nextButton) {
            DOM.nextButton.addEventListener('click', handleNextButtonClick);
        } else {
            console.warn('Next button not found.');
        }

        if (DOM.closeLetterButton) {
            DOM.closeLetterButton.addEventListener('click', handleCloseLetterButtonClick);
        } else {
            console.warn('Close letter button not found.');
        }

        if (DOM.letterOverlay) {
            DOM.letterOverlay.addEventListener('click', (event) => {
                if (event.target === DOM.letterOverlay) {
                    handleCloseLetterButtonClick();
                }
            });
            if (DOM.letterContainer) {
                DOM.letterContainer.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
            }
        }

        loadMemories();
    }

    document.addEventListener('DOMContentLoaded', init);

})();