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
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

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
        card.className = 'card flex flex-col items-center justify-center text-center';

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

    // Load certifications dynamically into the grid
    loadCertifications();
});
