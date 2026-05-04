document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('vtUser') || 'null');
  if (!user || !user.email) {
    window.location.href = '/login.html';
    return;
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0];
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileFullName').textContent = name;
  document.getElementById('profileEmail').textContent = user.email || '-';
  document.getElementById('profilePhone').textContent = user.phone || 'Not added';
  document.getElementById('profileService').textContent = user.service || 'Not specified';
});
