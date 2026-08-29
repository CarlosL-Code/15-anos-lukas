document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.getElementById('slideshow-container');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');
    const audioPlayer = document.getElementById('audio-player');
    const controlsContainer = document.getElementById('controls-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    
    let currentImageIndex = 0;
    let currentAudioIndex = 0;
    let slides = [];
    let slideTimer;
    let isPlaying = true;
    const slideDuration = 6000;

    // Decorations
    const decorationsContainer = document.getElementById('decorations');
    function createDecorations() {
        for (let i = 0; i < 50; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            star.style.animationDelay = (Math.random() * 2) + 's';
            decorationsContainer.appendChild(star);
        }
        for (let i = 0; i < 12; i++) {
            let balloon = document.createElement('div');
            balloon.classList.add('balloon');
            let side = Math.random() > 0.5 ? (Math.random() * 10 + 2) : (88 + Math.random() * 10);
            balloon.style.left = side + 'vw';
            balloon.style.animationDuration = (Math.random() * 15 + 15) + 's';
            balloon.style.animationDelay = (Math.random() * 20) + 's';
            const colorPairs = [['#1e3a8a', '#3b82f6'], ['#b45309', '#fcd34d'], ['#7f1d1d', '#ef4444'], ['#e6c8a3', '#b8916d']];
            const color = colorPairs[Math.floor(Math.random() * colorPairs.length)];
            balloon.style.background = `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)`;
            decorationsContainer.appendChild(balloon);
        }
        for (let i = 0; i < 6; i++) {
            let text = document.createElement('div');
            text.classList.add('floating-text');
            text.innerText = "Feliz 15 Lukas";
            let side = Math.random() > 0.5 ? (Math.random() * 10 + 15) : (75 + Math.random() * 10);
            text.style.left = side + 'vw';
            text.style.animationDuration = (Math.random() * 15 + 18) + 's';
            text.style.animationDelay = (Math.random() * 25) + 's';
            decorationsContainer.appendChild(text);
        }
    }
    createDecorations();

    // Deduplicate and randomize images/videos
    const uniqueImages = [...new Set(images)];
    const shuffledItems = uniqueImages.sort(() => 0.5 - Math.random());
    const validItems = shuffledItems.filter(img => img.match(/\.(jpeg|jpg|png|gif|mp4)$/i));

    // Create slide elements
    validItems.forEach((src) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        if (src.toLowerCase().endsWith('.mp4')) {
            const vid = document.createElement('video');
            vid.src = encodeURI(src);
            vid.classList.add('slide-video');
            vid.muted = true;
            vid.loop = true;
            vid.playsInline = true;
            slide.appendChild(vid);
        } else {
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('slide-img');
            imgDiv.style.backgroundImage = `url("${encodeURI(src)}")`;
            slide.appendChild(imgDiv);
        }
        
        slideshowContainer.appendChild(slide);
        slides.push(slide);
    });

    function updateProgressBar() {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.transition = `width ${slideDuration}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    function handleVideoPlayback(slideElement, play) {
        const vid = slideElement.querySelector('video');
        if (vid) {
            if (play) vid.play().catch(e => console.log(e));
            else vid.pause();
        }
    }

    function goToSlide(index) {
        if (slides.length === 0) return;
        
        const prevIndex = currentImageIndex;
        currentImageIndex = index;
        
        // Ensure index wraps around properly
        if (currentImageIndex < 0) currentImageIndex = slides.length - 1;
        if (currentImageIndex >= slides.length) currentImageIndex = 0;
        
        slides[prevIndex].classList.remove('active');
        slides[prevIndex].classList.add('previous');
        handleVideoPlayback(slides[prevIndex], false);
        
        slides[currentImageIndex].classList.add('active');
        handleVideoPlayback(slides[currentImageIndex], true);
        
        setTimeout(() => {
            slides[prevIndex].classList.remove('previous');
        }, 2000); // 2s transition

        if (isPlaying) {
            updateProgressBar();
            resetTimer();
        }
    }

    function nextSlide() { goToSlide(currentImageIndex + 1); }
    function prevSlide() { goToSlide(currentImageIndex - 1); }

    function resetTimer() {
        clearInterval(slideTimer);
        if (isPlaying) {
            slideTimer = setInterval(nextSlide, slideDuration);
        }
    }

    function togglePlayPause() {
        isPlaying = !isPlaying;
        playPauseBtn.innerText = isPlaying ? "⏸" : "▶";
        
        if (isPlaying) {
            updateProgressBar();
            resetTimer();
            handleVideoPlayback(slides[currentImageIndex], true);
        } else {
            clearInterval(slideTimer);
            progressBar.style.transition = 'none';
            handleVideoPlayback(slides[currentImageIndex], false);
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    playPauseBtn.addEventListener('click', togglePlayPause);

    function playAudio() {
        if (audioFiles && audioFiles.length > 0) {
            audioPlayer.src = encodeURI(audioFiles[currentAudioIndex]);
            audioPlayer.play().catch(e => console.log("Audio play prevented:", e));
            
            audioPlayer.ontimeupdate = () => {
                if (audioPlayer.duration && audioPlayer.currentTime >= audioPlayer.duration - 3) {
                    currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
                    audioPlayer.src = encodeURI(audioFiles[currentAudioIndex]);
                    audioPlayer.play();
                }
            };
        }
    }

    startBtn.addEventListener('click', () => {
        playAudio();
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            
            // Show intro message with static background
            const msgIntro = document.getElementById('message-intro');
            msgIntro.style.display = 'flex';
            setTimeout(() => { msgIntro.style.opacity = '1'; }, 100);
            
            const msgLines = document.querySelectorAll('.msg-line');
            msgLines.forEach((line, index) => {
                setTimeout(() => { line.classList.add('visible'); }, 1000 + (index * 3500));
            });
            
            // Fade out the intro and start slideshow
            const totalIntroTime = 1000 + (msgLines.length * 3500) + 5000;
            setTimeout(() => {
                msgIntro.style.opacity = '0';
                
                setTimeout(() => {
                    msgIntro.style.display = 'none';
                    
                    // Show controls and start slider
                    controlsContainer.style.opacity = '1';
                    if (slides.length > 0) {
                        slides[0].classList.add('active');
                        handleVideoPlayback(slides[0], true);
                        updateProgressBar();
                        resetTimer();
                    }
                }, 2000);
            }, totalIntroTime);

        }, 2000);
    });
});
