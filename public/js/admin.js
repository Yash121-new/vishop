let allQueries = [];
let allUsers = [];
let currentQueryId = null;
let currentFilter = 'all';

const user = JSON.parse(localStorage.getItem('vtUser') || '{}');
const adminOverlay = document.getElementById('adminLoginOverlay');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginAlert = document.getElementById('adminLoginAlert');

function isAdminLoggedIn() {
  return localStorage.getItem('vtAdmin') === 'true';
}

function setAdminAlert(message, isError = true) {
  if (!adminLoginAlert) return;
  adminLoginAlert.textContent = message;
  adminLoginAlert.className = `login-alert ${isError ? 'error' : 'success'}`;
}

function showAdminLogin() {
  if (adminOverlay) adminOverlay.classList.add('active');
}

function hideAdminLogin() {
  if (adminOverlay) adminOverlay.classList.remove('active');
}

async function handleAdminLogin(event) {
  event.preventDefault();
  if (!adminLoginForm) return;

  const formData = new FormData(adminLoginForm);
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    setAdminAlert('Please fill in both fields.');
    return;
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setAdminAlert(data.message || 'Invalid admin credentials.');
      return;
    }

    localStorage.setItem('vtAdmin', 'true');
    hideAdminLogin();
    setAdminAlert('Authenticated successfully.', false);
    initAdminPanel();
  } catch (err) {
    console.error(err);
    setAdminAlert('Unable to connect. Try again later.');
  }
}

async function loadData() {
  try {
    const [qRes, uRes] = await Promise.all([
      fetch('/api/admin/queries', { headers: { 'x-admin': 'true' } }),
      fetch('/api/admin/users', { headers: { 'x-admin': 'true' } })
    ]);
    allQueries = await qRes.json();
    allUsers = await uRes.json();
    updateStats();
    renderRecent();
    renderAllQueries();
    renderUsers();
  } catch (e) {
    console.error(e);
  }
}

function updateStats() {
  document.getElementById('stat-total').textContent = allQueries.length;
  document.getElementById('stat-new').textContent = allQueries.filter(
    (q) => q.status === 'new'
  ).length;
  document.getElementById('stat-replied').textContent = allQueries.filter(
    (q) => q.status === 'replied'
  ).length;
  document.getElementById('stat-users').textContent = allUsers.length;
  document.getElementById('queriesBadge').textContent = allQueries.filter(
    (q) => q.status === 'new'
  ).length;
}

function fmtDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderRecent() {
  const tbody = document.getElementById('recentQueriesBody');
  const rows = [...allQueries].reverse().slice(0, 10);
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">No queries yet</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = rows
    .map(
      (q, i) => `
    <tr>
      <td>${allQueries.length - i}</td>
      <td>${q.name}</td>
      <td>${q.email}</td>
      <td>${q.service || '—'}</td>
      <td>${fmtDate(q.createdAt)}</td>
      <td><span class="badge ${q.status}">${q.status}</span></td>
      <td><button class="action-btn" onclick="openModal('${q._id}')">View</button></td>
    </tr>
  `
    )
    .join('');
}

function renderAllQueries(filter = 'all', search = '') {
  const tbody = document.getElementById('allQueriesBody');
  let rows = [...allQueries].reverse();
  if (filter !== 'all') {
    rows = rows.filter((q) => q.status === filter);
  }
  if (search) {
    rows = rows.filter(
      (q) =>
        q.name.toLowerCase().includes(search) ||
        q.email.toLowerCase().includes(search) ||
        (q.message || '').toLowerCase().includes(search)
    );
  }
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">No queries found</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = rows
    .map(
      (q, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${q.name}</td>
      <td>${q.phone || '—'}</td>
      <td>${q.email}</td>
      <td>${q.service || '—'}</td>
      <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${
        q.message
      }</td>
      <td>${fmtDate(q.createdAt)}</td>
      <td><span class="badge ${q.status}">${q.status}</span></td>
      <td>
        <button class="action-btn" onclick="openModal('${q._id}')">View</button>
        <button class="action-btn danger" onclick="deleteQuery('${q._id}')">Del</button>
      </td>
    </tr>
  `
    )
    .join('');
}

function renderUsers() {
  const tbody = document.getElementById('usersBody');
  if (!allUsers.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👥</div><div class="empty-text">No users registered yet</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = allUsers
    .map(
      (u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${u.firstName} ${u.lastName}</td>
      <td>${u.email}</td>
      <td>${u.phone || '—'}</td>
      <td>${u.service || '—'}</td>
      <td>${fmtDate(u.createdAt)}</td>
      <td><button class="action-btn danger" onclick="deleteUser('${u._id}')">Remove</button></td>
    </tr>
  `
    )
    .join('');
}

function openModal(id) {
  const q = allQueries.find((x) => x._id === id);
  if (!q) return;
  currentQueryId = id;
  document.getElementById('modal-name').textContent = q.name;
  document.getElementById('modal-email').textContent = q.email;
  document.getElementById('modal-phone').textContent = q.phone || '—';
  document.getElementById('modal-service').textContent = q.service || '—';
  document.getElementById('modal-message').textContent = q.message;
  document.getElementById('modal-date').textContent = fmtDate(q.createdAt);
  document.getElementById('modalOverlay').classList.add('open');
  if (q.status === 'new') {
    markStatus(id, 'read', true);
  }
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
    loadData();
  }
}

async function markStatus(id, status, silent = false) {
  await fetch(`/api/admin/queries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin': 'true' },
    body: JSON.stringify({ status })
  });
  if (!silent) {
    closeModal();
    loadData();
  } else {
    const q = allQueries.find((x) => x._id === id);
    if (q) {
      q.status = status;
    }
  }
}

async function deleteQuery(id) {
  if (!confirm('Delete this query?')) return;
  await fetch(`/api/admin/queries/${id}`, { method: 'DELETE', headers: { 'x-admin': 'true' } });
  closeModal();
  loadData();
}

async function deleteUser(id) {
  if (!confirm('Remove this user?')) return;
  await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: { 'x-admin': 'true' } });
  loadData();
}

function filterQueries(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllQueries(filter, document.getElementById('searchInput').value.toLowerCase());
}

function handleSearch(val) {
  renderAllQueries(currentFilter, val.toLowerCase());
}

function switchPanel(name) {
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  event.currentTarget.classList.add('active');
  document.getElementById('topbarTitle').textContent = {
    dashboard: 'Dashboard',
    queries: 'All Queries',
    users: 'Users'
  }[name];
  if (name === 'queries') {
    renderAllQueries(currentFilter);
  }
  if (name === 'users') {
    renderUsers();
  }
}

function logout() {
  localStorage.removeItem('vtAdmin');
  localStorage.removeItem('vtUser');
  window.location.href = '/admin.html';
}

function initAdminPanel() {
  if (!isAdminLoggedIn()) {
    showAdminLogin();
    return;
  }

  hideAdminLogin();
  loadData();
  setInterval(loadData, 30000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }
  initAdminPanel();
});
