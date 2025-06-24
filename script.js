// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTo({
            behavior: 'smooth'
        });
    });
});

// Day/Night Mode Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    localStorage.setItem('theme', theme); // Save preference
    // Update particles color immediately when theme changes
    updateParticleColors();
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Particle background animation for Hero section
const heroSection = document.getElementById('home');
const particleCanvas = document.getElementById('hero-particles');
const ctx = particleCanvas ? particleCanvas.getContext('2d') : null; // Check if canvas exists
let particles = [];
const numberOfParticles = 50; // Adjust for more/few particles

function resizeCanvas() {
    if (particleCanvas && heroSection) { // Ensure elements exist before accessing properties
        particleCanvas.width = heroSection.offsetWidth;
        particleCanvas.height = heroSection.offsetHeight;
        createParticles(); // Recreate particles for new size
    }
}

function createParticles() {
    particles = []; // Clear existing particles
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            radius: Math.random() * 1.5 + 0.5, // Small particles
            velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 }, // Slower movement
            opacity: Math.random()
        });
    }
}

let particleColor; // Declare particleColor globally

function updateParticleColors() {
    const rootStyle = getComputedStyle(document.documentElement);
    // Get the particle color from CSS variable
    particleColor = rootStyle.getPropertyValue('--particle-color').trim();
}

function animateParticles() {
    if (!ctx) return; // Exit if context is not available

    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    // Set particle color dynamically based on theme
    ctx.fillStyle = particleColor;

    particles.forEach(p => {
        p.x += p.velocity.x;
        p.y += p.velocity.y;

        // Wrap particles around
        if (p.x < 0 || p.x > particleCanvas.width) p.velocity.x *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.velocity.y *= -1;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}


// Function to dynamically load certifications into the grid
function loadCertifications() {
    const certificationsGrid = document.getElementById('certifications-grid');
    // Ensure certifications array is available (from certificationsData.js)
    if (!certificationsGrid || typeof certifications === 'undefined' || !Array.isArray(certifications)) {
        console.error('Certifications grid element not found or certifications data is missing/invalid.');
        return;
    }

    certificationsGrid.innerHTML = ''; // Clear any existing content before loading

    certifications.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'card'; // Use general card class

        // Icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-award text-accent text-3xl mb-3';
        card.appendChild(icon);

        // Name
        const name = document.createElement('p');
        name.className = 'text-main font-semibold';
        name.textContent = cert.name;
        card.appendChild(name);

        // Issued Date (optional)
        if (cert.issued && cert.issued !== "N/A") {
            const issued = document.createElement('p');
            issued.className = 'text-secondary text-xs';
            issued.textContent = `Issued: ${cert.issued}`;
            card.appendChild(issued);
        }

        // Skills (expandable description)
        const skillsDescription = document.createElement('p');
        skillsDescription.className = 'card-description text-secondary text-xs mt-1';
        if (cert.skills && cert.skills.length > 0) {
            skillsDescription.textContent = `Skills: ${cert.skills.join(', ')}`;
        } else {
            skillsDescription.textContent = 'Skills: Not specified'; // Fallback if no skills
        }
        card.appendChild(skillsDescription);

        // Credential Link (optional)
        if (cert.credentialLink && cert.credentialLink !== "#") {
            const credentialLink = document.createElement('a');
            credentialLink.href = cert.credentialLink;
            credentialLink.target = "_blank";
            credentialLink.rel = "noopener noreferrer";
            credentialLink.className = "text-accent text-sm mt-2 hover:underline";
            credentialLink.textContent = "Show credential";
            card.appendChild(credentialLink);
        }

        certificationsGrid.appendChild(card);
    });
}


// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Initialize Hero section particles only if the canvas element exists
    if (heroSection && particleCanvas) {
        resizeCanvas();
        createParticles();
        updateParticleColors(); // Set initial color
        animateParticles();
        window.addEventListener('resize', resizeCanvas); // Adjust canvas size on window resize
    }

    // Load certifications dynamically into the grid
    loadCertifications();
});
