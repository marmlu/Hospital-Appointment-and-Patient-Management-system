/* =========================================================
   HOSPITAL MANAGEMENT SYSTEM — AUTH JAVASCRIPT
   Member 1 — Authentication & User Management
   ========================================================= */

/* =========================================================
   1. NAVBAR TOGGLE (mobile)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('navbarToggle');
  const links  = document.getElementById('navbarLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }
});

/* =========================================================
   2. SHOW / HIDE PASSWORD
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const input    = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '🙈';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        btn.innerHTML = '👁';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });
});

/* =========================================================
   3. HELPERS
   ========================================================= */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('error');
  field.classList.remove('success');

  let errEl = document.getElementById(fieldId + '-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    errEl.id = fieldId + '-error';
    field.closest('.form-group, .input-password-wrap')?.parentElement?.appendChild(errEl)
      || field.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove('error');
  field.classList.add('success');
  const errEl = document.getElementById(fieldId + '-error');
  if (errEl) errEl.textContent = '';
}

function clearAllErrors(fieldIds) {
  fieldIds.forEach(function (id) {
    const field = document.getElementById(id);
    if (!field) return;
    field.classList.remove('error', 'success');
    const errEl = document.getElementById(id + '-error');
    if (errEl) errEl.textContent = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
  return password.length >= 6;
}

function showAlert(containerId, message, type) {
  // type: 'error' | 'success' | 'info'
  let container = document.getElementById(containerId);
  if (!container) return;

  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';

  container.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      <span class="alert-icon">${icon}</span>
      <span>${message}</span>
    </div>`;
}

function clearAlert(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

/* =========================================================
   4. LOGIN VALIDATION
   ========================================================= */
var loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(['loginEmail', 'loginPassword']);
    clearAlert('loginAlert');

    var email    = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    var valid    = true;

    if (!email) {
      showError('loginEmail', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('loginEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('loginEmail');
    }

    if (!password) {
      showError('loginPassword', 'Password is required.');
      valid = false;
    } else {
      clearError('loginPassword');
    }

    if (!valid) return;

    // Simulate login — hardcoded user
    var DEMO_EMAIL    = 'john@gmail.com';
    var DEMO_PASSWORD = 'password123';

    var btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Login';

      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        showAlert('loginAlert', '✅ Login successful! Redirecting to profile…', 'success');
        setTimeout(function () {
          window.location.href = 'profile.html';
        }, 1200);
      } else {
        showAlert('loginAlert', 'Invalid email or password. Try john@gmail.com / password123', 'error');
      }
    }, 800);
  });

  // Live validation
  document.getElementById('loginEmail')?.addEventListener('blur', function () {
    var val = this.value.trim();
    if (!val) showError('loginEmail', 'Email address is required.');
    else if (!isValidEmail(val)) showError('loginEmail', 'Please enter a valid email address.');
    else clearError('loginEmail');
  });
}

/* =========================================================
   5. REGISTER VALIDATION
   ========================================================= */
var registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(['regName', 'regEmail', 'regPassword', 'regConfirm']);
    clearAlert('registerAlert');

    var name     = document.getElementById('regName').value.trim();
    var email    = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirm  = document.getElementById('regConfirm').value;
    var valid    = true;

    if (!name) {
      showError('regName', 'Full name is required.');
      valid = false;
    } else if (name.length < 2) {
      showError('regName', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError('regName');
    }

    if (!email) {
      showError('regEmail', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('regEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('regEmail');
    }

    if (!password) {
      showError('regPassword', 'Password is required.');
      valid = false;
    } else if (!isValidPassword(password)) {
      showError('regPassword', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearError('regPassword');
    }

    if (!confirm) {
      showError('regConfirm', 'Please confirm your password.');
      valid = false;
    } else if (password !== confirm) {
      showError('regConfirm', 'Passwords do not match.');
      valid = false;
    } else {
      clearError('regConfirm');
    }

    if (!valid) return;

    var btn = registerForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Register';
      showAlert('registerAlert', 'Account created successfully! Redirecting to login…', 'success');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1500);
    }, 900);
  });

  // Live password match
  document.getElementById('regConfirm')?.addEventListener('input', function () {
    var password = document.getElementById('regPassword').value;
    if (this.value && this.value !== password) {
      showError('regConfirm', 'Passwords do not match.');
    } else if (this.value) {
      clearError('regConfirm');
    }
  });
}

/* =========================================================
   6. FORGOT PASSWORD VALIDATION
   ========================================================= */
var forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(['forgotEmail']);
    clearAlert('forgotAlert');

    var email = document.getElementById('forgotEmail').value.trim();
    var valid = true;

    if (!email) {
      showError('forgotEmail', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('forgotEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('forgotEmail');
    }

    if (!valid) return;

    var btn = forgotForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
      showAlert('forgotAlert',
        'Reset link sent! Check your email inbox. (Simulated — redirecting to reset page…)',
        'success');
      setTimeout(function () {
        window.location.href = 'reset-password.html';
      }, 2000);
    }, 1000);
  });
}

/* =========================================================
   7. RESET PASSWORD VALIDATION
   ========================================================= */
var resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(['resetPassword', 'resetConfirm']);
    clearAlert('resetAlert');

    var password = document.getElementById('resetPassword').value;
    var confirm  = document.getElementById('resetConfirm').value;
    var valid    = true;

    if (!password) {
      showError('resetPassword', 'New password is required.');
      valid = false;
    } else if (!isValidPassword(password)) {
      showError('resetPassword', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearError('resetPassword');
    }

    if (!confirm) {
      showError('resetConfirm', 'Please confirm your password.');
      valid = false;
    } else if (password !== confirm) {
      showError('resetConfirm', 'Passwords do not match.');
      valid = false;
    } else {
      clearError('resetConfirm');
    }

    if (!valid) return;

    var btn = resetForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Resetting…';

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Reset Password';
      showAlert('resetAlert', 'Password reset successfully! Redirecting to login…', 'success');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1500);
    }, 900);
  });

  // Live confirm match
  document.getElementById('resetConfirm')?.addEventListener('input', function () {
    var password = document.getElementById('resetPassword').value;
    if (this.value && this.value !== password) {
      showError('resetConfirm', 'Passwords do not match.');
    } else if (this.value) {
      clearError('resetConfirm');
    }
  });
}
