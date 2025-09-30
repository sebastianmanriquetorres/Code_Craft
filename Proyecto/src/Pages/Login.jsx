import React, { useState } from "react";
import "../styles/login.css"; // tu CSS original

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // Estado para manejar el rol

  // Función para manejar el cambio en el selector de rol
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <main className="auth">
      {/* Añadido el cambio de clase para el efecto deslizante */}
      <div className={`auth__card ${isSignup ? "is-signup" : ""}`} id="authCard">
        {/* Columna: formularios */}
        <div className="auth__forms">
          {/* ---------------- LOGIN ---------------- */}
          {/* ... (Tu formulario de login está bien) ... */}
          <form className="form form--login" id="loginForm" autoComplete="on" noValidate>
            <h2 className="form__title">Iniciar sesión</h2>
            {/* ... Campos de Correo y Contraseña ... */}
            <div className="input">
              <input type="email" name="email" id="loginEmail" required placeholder=" " />
              <label htmlFor="loginEmail">Correo</label>
              <span className="input__bar"></span>
            </div>
            <div className="input">
              <input
                type="password"
                name="password"
                id="loginPassword"
                minLength="6"
                required
                placeholder=" "
              />
              <label htmlFor="loginPassword">Contraseña</label>
              <span className="input__bar"></span>
              <button
                className="input__toggle"
                type="button"
                aria-label="Mostrar/ocultar contraseña"
              ></button>
            </div>
            {/* ... Acciones y botón Entrar ... */}
            <div className="form__actions">
              <label className="checkbox">
                <input type="checkbox" id="recuerdame" />
                <span>Recuérdame</span>
              </label>
              <a href="/recuperar" className="link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button className="btn" type="submit">
              Entrar
            </button>

            <p className="form__switch">
              ¿No tienes cuenta?{" "}
              <button
                className="link link--btn"
                type="button"
                onClick={() => setIsSignup(true)}
              >
                Crear cuenta
              </button>
            </p>
          </form>

          {/* ---------------- REGISTRO ---------------- */}
          <form className="form form--signup" id="signupForm" autoComplete="on" noValidate>
            <h2 className="form__title">Crear cuenta</h2>

            <div className="form__grid">
              {/* ... Campos Nombre, Apellido, Correo, Teléfono ... */}
              <div className="input">
                <input type="text" name="firstName" id="signupFirstName" minLength="2" required placeholder=" " />
                <label htmlFor="signupFirstName">Nombre</label>
                <span className="input__bar"></span>
              </div>
              <div className="input">
                <input type="text" name="lastName" id="signupLastName" minLength="2" required placeholder=" " />
                <label htmlFor="signupLastName">Apellido</label>
                <span className="input__bar"></span>
              </div>
              <div className="input">
                <input type="email" name="email" id="signupEmail" required placeholder=" " />
                <label htmlFor="signupEmail">Correo</label>
                <span className="input__bar"></span>
              </div>
              <div className="input">
                <input type="tel" name="phone" id="signupPhone" pattern="[0-9]{7,15}" required placeholder=" " />
                <label htmlFor="signupPhone">Teléfono</label>
                <span className="input__bar"></span>
              </div>

              {/* ... Campos Contraseña y Confirmar Contraseña ... */}
              <div className="input">
                <input type="password" name="password" id="signupPassword" minLength="6" required placeholder=" " />
                <label htmlFor="signupPassword">Contraseña (mín. 6)</label>
                <span className="input__bar"></span>
                <button
                  className="input__toggle"
                  type="button"
                  aria-label="Mostrar/ocultar contraseña"
                ></button>
              </div>
              <div className="input">
                <input type="password" name="confirm" id="signupConfirm" minLength="6" required placeholder=" " />
                <label htmlFor="signupConfirm">Confirmar contraseña</label>
                <span className="input__bar"></span>
                <button
                  className="input__toggle"
                  type="button"
                  aria-label="Mostrar/ocultar contraseña"
                ></button>
              </div>

              {/* Selector de Rol - Añadido el manejo de estado */}
              <div className="input">
                <select id="signupRole" name="role" required value={selectedRole} onChange={handleRoleChange}>
                  <option value="" disabled>Selecciona un rol</option> {/* Añadido disabled para forzar la selección */}
                  <option value="cliente">Cliente</option>
                  <option value="desarrollador">Desarrollador</option>
                </select>
                <label htmlFor="signupRole">Rol</label>
                <span className="input__bar"></span>
              </div>

              {/* Campo Cargo - Uso de estilo condicional en base al estado */}
              {selectedRole === "desarrollador" && (
                <div className="input" id="cargoField">
                  <input type="text" name="cargo" id="signupCargo" minLength="2" placeholder=" " required={selectedRole === "desarrollador"} /> {/* hacerlo requerido solo si es desarrollador */}
                  <label htmlFor="signupCargo">Cargo</label>
                  <span className="input__bar"></span>
                </div>
              )}
               {/* Si el rol no es desarrollador, se renderiza un div vacío para mantener el grid, si es necesario, pero lo mejor es simplemente no renderizarlo y dejar que el grid se autoajuste. El CSS anterior ya maneja esto. */}

            </div>

            <button className="btn" type="submit">
              Registrarme
            </button>

            <p className="form__switch">
              ¿Ya tienes cuenta?{" "}
              <button
                className="link link--btn"
                type="button"
                onClick={() => setIsSignup(false)}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>

        {/* ... (Tu Panel deslizante está bien) ... */}
        <div className="auth__panel">
          <div className="panel__inner panel__inner--login">
            <h3>¡Bienvenido!</h3>
            <p>Ingresa con tus datos y vuelve a lo que estabas haciendo.</p>
            <button
              className="btn btn--outline"
              type="button"
              onClick={() => setIsSignup(false)}
            >
              Iniciar sesión
            </button>
          </div>
          <div className="panel__inner panel__inner--signup">
            <h3>¿Nuevo por aquí?</h3>
            <p>Crea una cuenta para disfrutar de todas las funciones.</p>
            <button
              className="btn btn--outline"
              type="button"
              onClick={() => setIsSignup(true)}
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;