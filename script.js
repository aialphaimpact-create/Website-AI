// Initialize Lucide icons
lucide.createIcons();

// Floating Book a Call button click handler
const bookCallBtn = document.querySelector('.book-call-btn');
if (bookCallBtn) {
    bookCallBtn.addEventListener('click', () => {
        alert('Alpha Impact Booking widget will open here!');
    });
}

// Scroll Network Animation (Grid -> Hub & Spoke)
const section = document.querySelector('.scroll-network');
const hubNode = document.getElementById('node-hub');
const satNodes = [
    document.getElementById('node-sat-1'),
    document.getElementById('node-sat-2'),
    document.getElementById('node-sat-3')
];
const lines = [
    document.getElementById('line-1'),
    document.getElementById('line-2'),
    document.getElementById('line-3')
];

function updateNetworkAnimation() {
    if (!section || window.innerWidth <= 768) {
        // Reset styles for mobile
        return;
    }
    
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    const startScroll = rect.top;
    const scrollableDistance = rect.height - viewportHeight;
    
    let progress = 0;
    if (startScroll <= 0) {
        progress = Math.abs(startScroll) / scrollableDistance;
    }
    progress = Math.max(0, Math.min(1, progress));
    
    // Add easing to progress for smoother morph
    const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const isTablet = window.innerWidth <= 1024;
    const baseGap = isTablet ? 150 : 180;
    
    // STATE 1: 2x2 Grid Coordinates (offsets from center)
    const gridState = {
        hub: { x: baseGap, y: -baseGap, scale: 1, radius: 48 }, // 48px = 3rem
        sat1: { x: -baseGap, y: -baseGap, scale: 1 },
        sat2: { x: -baseGap, y: baseGap, scale: 1 },
        sat3: { x: baseGap, y: baseGap, scale: 1 }
    };
    
    // STATE 2: Hub & Spoke Coordinates
    const spokeGapX = isTablet ? 300 : 420;
    const spokeGapY = isTablet ? 250 : 280;
    const spokeState = {
        hub: { x: 0, y: 0, scale: 1.2, radius: 160 }, // 160px = circle for 320x320 box
        sat1: { x: -spokeGapX, y: 0, scale: 1 },
        sat2: { x: spokeGapX, y: -spokeGapY, scale: 1 },
        sat3: { x: spokeGapX, y: spokeGapY, scale: 1 }
    };

    // Helper to interpolate
    const lerp = (start, end, t) => start + (end - start) * t;

    // 1. Animate Hub Node
    const hubX = lerp(gridState.hub.x, spokeState.hub.x, easeInOutCubic);
    const hubY = lerp(gridState.hub.y, spokeState.hub.y, easeInOutCubic);
    const hubScale = lerp(gridState.hub.scale, spokeState.hub.scale, easeInOutCubic);
    const hubRadius = lerp(gridState.hub.radius, spokeState.hub.radius, easeInOutCubic);
    
    // Text fades out
    const textOpacity = Math.max(0, 1 - (progress * 3));
    const hubGlow = easeInOutCubic;
    const iconScale = lerp(1, 2, easeInOutCubic);

    hubNode.style.setProperty('--node-x', `${hubX}px`);
    hubNode.style.setProperty('--node-y', `${hubY}px`);
    hubNode.style.setProperty('transform', `translate(calc(-50% + ${hubX}px), calc(-50% + ${hubY}px)) scale(${hubScale})`);
    hubNode.style.setProperty('--node-radius', `${hubRadius}px`);
    hubNode.style.setProperty('--hub-text-opacity', textOpacity);
    hubNode.style.setProperty('--hub-glow', hubGlow);
    hubNode.style.setProperty('--icon-scale', iconScale);
    hubNode.style.setProperty('--hub-center-progress', easeInOutCubic);

    // 2. Animate Satellite Nodes
    const satStates = [
        { start: gridState.sat1, end: spokeState.sat1 },
        { start: gridState.sat2, end: spokeState.sat2 },
        { start: gridState.sat3, end: spokeState.sat3 }
    ];

    const stickyView = document.querySelector('.sticky-view');
    const centerX = stickyView.clientWidth / 2;
    const centerY = stickyView.clientHeight / 2;

    satNodes.forEach((node, index) => {
        const state = satStates[index];
        const currentX = lerp(state.start.x, state.end.x, easeInOutCubic);
        const currentY = lerp(state.start.y, state.end.y, easeInOutCubic);
        const currentScale = lerp(state.start.scale, state.end.scale, easeInOutCubic);
        
        node.style.setProperty('--node-x', `${currentX}px`);
        node.style.setProperty('--node-y', `${currentY}px`);
        node.style.setProperty('transform', `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${currentScale})`);
        
        // Update SVG Lines
        const line = lines[index];
        if (line) {
            line.setAttribute('x1', centerX + hubX);
            line.setAttribute('y1', centerY + hubY);
            line.setAttribute('x2', centerX + currentX);
            line.setAttribute('y2', centerY + currentY);
            
            // Fades in cleanly as they move apart
            const lineProgress = progress > 0.1 ? Math.min(1, (progress - 0.1) * 1.25) : 0;
            line.style.opacity = lineProgress;
        }
    });
}

window.addEventListener('scroll', updateNetworkAnimation);
window.addEventListener('resize', updateNetworkAnimation);

// Trigger initial calculation
updateNetworkAnimation();

// --- Expand Section Animation Logic ---
const expandSection = document.querySelector('.scroll-expand-section');
const videoFrame = document.getElementById('founder-video');
const founderText = document.getElementById('founder-text');

function updateExpandAnimation() {
    if (!expandSection || window.innerWidth <= 768) return;

    const rect = expandSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    const startScroll = rect.top;
    const scrollableDistance = rect.height - viewportHeight;
    
    let progress = 0;
    if (startScroll <= 0) {
        progress = Math.abs(startScroll) / scrollableDistance;
    }
    progress = Math.max(0, Math.min(1, progress));

    // Phase 1: Expansion (0 to 0.6)
    const expansionProgress = Math.min(1, progress / 0.6);
    const easeExp = expansionProgress < 0.5 
        ? 4 * expansionProgress * expansionProgress * expansionProgress 
        : 1 - Math.pow(-2 * expansionProgress + 2, 3) / 2;

    const startW = 320;
    const startH = 320;
    const startR = 48; // 3rem

    const endW = window.innerWidth;
    const endH = window.innerHeight;
    const endR = 0;

    const currentW = startW + (endW - startW) * easeExp;
    const currentH = startH + (endH - startH) * easeExp;
    const currentR = startR + (endR - startR) * easeExp;

    videoFrame.style.setProperty('--expand-w', `${currentW}px`);
    videoFrame.style.setProperty('--expand-h', `${currentH}px`);
    videoFrame.style.setProperty('--expand-r', `${currentR}px`);

    // Fade in the frame smoothly at the start of scroll
    const frameOpacity = Math.min(1, progress * 10);
    videoFrame.style.opacity = frameOpacity;

    // Phase 2: Text Reveal (0.6 to 1.0)
    let textOpacity = 0;
    if (progress > 0.6) {
        textOpacity = (progress - 0.6) / 0.4;
    }
    
    founderText.style.setProperty('--founder-opacity', textOpacity);
}

window.addEventListener('scroll', updateExpandAnimation);
window.addEventListener('resize', updateExpandAnimation);
updateExpandAnimation();

// --- Premium Solid Grid Wall Animation Logic ---
const gridSection = document.getElementById('creatives');
const masonryGrid = document.querySelector('.solid-masonry-grid');
const descs = [
    document.querySelector('.desc-1'),
    document.querySelector('.desc-2'),
    document.querySelector('.desc-3'),
    document.querySelector('.desc-4')
];

function updateGridAnimation() {
    if (!gridSection || !masonryGrid) return;

    const rect = gridSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    let progress = 0;
    if (rect.top <= 0) {
        progress = Math.abs(rect.top) / (rect.height - viewportHeight);
    }
    progress = Math.max(0, Math.min(1, progress));

    // Smooth singular vertical pan (moves up slowly as user scrolls down)
    const travel = progress * -30; // -30% translation
    masonryGrid.style.transform = `translate3d(0, ${travel}%, 0)`;

    // Text Overlay Animation
    const phaseLength = 1 / descs.length;
    
    descs.forEach((desc, index) => {
        if (!desc) return;
        
        const start = index * phaseLength;
        const peak = start + (phaseLength / 2);
        const end = start + phaseLength;
        
        let opacity = 0;
        let translateY = 50;
        
        if (progress >= start && progress <= end) {
            if (progress <= peak) {
                // Fading in
                const localProgress = (progress - start) / (phaseLength / 2);
                opacity = Math.min(1, localProgress * 1.5); // Fades in slightly faster
                translateY = 50 * (1 - localProgress);
            } else {
                // Fading out
                const localProgress = (progress - peak) / (phaseLength / 2);
                opacity = Math.max(0, 1 - (localProgress * 1.5));
                translateY = -50 * localProgress; 
            }
        }
        
        desc.style.opacity = opacity;
        desc.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
}

window.addEventListener('scroll', updateGridAnimation);
window.addEventListener('resize', updateGridAnimation);
updateGridAnimation();

// --- Alpha System Section Parallax & Particles ---
const systemSection = document.querySelector('.alpha-system-section');
const systemCards = document.querySelectorAll('.system-card');

window.addEventListener("scroll", () => {
    if(!systemSection) return;
    const rect = systemSection.getBoundingClientRect();
    
    if(rect.top < window.innerHeight && rect.bottom > 0) {
        const scrolledIntoSection = window.innerHeight - rect.top;
        
        systemCards.forEach((card, index) => {
            const speed = (index + 1) * 0.1;
            card.style.transform = `translateY(${scrolledIntoSection * speed * -1.5}px)`;
        });
        
        const finalStatement = document.querySelector('.final-statement');
        if(finalStatement) {
            // Match the speed of the 4th card (index 3) so it stays attached underneath it
            const finalTransY = scrolledIntoSection * 0.4 * -1.5;
            finalStatement.style.transform = `translateY(${finalTransY}px)`;
            
            // Shrink the bottom of the page dynamically so there is no blank space left behind
            systemSection.style.marginBottom = `${finalTransY}px`;
        }
    }
});

const particleContainer = document.querySelector(".particles");
if(particleContainer) {
    for(let i = 0; i < 80; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDuration = 4 + Math.random() * 8 + "s";
        particle.style.animationDelay = Math.random() * 5 + "s";
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particleContainer.appendChild(particle);
    }
}

// --- FAQ Accordion Logic ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other items for a cleaner accordion feel
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if(otherAnswer) otherAnswer.style.height = '0px';
        });
        
        if (!isOpen) {
            item.classList.add('active');
            const inner = answer.querySelector('.faq-answer-inner');
            answer.style.height = inner.offsetHeight + 'px';
        }
    });
});

// --- Global Scroll Reveal (Apple-style) ---
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only reveal once for a premium feel
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Trigger initial load reveals immediately (Modified for Portal)
window.addEventListener('load', () => {
    // If portal exists, do not trigger reveals yet
    if (!document.getElementById('portal-curtain')) {
        document.querySelectorAll('.reveal-onload').forEach(el => {
            el.classList.add('is-visible');
        });
    }
});

// Prevent browser from automatically restoring scroll position on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- LOADING SPLASH SCREEN ENGINE ---
const portalCurtain = document.getElementById('portal-curtain');
const loadingBar = document.getElementById('loading-bar');
const loadingPercent = document.getElementById('loading-percent');
const mainContent = document.getElementById('main-content');
const pageBody = document.body;

let portalProgress = 0; 
let isPortalActive = !!portalCurtain;
let autoAdvanceFrame = null;

function updatePortal(progress) {
    if (!isPortalActive) return;
    
    if (loadingBar) loadingBar.style.width = `${progress * 100}%`;
    if (loadingPercent) loadingPercent.innerText = `${Math.floor(progress * 100)}%`;

    if (progress >= 1) {
        completePortal();
    }
}

function autoAdvance() {
    // Easing the progress slightly so it slows down near the end
    let remaining = 1 - portalProgress;
    portalProgress += Math.max(0.005, remaining * 0.05);
    
    if (portalProgress > 0.999) portalProgress = 1;
    updatePortal(portalProgress);
    
    if (portalProgress < 1 && isPortalActive) {
        autoAdvanceFrame = requestAnimationFrame(autoAdvance);
    }
}

function completePortal() {
    isPortalActive = false;
    
    // Force scroll to top before revealing website
    window.scrollTo(0, 0);

    const title = document.querySelector('.loading-title');
    const ui = document.querySelector('.loading-ui');

    // 1. Fade out the progress UI
    if (ui) ui.style.opacity = '0';

    // 2. Zoom the ALPHA text massive and fade it out
    if (title) {
        title.style.transform = 'scale(100)';
        title.style.opacity = '0'; 
    }

    // 3. Fade out the black curtain shortly after zoom begins
    setTimeout(() => {
        if (portalCurtain) {
            portalCurtain.classList.add('loaded'); // Triggers CSS opacity fade
            setTimeout(() => portalCurtain.remove(), 1200); 
        }
        
        if (mainContent) {
            mainContent.classList.remove('locked', 'pointer-events-none');
        }
        pageBody.classList.remove('portal-locked');

        // Trigger reveal animations now that the portal has cleared
        setTimeout(() => {
            document.querySelectorAll('.reveal-onload').forEach(el => {
                el.classList.add('is-visible');
            });
            
            // Reveal the floating button
            const floatingBtn = document.getElementById('floating-btn');
            if (floatingBtn) {
                floatingBtn.classList.remove('hidden-during-load');
            }
        }, 200);
    }, 400);
}

// Start the loading sequence automatically
if (isPortalActive) {
    setTimeout(() => {
        autoAdvanceFrame = requestAnimationFrame(autoAdvance);
    }, 400); 
}
