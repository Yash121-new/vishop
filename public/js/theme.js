function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function updateNavAuth() {
  const user = JSON.parse(localStorage.getItem('vtUser') || 'null');
  const navAuth = document.getElementById('navAuth');
  
  if (!navAuth) return;
  
  if (user && user.email) {
    const displayName = user.firstName ? `${user.firstName}` : user.email.split('@')[0];
    navAuth.innerHTML = `
      <div class="nav-user-menu">
        <button class="nav-user-btn" onclick="toggleUserMenu(event)">${displayName} ▾</button>
        <div class="nav-user-dropdown" id="userDropdown">
          <a href="/profile.html">Profile</a>
          <button type="button" onclick="handleLogout()">Logout</button>
        </div>
      </div>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="/login.html" class="btn-outline">Login</a>
      <a href="/signup.html" class="btn-gold">Sign Up</a>
    `;
  }
}

function toggleUserMenu(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
}

function toggleMobileNav(event) {
  event.stopPropagation();
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.toggle('open');
}

window.addEventListener('click', () => {
  const dropdown = document.querySelector('.nav-user-dropdown.open');
  if (dropdown) dropdown.classList.remove('open');
  const nav = document.querySelector('nav.open');
  if (nav) nav.classList.remove('open');
});

function handleLogout() {
  localStorage.removeItem('vtUser');
  window.location.href = '/';
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateNavAuth();
  const nav = document.querySelector('nav');
  if (nav) {
    nav.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
});

window.addEventListener('storage', () => {
  updateNavAuth();
});
