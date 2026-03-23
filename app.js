/**
 * FundForge — Application Logic
 * Designed By Shumani Monyai
 * ================================
 * Modular JavaScript for the FundForge crowdfunding platform.
 * Uses localStorage for data persistence and simulates a backend.
 */

'use strict';

// ===================================
// STATE
// ===================================
const App = {
  currentUser: null,
  currentFilter: 'all',
  currentSort: 'newest',
  currentProjectId: null,
  rewardTierCount: 0,
};

// ===================================
// DATA LAYER — LocalStorage helpers
// ===================================
const DB = {
  getProjects() {
    return JSON.parse(localStorage.getItem('ff_projects') || '[]');
  },
  saveProjects(projects) {
    localStorage.setItem('ff_projects', JSON.stringify(projects));
  },
  getUsers() {
    return JSON.parse(localStorage.getItem('ff_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('ff_users', JSON.stringify(users));
  },
  getCurrentUser() {
    const u = localStorage.getItem('ff_current_user');
    return u ? JSON.parse(u) : null;
  },
  setCurrentUser(user) {
    if (user) localStorage.setItem('ff_current_user', JSON.stringify(user));
    else localStorage.removeItem('ff_current_user');
  },
  getUpdates() {
    return JSON.parse(localStorage.getItem('ff_updates') || '[]');
  },
  saveUpdates(updates) {
    localStorage.setItem('ff_updates', JSON.stringify(updates));
  },
};

// ===================================
// SEED DATA
// ===================================
function seedData() {
  if (DB.getProjects().length > 0) return;

  const seed = [
    {
      id: 'p001', title: 'Solar Lantern Kit for Rural SA',
      category: 'Environment', tagline: 'Bringing clean light to off-grid communities across rural South Africa with affordable solar kits.',
      description: `Millions of South Africans in rural areas still rely on candles and paraffin for lighting — expensive, dangerous, and polluting.\n\nOur Solar Lantern Kit is a robust, locally-assembled solar lighting system designed for households without reliable grid access. Each kit powers three LED lanterns for 10+ hours from a single day's charge.\n\nThe funds raised will go toward:\n• Manufacturing 1,000 initial kits\n• Training 50 community resellers\n• Subsidising kits for the most vulnerable households\n\nHelp us light up the dark corners of our beautiful country.`,
      goal: 250000, raised: 195600, backers: 312, creator: 'Thabo Nkosi', location: 'Limpopo, SA',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
      deadline: daysFromNow(18), createdAt: daysAgo(12), featured: true,
      rewards: [
        { amount: 150, title: 'Early Backer', desc: 'Name on our thank-you wall' },
        { amount: 500, title: 'Kit Sponsor', desc: 'Sponsor one lantern kit for a family' },
        { amount: 2500, title: 'Community Champion', desc: 'Sponsor 5 kits + personalised impact report' },
      ]
    },
    {
      id: 'p002', title: 'Eco Smart Bottle',
      category: 'Technology', tagline: 'A self-cleaning, temperature-tracking water bottle that nudges you to stay hydrated.',
      description: `The Eco Smart Bottle uses UV-C LED technology to purify your water in 60 seconds, eliminating 99.99% of bacteria and viruses.\n\nPair it with our app (iOS & Android) to:\n• Track daily water intake\n• Receive personalised hydration reminders\n• Monitor UV-C cleaning cycles\n\nBuilt from 100% recycled ocean plastic, it's the most sustainable smart bottle on the market.\n\nWe've already completed 18 months of R&D and are ready to manufacture. Your backing gets us to production.`,
      goal: 180000, raised: 257400, backers: 489, creator: 'Lerato Dlamini', location: 'Cape Town, SA',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      deadline: daysFromNow(5), createdAt: daysAgo(25), featured: true,
      rewards: [
        { amount: 300, title: 'Early Bird', desc: 'One bottle at 40% off retail price' },
        { amount: 600, title: 'Duo Pack', desc: 'Two bottles + free app premium year' },
        { amount: 1500, title: 'Team Edition', desc: '5 bottles + company branding option' },
      ]
    },
    {
      id: 'p003', title: 'Urban Garden AI',
      category: 'Technology', tagline: 'AI-powered vertical garden system that grows food in any apartment, year-round.',
      description: `Urban Garden AI combines computer vision, IoT sensors, and machine learning to automate indoor food growing for urban dwellers.\n\nThe system monitors plant health, adjusts LED light spectra, controls nutrients, and even predicts harvest times — all via a beautiful mobile app.\n\nGrow fresh herbs, leafy greens, and even strawberries in a space as small as 40×40cm. No green thumb required.\n\nBacked by the University of Johannesburg's AgriTech Lab.`,
      goal: 400000, raised: 220000, backers: 178, creator: 'Sipho Zulu', location: 'Johannesburg, SA',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      deadline: daysFromNow(30), createdAt: daysAgo(5), featured: true,
      rewards: [
        { amount: 500, title: 'Seed Supporter', desc: 'Early access to app beta' },
        { amount: 2500, title: 'First Harvest', desc: 'One Urban Garden AI unit at 35% off' },
        { amount: 5000, title: 'Full Stack', desc: 'Unit + nutrient starter pack + 1yr premium app' },
      ]
    },
    {
      id: 'p004', title: 'The Kasi Cookbook',
      category: 'Arts', tagline: 'A beautifully illustrated cookbook celebrating authentic township cuisine and the stories behind each dish.',
      description: `South African township food is world-class cuisine that deserves global recognition.\n\nThe Kasi Cookbook features 80 authentic recipes from grandmothers, street vendors, and home cooks across Soweto, Khayelitsha, Umlazi and more.\n\nEach recipe is paired with a personal story and stunning photography by award-winning photographer Nomvula Khumalo.\n\nThe book will be printed locally, creating jobs in Johannesburg's printing sector.`,
      goal: 120000, raised: 88500, backers: 234, creator: 'Nomvula Khumalo', location: 'Soweto, SA',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      deadline: daysFromNow(22), createdAt: daysAgo(8),
      rewards: [
        { amount: 200, title: 'Digital Edition', desc: 'PDF cookbook + recipe cards' },
        { amount: 400, title: 'Print Copy', desc: 'Signed hardcover + digital edition' },
        { amount: 1000, title: 'Premium Bundle', desc: 'Signed copy + cooking class ticket + chef apron' },
      ]
    },
    {
      id: 'p005', title: 'Coding Bootcamp for Township Youth',
      category: 'Education', tagline: 'Free 12-week coding bootcamp for unemployed youth aged 18–25 in Soweto and surrounding areas.',
      description: `South Africa has one of the highest youth unemployment rates in the world. We believe coding skills are the key to breaking this cycle.\n\nOur 12-week intensive bootcamp covers HTML/CSS, JavaScript, React, and basic backend development. Graduates receive job placement support and mentorship for 6 months post-graduation.\n\nWe've already run 3 cohorts with 85% employment rate. Help us fund cohort 4.`,
      goal: 350000, raised: 142000, backers: 521, creator: 'Zanele Mokoena', location: 'Soweto, SA',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      deadline: daysFromNow(45), createdAt: daysAgo(3),
      rewards: [
        { amount: 100, title: 'Believer', desc: 'Certificate of support + thank-you card' },
        { amount: 1000, title: 'Mentor Sponsor', desc: 'Sponsor one student for 4 weeks' },
        { amount: 5000, title: 'Full Scholarship', desc: 'Sponsor one student for the full bootcamp' },
      ]
    },
    {
      id: 'p006', title: 'Buchu Health Shots',
      category: 'Health', tagline: 'Premium wellness shots made from wild-harvested Buchu — South Africa\'s ancient medicinal plant.',
      description: `Buchu (Agathosma betulina) has been used by the Khoi-San people for centuries for its anti-inflammatory and antioxidant properties.\n\nBuchu Health Shots makes this powerful plant accessible in a modern, convenient format. Our 60ml daily shots are wild-harvested from the Cederberg mountains and cold-pressed to preserve potency.\n\nNo sugar. No preservatives. Just pure Buchu.\n\nFunding will enable us to scale production and achieve GMP certification for export.`,
      goal: 200000, raised: 67000, backers: 145, creator: 'Amahle van der Berg', location: 'Cederberg, SA',
      image: 'https://images.unsplash.com/photo-1550041491-c8d9eacfd9a4?w=800&q=80',
      deadline: daysFromNow(37), createdAt: daysAgo(15),
      rewards: [
        { amount: 250, title: 'Taste Tester', desc: '1 month supply (30 shots)' },
        { amount: 700, title: 'Wellness Pack', desc: '3 month supply + tote bag' },
        { amount: 2000, title: 'Corporate Wellness', desc: '6 month supply for up to 3 people' },
      ]
    },
  ];

  DB.saveProjects(seed);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function pct(raised, goal) {
  return Math.min(Math.round((raised / goal) * 100), 999);
}

function formatCurrency(n) {
  return 'R' + Number(n).toLocaleString('en-ZA');
}

function generateId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getInitials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ===================================
// NAVIGATION
// ===================================
function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile menu
  closeMobileMenu();

  // Page-specific logic
  if (page === 'home') renderHome();
  if (page === 'explore') renderExplore();
  if (page === 'dashboard') {
    if (!App.currentUser) {
      showModal('loginModal');
      showPage('home');
      return;
    }
    renderDashboard();
  }
  if (page === 'create') {
    if (!App.currentUser) {
      showModal('loginModal');
      return;
    }
  }
}

function toggleMobileMenu() {
  const links = document.getElementById('navLinks');
  const actions = document.getElementById('navActions');
  links.classList.toggle('open');
  actions.classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navActions').classList.remove('open');
}

// Scroll navbar effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===================================
// MODAL SYSTEM
// ===================================
function showModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e, id) {
  if (e.target.classList.contains('modal-overlay')) closeModal(id);
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => showModal(to), 150);
}

// ===================================
// AUTH
// ===================================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const users = DB.getUsers();
  const user = users.find(u => u.email === email && u.password === btoa(pw));

  if (!user) {
    errorEl.textContent = 'Invalid email or password.';
    errorEl.classList.add('visible');
    return;
  }

  errorEl.classList.remove('visible');
  loginSuccess(user);
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const errorEl = document.getElementById('registerError');

  if (pw.length < 8) {
    errorEl.textContent = 'Password must be at least 8 characters.';
    errorEl.classList.add('visible');
    return;
  }
  if (pw !== confirm) {
    errorEl.textContent = 'Passwords do not match.';
    errorEl.classList.add('visible');
    return;
  }

  const users = DB.getUsers();
  if (users.find(u => u.email === email)) {
    errorEl.textContent = 'An account with this email already exists.';
    errorEl.classList.add('visible');
    return;
  }

  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password: btoa(pw),
    createdAt: new Date().toISOString(),
    backedProjects: [],
  };

  users.push(newUser);
  DB.saveUsers(users);
  errorEl.classList.remove('visible');
  loginSuccess(newUser);
  closeModal('registerModal');
  showToast(`Welcome to FundForge, ${name}! 🎉`, 'success');
}

function loginSuccess(user) {
  // Don't store password in session
  const { password, ...safeUser } = user;
  App.currentUser = safeUser;
  DB.setCurrentUser(safeUser);
  updateNavForUser();
  closeModal('loginModal');
  showToast(`Welcome back, ${user.name}! ✦`, 'success');
}

function logout() {
  App.currentUser = null;
  DB.setCurrentUser(null);
  updateNavForUser();
  showPage('home');
  showToast('You have been signed out.', 'info');
}

function updateNavForUser() {
  const actions = document.getElementById('navActions');
  if (App.currentUser) {
    actions.innerHTML = `
      <button class="btn btn-ghost" onclick="showPage('dashboard')">Dashboard</button>
      <div class="user-pill" onclick="logout()" title="Sign out">
        <div class="up-avatar">${getInitials(App.currentUser.name)}</div>
        <span>${App.currentUser.name.split(' ')[0]}</span>
      </div>
    `;
    // Inject style once
    if (!document.getElementById('userPillStyle')) {
      const s = document.createElement('style');
      s.id = 'userPillStyle';
      s.textContent = `.user-pill{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border-light);border-radius:100px;padding:6px 16px 6px 6px;cursor:pointer;font-size:0.88rem;font-weight:600;transition:var(--transition)}.user-pill:hover{border-color:var(--accent)}.up-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:var(--bg)}`;
      document.head.appendChild(s);
    }
  } else {
    actions.innerHTML = `
      <button class="btn btn-ghost" onclick="showModal('loginModal')">Log In</button>
      <button class="btn btn-primary" onclick="showModal('registerModal')">Sign Up</button>
    `;
  }
}

// Password strength indicator
document.getElementById('regPassword').addEventListener('input', function () {
  const bar = document.getElementById('pwStrength');
  const v = this.value;
  const strength = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(v)).length;
  if (v.length < 6) { bar.className = 'pw-strength weak'; }
  else if (strength < 2) { bar.className = 'pw-strength medium'; }
  else { bar.className = 'pw-strength strong'; }
});

function togglePw(fieldId, btn) {
  const f = document.getElementById(fieldId);
  if (f.type === 'password') { f.type = 'text'; btn.textContent = 'Hide'; }
  else { f.type = 'password'; btn.textContent = 'Show'; }
}

// ===================================
// PROJECT RENDERING
// ===================================
function buildProjectCard(p) {
  const pctVal = pct(p.raised, p.goal);
  const days = daysLeft(p.deadline);
  const isOver = pctVal >= 100;
  const imgEl = p.image
    ? `<img class="card-image" src="${p.image}" alt="${p.title}" onerror="this.style.display='none'">`
    : `<div class="card-image-placeholder">◎</div>`;

  return `
    <div class="project-card" onclick="openProject('${p.id}')">
      ${imgEl}
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-tagline">${p.tagline}</div>
        <div class="card-creator">by <span>${p.creator}</span>${p.location ? ` · ${p.location}` : ''}</div>
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill ${isOver ? 'over' : ''}" style="width:${Math.min(pctVal,100)}%"></div>
          </div>
          <div class="progress-meta">
            <span class="progress-pct ${isOver ? 'over' : ''}">${pctVal}% funded</span>
            <span style="font-size:0.78rem;color:var(--text3)">${p.backers} backers</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-raised">
            <strong>${formatCurrency(p.raised)}</strong>
            <span> of ${formatCurrency(p.goal)}</span>
          </div>
          <div class="card-time ${days <= 7 ? 'urgent' : ''}">${days > 0 ? days + ' days left' : 'Ended'}</div>
        </div>
      </div>
    </div>
  `;
}

// ===================================
// HOME PAGE
// ===================================
function renderHome() {
  const projects = DB.getProjects();

  // Featured grid (first 3 featured or just first 3)
  const featured = projects.filter(p => p.featured).slice(0, 3);
  document.getElementById('homeFeaturedGrid').innerHTML =
    featured.map(buildProjectCard).join('') || '<p style="color:var(--text3);grid-column:1/-1;padding:40px 0">No projects yet.</p>';

  // Category counts
  const cats = ['Technology', 'Arts', 'Environment', 'Education', 'Health', 'Food'];
  const ids = ['cat-tech', 'cat-arts', 'cat-env', 'cat-edu', 'cat-health', 'cat-food'];
  cats.forEach((c, i) => {
    const count = projects.filter(p => p.category === c).length;
    document.getElementById(ids[i]).textContent = count + ' project' + (count !== 1 ? 's' : '');
  });

  // Animate stats
  animateCounters();
}

function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

function filterCategory(cat) {
  App.currentFilter = cat;
  showPage('explore');
  // Set filter tab
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.textContent === cat);
  });
  renderExplore();
}

// ===================================
// EXPLORE PAGE
// ===================================
function renderExplore() {
  let projects = DB.getProjects();
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();

  // Filter by category
  if (App.currentFilter !== 'all') {
    projects = projects.filter(p => p.category === App.currentFilter);
  }

  // Filter by search
  if (search) {
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.tagline.toLowerCase().includes(search) ||
      p.creator.toLowerCase().includes(search)
    );
  }

  // Sort
  if (App.currentSort === 'popular') {
    projects.sort((a, b) => b.raised - a.raised);
  } else if (App.currentSort === 'ending') {
    projects.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (App.currentSort === 'goal') {
    projects.sort((a, b) => b.goal - a.goal);
  } else {
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const grid = document.getElementById('exploreGrid');
  const empty = document.getElementById('emptyState');

  if (projects.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    grid.innerHTML = projects.map(buildProjectCard).join('');
    empty.style.display = 'none';
  }
}

function filterProjects() {
  renderExplore();
}

function setFilter(cat, btn) {
  App.currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderExplore();
}

function sortProjects(val) {
  App.currentSort = val;
  renderExplore();
}

// ===================================
// PROJECT DETAIL PAGE
// ===================================
function openProject(id) {
  const projects = DB.getProjects();
  const p = projects.find(proj => proj.id === id);
  if (!p) return;

  App.currentProjectId = id;
  const pctVal = pct(p.raised, p.goal);
  const days = daysLeft(p.deadline);
  const isOver = pctVal >= 100;
  const updates = DB.getUpdates().filter(u => u.projectId === id);

  const imgUrl = p.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80';

  const rewardsHTML = (p.rewards || []).map(r => `
    <div class="reward-option" onclick="selectRewardAmount(${r.amount})">
      <div class="reward-option-amount">${formatCurrency(r.amount)}</div>
      <div style="font-weight:600;margin:4px 0;font-size:0.9rem">${r.title}</div>
      <div class="reward-option-desc">${r.desc}</div>
    </div>
  `).join('');

  const updatesHTML = updates.length > 0
    ? updates.map(u => `
        <div class="update-item">
          <div class="update-date">${new Date(u.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div class="update-title">${u.title}</div>
          <div class="update-body">${u.body}</div>
        </div>
      `).join('')
    : '<p style="color:var(--text3);font-size:0.9rem">No updates posted yet.</p>';

  // Build supporter list (anonymous + stored)
  const supportersHTML = buildSupportersList(p);

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero">
      <img class="detail-hero-img" src="${imgUrl}" alt="${p.title}" onerror="this.style.background='var(--bg3)'">
      <div class="detail-hero-overlay"></div>
      <div class="detail-hero-content container">
        <div class="detail-category">${p.category}</div>
        <h1 class="detail-title">${p.title}</h1>
      </div>
    </div>

    <div class="container">
      <div class="detail-layout">

        <div class="detail-main">
          <p class="detail-tagline">${p.tagline}</p>
          <div class="detail-creator">
            <div class="detail-creator-avatar">${getInitials(p.creator)}</div>
            <div>
              <div class="detail-creator-label">Created by</div>
              <div class="detail-creator-name">${p.creator}</div>
              ${p.location ? `<div class="detail-creator-location">📍 ${p.location}</div>` : ''}
            </div>
          </div>
          <div class="detail-desc">${p.description}</div>

          <div class="updates-section">
            <h3>Project Updates</h3>
            ${updatesHTML}
          </div>

          <div class="supporters-section" style="margin-top:40px">
            <h3>Supporters (${p.backers})</h3>
            ${supportersHTML}
          </div>
        </div>

        <aside>
          <div class="funding-widget">
            <div class="fw-amount">${formatCurrency(p.raised)}</div>
            <div class="fw-goal">raised of ${formatCurrency(p.goal)} goal</div>
            <div class="fw-progress">
              <div class="fw-fill" style="width:${Math.min(pctVal,100)}%"></div>
            </div>
            <div class="fw-pct">${pctVal}% ${isOver ? '🎉 Goal Reached!' : 'funded'}</div>
            <div class="fw-stats">
              <div class="fw-stat">
                <div class="fw-stat-num">${p.backers}</div>
                <div class="fw-stat-label">Backers</div>
              </div>
              <div class="fw-stat">
                <div class="fw-stat-num">${days > 0 ? days : 0}</div>
                <div class="fw-stat-label">Days Left</div>
              </div>
            </div>
            <button class="btn btn-hero fw-btn" onclick="openContributeModal('${p.id}')">
              ★ Back This Project
            </button>
            <div class="fw-share">
              <button class="fw-share-btn" onclick="shareProject('${p.id}')">Share</button>
              <button class="fw-share-btn" onclick="copyProjectLink('${p.id}')">Copy Link</button>
            </div>
            ${(p.rewards && p.rewards.length > 0) ? `
              <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--border)">
                <div style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);margin-bottom:16px">Reward Tiers</div>
                ${rewardsHTML}
              </div>
            ` : ''}
          </div>
        </aside>

      </div>
    </div>
  `;

  showPage('detail');
}

function buildSupportersList(p) {
  const names = [
    'Thandi M.', 'Sipho K.', 'Naledi P.', 'Bongani N.', 'Lerato D.',
    'Amahle Z.', 'Sifiso M.', 'Nokwanda T.', 'Zithulele B.', 'Lindiwe S.',
    'Ahmed K.', 'Sarah van R.', 'Michael O.', 'Fatima M.', 'John P.',
    'Zanele K.', 'Tebogo L.', 'Priya N.', 'James H.', 'Nomvula X.'
  ];

  const count = Math.min(p.backers, 12);
  const shown = names.slice(0, count);

  return `<div class="supporter-list">
    ${shown.map(n => `
      <div class="supporter-badge">
        <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:var(--bg)">${n[0]}</div>
        <strong>${n}</strong>
      </div>
    `).join('')}
    ${p.backers > 12 ? `<div class="supporter-badge"><span style="color:var(--text3)">+${p.backers - 12} more backers</span></div>` : ''}
  </div>`;
}

// ===================================
// PROJECT CREATION
// ===================================
let currentStep = 1;

function nextStep(step) {
  if (!validateStep(currentStep)) return;
  currentStep = step;
  goToStep(step);
}

function prevStep(step) {
  currentStep = step;
  goToStep(step);
}

function goToStep(step) {
  document.querySelectorAll('.form-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === step);
  });

  document.querySelectorAll('.form-step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 < step) s.classList.add('completed');
    if (i + 1 === step) s.classList.add('active');
  });

  if (step === 3) updateLaunchPreview();
}

function validateStep(step) {
  if (step === 1) {
    const title = document.getElementById('projTitle').value.trim();
    const cat = document.getElementById('projCategory').value;
    let valid = true;
    if (!title) { document.getElementById('err-title').textContent = 'Please enter a project title.'; valid = false; }
    else document.getElementById('err-title').textContent = '';
    if (!cat) { document.getElementById('err-cat').textContent = 'Please select a category.'; valid = false; }
    else document.getElementById('err-cat').textContent = '';
    return valid;
  }
  if (step === 2) {
    const desc = document.getElementById('projDescription').value.trim();
    const creator = document.getElementById('projCreator').value.trim();
    let valid = true;
    if (desc.length < 50) { document.getElementById('err-desc').textContent = 'Description must be at least 50 characters.'; valid = false; }
    else document.getElementById('err-desc').textContent = '';
    if (!creator) valid = false;
    return valid;
  }
  return true;
}

function updateLaunchPreview() {
  const title = document.getElementById('projTitle').value.trim();
  const goal = document.getElementById('projGoal').value;
  const deadline = document.getElementById('projDeadline').value;
  const cat = document.getElementById('projCategory').value;

  const preview = document.getElementById('launchPreview');
  if (title && goal) {
    preview.classList.add('visible');
    preview.innerHTML = `
      <h4>Campaign Preview</h4>
      <div class="lp-item"><span>Title</span><span>${title}</span></div>
      <div class="lp-item"><span>Category</span><span>${cat}</span></div>
      <div class="lp-item"><span>Goal</span><span>${formatCurrency(goal)}</span></div>
      ${deadline ? `<div class="lp-item"><span>Deadline</span><span>${new Date(deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>` : ''}
      <div class="lp-item"><span>Days</span><span>${deadline ? Math.max(0, Math.ceil((new Date(deadline) - new Date()) / 86400000)) + ' days' : 'N/A'}</span></div>
    `;
  } else {
    preview.classList.remove('visible');
  }
}

function submitProject(e) {
  e.preventDefault();
  if (!App.currentUser) { showModal('loginModal'); return; }

  const goal = parseInt(document.getElementById('projGoal').value);
  if (!goal || goal < 100) {
    document.getElementById('err-goal').textContent = 'Please enter a valid goal (min R100).';
    return;
  }
  document.getElementById('err-goal').textContent = '';

  // Collect reward tiers from builder
  const rewardEls = document.querySelectorAll('.reward-tier');
  const rewards = [];
  rewardEls.forEach(el => {
    const amount = parseInt(el.querySelector('.rt-amount')?.value);
    const title = el.querySelector('.rt-title')?.value?.trim();
    const desc = el.querySelector('.rt-desc')?.value?.trim();
    if (amount && title) rewards.push({ amount, title, desc: desc || '' });
  });

  const newProject = {
    id: generateId(),
    title: document.getElementById('projTitle').value.trim(),
    category: document.getElementById('projCategory').value,
    tagline: document.getElementById('projTagline').value.trim(),
    description: document.getElementById('projDescription').value.trim(),
    creator: document.getElementById('projCreator').value.trim(),
    location: document.getElementById('projLocation').value.trim(),
    image: document.getElementById('projImage').value.trim() || '',
    goal,
    raised: 0,
    backers: 0,
    deadline: document.getElementById('projDeadline').value,
    createdAt: new Date().toISOString(),
    creatorId: App.currentUser.id,
    featured: false,
    rewards,
  };

  const projects = DB.getProjects();
  projects.unshift(newProject);
  DB.saveProjects(projects);

  showToast(`"${newProject.title}" is now live! 🚀`, 'success');
  document.getElementById('createProjectForm').reset();
  document.getElementById('imagePreview').innerHTML = '<span>Image preview will appear here</span>';
  document.getElementById('rewardsBuilder').innerHTML = '<div class="reward-empty">No reward tiers added yet.</div>';
  App.rewardTierCount = 0;
  currentStep = 1;
  goToStep(1);
  setTimeout(() => openProject(newProject.id), 800);
}

// ===================================
// REWARD TIERS (Create form)
// ===================================
function addRewardTier() {
  App.rewardTierCount++;
  const builder = document.getElementById('rewardsBuilder');
  const emptyEl = builder.querySelector('.reward-empty');
  if (emptyEl) emptyEl.remove();

  const id = 'rt-' + App.rewardTierCount;
  const div = document.createElement('div');
  div.className = 'reward-tier';
  div.id = id;
  div.innerHTML = `
    <div class="reward-tier-header">
      <div class="reward-tier-title">Reward Tier ${App.rewardTierCount}</div>
      <button type="button" class="reward-remove" onclick="removeRewardTier('${id}')">✕ Remove</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-bottom:10px">
      <div>
        <label class="field-label" style="font-size:0.72rem">Amount (R)</label>
        <input type="number" class="field-input rt-amount" placeholder="500" min="10">
      </div>
      <div>
        <label class="field-label" style="font-size:0.72rem">Tier Title</label>
        <input type="text" class="field-input rt-title" placeholder="e.g. Early Backer">
      </div>
    </div>
    <div>
      <label class="field-label" style="font-size:0.72rem">Description</label>
      <input type="text" class="field-input rt-desc" placeholder="What does the backer receive?">
    </div>
  `;
  builder.appendChild(div);
}

function removeRewardTier(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  const builder = document.getElementById('rewardsBuilder');
  if (!builder.querySelector('.reward-tier')) {
    builder.innerHTML = '<div class="reward-empty">No reward tiers added yet.</div>';
  }
}

// ===================================
// IMAGE PREVIEW (Create form)
// ===================================
document.getElementById('projImage').addEventListener('input', function () {
  const preview = document.getElementById('imagePreview');
  if (this.value) {
    preview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.innerHTML='<span>Invalid image URL</span>'">`;
  } else {
    preview.innerHTML = '<span>Image preview will appear here</span>';
  }
});

// Tagline char count
document.getElementById('projTagline').addEventListener('input', function () {
  document.getElementById('taglineCount').textContent = this.value.length;
});

// Set min date for deadline
document.getElementById('projDeadline').min = new Date(Date.now() + 86400000).toISOString().split('T')[0];

// ===================================
// CONTRIBUTION SYSTEM
// ===================================
function openContributeModal(projectId) {
  if (!App.currentUser) {
    showModal('loginModal');
    return;
  }

  const projects = DB.getProjects();
  const p = projects.find(proj => proj.id === projectId);
  if (!p) return;

  App.currentProjectId = projectId;
  document.getElementById('contributeProjectName').textContent = p.title;
  document.getElementById('contributeAmount').value = '';
  document.getElementById('cardNum').value = '';
  document.getElementById('cardExp').value = '';
  document.getElementById('cardCvv').value = '';
  document.getElementById('contributeError').classList.remove('visible');

  // Render reward options
  const rewardOpts = document.getElementById('rewardOptions');
  if (p.rewards && p.rewards.length > 0) {
    rewardOpts.innerHTML = p.rewards.map(r => `
      <div class="reward-option" onclick="selectRewardAmount(${r.amount})">
        <div class="reward-option-amount">${formatCurrency(r.amount)}</div>
        <div style="font-weight:600;font-size:0.88rem;margin:4px 0">${r.title}</div>
        <div class="reward-option-desc">${r.desc}</div>
      </div>
    `).join('');
    rewardOpts.style.display = 'flex';
    rewardOpts.style.flexDirection = 'column';
    rewardOpts.style.gap = '8px';
    rewardOpts.style.marginBottom = '16px';
  } else {
    rewardOpts.innerHTML = '';
  }

  showModal('contributeModal');
}

function selectRewardAmount(amount) {
  document.getElementById('contributeAmount').value = amount;
  document.querySelectorAll('#rewardOptions .reward-option').forEach(el => {
    el.classList.toggle('selected', parseInt(el.querySelector('.reward-option-amount').textContent.replace(/\D/g, '')) === amount);
  });
}

function processContribution() {
  const amount = parseInt(document.getElementById('contributeAmount').value);
  const cardNum = document.getElementById('cardNum').value.replace(/\s/g, '');
  const exp = document.getElementById('cardExp').value;
  const cvv = document.getElementById('cardCvv').value;
  const errorEl = document.getElementById('contributeError');

  if (!amount || amount < 10) {
    errorEl.textContent = 'Please enter an amount of at least R10.';
    errorEl.classList.add('visible'); return;
  }
  if (cardNum.length < 16) {
    errorEl.textContent = 'Please enter a valid card number.';
    errorEl.classList.add('visible'); return;
  }
  if (!exp || exp.length < 5) {
    errorEl.textContent = 'Please enter a valid expiry date.';
    errorEl.classList.add('visible'); return;
  }
  if (cvv.length < 3) {
    errorEl.textContent = 'Please enter a valid CVV.';
    errorEl.classList.add('visible'); return;
  }

  errorEl.classList.remove('visible');

  // Simulate payment processing
  const btn = document.querySelector('#contributeModal .btn-hero');
  btn.textContent = '⏳ Processing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '✓ Confirmed!';

    // Update project
    const projects = DB.getProjects();
    const proj = projects.find(p => p.id === App.currentProjectId);
    if (proj) {
      proj.raised += amount;
      proj.backers += 1;
      DB.saveProjects(projects);
    }

    // Track user backing
    const users = DB.getUsers();
    const userIdx = users.findIndex(u => u.id === App.currentUser.id);
    if (userIdx > -1) {
      users[userIdx].backedProjects = users[userIdx].backedProjects || [];
      users[userIdx].backedProjects.push({ projectId: App.currentProjectId, amount, date: new Date().toISOString() });
      DB.saveUsers(users);
    }

    closeModal('contributeModal');
    showToast(`🎉 You backed ${formatCurrency(amount)}! Thank you for supporting this project!`, 'success');

    // Refresh detail view if on detail page
    if (document.getElementById('page-detail').classList.contains('active')) {
      openProject(App.currentProjectId);
    }

    setTimeout(() => {
      btn.textContent = 'Confirm Backing';
      btn.disabled = false;
    }, 500);
  }, 1800);
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.match(/.{1,4}/g)?.join(' ') || v;
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
}

// ===================================
// DASHBOARD
// ===================================
function renderDashboard() {
  if (!App.currentUser) return;

  document.getElementById('dashWelcome').textContent = `Welcome back, ${App.currentUser.name}!`;

  const projects = DB.getProjects();
  const myProjects = projects.filter(p => p.creatorId === App.currentUser.id);

  // Get backed projects
  const users = DB.getUsers();
  const fullUser = users.find(u => u.id === App.currentUser.id) || {};
  const backedProjectIds = (fullUser.backedProjects || []).map(b => b.projectId);
  const backedProjects = projects.filter(p => backedProjectIds.includes(p.id));
  const totalBacked = (fullUser.backedProjects || []).reduce((s, b) => s + b.amount, 0);
  const totalRaised = myProjects.reduce((s, p) => s + p.raised, 0);

  // Stats
  document.getElementById('dashStats').innerHTML = `
    <div class="dash-stat-card">
      <div class="dsc-icon">📁</div>
      <div class="dsc-num">${myProjects.length}</div>
      <div class="dsc-label">Projects Created</div>
    </div>
    <div class="dash-stat-card">
      <div class="dsc-icon">💰</div>
      <div class="dsc-num">${formatCurrency(totalRaised)}</div>
      <div class="dsc-label">Total Raised</div>
    </div>
    <div class="dash-stat-card">
      <div class="dsc-icon">⭐</div>
      <div class="dsc-num">${backedProjects.length}</div>
      <div class="dsc-label">Projects Backed</div>
    </div>
    <div class="dash-stat-card">
      <div class="dsc-icon">🤝</div>
      <div class="dsc-num">${formatCurrency(totalBacked)}</div>
      <div class="dsc-label">Total Contributed</div>
    </div>
  `;

  // My Projects panel
  const myPanel = document.getElementById('dashMyProjects');
  if (myProjects.length > 0) {
    myPanel.innerHTML = `<div class="projects-grid">${myProjects.map(buildProjectCard).join('')}</div>`;
  } else {
    myPanel.innerHTML = `
      <div class="dash-empty">
        <span class="empty-icon">📁</span>
        You haven't created any projects yet.<br><br>
        <button class="btn btn-primary" onclick="showPage('create')">Start Your First Project</button>
      </div>
    `;
  }

  // Backed projects panel
  const backPanel = document.getElementById('dashMyBacking');
  if (backedProjects.length > 0) {
    backPanel.innerHTML = `<div class="projects-grid">${backedProjects.map(buildProjectCard).join('')}</div>`;
  } else {
    backPanel.innerHTML = `
      <div class="dash-empty">
        <span class="empty-icon">⭐</span>
        You haven't backed any projects yet.<br><br>
        <button class="btn btn-primary" onclick="showPage('explore')">Explore Projects</button>
      </div>
    `;
  }

  // Populate update project selector
  const sel = document.getElementById('updateProject');
  sel.innerHTML = myProjects.length > 0
    ? myProjects.map(p => `<option value="${p.id}">${p.title}</option>`).join('')
    : '<option value="">No projects yet</option>';
}

function switchDashTab(panel, btn) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`dash${panel.charAt(0).toUpperCase() + panel.slice(1)}`).classList.add('active');
}

// ===================================
// PROJECT UPDATES
// ===================================
function postUpdate() {
  if (!App.currentUser) return;

  const projectId = document.getElementById('updateProject').value;
  const title = document.getElementById('updateTitle').value.trim();
  const body = document.getElementById('updateBody').value.trim();

  if (!projectId) { showToast('No project selected.', 'error'); return; }
  if (!title) { showToast('Please enter an update title.', 'error'); return; }
  if (!body) { showToast('Please write your update.', 'error'); return; }

  const updates = DB.getUpdates();
  updates.unshift({
    id: 'upd-' + Date.now(),
    projectId,
    title,
    body,
    author: App.currentUser.name,
    createdAt: new Date().toISOString(),
  });
  DB.saveUpdates(updates);

  document.getElementById('updateTitle').value = '';
  document.getElementById('updateBody').value = '';
  showToast('Update posted! Your backers will see it. ✦', 'success');
}

// ===================================
// CONTACT FORM
// ===================================
function submitContact(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you within 24 hours. ✉', 'success');
  e.target.reset();
}

// ===================================
// SHARING
// ===================================
function shareProject(id) {
  const p = DB.getProjects().find(proj => proj.id === id);
  if (!p) return;
  if (navigator.share) {
    navigator.share({ title: p.title, text: p.tagline, url: window.location.href });
  } else {
    copyProjectLink(id);
  }
}

function copyProjectLink(id) {
  const link = `${window.location.origin}${window.location.pathname}#project/${id}`;
  navigator.clipboard?.writeText(link).then(() => {
    showToast('Link copied to clipboard!', 'info');
  }).catch(() => {
    showToast('Link: ' + link, 'info');
  });
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} visible`;
  setTimeout(() => toast.classList.remove('visible'), 4000);
}

// ===================================
// INIT
// ===================================
function init() {
  seedData();
  App.currentUser = DB.getCurrentUser();
  if (App.currentUser) updateNavForUser();

  renderHome();
  showPage('home');

  // Handle URL hash navigation
  const hash = window.location.hash;
  if (hash.startsWith('#project/')) {
    const id = hash.replace('#project/', '');
    setTimeout(() => openProject(id), 100);
  }
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['loginModal', 'registerModal', 'contributeModal'].forEach(closeModal);
  }
});
