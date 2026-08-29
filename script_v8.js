document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.getElementById('slideshow-container');
    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');
    const audioPlayer1 = document.getElementById('audio-player-1');
    const audioPlayer2 = document.getElementById('audio-player-2');
    const controlsContainer = document.getElementById('controls-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    
    let currentImageIndex = 0;
    let currentAudioIndex = 0;
    let activePlayer = 1;
    let slides = [];
    let slideTimer;
    let isPlaying = true;
    const slideDuration = 8500; // Increased to 8.5s so images last longer than the 3 songs (no repeating)

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
            text.innerText = "Feliz 15 Lucas";
            
            // Explicitly force half to the left, half to the right
            let side;
            if (i % 2 === 0) {
                side = Math.random() * 10 + 10; // 10vw to 20vw (Left)
            } else {
                side = 75 + Math.random() * 10; // 75vw to 85vw (Right)
            }
            
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

    const animations = ['anim-zoom', 'anim-pan-right', 'anim-pan-left', 'anim-up', 'anim-down'];

    // Create slide elements
    validItems.forEach((src) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        // Assign a random movement animation to this slide
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        slide.classList.add(randomAnim);
        
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
        playPauseBtn.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9654;";
        
        const currentAudio = activePlayer === 1 ? audioPlayer1 : audioPlayer2;
        
        if (isPlaying) {
            document.body.classList.remove('is-paused');
            updateProgressBar();
            resetTimer();
            handleVideoPlayback(slides[currentImageIndex], true);
            currentAudio.play().catch(e => console.log(e));
        } else {
            document.body.classList.add('is-paused');
            clearInterval(slideTimer);
            
            // Freeze progress bar where it is
            const computedWidth = window.getComputedStyle(progressBar).width;
            progressBar.style.transition = 'none';
            progressBar.style.width = computedWidth;
            
            handleVideoPlayback(slides[currentImageIndex], false);
            currentAudio.pause();
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    playPauseBtn.addEventListener('click', togglePlayPause);

    function playAudio() {
        if (audioFiles && audioFiles.length > 0) {
            audioPlayer1.src = encodeURI(audioFiles[0]);
            audioPlayer1.play().catch(e => console.log("Audio play prevented:", e));
            
            if (audioFiles.length > 1) {
                // Preload the next song IMMEDIATELY so it's ready in memory
                audioPlayer2.src = encodeURI(audioFiles[1]);
                audioPlayer2.load();
            }
            
            const handleTimeUpdate = (currentPlayer, nextPlayer) => {
                // Skip the last 15 seconds to avoid long silent tails entirely
                if (currentPlayer.duration && currentPlayer.currentTime >= currentPlayer.duration - 15) {
                    
                    if (currentAudioIndex === audioFiles.length - 1) {
                        // THIS IS THE LAST SONG! Trigger End Sequence
                        clearInterval(slideTimer);
                        isPlaying = false;
                        
                        // Fade out current audio
                        let fadeOut = setInterval(() => {
                            let newVol = currentPlayer.volume - 0.1;
                            if (newVol <= 0.05) {
                                clearInterval(fadeOut);
                                currentPlayer.volume = 0;
                                currentPlayer.pause();
                            } else {
                                currentPlayer.volume = newVol;
                            }
                        }, 200);

                        // Fade out slideshow and hide controls
                        controlsContainer.style.opacity = '0';
                        slideshowContainer.style.opacity = '0';
                        
                        // Show Outro Message
                        setTimeout(() => {
                            const msgOutro = document.getElementById('message-outro');
                            msgOutro.style.display = 'flex';
                            setTimeout(() => { msgOutro.style.opacity = '1'; }, 100);
                            
                            const msgLines = msgOutro.querySelectorAll('.msg-line');
                            msgLines.forEach((line, index) => {
                                setTimeout(() => { line.classList.add('visible'); }, 1000 + (index * 3500));
                            });
                        }, 2000);
                        
                        currentPlayer.ontimeupdate = null;
                        return; // Stop logic here
                    }

                    currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
                    
                    // Start playing the already-preloaded next player
                    nextPlayer.currentTime = 0;
                    nextPlayer.play().catch(e => console.log("Next track play failed:", e));
                    
                    // Immediately preload the THIRD song in the background into the old player
                    const nextNextIndex = (currentAudioIndex + 1) % audioFiles.length;
                    
                    activePlayer = activePlayer === 1 ? 2 : 1;
                    currentPlayer.ontimeupdate = null; // Unbind
                    nextPlayer.ontimeupdate = () => handleTimeUpdate(nextPlayer, currentPlayer);
                    
                    // Fade out the current player gracefully and safely
                    let fadeOut = setInterval(() => {
                        let newVol = currentPlayer.volume - 0.1;
                        if (newVol <= 0.05) {
                            clearInterval(fadeOut);
                            currentPlayer.volume = 0;
                            currentPlayer.pause();
                            currentPlayer.volume = 1;
                            // Preload the upcoming song now that it's fully paused
                            currentPlayer.src = encodeURI(audioFiles[nextNextIndex]);
                            currentPlayer.load();
                        } else {
                            currentPlayer.volume = newVol;
                        }
                    }, 200);
                }
            };
            
            audioPlayer1.ontimeupdate = () => handleTimeUpdate(audioPlayer1, audioPlayer2);
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
