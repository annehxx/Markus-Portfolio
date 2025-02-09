document.addEventListener('DOMContentLoaded', () => {
    // Add hamburger button to the nav
    const nav = document.querySelector('nav');
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
    `;
    nav.insertBefore(hamburger, nav.firstChild);

    // Get the menu elements
    const menuList = document.querySelector('nav ul');
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menuList.classList.toggle('active');
    });

    // Close menu when clicking a link
    const menuLinks = document.querySelectorAll('nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menuList.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && menuList.classList.contains('active')) {
            hamburger.classList.remove('active');
            menuList.classList.remove('active');
        }
    });
});


// Lazy Loading für Bilder
document.addEventListener('DOMContentLoaded', () => {
    // Konfiguration für den Intersection Observer
    const observerOptions = {
        root: null, // viewport als root
        rootMargin: '50px', // lädt etwas früher
        threshold: 0.1 // 10% des Elements muss sichtbar sein
    };

    // Bilder Lazy Loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    // Alle Bilder mit data-src beobachten
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Sections Lazy Loading
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Alle Sections beobachten
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('lazy-section');
        sectionObserver.observe(section);
    });

    // Spline Viewer Lazy Loading
    const splineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spline = entry.target;
                if (spline.dataset.url) {
                    spline.url = spline.dataset.url;
                    spline.removeAttribute('data-url');
                }
                observer.unobserve(spline);
            }
        });
    }, observerOptions);

    // Alle Spline Viewer beobachten
    document.querySelectorAll('spline-viewer[data-url]').forEach(spline => {
        splineObserver.observe(spline);
    });
});



// Erstelle das Canvas sobald das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    // Canvas Setup
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    // Stelle sicher, dass Canvas die volle Größe hat
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Stern-Klasse
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1500 + 500; // Entfernung vom Betrachter
            this.size = Math.random() * 2;
            this.speed = Math.random() * 0.5 + 0.1;
            this.brightness = Math.random() * 0.5 + 0.5;
        }

        update(mouseX, mouseY) {
            // Bewege Sterne basierend auf Mausposition
            const dx = (mouseX - canvas.width / 2) * 0.001;
            const dy = (mouseY - canvas.height / 2) * 0.001;

            this.x += dx * (this.z * 0.001);
            this.y += dy * (this.z * 0.001);

            // Zusätzliche langsame Bewegung
            this.y += this.speed;

            // Wenn Stern außerhalb des Sichtfelds, reset
            if (this.y > canvas.height || this.y < 0 || 
                this.x > canvas.width || this.x < 0) {
                this.reset();
            }
        }

        draw() {
            const scale = 1500 / (this.z + 500); // Perspektive
            const alpha = this.brightness * scale;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
            
            // Erstelle einen Farbverlauf für den Stern
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * scale
            );
            gradient.addColorStop(0, `rgba(134, 60, 255, ${alpha})`);        // Dein Markenviolett
            gradient.addColorStop(0.5, `rgba(134, 60, 255, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(134, 60, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Erstelle Sterne
    const stars = Array.from({ length: 200 }, () => new Star());
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Mausbewegung tracken
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation Loop
    function animate() {
        ctx.fillStyle = 'rgba(5, 2, 8, 0.2)'; // Dein dunkler Hintergrund mit Trail-Effekt
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.update(mouseX, mouseY);
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});


