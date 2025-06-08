(function() {
    const DOM = {};

    function cacheDOM() {
        DOM.birthdayButton = document.getElementById('birthdayButton');
        DOM.birthdayContainer = document.querySelector('.birthday-container');
        DOM.memoriesSection = document.getElementById('memoriesSection');
        DOM.memoryGrid = document.getElementById('memoryGrid');
        DOM.closeMemoriesButton = document.getElementById('closeMemories');
        DOM.nextButton = document.getElementById('nextButton');
        DOM.letterOverlay = document.getElementById('letterOverlay');
        DOM.closeLetterButton = document.getElementById('closeLetter');

        DOM.letterContainer = DOM.letterOverlay ? DOM.letterOverlay.querySelector('.letter-container') : null;
        DOM.envelope = DOM.letterContainer ? DOM.letterContainer.querySelector('.envelope') : null;
        DOM.letterContentElement = DOM.envelope ? DOM.envelope.querySelector('#letterContent') : null;

        // New modal elements
        DOM.imageModalOverlay = document.createElement('div');
        DOM.imageModalOverlay.classList.add('image-modal-overlay');
        DOM.imageModalContent = document.createElement('div');
        DOM.imageModalContent.classList.add('image-modal-content');
        DOM.imageModalImg = document.createElement('img');
        DOM.imageModalText = document.createElement('p'); // Element for the memory text
        DOM.imageModalText.classList.add('modal-text');
        DOM.imageModalCloseButton = document.createElement('button');
        DOM.imageModalCloseButton.classList.add('image-modal-close');
        DOM.imageModalCloseButton.innerHTML = '&times;'; // 'x' symbol

        DOM.imageModalContent.appendChild(DOM.imageModalImg);
        DOM.imageModalContent.appendChild(DOM.imageModalText); // Append the text element
        DOM.imageModalContent.appendChild(DOM.imageModalCloseButton);
        DOM.imageModalOverlay.appendChild(DOM.imageModalContent);
        document.body.appendChild(DOM.imageModalOverlay); // Add to body once
    }

    const memoriesData = [
        { image: 'images/IMG_4180.JPEG', text: 'Ito yung date na gusto ko sa lahat.' },
        { image: 'images/IMG_2987.JPG', text: 'Ang ganda mo dito.' },
        { image: 'images/FullSizeRender.jpg', text: 'Cute lang natin dito' },
        { image: 'images/IMG_6316.JPEG', text: 'Lasang Milo talaga yon.' },
        { image: 'images/IMG_6688.PNG', text: 'Sana ma-ulit to.' },
        { image: 'images/IMG_4188.JPEG', text: 'Fav mirrorshot with you.' }
    ];

    const fullLetter = `Baby,

Happy birthday! Gusto ko lang sabihin na sobrang saya ko kasi nakilala kita. 
From our silly jokes, your comforting presence, and our shared dreams, every moment with you is a treasure. You bring so much joy and warmth into my life, and I'm incredibly grateful for your love and support.

I wish you all the happiness in the world, and I promise to be here for you, always. May your special day be filled with everything you wished for, and may our future together be even brighter.

I love you more than words can say.

Happy Birthday, my love!

Love,
[Your Name]`;

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
        // Make the image clickable and pass the entire memory object
        img.addEventListener('click', () => showImageInModal(memory));

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
            }, index * 150);
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
        const confettiCount = 80;
        const colors = ['#FF6F91', '#A367DC', '#F0E68C', '#B9F6CA', '#82B1FF', '#FFD700', '#FFC0CB', '#DAF7A6'];
        const shapes = ['square', 'circle', 'triangle'];

        let confettiContainer = document.querySelector('.js-confetti');
        if (!confettiContainer) {
            confettiContainer = document.createElement('div');
            confettiContainer.classList.add('js-confetti');
            document.body.appendChild(confettiContainer);
        } else {
            confettiContainer.innerHTML = '';
        }

        const buttonRect = DOM.birthdayButton.getBoundingClientRect();
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;

        for (let i = 0; i < confettiCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('confetti-particle');

            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                particle.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                particle.style.width = '0';
                particle.style.height = '0';
                particle.style.borderLeft = `${Math.random() * 8 + 5}px solid transparent`;
                particle.style.borderRight = `${Math.random() * 8 + 5}px solid transparent`;
                particle.style.borderBottom = `${Math.random() * 12 + 8}px solid ${particle.style.backgroundColor}`;
                particle.style.backgroundColor = 'transparent';
            }

            const size = Math.random() * 8 + 5;
            if (shape !== 'triangle') {
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
            }
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            const spreadFactor = 300;
            const initialXOffset = (Math.random() - 0.5) * spreadFactor;
            const initialYOffset = (Math.random() - 0.5) * spreadFactor;
            const finalXOffset = (Math.random() - 0.5) * 800;
            const finalYOffset = window.innerHeight + 100;
            const finalRotation = Math.random() * 1000 - 500;

            particle.style.setProperty('--initial-x', `${initialXOffset}px`);
            particle.style.setProperty('--initial-y', `${initialYOffset}px`);
            particle.style.setProperty('--initial-rot', `${Math.random() * 360}deg`);
            particle.style.setProperty('--final-x', `${finalXOffset}px`);
            particle.style.setProperty('--final-y', `${finalYOffset}px`);
            particle.style.setProperty('--final-rot', `${finalRotation}deg`);

            particle.style.animationDelay = `${Math.random() * 0.4}s`;
            particle.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;

            confettiContainer.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particle.remove();
                if (confettiContainer && confettiContainer.children.length === 0) {
                    confettiContainer.remove();
                }
            });
        }
    }

    // Function to show the image and text in the modal
    function showImageInModal(memory) {
        if (DOM.imageModalOverlay && DOM.imageModalImg && DOM.imageModalText) {
            DOM.imageModalImg.src = memory.image;
            DOM.imageModalImg.alt = memory.text; // Set alt text for accessibility
            DOM.imageModalText.textContent = memory.text; // Set the text content
            DOM.imageModalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    }

    function hideImageModal() {
        if (DOM.imageModalOverlay) {
            DOM.imageModalOverlay.classList.remove('visible');
            document.body.style.overflow = ''; // Restore scrolling
            // Clear image and text after hiding to prevent flicker on next open
            DOM.imageModalImg.src = '';
            DOM.imageModalText.textContent = '';
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
        cacheDOM();

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

        // Event listeners for the image modal
        if (DOM.imageModalCloseButton) {
            DOM.imageModalCloseButton.addEventListener('click', hideImageModal);
        }
        if (DOM.imageModalOverlay) {
            DOM.imageModalOverlay.addEventListener('click', (event) => {
                if (event.target === DOM.imageModalOverlay) { // Only close if clicking the overlay itself
                    hideImageModal();
                }
            });
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
        
        loadMemories(); // Initial load of memories
    }

    document.addEventListener('DOMContentLoaded', init);

})();