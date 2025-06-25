document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLING (DARK/LIGHT MODE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;

    // Apply theme from local storage or system preference
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (storedTheme === 'dark') {
        body.classList.add('dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        body.classList.remove('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDarkMode = body.classList.contains('dark');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeIcon.classList.toggle('fa-sun', !isDarkMode);
        themeIcon.classList.toggle('fa-moon', isDarkMode);
    });

    // --- 2. DYNAMIC SKILLS & TECH STACK ---
    const skillsData = [
        { name: "Networking", icon: "fas fa-network-wired" },
        { name: "Vuln. Analysis", icon: "fas fa-bug" },
        { name: "Kali Linux", icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor"><title>Kali Linux</title><path d="M12.012 0L.024 4.164v10.32l5.448 3.12v-6.24L0 8.256V5.4L12.012 1.2l11.988 4.2v2.856l-5.472 3.144v6.24l5.472-3.12V4.164Zm-5.46 13.464v6.264l5.46-3.156 5.46 3.156v-6.264l-5.46-3.144Z"/></svg>` },
        { name: "Python", icon: "fab fa-python" },
        { name: "Nessus", icon: "fas fa-shield-alt" },
        { name: "Wireshark", icon: "fas fa-wave-square" },
        { name: "AWS", icon: "fab fa-aws" },
        { name: "ISO 27001", icon: "fas fa-fingerprint" },
        { name: "OWASP Top 10", icon: "fas fa-exclamation-triangle" },
        { name: "VPN", icon: "fas fa-lock" }
    ];

    const skillsGrid = document.getElementById('skills-grid');
    if(skillsGrid) {
        skillsData.forEach(skill => {
            const skillEl = document.createElement('div');
            skillEl.className = "flex flex-col items-center group cursor-pointer skill-item";
            
            const iconHTML = skill.icon.startsWith('<svg') 
                ? `<div class="skill-icon">${skill.icon}</div>`
                : `<i class="${skill.icon} skill-icon"></i>`;

            skillEl.innerHTML = `
                <div class="text-3xl text-secondary mb-2 transition-all duration-300 group-hover:text-accent transform group-hover:scale-110">
                    ${iconHTML}
                </div>
                <span class="text-xs text-secondary transition-colors duration-300 group-hover:text-main">${skill.name}</span>
            `;
            skillsGrid.appendChild(skillEl);
        });
    }

    // --- 3. DYNAMIC CERTIFICATIONS ---
    const certificationsData = [
        { name: "Complete Guide to Power BI for Data Analysts", issuer: "LinkedIn", skills: ["Power BI", "Data Analysis", "BI"], credentialLink: "#" },
        { name: "Microsoft Security Essentials Professional Certificate", issuer: "Microsoft", skills: ["GRC", "Cloud Security", "Azure"], credentialLink: "#" },
        { name: "Operating Systems: Overview, Administration, and Security", issuer: "Coursera", skills: ["Virtualization", "Windows", "Linux"], credentialLink: "#" },
        { name: "HCIA Security", issuer: "Huawei", skills: ["Routing", "Switching", "Network Security"], credentialLink: "#" },
        { name: "CCNA Introduction to Networks", issuer: "Cisco", skills: ["Networking", "Packet Tracer", "IP Addressing"], credentialLink: "#" },
        { name: "AWS Academy Cloud Foundations", issuer: "AWS", skills: ["Cloud Computing", "EC2", "S3", "VPC"], credentialLink: "#" },
        { name: "Docker Essentials", issuer: "Katacoda", skills: ["Containerization", "Docker", "Microservices"], credentialLink: "#" },
        { name: "Neural Networks and Deep Learning", issuer: "Coursera", skills: ["Deep Learning", "Neural Networks", "TensorFlow"], credentialLink: "#" },
        { name: "Vulnerability Management with Nessus", issuer: "Tenable", skills: ["Nessus", "Vulnerability Scanning", "Remediation"], credentialLink: "#" }
    ];

    const certificationsGrid = document.getElementById('certifications-grid');
    if (certificationsGrid) {
        certificationsData.forEach(cert => {
            const cardLink = document.createElement('a');
            cardLink.href = cert.credentialLink || '#';
            cardLink.target = '_blank';
            cardLink.rel = 'noopener noreferrer';
            cardLink.className = 'block p-5 rounded-lg transition-all duration-300 hover:bg-white/5 hover:scale-105 border border-transparent hover:border-accent/50 glow-on-hover';
            
            let skillsHTML = cert.skills.map(skill => `<span class="card-tag">${skill}</span>`).join('');

            cardLink.innerHTML = `
                <div class="flex flex-col h-full">
                    <h4 class="font-bold text-main text-md leading-tight mb-2 flex-grow">${cert.name}</h4>
                    <p class="text-secondary text-sm mb-4">${cert.issuer}</p>
                    <div class="flex flex-wrap gap-2 mt-auto">
                        ${skillsHTML}
                    </div>
                </div>
            `;
            certificationsGrid.appendChild(cardLink);
        });
    }

    // --- 4. SCROLL-BASED ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // --- 5. INTERACTIVE CANVAS BACKGROUND ---
    const canvas = document.getElementById('animated-background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100;
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() * 0.4 - 0.2);
                this.speedY = (Math.random() * 0.4 - 0.2);
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 100;
                let force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    this.x -= forceDirectionX * force * this.density * 0.1;
                    this.y -= forceDirectionY * force * this.density * 0.1;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            draw(context) {
                const isDark = document.body.classList.contains('dark');
                context.fillStyle = isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)';
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', setupCanvas);
        themeToggle.addEventListener('click', () => {
            setupCanvas();
        });
        
        setupCanvas();
        animate();
    }

    // --- 6. HERO TEXT "DECODING" ANIMATION ---
    function typeWriter(element) {
        const text = element.getAttribute('data-text');
        element.innerHTML = '';
        element.style.opacity = '1';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    // Stagger the start of each text animation
    setTimeout(() => typeWriter(document.getElementById('hero-subtitle')), 500);
    setTimeout(() => typeWriter(document.getElementById('hero-title')), 1000);
    setTimeout(() => typeWriter(document.getElementById('hero-description')), 2000);
    setTimeout(() => document.getElementById('hero-button').style.opacity = '1', 3000);


    // --- 7. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#desktop-nav-links a, #mobile-nav-links a');

    const activateLink = (id) => {
        navLinks.forEach(link => {
            link.classList.remove('active', 'text-accent');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active', 'text-accent');
            }
        });
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateLink(entry.target.id);
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => {
        scrollObserver.observe(section);
    });
});
