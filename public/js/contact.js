document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  msg.className = 'form-msg';

  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    service: form.service.value,
    message: form.message.value
  };

  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      msg.textContent = '✓ Query submitted successfully! We will contact you within 24 hours.';
      msg.className = 'form-msg success';
      form.reset();
    } else {
      throw new Error('Server error');
    }
  } catch {
    msg.textContent = '✗ Something went wrong. Please call us directly.';
    msg.className = 'form-msg error';
  }
});
