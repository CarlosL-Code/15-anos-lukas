document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.getElementById('slideshow-container');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');
    const audioPlayer = document.getElementById('audio-player');
    
    let currentImageIndex = 0;
    let currentAudioIndex = 0;
    let slides = [];
    
    const slideDuration = 6000; // Time per slide in ms

    // Generate decorations (Stars and Balloons)
    const decorationsContainer = document.getElementById('decorations');
    
    function createDecorations() {
        // Create stars
        for (let i = 0; i < 50; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            star.style.animationDelay = (Math.random() * 2) + 's';
            decorationsContainer.appendChild(star);
        }

        // Create balloons
        for (let i = 0; i < 12; i++) {
            let balloon = document.createElement('div');
            balloon.classList.add('balloon');
            
            // Distribute far on left and right edges to avoid text
            let side = Math.random() > 0.5 ? (Math.random() * 10 + 2) : (88 + Math.random() * 10);
            balloon.style.left = side + 'vw';
            
            // Widen duration and delay to prevent clumping
            balloon.style.animationDuration = (Math.random() * 15 + 15) + 's';
            balloon.style.animationDelay = (Math.random() * 20) + 's';
            
            // Colors: Blue, Yellow, Red, Rose Gold
            const colorPairs = [
                ['#1e3a8a', '#3b82f6'], // Blue
                ['#b45309', '#fcd34d'], // Yellow
                ['#7f1d1d', '#ef4444'], // Red
                ['#e6c8a3', '#b8916d']  // Rose gold
            ];
            const color = colorPairs[Math.floor(Math.random() * colorPairs.length)];
            balloon.style.background = `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)`;
            
            decorationsContainer.appendChild(balloon);
        }

        // Create floating texts
        for (let i = 0; i < 6; i++) {
            let text = document.createElement('div');
            text.classList.add('floating-text');
            text.innerText = "Feliz 15 Lukas";
            
            // Place text slightly more inward than balloons
            let side = Math.random() > 0.5 ? (Math.random() * 10 + 15) : (75 + Math.random() * 10);
            text.style.left = side + 'vw';
            
            // Widen duration and delay
            text.style.animationDuration = (Math.random() * 15 + 18) + 's';
            text.style.animationDelay = (Math.random() * 25) + 's';
            
            decorationsContainer.appendChild(text);
        }
    }
    
    createDecorations();

    // Deduplicate and randomize images
    const uniqueImages = [...new Set(images)];
    const shuffledImages = uniqueImages.sort(() => 0.5 - Math.random());
    const validImages = shuffledImages.filter(img => img.match(/\.(jpeg|jpg|png|gif)$/i));

    // Create slide elements
    validImages.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.style.backgroundImage = `url("${encodeURI(imgSrc)}")`;
        slideshowContainer.appendChild(slide);
        slides.push(slide);
    });

    function nextSlide() {
        if (slides.length === 0) return;
        
        const prevIndex = currentImageIndex;
        currentImageIndex = (currentImageIndex + 1) % slides.length;
        
        slides[prevIndex].classList.remove('active');
        slides[prevIndex].classList.add('previous');
        
        slides[currentImageIndex].classList.add('active');
        
        // Clean up previous class after transition finishes (3s)
        setTimeout(() => {
            slides[prevIndex].classList.remove('previous');
        }, 3000);
    }

    function playAudio() {
        if (audioFiles && audioFiles.length > 0) {
            audioPlayer.src = encodeURI(audioFiles[currentAudioIndex]);
            audioPlayer.play().catch(e => console.log("Audio play prevented:", e));
            
            // Check near end to start next song without long delay
            audioPlayer.ontimeupdate = () => {
                // If within 3 seconds of the end, jump to next song
                if (audioPlayer.duration && audioPlayer.currentTime >= audioPlayer.duration - 3) {
                    currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
                    audioPlayer.src = encodeURI(audioFiles[currentAudioIndex]);
                    audioPlayer.play();
                }
            };
        }
    }

    startBtn.addEventListener('click', () => {
        // Start audio immediately on click
        playAudio();
        
        // Hide overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            
            // Start slideshow in background
            if (slides.length > 0) {
                slides[0].classList.add('active');
                setInterval(nextSlide, slideDuration);
            }
            
            // Show intro message
            const msgIntro = document.getElementById('message-intro');
            msgIntro.style.display = 'flex';
            setTimeout(() => { msgIntro.style.opacity = '1'; }, 100);
            
            const msgLines = document.querySelectorAll('.msg-line');
            msgLines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.add('visible');
                }, 1000 + (index * 3500)); // Stagger each line by 3.5 seconds
            });
            
            // Fade out the whole message after all lines are shown + wait time
            const totalIntroTime = 1000 + (msgLines.length * 3500) + 6000;
            setTimeout(() => {
                msgIntro.style.opacity = '0';
                setTimeout(() => {
                    msgIntro.style.display = 'none';
                }, 3000);
            }, totalIntroTime);

        }, 2000);
    });
});
