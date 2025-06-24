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
    // Update canvas particle colors immediately when theme changes
    updateCanvasColors();
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// --- Global Animated Background (Canvas - Particle Network) ---
const animatedBackgroundCanvas = document.getElementById('animated-background-canvas');
const ctx = animatedBackgroundCanvas ? animatedBackgroundCanvas.getContext('2d') : null;

let nodes = [];
const numNodes = 80; // More nodes for a richer network
const maxLineDistance = 180; // Max distance for lines to connect
const nodeSpeed = 0.3; // Slower, smoother node movement

// Colors for the canvas animation, will be read dynamically from CSS variables
let nodeColor = '';
let lineColor = '';

function updateCanvasColors() {
    if (!animatedBackgroundCanvas || !ctx) return;
    const rootStyle = getComputedStyle(document.documentElement);
    nodeColor = rootStyle.getPropertyValue('--node-color').trim(); // Base color for nodes
    lineColor = rootStyle.getPropertyValue('--line-color').trim(); // Color for lines
}

function initCanvas() {
    if (!animatedBackgroundCanvas || !ctx) return;

    animatedBackgroundCanvas.width = window.innerWidth;
    animatedBackgroundCanvas.height = document.documentElement.scrollHeight; // Cover full scrollable height

    nodes = [];
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * animatedBackgroundCanvas.width,
            y: Math.random() * animatedBackgroundCanvas.height,
            vx: (Math.random() - 0.5) * nodeSpeed * 2, // Slightly faster initial velocity for variation
            vy: (Math.random() - 0.5) * nodeSpeed * 2,
            radius: Math.random() * 1.2 + 0.8, // Slightly larger nodes
            opacity: Math.random() * 0.6 + 0.4 // More visible particles
        });
    }
    updateCanvasColors(); // Set initial colors
    drawCanvas(); // Start the animation loop
}

function drawCanvas() {
    if (!ctx) return;

    // Clear canvas with a transparent overlay to create subtle trails
    ctx.clearRect(0, 0, animatedBackgroundCanvas.width, animatedBackgroundCanvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // This creates trails, adjust opacity or remove for different effect
    ctx.fillRect(0, 0, animatedBackgroundCanvas.width, animatedBackgroundCanvas.height);


    nodes.forEach(node => {
        // Update node position
        node.x += node.vx;
        node.y += node.vy;

        // Wrap nodes around the screen
        if (node.x < 0) node.x = animatedBackgroundCanvas.width;
        if (node.x > animatedBackgroundCanvas.width) node.x = 0;
        if (node.y < 0) node.y = animatedBackgroundCanvas.height;
        if (node.y > animatedBackgroundCanvas.height) node.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = node.opacity;
        ctx.fill();
    });

    // Draw lines between close nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const node1 = nodes[i];
            const node2 = nodes[j];
            const distance = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));

            if (distance < maxLineDistance) {
                ctx.beginPath();
                ctx.moveTo(node1.x, node1.y);
                ctx.lineTo(node2.x, node2.y);
                // Line opacity based on distance
                ctx.globalAlpha = (1 - (distance / maxLineDistance)) * 0.4; // Subtle lines
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.8; // Slightly thicker lines
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawCanvas);
}

// Update canvas size and re-initialize nodes on window resize and scroll
window.addEventListener('resize', initCanvas);
window.addEventListener('scroll', () => {
    if (animatedBackgroundCanvas) {
        animatedBackgroundCanvas.height = document.documentElement.scrollHeight;
        // No need to recreate particles here unless scroll changes viewport significantly,
        // particles already wrap. This just ensures canvas covers new scroll height.
    }
});

// --- End Global Animated Background (Canvas) ---


// Function to dynamically load certifications into the grid
function loadCertifications() {
    const certificationsGrid = document.getElementById('certifications-grid');
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

    // Initialize Global Animated Background only if the canvas element exists
    if (animatedBackgroundCanvas) {
        initCanvas(); // Set up canvas and start animation
    }

    // Load certifications dynamically into the grid
    loadCertifications();
});
