/* ════════════════════════════════════════════════════════ */
/* SIGNUP FORM HANDLER */
/* ════════════════════════════════════════════════════════ */

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const alertEl = document.getElementById('alertMsg');
  alertEl.className = 'alert';

  if (form.password.value !== form.confirmPassword.value) {
    alertEl.textContent = '✗ Passwords do not match.';
    alertEl.className = 'alert error';
    return;
  }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        service: form.service.value,
        password: form.password.value
      })
    });

    const data = await res.json();
    if (res.ok) {
      alertEl.textContent = '✓ Account created successfully! Redirecting to login...';
      alertEl.className = 'alert success';
      setTimeout(() => (window.location.href = '/login.html'), 2000);
    } else {
      alertEl.textContent = '✗ ' + (data.message || 'Registration failed. Please try again.');
      alertEl.className = 'alert error';
    }
  } catch {
    alertEl.textContent = '✗ Server error. Please try again later.';
    alertEl.className = 'alert error';
  }
});
