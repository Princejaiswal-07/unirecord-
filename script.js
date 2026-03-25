const academicData = [
    { code: 'CS101', name: 'Programming Fundamentals', credits: 4, grade: 'A', gpa: 9.0, semester: '1' },
    { code: 'MA101', name: 'Calculus I', credits: 3, grade: 'A-', gpa: 8.5, semester: '1' },
    { code: 'PH101', name: 'Physics I', credits: 4, grade: 'B+', gpa: 8.0, semester: '1' },
    { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A', gpa: 9.2, semester: '2' },
    { code: 'MA102', name: 'Linear Algebra', credits: 3, grade: 'A', gpa: 8.8, semester: '2' },
    { code: 'EE101', name: 'Digital Electronics', credits: 4, grade: 'B', gpa: 7.5, semester: '2' }
];

let currentFilter = 'all';

// DOM Elements
const sections = document.querySelectorAll('.section');
const academicTableBody = document.getElementById('academicTableBody');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initTheme();

    if(document.getElementById('academicTableBody')) {
        initNavigation();
        initFilters();
        populateAcademicTable();
        initCharts();
        initMobileMenu();
        updateStats();
    }
    // populate profile when on index/profile page
    populateProfile();
});

// Theme Manager
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme') || 'light';
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Academic Table Functions
function populateAcademicTable(data = academicData) {
    academicTableBody.innerHTML = '';
    
    data.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${course.code}</strong></td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td><span class="grade-badge grade-${course.grade.toLowerCase().replace('-', '')}">${course.grade}</span></td>
            <td>${course.gpa}</td>
            <td><span class="semester-badge">${course.semester}</span></td>
        `;
        academicTableBody.appendChild(row);
    });
}

function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.dataset.semester;
            filterData();
        });
    });
}

function filterData() {
    let filteredData = academicData;
    
    if (currentFilter !== 'all') {
        filteredData = academicData.filter(course => course.semester === currentFilter);
    }
    
    populateAcademicTable(filteredData);
    updateStats();
}

// Stats Update
function updateStats() {
    const filteredData = currentFilter === 'all' ? academicData : academicData.filter(course => course.semester === currentFilter);
    
    // Total courses
    document.getElementById('total-courses').textContent = filteredData.length;
    
    // CGPA calculation
    const totalGPA = filteredData.reduce((sum, course) => sum + course.gpa, 0);
    const cgpa = filteredData.length > 0 ? (totalGPA / filteredData.length).toFixed(1) : 0;
    document.getElementById('cgpa').textContent = cgpa;
    
    // Total credits
    const totalCredits = filteredData.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('credits').textContent = totalCredits;
}

// Charts
function initCharts() {
    // CGPA Trend Chart
    const cgpaCtx = document.getElementById('cgpaChart').getContext('2d');
    new Chart(cgpaCtx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
            datasets: [{
                label: 'CGPA',
                data: [8.2, 8.5, 8.7, 8.4, 8.6],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7,
                    max: 10
                }
            }
        }
    });

    // Activity Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Academic', 'Co-curricular', 'Sports', 'Projects'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Add Activity Modal (Demo)
document.querySelector('.add-activity-btn')?.addEventListener('click', () => {
    alert('🆕 Add New Activity Feature!\n\nThis would open a modal form to add new co-curricular activities.\n\nDemo: Hackathon Winner - TechFest 2024 ✅');
});

// Dynamic Stats Update on Filter Change
function updateDynamicStats() {
    const semesters = {};
    academicData.forEach(course => {
        if (!semesters[course.semester]) semesters[course.semester] = [];
        semesters[course.semester].push(course);
    });
    
    console.log('Semester-wise stats:', semesters);
}

// Search Functionality (Bonus Feature)
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Search courses...';
    searchInput.className = 'search-input';
    
    const academicSection = document.getElementById('academic');
    const existingH1 = academicSection.querySelector('h1');
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.appendChild(searchInput);
    
    existingH1.parentNode.insertBefore(searchContainer, existingH1.nextSibling);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = academicData.filter(course => 
            course.code.toLowerCase().includes(searchTerm) ||
            course.name.toLowerCase().includes(searchTerm)
        );
        populateAcademicTable(filtered);
    });
}

// Export Data (Bonus Feature)
function initExport() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📥 Export Records';
    exportBtn.className = 'export-btn';
    
    const academicContainer = document.querySelector('#academic .container');
    academicContainer.appendChild(exportBtn);
    
    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(academicData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'academic-records.json';
        link.click();
    });
}

// Initialize Bonus Features
setTimeout(() => {
    initSearch();
    initExport();
}, 100);

// Auth Logic (Signup & Login)
document.addEventListener('DOMContentLoaded', () => {
    // API base: prefer explicit localhost:5000; fall back to same-origin if served from backend
    const host = location.hostname || '127.0.0.1';
    const API_BASE = (host === '127.0.0.1' || host === 'localhost') ? `${location.protocol}//${host}:5000` : '';
    console.log('API_BASE set to', API_BASE || '(same-origin)');
    const authForm = document.querySelector('.login-form');
    
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = authForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            const fullnameField = document.getElementById('fullname');
            const usernameField = document.getElementById('username');
            
            // If it's the signup page
            if (fullnameField) {
                const fullname = fullnameField.value;
                const studentid = document.getElementById('studentid').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm_password').value;
                
                if (password !== confirmPassword) {
                    alert("Passwords don't match!");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }
                
                try {
                    const response = await fetch(`${API_BASE}/api/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullname, studentid, email, password })
                    });
                    
                    const data = await response.json();
                    if (response.ok) {
                        alert(data.message || 'Signup successful!');
                        window.location.href = 'loggin.html';
                    } else {
                        alert(data.message || 'Signup failed');
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    alert('Server error, please ensure the backend is running.');
                }
            } 
            // If it's the login page
            else if (usernameField) {
                const username = usernameField.value;
                const password = document.getElementById('password').value;
                
                try {
                    const url = `${API_BASE}/api/login`;
                    const body = JSON.stringify({ username, password });
                    console.log('Login request ->', url, body);
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body
                    });
                    
                    const data = await response.json().catch(() => null);
                    if (response.ok) {
                        console.log('Login success', data);
                        alert(data?.message || 'Login successful!');
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        window.location.href = 'index.html';
                    } else {
                        console.warn('Login failed', response.status, data);
                        alert(data?.message || 'Login failed');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Server error, please ensure the backend is running. Check browser console for details.');
                }
            }
            
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    }
});

// Performance Monitoring (Hackathon Bonus Points!)
console.log('🚀 UniRecord System Loaded Successfully!');
console.log('📊 Features:');
console.log('- Responsive Design');
console.log('- Dynamic Filtering');
console.log('- Interactive Charts');
console.log('- Mobile Responsive');
console.log('- Search & Export');
console.log('- Smooth Animations');
console.log('🎯 Ready for Hackathon Demo!');

// Populate profile section from logged-in user and dashboard data
function populateProfile() {
    const profileName = document.getElementById('profileName');
    if (!profileName) return; // not on profile page

    const profileBadge = document.getElementById('profileBadge');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileYear = document.getElementById('profileYear');
    const profileDepartment = document.getElementById('profileDepartment');
    const profileCGPA = document.getElementById('profileCGPA');
    const profileCredits = document.getElementById('profileCredits');

    const userJson = localStorage.getItem('user');
    if (!userJson) {
        // Not logged in — redirect to login
        console.warn('No user in localStorage — redirecting to login');
        window.location.href = 'loggin.html';
        return;
    }

    const user = JSON.parse(userJson);
    profileName.textContent = user.fullname || '—';
    profileBadge.textContent = `Student ID: ${user.studentid || '—'}`;
    profileEmail.textContent = user.email || '—';
    profilePhone.textContent = user.phone || '—';
    profileYear.textContent = user.year ? `Year: ${user.year}` : 'Year: —';
    profileDepartment.textContent = user.department ? user.department : 'Department: —';

    // Use values from dashboard if available
    const cgpaEl = document.getElementById('cgpa');
    const creditsEl = document.getElementById('credits');
    profileCGPA.textContent = cgpaEl ? cgpaEl.textContent : '—';
    profileCredits.textContent = creditsEl ? creditsEl.textContent : '—';
}