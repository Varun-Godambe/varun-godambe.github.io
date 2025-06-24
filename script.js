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
    // Update blinking dot colors immediately when theme changes
    updateBlinkingDotColors();
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Global Blinking Dots Background Animation
const blinkingDotsContainer = document.getElementById('blinking-dots-container');
const numberOfDots = 100; // Total number of blinking dots

function createBlinkingDots() {
    if (!blinkingDotsContainer) return; // Exit if container not found

    blinkingDotsContainer.innerHTML = ''; // Clear existing dots
    const fragment = document.createDocumentFragment(); // Use fragment for performance

    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('span');
        dot.className = 'blinking-dot';
        
        // Random size (2px to 5px)
        const size = Math.random() * 3 + 2;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;

        // Random position
        dot.style.left = `${Math.random() * 100}vw`;
        dot.style.top = `${Math.random() * 100}vh`;

        // Random animation delay and duration for a scattered blinking effect
        dot.style.animationDelay = `${Math.random() * 5}s`; // 0 to 5s delay
        dot.style.animationDuration = `${Math.random() * 4 + 2}s`; // 2 to 6s duration

        fragment.appendChild(dot);
    }
    blinkingDotsContainer.appendChild(fragment);
    updateBlinkingDotColors(); // Apply initial colors
}

function updateBlinkingDotColors() {
    const rootStyle = getComputedStyle(document.documentElement);
    const dotColor = rootStyle.getPropertyValue('--dot-color').trim();
    const dotGlowColor = rootStyle.getPropertyValue('--dot-glow-color').trim();

    // Apply colors to existing dots
    Array.from(blinkingDotsContainer.children).forEach(dot => {
        dot.style.backgroundColor = dotColor;
        dot.style.boxShadow = `0 0 5px ${dotGlowColor}`;
    });
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

    // Create and animate blinking dots for background
    createBlinkingDots();
    // Recreate dots on resize to fill new dimensions if needed
    window.addEventListener('resize', createBlinkingDots); 


    // Load certifications dynamically into the grid
    loadCertifications();
});
