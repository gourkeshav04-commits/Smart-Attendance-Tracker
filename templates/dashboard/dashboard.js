let attendanceData = null;
let charts = {};

// Simple icon helper returning inline SVGs (uses currentColor)
function getIconSVG(name, size = 16) {
    const s = size;
    const common = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"`;
    switch (name) {
        case 'sun': return `<svg ${common}><path d="M12 3v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.2 4.2l1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4 18.4l1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>`;
        case 'moon': return `<svg ${common}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
        case 'check-circle': return `<svg ${common}><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
        case 'x-circle': return `<svg ${common}><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
        case 'alert-triangle': return `<svg ${common}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 9v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>`;
        case 'search': return `<svg ${common}><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
        case 'trash': return `<svg ${common}><path d="M3 6h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'refresh': return `<svg ${common}><path d="M20 11a8 8 0 10-2.9 6.1L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M21 3v6h-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
        case 'target': return `<svg ${common}><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`;
        case 'pencil': return `<svg ${common}><path d="M3 21l3-1 11-11 1-3-3 1-11 11-1 3z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
        case 'chart-bar': return `<svg ${common}><path d="M3 3v18h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 17V9M18 21V5M6 21v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'book': return `<svg ${common}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 4v15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 4v15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'file': return `<svg ${common}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'clipboard': return `<svg ${common}><path d="M9 2h6v4H9z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`;
        case 'mail': return `<svg ${common}><path d="M3 8l9 6 9-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`;
        case 'rocket': return `<svg ${common}><path d="M9 21l-2-2 5-5 2 2-5 5z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 7l4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'user': return `<svg ${common}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`;
        case 'lock': return `<svg ${common}><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'wrench': return `<svg ${common}><path d="M14.7 10.3a6 6 0 10-8.4 8.4L2 21l2.3-4.3a6 6 0 008.4-6.4z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'phone': return `<svg ${common}><rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M11 18h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'lightbulb': return `<svg ${common}><path d="M9 18a3 3 0 006 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 3a6 6 0 00-4 10.6V15a2 2 0 002 2h4a2 2 0 002-2v-1.4A6 6 0 0012 3z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        case 'arrow-right': return `<svg ${common}><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
        default: return '';
    }
}

// Replace any elements with data-icon attribute to inline SVGs
function initInlineIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
        const name = el.getAttribute('data-icon');
        const size = parseInt(el.getAttribute('data-icon-size')) || 16;
        const svg = getIconSVG(name, size);
        if (svg) el.innerHTML = svg;
    });
}

// Theme management
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.innerHTML = theme === 'dark' ? getIconSVG('sun',16) : getIconSVG('moon',16);
    document.getElementById('theme-text').textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light');
    setTheme(isLight ? 'dark' : 'light');
}

setTheme(localStorage.getItem('theme') || 'dark');

// NEW CHANGES FOR HELP 
// ── Page switcher ──
function showPage(page) {
  const dashboardHero = document.getElementById('dashboard-hero');
  const helpHero      = document.getElementById('help-hero');
  const dashboard     = document.getElementById('dashboard');
  const navLinks      = document.querySelectorAll('.nav-link');

  // Update active nav link
  navLinks.forEach(link => link.classList.remove('active'));
  event.target.classList.add('active');

    if (page === 'dashboard') {
        dashboardHero.style.display = 'block';
        helpHero.style.display      = 'none';
    }
   else if (page === 'help') {
    dashboardHero.style.display = 'none';
    helpHero.style.display      = 'block';
    dashboard.classList.remove('active');
  }
}

// ── FAQ toggle ──
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── Jump to section ──
function jumpTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const first = el.querySelector('.faq-item');
  if (first && !first.classList.contains('open')) first.classList.add('open');
}

// ── Help Search ──
function initHelpSearch() {
  const searchInput  = document.getElementById('search-input');
  const searchClear  = document.getElementById('search-clear');
  const noResults    = document.getElementById('no-results');
  const noResultsQ   = document.getElementById('no-results-query');
  const faqContainer = document.getElementById('faq-container');
  const quickLinks   = document.getElementById('quick-links');

  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    searchClear.classList.toggle('visible', query.length > 0);

    if (query === '') { resetSearch(); return; }

    let anyVisible = false;
    document.querySelectorAll('.faq-item').forEach(item => {
      const q    = item.querySelector('.faq-q span')?.textContent.toLowerCase() || '';
      const a    = item.querySelector('.faq-a')?.textContent.toLowerCase() || '';
      const tags = (item.dataset.tags || '').toLowerCase();
      const match = q.includes(query) || a.includes(query) || tags.includes(query);
      item.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });

    document.querySelectorAll('.faq-section').forEach(section => {
      const hasVisible = [...section.querySelectorAll('.faq-item')].some(i => !i.classList.contains('hidden'));
      section.style.display = hasVisible ? 'block' : 'none';
    });

    document.querySelectorAll('.faq-item:not(.hidden)').forEach(item => item.classList.add('open'));

    if (!anyVisible) {
      noResultsQ.textContent = query;
      noResults.classList.add('visible');
      faqContainer.style.display = 'none';
      quickLinks.style.display   = 'none';
    } else {
      noResults.classList.remove('visible');
      faqContainer.style.display = 'flex';
      quickLinks.style.display   = 'grid';
    }
  });
}

function clearSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  searchInput.value = '';
  searchInput.dispatchEvent(new Event('input'));
  searchInput.focus();
}

function resetSearch() {
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('hidden', 'open'));
  document.querySelectorAll('.faq-section').forEach(s => s.style.display = 'block');
  const noResults    = document.getElementById('no-results');
  const faqContainer = document.getElementById('faq-container');
  const quickLinks   = document.getElementById('quick-links');
  const searchClear  = document.getElementById('search-clear');
  if (noResults)    noResults.classList.remove('visible');
  if (faqContainer) faqContainer.style.display = 'flex';
  if (quickLinks)   quickLinks.style.display   = 'grid';
  if (searchClear)  searchClear.classList.remove('visible');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    const inner = document.createElement('div');
    inner.className = 'notification-inner';

    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    if (type === 'success') icon.innerHTML = getIconSVG('check-circle',18);
    else if (type === 'error') icon.innerHTML = getIconSVG('x-circle',18);
    else icon.innerHTML = getIconSVG('alert-triangle',18);

    const text = document.createElement('div');
    text.className = 'notification-text';
    text.innerHTML = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = '&times;';

    inner.appendChild(icon);
    inner.appendChild(text);
    inner.appendChild(closeBtn);
    notification.appendChild(inner);
    document.body.appendChild(notification);

    // Show with small delay for transition
    requestAnimationFrame(() => setTimeout(() => notification.classList.add('show'), 50));

    // Auto-dismiss
    const dismissAfter = 3500;
    const timeoutId = setTimeout(() => close(), dismissAfter);

    function close() {
        clearTimeout(timeoutId);
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 260);
    }

    // Dismiss on click of close button or on notification click
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });
    notification.addEventListener('click', () => close());
}

// Confirmation modal helper
function showConfirm(message, onConfirm, title = 'Confirm Action') {
    const modal = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmMessage');
    const titleEl = document.getElementById('confirmTitle');
    const okBtn = document.getElementById('confirmOk');
    const cancelBtn = document.getElementById('confirmCancel');
    if (!modal || !msgEl || !okBtn || !cancelBtn) {
        // Fallback to native confirm
        if (window.confirm(message)) onConfirm();
        return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.setAttribute('aria-hidden', 'false');

    function cleanup() {
        modal.setAttribute('aria-hidden', 'true');
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
    }

    function onOk(e) { e.preventDefault(); cleanup(); onConfirm(); }
    function onCancel(e) { e.preventDefault(); cleanup(); }
    function onKey(e) { if (e.key === 'Escape') { cleanup(); } }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKey);

    // Focus the cancel button for safe default
    cancelBtn.focus();
}
// Initialize fetch handler: supports either a form submit (`#loginForm`) or
// a standalone button (`#fetchBtn`). Posts credentials to `/fetch_attendance`.
function initFetchHandler() {
    const loginForm = document.getElementById('loginForm');
    const fetchBtn = document.getElementById('fetchBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('loadingSpinner');

    async function doFetch(username, password) {
        if (!fetchBtn) return;

        // Basic validation
        if (!username || !password) {
            showError('Username and password are required');
            return;
        }

        // Show loading state
        fetchBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'inline-block';

        try {
            const response = await fetch('/fetch_attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.status === 'success') {
                attendanceData = data;
                displayDashboard(data);
                showNotification('Attendance data fetched successfully!');
                const refreshBtn = document.getElementById('refreshBtn');
                if (refreshBtn) refreshBtn.classList.add('show');
            } else {
                showError(data.message || 'Failed to fetch attendance data');
            }
        } catch (err) {
            showError('Network error: ' + (err.message || err));
        } finally {
            // Reset loading state
            fetchBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (spinner) spinner.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username')?.value || '';
            const password = document.getElementById('password')?.value || '';
            doFetch(username, password);
        });
    } else if (fetchBtn) {
        fetchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const username = document.getElementById('username')?.value || '';
            const password = document.getElementById('password')?.value || '';
            doFetch(username, password);
        });
    }
}

initFetchHandler();

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<div class="error-message">${message}</div>`;
    setTimeout(() => errorDiv.innerHTML = '', 5000);
    showNotification(message, 'error');
}

function displayDashboard(data) {
    // Show dashboard
    document.getElementById('dashboard').classList.add('active');
    
    // Update overall stats
    const overall = data.overall;
    document.getElementById('overallPercentage').textContent = overall.percentage + '%';
    document.getElementById('totalClasses').textContent = overall.total;
    document.getElementById('attendedClasses').textContent = overall.attended;
    document.getElementById('subjectCount').textContent = data.subjects.length;
    
    // Update progress ring
    updateProgressRing('overallProgress', parseFloat(overall.percentage));
    
    // Display subjects
    displaySubjects(data.subjects);
    
    // Force chart refresh with new data (ensures charts always update)
    setTimeout(() => {
        forceChartRefresh(data);
    }, 300);
}

function updateProgressRing(id, percentage) {
    const circle = document.getElementById(id);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${progress} ${circumference}`;
    
    // Color based on percentage
    if (percentage >= 75) {
        circle.style.stroke = '#10b981';
    } else if (percentage >= 60) {
        circle.style.stroke = '#f59e0b';
    } else {
        circle.style.stroke = '#ef4444';
    }
}

function displaySubjects(subjects) {
    const gridContainer = document.getElementById('subjectsGrid');
    const listContainer = document.getElementById('subjectsList');
    
    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';
    
    subjects.forEach(subject => {
        const percentage = parseFloat(subject.percentage);
        const badgeClass = percentage >= 75 ? 'badge-success' : 
                          percentage >= 60 ? 'badge-warning' : 'badge-danger';
        
        // Grid view card
        const gridCard = document.createElement('div');
        gridCard.className = 'subject-card';
        gridCard.innerHTML = `
            <div class="subject-header">
                <div class="subject-name">${subject.subject}</div>
                <div class="attendance-badge ${badgeClass}">${subject.percentage}%</div>
            </div>
            <div class="subject-stats">
                <div class="stat-item">
                    <div class="stat-number">${subject.attended}</div>
                    <div class="stat-text">Attended</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${subject.total}</div>
                    <div class="stat-text">Total</div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%; background-color: ${getProgressColor(percentage)};"></div>
            </div>
            <div class="recommendations">
                ${generateRecommendations(subject)}
            </div>
        `;
        gridContainer.appendChild(gridCard);
        
        // List view item
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-primary);">${subject.subject}</div>
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px;">
                    ${subject.attended}/${subject.total} classes attended
                </div>
                <div class="progress-bar" style="margin: 0; width: 100%; max-width: 200px;">
                    <div class="progress-fill" style="width: ${percentage}%; background-color: ${getProgressColor(percentage)};"></div>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                    ${percentage < 75 && subject.needed_75 > 0 ? `Need ${subject.needed_75} more for 75%` : ''}
                    ${subject.can_miss_75 > 0 ? `Can miss ${subject.can_miss_75} classes and maintain 75%` : ''}
                </div>
            </div>
            <div class="attendance-badge ${badgeClass}">${subject.percentage}%</div>
        `;
        listContainer.appendChild(listItem);
    });
}

function getProgressColor(percentage) {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
}

function generateRecommendations(subject) {
    const recommendations = [];
    const percentage = parseFloat(subject.percentage);
    
    if (percentage < 60) {
        // Below 60%: Show classes needed for both 60% and 75%
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-warning"></div>
                <span>Need ${subject.needed_60} more classes to reach 60%</span>
            </div>
        `);
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-info"></div>
                <span>Need ${subject.needed_75} more classes to reach 75%</span>
            </div>
        `);
    } else if (percentage >= 60 && percentage < 75) {
        // Between 60-75%: Show classes can miss for 60% and classes needed for 75%
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-success"></div>
                <span>Can miss ${subject.can_miss_60} classes and maintain 60%</span>
            </div>
        `);
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-info"></div>
                <span>Need ${subject.needed_75} more classes to reach 75%</span>
            </div>
        `);
    } else {
        // Above 75%: Show classes can miss for both 60% and 75%
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-success"></div>
                <span>Can miss ${subject.can_miss_60} classes and maintain 60%</span>
            </div>
        `);
        recommendations.push(`
            <div class="recommendation">
                <div class="recommendation-icon icon-success"></div>
                <span>Can miss ${subject.can_miss_75} classes and maintain 75%</span>
            </div>
        `);
    }
    
    return recommendations.join('');
}

function createCharts(data) {
    // Only create charts if containers exist and data is valid
    const attendanceCanvas = document.getElementById('attendanceChart');
    const performanceCanvas = document.getElementById('performanceChart');
    
    if (!attendanceCanvas || !performanceCanvas || !data || !data.subjects) {
        console.log('Chart containers or data not available');
        return;
    }
    
    // Destroy existing charts to prevent memory leaks and ensure fresh data
    if (charts.attendance) {
        charts.attendance.destroy();
        charts.attendance = null;
    }
    if (charts.performance) {
        charts.performance.destroy();
        charts.performance = null;
    }
    
    // Clear canvas contexts
    const attendanceCtx = attendanceCanvas.getContext('2d');
    const performanceCtx = performanceCanvas.getContext('2d');
    attendanceCtx.clearRect(0, 0, attendanceCanvas.width, attendanceCanvas.height);
    performanceCtx.clearRect(0, 0, performanceCanvas.width, performanceCanvas.height);
    
    try {
        // Attendance Distribution Chart (Doughnut) - ALWAYS RECREATED WITH FRESH DATA
        const attendanceLabels = ['Below 60%', '60-75%', 'Above 75%'];
        const attendanceCounts = [0, 0, 0];
        
        // Process current data (not cached)
        data.subjects.forEach(subject => {
            const percentage = parseFloat(subject.percentage);
            if (percentage < 60) attendanceCounts[0]++;
            else if (percentage < 75) attendanceCounts[1]++;
            else attendanceCounts[2]++;
        });
        
        console.log('Creating attendance chart with data:', attendanceCounts);
        
        charts.attendance = new Chart(attendanceCtx, {
            type: 'doughnut',
            data: {
                labels: attendanceLabels,
                datasets: [{
                    data: attendanceCounts,
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderColor: ['#dc2626', '#d97706', '#059669'],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                layout: {
                    padding: 10
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = data.subjects.length;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} subjects (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 800
                }
            }
        });
        
        // Subject Performance Chart (Bar) - ALWAYS RECREATED WITH FRESH DATA
        // Sort subjects by percentage for better visualization (use fresh data)
        const sortedSubjects = [...data.subjects].sort((a, b) => 
            parseFloat(b.percentage) - parseFloat(a.percentage)
        );
        
        const subjectNames = sortedSubjects.map(s => 
            s.subject.length > 10 ? s.subject.substring(0, 10) + '...' : s.subject
        );
        const percentages = sortedSubjects.map(s => parseFloat(s.percentage));
        const backgroundColors = percentages.map(p => {
            if (p >= 75) return '#10b981';
            if (p >= 60) return '#f59e0b';
            return '#ef4444';
        });
        
        console.log('Creating performance chart with subjects:', subjectNames.length);
        
        charts.performance = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: subjectNames,
                datasets: [{
                    label: 'Attendance Percentage',
                    data: percentages,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 5,
                        right: 5
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 10
                            },
                            maxTicksLimit: 6
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0,
                            font: {
                                size: 9
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const index = context[0].dataIndex;
                                return sortedSubjects[index].subject;
                            },
                            label: function(context) {
                                const index = context.dataIndex;
                                const subject = sortedSubjects[index];
                                return [
                                    `Attendance: ${context.parsed.y}%`,
                                    `Attended: ${subject.attended}/${subject.total} classes`
                                ];
                            }
                        }
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        console.log('Charts created successfully with fresh data');
        
    } catch (error) {
        console.error('Error creating charts:', error);
        showNotification('Error creating charts: ' + error.message, 'error');
    }
}

function toggleView(view) {
    const buttons = document.querySelectorAll('.view-toggle button');
    const gridView = document.getElementById('subjectsGrid');
    const listView = document.getElementById('subjectsList');
    
    // Reset all button states
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Set active button
    const clickedButton = event.target;
    clickedButton.classList.add('active');
    
    // Toggle views with proper hiding/showing
    if (view === 'grid') {
        gridView.classList.remove('hidden');
        gridView.style.display = 'grid';
        listView.classList.remove('active');
        listView.classList.add('hidden');
        listView.style.display = 'none';
        console.log('Switched to Grid View');
    } else if (view === 'list') {
        gridView.classList.add('hidden');
        gridView.style.display = 'none';
        listView.classList.add('active');
        listView.classList.remove('hidden');
        listView.style.display = 'block';
        console.log('📋 Switched to List View');
    }
    
    // Save preference
    try {
        localStorage.setItem('viewPreference', view);
    } catch (error) {
        console.warn('Could not save view preference:', error);
    }
}

function simulateAttendance() {
    if (!attendanceData) {
        showNotification('Please fetch attendance data first', 'error');
        return;
    }
    
    const classesToAttend = parseInt(document.getElementById('classesToAttend').value) || 0;
    const classesToMiss = parseInt(document.getElementById('classesToMiss').value) || 0;
    const resultDiv = document.getElementById('predictionResult');
    
    // Calculate new attendance based on both attend and miss
    let newAttended = attendanceData.overall.attended + classesToAttend;
    let newTotal = attendanceData.overall.total + classesToAttend + classesToMiss;
    
    const currentPercentage = parseFloat(attendanceData.overall.percentage);
    const newPercentage = newTotal > 0 ? ((newAttended / newTotal) * 100) : 0;
    const change = (newPercentage - currentPercentage);
    
    // Determine result styling
    const changeClass = change > 0 ? 'success' : change < 0 ? 'danger' : 'warning';
    const changeIconSVG = change > 0 ? getIconSVG('chart-bar',18) : change < 0 ? getIconSVG('chart-bar',18) : getIconSVG('arrow-right',18);
    const changeText = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'no change';
    
    // Generate recommendation based on new percentage
    let recommendation = '';
    let recommendationClass = 'success-message';
    
    if (newPercentage < 60) {
        recommendation = `${getIconSVG('alert-triangle',16)} <strong>Critical:</strong> Below 60% - High risk zone!`;
        recommendationClass = 'error-message';
    } else if (newPercentage < 75) {
        recommendation = `<strong>Warning:</strong> Below 75% - Consider attending more classes`;
        recommendationClass = 'warning-message';
    } else {
        recommendation = `${getIconSVG('check-circle',16)} <strong>Safe:</strong> Above 75% - Good attendance level!`;
        recommendationClass = 'success-message';
    }
    
    // Build result display
    let resultHTML = `
        <div class="${recommendationClass}">
            <strong>Simulation Result:</strong><br>
            After attending ${classesToAttend} and missing ${classesToMiss} classes:<br>
            <div style="margin-top: 12px; font-size: 1.2rem;">
                ${changeIconSVG} <strong>${newPercentage.toFixed(2)}%</strong> 
                <span style="color: var(--${changeClass === 'success' ? 'success' : changeClass === 'danger' ? 'danger' : 'warning'}-color);">
                    (${change > 0 ? '+' : ''}${change.toFixed(2)}% ${changeText})
                </span>
            </div>
            <div style="margin-top: 8px; font-size: 0.9rem; opacity: 0.8;">
                Total: ${newAttended}/${newTotal} classes
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2);">
                ${recommendation}
            </div>
        </div>
    `;
    
    // Add additional insights if both values are provided
    if (classesToAttend > 0 && classesToMiss > 0) {
        const attendOnlyPercentage = ((attendanceData.overall.attended + classesToAttend) / (attendanceData.overall.total + classesToAttend) * 100);
        const missOnlyPercentage = (attendanceData.overall.attended / (attendanceData.overall.total + classesToMiss) * 100);
        
        resultHTML += `
            <div style="margin-top: 15px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-size: 0.9rem;">
                <strong>${getIconSVG('lightbulb',14)} Additional Insights:</strong><br>
                • If only attending ${classesToAttend}: ${attendOnlyPercentage.toFixed(2)}%<br>
                • If only missing ${classesToMiss}: ${missOnlyPercentage.toFixed(2)}%<br>
                • Combined impact: ${newPercentage.toFixed(2)}%
            </div>
        `;
    }
    
    resultDiv.innerHTML = resultHTML;
    
    // Show notification
    showNotification(`Simulation complete: ${newPercentage.toFixed(1)}% attendance projected`);
}

// Stepper button handling: increment/decrement inputs used in predictor
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.stepper-btn');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const stepper = btn.closest('.stepper');
    if (!stepper) return;
    const targetId = stepper.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;
    const min = parseInt(input.getAttribute('min') || '0', 10);
    const max = parseInt(input.getAttribute('max') || '9999', 10);
    let val = parseInt(input.value || '0', 10);
    if (action === 'inc') val = Math.min(max, val + 1);
    else if (action === 'dec') val = Math.max(min, val - 1);
    input.value = val;
});

function exportToPDF() {
    if (!attendanceData) {
        showNotification('No data available to export', 'error');
        return;
    }
    
    try {
        // Check if jsPDF is loaded with multiple possible references
        let jsPDF;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDF = window.jspdf.jsPDF;
        } else if (window.jsPDF) {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF library not found');
        }
        
        const doc = new jsPDF();
        
        // Set font
        doc.setFont('helvetica');
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('Attendance Report', 20, 30);
        
        // Date
        doc.setFontSize(12);
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(`Generated on: ${currentDate}`, 20, 45);
        
        // Line separator
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 50, 190, 50);
        
        // Overall statistics
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Overall Statistics', 20, 65);
        
        doc.setFontSize(12);
        doc.text(`Total Classes: ${attendanceData.overall.total}`, 30, 80);
        doc.text(`Classes Attended: ${attendanceData.overall.attended}`, 30, 90);
        doc.text(`Attendance Percentage: ${attendanceData.overall.percentage}%`, 30, 100);
        
        if (attendanceData.overall.needed_75 > 0) {
            doc.text(`Classes needed for 75%: ${attendanceData.overall.needed_75}`, 30, 110);
        }
        
        if (attendanceData.overall.can_miss_75 > 0) {
            doc.text(`Classes can miss (maintain 75%): ${attendanceData.overall.can_miss_75}`, 30, 120);
        }
        
        // Subject breakdown
        doc.setFontSize(16);
        doc.text('Subject-wise Breakdown', 20, 140);
        
        let yPosition = 155;
        const pageHeight = doc.internal.pageSize.height;
        
        attendanceData.subjects.forEach((subject, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
                doc.setFontSize(16);
                doc.text('Subject-wise Breakdown (continued)', 20, yPosition);
                yPosition += 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            // Subject name (truncate if too long)
            const subjectName = subject.subject.length > 30 ? 
                subject.subject.substring(0, 30) + '...' : subject.subject;
            
            doc.text(`${index + 1}. ${subjectName}`, 30, yPosition);
            doc.text(`${subject.attended}/${subject.total} classes`, 120, yPosition);
            doc.text(`(${subject.percentage}%)`, 160, yPosition);
            
            yPosition += 8;
            
            // Add recommendations if any
            const percentage = parseFloat(subject.percentage);
            if (percentage < 75 && subject.needed_75 > 0) {
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text(`   → Need ${subject.needed_75} more classes for 75%`, 30, yPosition);
                yPosition += 6;
            }
            
            if (subject.can_miss_75 > 0) {
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text(`   → Can miss ${subject.can_miss_75} classes (maintain 75%)`, 30, yPosition);
                yPosition += 6;
            }
            
            yPosition += 5; // Extra spacing between subjects
        });
        
        // Footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${totalPages} - Generated by Attendance Analyzer`, 
                20, pageHeight - 10);
        }
        
        // Save the PDF
        const fileName = `attendance_report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        showNotification('PDF exported successfully!');
        
    } catch (error) {
        console.error('PDF Export Error:', error);
        
        // Fallback: Generate a simple text report
        generateTextReport();
        showNotification('PDF library unavailable. Text report generated instead.', 'warning');
    }
}

// Fallback text report generator
function generateTextReport() {
    if (!attendanceData) return;
    
    let report = 'ATTENDANCE REPORT\n';
    report += '=================\n\n';
    report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    report += 'OVERALL STATISTICS:\n';
    report += `Total Classes: ${attendanceData.overall.total}\n`;
    report += `Classes Attended: ${attendanceData.overall.attended}\n`;
    report += `Attendance Percentage: ${attendanceData.overall.percentage}%\n\n`;
    
    report += 'SUBJECT-WISE BREAKDOWN:\n';
    report += '========================\n\n';
    
    attendanceData.subjects.forEach((subject, index) => {
        report += `${index + 1}. ${subject.subject}\n`;
        report += `   Attended: ${subject.attended}/${subject.total} classes (${subject.percentage}%)\n`;
        
        if (subject.needed_75 > 0) {
            report += `   → Need ${subject.needed_75} more classes for 75%\n`;
        }
        
        if (subject.can_miss_75 > 0) {
            report += `   → Can miss ${subject.can_miss_75} classes (maintain 75%)\n`;
        }
        
        report += '\n';
    });
    
    // Create and download text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function exportToCSV() {
    if (!attendanceData) return;
    
    try {
        let csvContent = 'Subject,Total Classes,Attended Classes,Percentage,Classes Needed (75%),Classes Can Miss (75%)\n';
        
        attendanceData.subjects.forEach(subject => {
            csvContent += `"${subject.subject}",${subject.total},${subject.attended},${subject.percentage},${subject.needed_75},${subject.can_miss_75}\n`;
        });
        
        // Add overall row
        const overall = attendanceData.overall;
        csvContent += `"OVERALL",${overall.total},${overall.attended},${overall.percentage},${overall.needed_75},${overall.can_miss_75}\n`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('CSV exported successfully!');
    } catch (error) {
        showNotification('Error exporting CSV: ' + error.message, 'error');
    }
}

function refreshData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        // Prevent multiple simultaneous requests
        const fetchBtn = document.getElementById('fetchBtn');
        if (fetchBtn.disabled) {
            showNotification('Request already in progress...', 'error');
            return;
        }
        
        // Trigger form submission
        const form = document.getElementById('loginForm');
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
    } else {
        showNotification('Please enter username and password first', 'error');
    }
}

function clearData() {
    showConfirm('Are you sure you want to clear all data?', () => {
        // Destroy charts first
        destroyAllCharts();

        // Clear data
        attendanceData = null;
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('refreshBtn').classList.remove('show');

        // Clear session storage
        try { sessionStorage.removeItem('attendanceData'); } catch (error) { console.warn('Could not clear session storage:', error); }

        // Disable auto-refresh
        disableAutoRefresh();

        showNotification('Data cleared successfully!');
    }, 'Clear All Data');
}

// Pull to refresh functionality for mobile
let startY = 0;
let pullDistance = 0;
let isPulling = false;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isPulling && window.scrollY === 0) {
        pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > 0 && pullDistance < 100) {
            document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
        }
    }
});

document.addEventListener('touchend', () => {
    if (isPulling && pullDistance > 60) {
        refreshData();
    }
    
    document.body.style.transform = '';
    isPulling = false;
    pullDistance = 0;
});

// Auto-refresh management (disabled by default)
let autoRefreshInterval = null;

// Clean up and destroy all charts
function destroyAllCharts() {
    try {
        Object.keys(charts).forEach(key => {
            if (charts[key] && typeof charts[key].destroy === 'function') {
                console.log(`Destroying chart: ${key}`);
                charts[key].destroy();
                charts[key] = null;
            }
        });
        charts = {};
        console.log('All charts destroyed successfully');
    } catch (error) {
        console.error('Error destroying charts:', error);
    }
}

// Force chart refresh - ensures charts always update with new data
function forceChartRefresh(data) {
    console.log('Force refreshing charts with new data');
    
    // Always destroy existing charts first
    destroyAllCharts();
    
    // Wait for cleanup, then create fresh charts
    setTimeout(() => {
        safeCreateCharts(data);
    }, 100);
}

function enableAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    
    autoRefreshInterval = setInterval(() => {
        if (attendanceData && document.getElementById('username').value && document.getElementById('password').value) {
            console.log('Auto-refreshing data...');
            refreshData();
            showNotification('Data auto-refreshed!');
        }
    }, 300000); // 5 minutes
}

function disableAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Initialize theme on load
// NEW CHANGES
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Initialize chart system
    initializeCharts();
    initHelpSearch();
    // Check if there's saved data in sessionStorage
    const savedData = sessionStorage.getItem('attendanceData');
    if (savedData) {
        try {
            attendanceData = JSON.parse(savedData);
            displayDashboard(attendanceData);
            document.getElementById('refreshBtn').classList.add('show');
            showNotification('Previous data loaded!');
        } catch (error) {
            console.error('Error loading saved data:', error);
            sessionStorage.removeItem('attendanceData');
        }
    }
});

// Save data to session storage when fetched
function saveToSession(data) {
    try {
        sessionStorage.setItem('attendanceData', JSON.stringify(data));
    } catch (error) {
        console.warn('Could not save to session storage:', error);
    }
}

// Update the original display function to handle auto-refresh properly
const originalDisplayDashboard = displayDashboard;
displayDashboard = function(data) {
    originalDisplayDashboard(data);
    saveToSession(data);
    
    // Enable auto-refresh only after successful data fetch
    if (!autoRefreshInterval) {
        // Ask user if they want auto-refresh (optional)
        // enableAutoRefresh();
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'r':
                e.preventDefault();
                refreshData();
                break;
            case 'e':
                e.preventDefault();
                if (attendanceData) exportToPDF();
                break;
            case 'd':
                e.preventDefault();
                toggleTheme();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// Add tooltips for better UX
function addTooltips() {
    const tooltipElements = [
        { selector: '.progress-ring', text: 'Overall attendance percentage' },
        { selector: '.attendance-badge', text: 'Current attendance percentage' },
        { selector: '.stat-card', text: 'Click for detailed breakdown' }
    ];

    tooltipElements.forEach(({ selector, text }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.title = text;
        });
    });
}

// Improved chart initialization and management
function initializeCharts() {
    // Clear any existing charts
    charts = {};
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return false;
    }
    
    // Set Chart.js defaults
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-secondary').trim();
    
    return true;
}

// Safe chart creation with error handling
function safeCreateCharts(data) {
    if (!data || !data.subjects || data.subjects.length === 0) {
        console.log('No valid data for charts');
        return;
    }
    
    // Initialize charts if not done already
    if (!initializeCharts()) {
        setTimeout(() => safeCreateCharts(data), 1000); // Retry after 1 second
        return;
    }
    
    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
        try {
            createCharts(data);
        } catch (error) {
            console.error('Chart creation failed:', error);
            showNotification('Charts could not be created. Data is still available.', 'error');
        }
    });
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize all features
window.addEventListener('load', () => {
    // Ensure all libraries are loaded
    const checkLibraries = () => {
        const chartLoaded = typeof Chart !== 'undefined';
        let jsPDFLoaded = false;
        
        // Check for jsPDF in multiple locations
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDFLoaded = true;
        } else if (window.jsPDF) {
            jsPDFLoaded = true;
        }
        
        // Proper console logging
        console.log('📚 Library Status Check:');
        console.log('Chart.js:', chartLoaded ? 'Loaded' : 'Missing');
        console.log('jsPDF:', jsPDFLoaded ? 'Loaded' : 'Missing');
        
        if (!chartLoaded) {
            console.warn('Chart.js not loaded - charts will not work');
            showNotification('Chart library not loaded - charts may not work', 'error');
        }
        
        if (!jsPDFLoaded) {
            console.log('ℹ️ jsPDF not available - will use text export fallback');
        } else {
            console.log('All libraries loaded successfully');
        }
    };
    
    // Check libraries after a delay to ensure loading
    setTimeout(checkLibraries, 2000);
    
    // Add event listeners
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', () => {
            setTimeout(addTooltips, 2000);
        });
    }
});

// Page visibility API to handle tab switching
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any ongoing operations
        disableAutoRefresh();
    } else {
        // Page is visible again - resume if needed
        if (attendanceData && !autoRefreshInterval) {
            // User can manually enable auto-refresh if needed
        }
    }
});

// Before page unload - cleanup
window.addEventListener('beforeunload', () => {
    destroyAllCharts();
    disableAutoRefresh();
});

// ===== ATTENDANCE CORRECTIONS FEATURE =====
let attendanceCorrections = {};

// Load corrections from localStorage
function loadCorrections() {
    try {
        const saved = localStorage.getItem('attendanceCorrections');
        if (saved) {
            attendanceCorrections = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading corrections:', error);
        attendanceCorrections = {};
    }
}

// Save corrections to localStorage
function saveCorrections() {
    try {
        localStorage.setItem('attendanceCorrections', JSON.stringify(attendanceCorrections));
    } catch (error) {
        console.error('Error saving corrections:', error);
    }
}

// Populate subject dropdown
function populateCorrectionsDropdown() {
    if (!attendanceData || !attendanceData.subjects) return;
    const select = document.getElementById('correctionSubject');
    select.innerHTML = '<option value="">Choose a subject...</option>';

    attendanceData.subjects.forEach((subject, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${subject.subject} (${subject.attended}/${subject.total})`;
        select.appendChild(option);
    });

    // Build or refresh custom dropdown UI
    buildCustomSubjectDropdown();
}

function buildCustomSubjectDropdown() {
    const select = document.getElementById('correctionSubject');
    const wrapper = document.getElementById('customCorrectionSelect');
    const panel = document.getElementById('customCorrectionList');
    const label = wrapper.querySelector('.custom-select__label');
    panel.innerHTML = '';

    // Add option rows
    Array.from(select.options).forEach((opt, idx) => {
        if (opt.value === '') return; // skip placeholder
        const subj = attendanceData.subjects[opt.value];
        const row = document.createElement('div');
        row.className = 'custom-option';
        row.setAttribute('role', 'option');
        row.setAttribute('data-value', opt.value);
        row.tabIndex = 0;

        const left = document.createElement('div');
        left.innerHTML = `<div class="option-title">${escapeHtml(subj.subject)}</div><div class="option-meta">${subj.attended} / ${subj.total}</div>`;

        const badge = document.createElement('div');
        badge.className = 'subject-badge';
        badge.textContent = `${subj.attended} / ${subj.total}`;

        row.appendChild(left);
        row.appendChild(badge);
        panel.appendChild(row);

        // click handler
        row.addEventListener('click', () => {
            select.value = opt.value;
            label.textContent = `${subj.subject}   [${subj.attended} / ${subj.total}]`;
            // update aria-selected
            panel.querySelectorAll('.custom-option').forEach(r => r.removeAttribute('aria-selected'));
            row.setAttribute('aria-selected', 'true');
            wrapper.setAttribute('aria-expanded', 'false');
        });

        // keyboard selection
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
            if (e.key === 'ArrowDown') { e.preventDefault(); focusNextOption(row); }
            if (e.key === 'ArrowUp') { e.preventDefault(); focusPrevOption(row); }
        });
    });

    // Toggle behavior
    const toggle = document.getElementById('customCorrectionToggle');
    wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); focusFirstOption(); }
        if (e.key === 'Escape') { closePanel(); }
    });
    toggle.addEventListener('click', (e) => { e.preventDefault(); const open = wrapper.getAttribute('aria-expanded') === 'true'; if (open) closePanel(); else openPanel(); });

    function openPanel() { wrapper.setAttribute('aria-expanded', 'true'); wrapper.classList.add('open'); panel.focus(); }
    function closePanel(){ wrapper.setAttribute('aria-expanded', 'false'); wrapper.classList.remove('open'); }
    function focusFirstOption(){ const r = panel.querySelector('.custom-option'); if (r) r.focus(); }
    function focusNextOption(current){ const items = Array.from(panel.querySelectorAll('.custom-option')); const i = items.indexOf(current); if (i < items.length -1) items[i+1].focus(); }
    function focusPrevOption(current){ const items = Array.from(panel.querySelectorAll('.custom-option')); const i = items.indexOf(current); if (i > 0) items[i-1].focus(); }
}

// Close custom select panels when clicking outside
document.addEventListener('click', (e) => {
    const openSelect = document.querySelector('.custom-select[aria-expanded="true"]');
    if (!openSelect) return;
    if (openSelect.contains(e.target)) return;
    openSelect.setAttribute('aria-expanded', 'false');
});

function escapeHtml(unsafe) { return unsafe.replace(/[&<"'`=\/]/g, function (s) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;','/':'\/','=':'&#61;','`':'&#96;'}[s]; }); }

// Apply correction
function applyCorrection() {
    const subjectIndex = document.getElementById('correctionSubject').value;
    const count = parseInt(document.getElementById('correctionsCount').value) || 0;
    
    if (!attendanceData || !subjectIndex || count <= 0) {
        showNotification('Please select a subject and enter valid correction count', 'error');
        return;
    }
    
    const subject = attendanceData.subjects[subjectIndex];
    
    // Validate: can't correct more than absent classes
    const maxCorrections = subject.total - subject.attended;
    if (count > maxCorrections) {
        showNotification(`Cannot correct ${count} classes. Maximum absent: ${maxCorrections}`, 'error');
        return;
    }
    
    // Store or update correction
    if (!attendanceCorrections[subject.subject]) {
        attendanceCorrections[subject.subject] = 0;
    }
    
    const newTotal = attendanceCorrections[subject.subject] + count;
    if (newTotal > maxCorrections) {
        showNotification(`Total corrections (${newTotal}) exceed absent classes (${maxCorrections})`, 'error');
        return;
    }
    
    attendanceCorrections[subject.subject] = newTotal;
    saveCorrections();
    
    // Update display
    displayCorrections();
    calculateAdjustedStats();
    
    showNotification(`Corrected ${count} class(es) for ${subject.subject}`, 'success');
    
    // Reset inputs
    document.getElementById('correctionSubject').value = '';
    document.getElementById('correctionsCount').value = '1';
}

// Display active corrections
function displayCorrections() {
    const summaryDiv = document.getElementById('correctionsSummary');
    
    if (Object.keys(attendanceCorrections).length === 0) {
        summaryDiv.classList.remove('active');
        summaryDiv.innerHTML = '';
        return;
    }
    
    summaryDiv.classList.add('active');
    
    let html = `<h4 style="margin-bottom: 1rem; color: var(--text-primary);">${getIconSVG('clipboard',16)} Active Corrections:</h4>`;
    
    for (const [subject, count] of Object.entries(attendanceCorrections)) {
        if (count > 0) {
            html += `
                <div class="correction-item">
                    <div style="flex: 1;">
                        <strong>${subject}</strong>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                            ${count} absent class${count > 1 ? 'es' : ''} marked as present
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="correction-badge">+${count}</span>
                        <button class="remove-correction" onclick="removeCorrection('${subject}')">${getIconSVG('x-circle',12)}</button>
                    </div>
                </div>
            `;
        }
    }
    
    summaryDiv.innerHTML = html;
}

// Remove specific correction
function removeCorrection(subjectName) {
    showConfirm(`Remove all corrections for ${subjectName}?`, () => {
        delete attendanceCorrections[subjectName];
        saveCorrections();
        displayCorrections();
        calculateAdjustedStats();
        showNotification(`Corrections removed for ${subjectName}`, 'success');
    }, 'Remove Correction');
}

// Clear all corrections
function clearCorrections() {
    if (Object.keys(attendanceCorrections).length === 0) {
        showNotification('No corrections to clear', 'error');
        return;
    }

    showConfirm('Clear all attendance corrections?', () => {
        attendanceCorrections = {};
        saveCorrections();
        displayCorrections();
        document.getElementById('adjustedStats').classList.remove('active');
        document.getElementById('adjustedStats').innerHTML = '';
        showNotification('All corrections cleared', 'success');
    }, 'Clear Corrections');
}

// Calculate adjusted statistics
function calculateAdjustedStats() {
    if (!attendanceData || Object.keys(attendanceCorrections).length === 0) {
        document.getElementById('adjustedStats').classList.remove('active');
        return;
    }
    
    const adjustedDiv = document.getElementById('adjustedStats');
    adjustedDiv.classList.add('active');
    
    // Calculate original and adjusted overall stats
    let originalAttended = attendanceData.overall.attended;
    let originalTotal = attendanceData.overall.total;
    let adjustedAttended = originalAttended;
    let totalCorrections = 0;
    
    // Calculate adjusted values
    attendanceData.subjects.forEach(subject => {
        if (attendanceCorrections[subject.subject]) {
            adjustedAttended += attendanceCorrections[subject.subject];
            totalCorrections += attendanceCorrections[subject.subject];
        }
    });
    
    const originalPercentage = parseFloat(attendanceData.overall.percentage);
    const adjustedPercentage = (adjustedAttended / originalTotal) * 100;
    const improvement = adjustedPercentage - originalPercentage;
    
    // Generate insights
    let insights = [];
    
    if (adjustedPercentage >= 75 && originalPercentage < 75) {
        insights.push({
            icon: getIconSVG('check-circle',14),
            text: `Great news! With corrections, you've reached the 75% threshold (Safe Zone).`
        });
    } else if (adjustedPercentage >= 60 && originalPercentage < 60) {
        insights.push({
            icon: getIconSVG('check-circle',14),
            text: `You've moved into the Warning Zone (60%+). ${(75 - adjustedPercentage).toFixed(1)}% more needed for Safe Zone.`
        });
    } else if (adjustedPercentage < 60) {
        insights.push({
            icon: getIconSVG('alert-triangle',14),
            text: `Still in Critical Zone. Need ${Math.ceil((0.6 * originalTotal - adjustedAttended) / 0.4)} more classes for 60%.`
        });
    } else if (adjustedPercentage >= 75) {
        insights.push({
            icon: getIconSVG('chart-bar',14),
            text: `Excellent! You're in the Safe Zone with ${(adjustedPercentage - 75).toFixed(1)}% buffer above 75%.`
        });
    }
    
    insights.push({
        icon: getIconSVG('chart-bar',14),
        text: `Corrected ${totalCorrections} mismarked class${totalCorrections > 1 ? 'es' : ''} across ${Object.keys(attendanceCorrections).length} subject${Object.keys(attendanceCorrections).length > 1 ? 's' : ''}.`
    });
    
    if (improvement > 0) {
        insights.push({
            icon: getIconSVG('chart-bar',14),
            text: `Overall attendance improved by ${improvement.toFixed(2)}% after corrections.`
        });
    }
    
    // Subject-wise corrections insights
    let subjectInsights = [];
    attendanceData.subjects.forEach(subject => {
        if (attendanceCorrections[subject.subject]) {
            const origPercent = parseFloat(subject.percentage);
            const corrections = attendanceCorrections[subject.subject];
            const adjAttended = subject.attended + corrections;
            const adjPercent = (adjAttended / subject.total) * 100;
            const change = adjPercent - origPercent;
            
            let status = '';
            if (adjPercent >= 75 && origPercent < 75) {
                status = 'Now above 75%!';
            } else if (adjPercent >= 60 && origPercent < 60) {
                status = 'Now above 60%';
            }
            
            subjectInsights.push({
                subject: subject.subject,
                original: origPercent,
                adjusted: adjPercent,
                change: change,
                corrections: corrections,
                status: status
            });
        }
    });
    
    // Build HTML
    let html = `
        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-primary);">
            ${getIconSVG('chart-bar',18)} Adjusted Attendance Summary
        </h4>
        
        <div class="comparison-grid">
            <div class="comparison-card">
                <h4>Original Attendance</h4>
                <div class="comparison-value">${originalPercentage.toFixed(2)}%</div>
                <div class="comparison-details">${originalAttended}/${originalTotal} classes</div>
            </div>
            
            <div class="comparison-card adjusted">
                <h4>Adjusted Attendance</h4>
                <div class="comparison-value">${adjustedPercentage.toFixed(2)}%</div>
                <div class="comparison-change">
                    <span>↑ +${improvement.toFixed(2)}%</span>
                </div>
                <div class="comparison-details">${adjustedAttended}/${originalTotal} classes (+${totalCorrections} corrected)</div>
            </div>
        </div>
        
        <div class="insights-box">
            <h4>${getIconSVG('lightbulb',16)} Key Insights</h4>
            ${insights.map(insight => `
                <div class="insight-item">
                    <span class="insight-icon">${insight.icon}</span>
                    <span class="insight-text">${insight.text}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add subject-wise comparison if there are corrections
    if (subjectInsights.length > 0) {
        html += `
            <div style="margin-top: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--text-primary);">${getIconSVG('book',16)} Subject-wise Adjustments</h4>
                <div class="comparison-grid">
        `;
        
        subjectInsights.forEach(item => {
            const statusBadge = item.status ? `<div style="color: var(--success-color); font-weight: 600; font-size: 0.85rem; margin-top: 0.5rem;">${item.status}</div>` : '';
            
            html += `
                <div class="comparison-card adjusted">
                    <h4>${item.subject}</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Original</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${item.original.toFixed(1)}%</div>
                        </div>
                        <div style="font-size: 1.5rem; color: var(--text-secondary);">→</div>
                        <div>
                            <div style="font-size: 0.85rem; color: var(--success-color);">Adjusted</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--success-color);">${item.adjusted.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div class="comparison-change" style="margin-top: 0.5rem;">
                        ↑ +${item.change.toFixed(2)}% (+${item.corrections} class${item.corrections > 1 ? 'es' : ''})
                    </div>
                    ${statusBadge}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    adjustedDiv.innerHTML = html;
}

// Update displayDashboard to initialize corrections
const originalDisplayDashboardFunc = displayDashboard;
displayDashboard = function(data) {
    originalDisplayDashboardFunc(data);
    loadCorrections();
    populateCorrectionsDropdown();
    displayCorrections();
    if (Object.keys(attendanceCorrections).length > 0) {
        calculateAdjustedStats();
    }
};

// Initialize corrections on page load
document.addEventListener('DOMContentLoaded', () => {
    initInlineIcons();
    loadCorrections();
});


function createParticleSystem() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
        
        const size = 3 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
            }
        }, 35000);
    }
    
    for (let i = 0; i < 60; i++) {
        setTimeout(() => createParticle(), i * 50);
    }
    
    setInterval(createParticle, 400);
}

// Start particle system on load
window.addEventListener('load', () => {
    createParticleSystem();
});
