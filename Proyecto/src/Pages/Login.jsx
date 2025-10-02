import React, { useState } from "react";
import "../styles/login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false,
  });

  const [role, setRole] = useState(""); // rol seleccionado
  const [customRole, setCustomRole] = useState(""); // si elige "Otro"
  const [devType, setDevType] = useState(""); // si elige "Desarrollador"

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const switchToSignup = () => setIsSignup(true);
  const switchToLogin = () => setIsSignup(false);

  return (
    <main className="auth">
      <div className={`auth__card ${isSignup ? "is-signup" : "is-login"}`}>
        {/* Columna izquierda: formularios */}
        <div className="auth__forms">
          {/* LOGIN */}
          {!isSignup && (
            <form id="form-login" className="form form--login">
              <h2 className="form__title">Iniciar sesión</h2>

              <div className="input">
                <input type="email" name="email" placeholder=" " required />
                <label>Correo</label>
              </div>

              <div className="input">
                <input
                  type={showPassword.login ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  required
                />
                <label>Contraseña</label>
                <button
                  className="input__toggle"
                  type="button"
                  onClick={() => togglePassword("login")}
                >
                  {showPassword.login ? "🙈" : "👁️"}
                </button>
              </div>

              <button className="btn" type="submit">Entrar</button>

              <p className="form__switch">
                ¿No tienes cuenta?{" "}
                <button
                  className="link link--btn"
                  type="button"
                  onClick={switchToSignup}
                >
                  Crear cuenta
                </button>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {isSignup && (
            <form id="form-register" className="form form--signup">
              <h2 className="form__title">Crear cuenta</h2>

              <div className="form__grid">
                <div className="input">
                  <input type="text" name="firstName" placeholder=" " required />
                  <label>Nombre</label>
                </div>
                <div className="input">
                  <input type="text" name="lastName" placeholder=" " required />
                  <label>Apellido</label>
                </div>
                <div className="input">
                  <input type="email" name="email" placeholder=" " required />
                  <label>Correo</label>
                </div>
                <div className="input">
                  <input type="tel" name="phone" placeholder=" " required />
                  <label>Teléfono</label>
                </div>

                {/* CAMPO ROL */}
                <div className="input">
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>Selecciona un rol</option>
                    <option value="cliente">Cliente</option>
                    <option value="desarrollador">Desarrollador</option>
                    <option value="otro">Otro</option>
                  </select>
                  <label>Rol</label>
                </div>

                {/* Si es desarrollador */}
                {role === "desarrollador" && (
                  <div className="input">
                    <select
                      name="devType"
                      value={devType}
                      onChange={(e) => setDevType(e.target.value)}
                      required
                    >
                      <option value="">Tipo de desarrollador</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="fullstack">FullStack</option>
                      <option value="movil">Móvil</option>
                      <option value="otro">Otro</option>
                    </select>
                    <label>Especialidad</label>
                  </div>
                )}

                {/* Si elige otro rol */}
                {role === "otro" && (
                  <div className="input">
                    <input
                      type="text"
                      name="customRole"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label>Escribe tu rol</label>
                  </div>
                )}

                <div className="input">
                  <input
                    type={showPassword.signup ? "text" : "password"}
                    name="password"
                    placeholder=" "
                    required
                  />
                  <label>Contraseña</label>
                  <button
                    className="input__toggle"
                    type="button"
                    onClick={() => togglePassword("signup")}
                  >
                    {showPassword.signup ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="input">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirm"
                    placeholder=" "
                    required
                  />
                  <label>Confirmar contraseña</label>
                  <button
                    className="input__toggle"
                    type="button"
                    onClick={() => togglePassword("confirm")}
                  >
                    {showPassword.confirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button className="btn" type="submit">Registrarme</button>

              <p className="form__switch">
                ¿Ya tienes cuenta?{" "}
                <button
                  className="link link--btn"
                  type="button"
                  onClick={switchToLogin}
                >
                  Inicia sesión
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Columna derecha: panel */}
        <div className="auth__panel">
          {!isSignup ? (
            <div className="panel__inner active">
              {/* LOGO */}
              <img src="../../public/bombillo-medio.png" alt="Logo" className="panel__logo" />
              <h3>¡Bienvenido!</h3>
              <p>Ingresa con tus datos y vuelve a lo que estabas haciendo.</p>
            </div>
          ) : (
            <div className="panel__inner active">
              {/* LOGO */}
              <img src="../../public/bombillo-medio.png" alt="Logo" className="panel__logo" />
              <h3>¿Nuevo por aquí?</h3>
              <p>Crea una cuenta para disfrutar de todas las funciones.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
