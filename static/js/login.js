// Toggle entre login y signup
const authCard = document.getElementById('authCard');

function setMode(mode) {
  if (mode === 'signup') {
    authCard.classList.add('is-signup');
  } else {
    authCard.classList.remove('is-signup');
  }
}

// Botones que cambian de modo
document.querySelectorAll('[data-switch]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const mode = e.currentTarget.getAttribute('data-switch');
    setMode(mode);
  });
});

// Mostrar/ocultar contraseña
document.querySelectorAll('.input__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    // feedback rápido
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => btn.style.transform = '', 80);
  });
});

// Formularios
const loginForm  = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// --- Rol y Cargo ---
const roleSelect = document.getElementById('signupRole');
const cargoField = document.getElementById('cargoField');
const cargoInput = document.getElementById('signupCargo');

function updateCargoVisibility() {
  if (roleSelect.value === 'desarrollador') {
    cargoField.style.display = 'block';
    cargoInput.setAttribute('required', 'true');
  } else {
    cargoField.style.display = 'none';
    cargoInput.removeAttribute('required');
    cargoInput.value = "";
  }
}
roleSelect.addEventListener('change', updateCargoVisibility);
updateCargoVisibility();

// Robustez: flotar label si tiene valor
roleSelect.addEventListener('change', () => {
  const wrapper = roleSelect.closest('.input');
  if (roleSelect.value) wrapper.classList.add('input--filled');
  else wrapper.classList.remove('input--filled');
});

// Toast
function showToast(msg, type='ok') {
  let el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.left = '50%';
  el.style.bottom = '24px';
  el.style.transform = 'translateX(-50%)';
  el.style.padding = '12px 16px';
  el.style.borderRadius = '12px';
  el.style.background = type === 'ok' ? 'rgba(35,209,139,.15)' : 'rgba(255,93,108,.15)';
  el.style.border = `1px solid ${type === 'ok' ? 'rgba(35,209,139,.45)' : 'rgba(255,93,108,.45)'}`;
  el.style.color = '#e9ecff';
  el.style.backdropFilter = 'blur(6px)';
  el.style.zIndex = '9999';
  el.style.transition = 'opacity .5s ease';
  document.body.appendChild(el);
  setTimeout(() => el.style.opacity = '0', 1800);
  setTimeout(() => el.remove(), 2200);
}

// --- LOGIN ---
loginForm.addEventListener('submit', (e) => {
  const email = document.getElementById('loginUsuario').value.trim();
  const pass  = document.getElementById('loginPassword').value;

  if (!email || email.length < 2) {
    e.preventDefault();
    showToast('Ingresa un usuario o correo válido', 'err');
    return;
  }
  if (!pass || pass.length < 6) {
    e.preventDefault();
    showToast('La contraseña debe tener al menos 6 caracteres', 'err');
    return;
  }
  // Si pasa validaciones -> el form se envía a /login
});

// --- SIGNUP ---
signupForm.addEventListener('submit', (e) => {
  const firstName = document.getElementById('signupFirstName').value.trim();
  const lastName  = document.getElementById('signupLastName').value.trim();
  const email     = document.getElementById('signupEmail').value.trim();
  const phone     = document.getElementById('signupPhone').value.trim();
  const pass      = document.getElementById('signupPassword').value;
  const role      = roleSelect.value;
  const cargo     = cargoInput.value.trim();

  if (firstName.length < 2) { e.preventDefault(); showToast('El nombre es muy corto', 'err'); return; }
  if (lastName.length  < 2) { e.preventDefault(); showToast('El apellido es muy corto', 'err'); return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { e.preventDefault(); showToast('Correo inválido', 'err'); return; }
  if (phone && !/^[0-9]{7,15}$/.test(phone)) { e.preventDefault(); showToast('Teléfono inválido', 'err'); return; }
  if (pass.length < 6) { e.preventDefault(); showToast('La contraseña debe tener al menos 6 caracteres', 'err'); return; }
  if (!role) { e.preventDefault(); showToast('Debes seleccionar un rol', 'err'); return; }
  if (role === 'desarrollador' && cargo.length < 2) {
    e.preventDefault(); showToast('Debes ingresar un cargo válido', 'err'); return;
  }

  // ✅ No hacemos preventDefault si todo está correcto
  // El form se enviará a /registro y Flask lo guardará en la DB
  showToast('Registrando cuenta...', 'ok');
});

// Estado inicial
setMode('login');
