import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de crear el archivo 'login.css' y pegar el contenido
// del CSS original dentro.
import '../styles/login.css'; 

/**
 * Componente principal para el formulario de Login y Registro.
 * Recrea la funcionalidad y estructura del login.html y login.js.
 */
const Login = () => {
  // Estado para controlar si estamos en modo 'login' o 'signup'
  const [mode, setMode] = useState('login'); 
  
  // Estados para los campos de los formularios
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [signupCargo, setSignupCargo] = useState('');

  // Refs para los campos de contraseña para alternar su visibilidad
  const loginPassRef = useRef(null);
  const signupPassRef = useRef(null);
  const signupConfirmRef = useRef(null);

  // --- Lógica de Toast (Notificación) ---
  const showToast = (msg, type = 'ok') => {
    let el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    
    // Estilos del toast, tomados del JS original
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
  };

  // --- Lógica para alternar visibilidad de contraseña ---
  const togglePasswordVisibility = (e, inputRef) => {
    e.preventDefault(); // Evita el envío del formulario si está dentro de uno
    if (!inputRef.current) return;

    const input = inputRef.current;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Feedback rápido (animación de escala)
    const btn = e.currentTarget;
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => btn.style.transform = '', 80);
  };

  // --- Lógica de Visibilidad del Campo Cargo ---
  const isDeveloper = signupRole === 'desarrollador';
  
  // Función para manejar el cambio de rol y la clase 'input--filled'
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSignupRole(value);
    
    // (Robustez) marcar .input--filled para flotar el label en el select (replicando el JS original)
    const wrapper = e.target.closest('.input');
    if (value) wrapper.classList.add('input--filled');
    else wrapper.classList.remove('input--filled');

    // Limpiar el campo Cargo si el rol cambia de "desarrollador"
    if (value !== 'desarrollador') {
      setSignupCargo('');
    }
  };

  // Efecto para aplicar la clase `input--filled` al montar si ya hay un valor (ej. si el navegador autocompleta)
  useEffect(() => {
    const roleSelect = document.getElementById('signupRole');
    if (roleSelect && signupRole) {
      const wrapper = roleSelect.closest('.input');
      if (wrapper) wrapper.classList.add('input--filled');
    }
  }, [signupRole]);
  
  
  // --- Manejo del Login ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = loginEmail.trim();
    const pass = loginPassword;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Ingresa un correo válido', 'err');
      return;
    }
    if (!pass || pass.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'err');
      return;
    }
    
    showToast('¡Inicio de sesión correcto!', 'ok');
    // Aquí iría la lógica de autenticación real
  };

  // --- Manejo del Registro (Signup) ---
  const handleSignupSubmit = (e) => {
    e.preventDefault();

    const firstName = signupFirstName.trim();
    const lastName  = signupLastName.trim();
    const email     = signupEmail.trim();
    const phone     = signupPhone.trim();
    const pass      = signupPassword;
    const conf      = signupConfirm;
    const role      = signupRole;
    const cargo     = signupCargo.trim();

    if (firstName.length < 2) { showToast('El nombre es muy corto', 'err'); return; }
    if (lastName.length  < 2) { showToast('El apellido es muy corto', 'err'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { showToast('Correo inválido', 'err'); return; }
    if (!/^[0-9]{7,15}$/.test(phone)) { showToast('Teléfono inválido', 'err'); return; }
    if (pass.length < 6) { showToast('La contraseña debe tener al menos 6 caracteres', 'err'); return; }
    if (pass !== conf) { showToast('Las contraseñas no coinciden', 'err'); return; }
    if (!role) { showToast('Debes seleccionar un rol', 'err'); return; }
    if (role === 'desarrollador' && cargo.length < 2) {
      showToast('Debes ingresar un cargo válido', 'err'); return;
    }

    showToast('¡Cuenta creada! Ahora inicia sesión 🙌', 'ok');
    setMode('login'); // Cambiar a la vista de login después del registro
  };
  
  // Clase condicional para aplicar las animaciones CSS
  const authCardClass = `auth__card ${mode === 'signup' ? 'is-signup' : ''}`;

  return (
    <main className="auth">
      <div className={authCardClass} id="authCard">
        
        {/* Columna: formularios */}
        <div className="auth__forms">
          {/* Login */}
          <form className="form form--login" id="loginForm" onSubmit={handleLoginSubmit} autoComplete="on" noValidate>
            <h2 className="form__title">Iniciar sesión</h2>

            <div className="input">
              <input 
                type="email" name="email" id="loginEmail" required 
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder=" " // Necesario para el efecto 'flotante' del label
              />
              <label htmlFor="loginEmail">Correo</label>
              <span className="input__bar"></span>
            </div>

            <div className="input">
              <input 
                type="password" name="password" id="loginPassword" minLength="6" required 
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                ref={loginPassRef}
                placeholder=" "
              />
              <label htmlFor="loginPassword">Contraseña</label>
              <span className="input__bar"></span>
              <button 
                className="input__toggle" type="button" aria-label="Mostrar/ocultar contraseña"
                onClick={(e) => togglePasswordVisibility(e, loginPassRef)}
              ></button>
            </div>

            <div className="form__actions">
              <label className="checkbox">
                <input type="checkbox" id="recuerdame" />
                <span>Recuérdame</span>
              </label>
              {/* Usa <a> para enlaces externos/navegación */}
              <a href="../smsrecup/sms.html" className="link">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="btn" type="submit">Entrar</button>

            <p className="form__switch">
              ¿No tienes cuenta?
              <button className="link link--btn" type="button" onClick={() => setMode('signup')} data-switch="signup">
                Crear cuenta
              </button>
            </p>
          </form>

          {/* Registro */}
          <form className="form form--signup" id="signupForm" onSubmit={handleSignupSubmit} autoComplete="on" noValidate>
            <h2 className="form__title">Crear cuenta</h2>

            <div className="form__grid">
              <div className="input">
                <input 
                  type="text" name="firstName" id="signupFirstName" minLength="2" required 
                  value={signupFirstName} onChange={(e) => setSignupFirstName(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signupFirstName">Nombre</label>
                <span className="input__bar"></span>
              </div>

              <div className="input">
                <input 
                  type="text" name="lastName" id="signupLastName" minLength="2" required 
                  value={signupLastName} onChange={(e) => setSignupLastName(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signupLastName">Apellido</label>
                <span className="input__bar"></span>
              </div>

              <div className="input">
                <input 
                  type="email" name="email" id="signupEmail" required 
                  value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signupEmail">Correo</label>
                <span className="input__bar"></span>
              </div>

              <div className="input">
                <input 
                  type="tel" name="phone" id="signupPhone" pattern="[0-9]{7,15}" required 
                  value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="signupPhone">Teléfono</label>
                <span className="input__bar"></span>
              </div>

              <div className="input">
                <input 
                  type="password" name="password" id="signupPassword" minLength="6" required 
                  value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                  ref={signupPassRef}
                  placeholder=" "
                />
                <label htmlFor="signupPassword">Contraseña (mín. 6)</label>
                <span className="input__bar"></span>
                <button 
                  className="input__toggle" type="button" aria-label="Mostrar/ocultar contraseña"
                  onClick={(e) => togglePasswordVisibility(e, signupPassRef)}
                ></button>
              </div>

              <div className="input">
                <input 
                  type="password" name="confirm" id="signupConfirm" minLength="6" required 
                  value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)}
                  ref={signupConfirmRef}
                  placeholder=" "
                />
                <label htmlFor="signupConfirm">Confirmar contraseña</label>
                <span className="input__bar"></span>
                <button 
                  className="input__toggle" type="button" aria-label="Mostrar/ocultar contraseña"
                  onClick={(e) => togglePasswordVisibility(e, signupConfirmRef)}
                ></button>
              </div>

              {/* Rol (select) */}
              <div className="input">
                <select 
                  id="signupRole" name="role" required 
                  value={signupRole} onChange={handleRoleChange}
                >
                  <option value="" disabled>Selecciona un rol</option>
                  <option value="cliente">Cliente</option>
                  <option value="desarrollador">Desarrollador</option>
                </select>
                <label htmlFor="signupRole">Rol</label>
                <span className="input__bar"></span>
              </div>

              {/* Cargo (aparece solo si Rol = Desarrollador) */}
              {isDeveloper && (
                <div className="input" id="cargoField">
                  <input 
                    type="text" name="cargo" id="signupCargo" minLength="2" 
                    required={isDeveloper} 
                    value={signupCargo} onChange={(e) => setSignupCargo(e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="signupCargo">Cargo</label>
                  <span className="input__bar"></span>
                </div>
              )}
            </div>

            <button className="btn" type="submit">Registrarme</button>

            <p className="form__switch">
              ¿Ya tienes cuenta?
              <button className="link link--btn" type="button" onClick={() => setMode('login')} data-switch="login">
                Inicia sesión
              </button>
            </p>
          </form>
        </div>

        {/* Columna: panel deslizante */}
        <div className="auth__panel">
          <div className="panel__inner panel__inner--login">
            <h3>¡Bienvenido!</h3>
            <p>Ingresa con tus datos y vuelve a lo que estabas haciendo.</p>
            <button className="btn btn--outline" type="button" onClick={() => setMode('login')} data-switch="login">
              Iniciar sesión
            </button>
          </div>
          <div className="panel__inner panel__inner--signup">
            <h3>¿Nuevo por aquí?</h3>
            <p>Crea una cuenta para disfrutar de todas las funciones.</p>
            <button className="btn btn--outline" type="button" onClick={() => setMode('signup')} data-switch="signup">
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;