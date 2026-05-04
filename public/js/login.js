document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const alert = document.getElementById('alertMsg');
  alert.className = 'alert';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value
      })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('vtUser', JSON.stringify(data.user));
      if (data.user.role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/';
      }
    } else {
      alert.textContent = '✗ ' + (data.message || 'Invalid credentials. Please try again.');
      alert.className = 'alert error';
    }
  } catch {
    alert.textContent = '✗ Server error. Please try again later.';
    alert.className = 'alert error';
  }
});
