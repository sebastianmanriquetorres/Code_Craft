// Capturamos los elementos
const formCodigo = document.getElementById("formCodigo");
const inputCodigo = document.getElementById("codigo");
const btnReenviar = document.getElementById("reenviar");
const btnSMS = document.getElementById("sms");

// Validación simple del código
formCodigo.addEventListener("submit", function(e) {
  e.preventDefault();
  const codigo = inputCodigo.value.trim();

  if (codigo.length === 6) {
    alert("✅ Código verificado correctamente");
  } else {
    alert("❌ El código debe tener 6 dígitos");
  }
});

// Acción al hacer clic en "Reenviar código"
btnReenviar.addEventListener("click", function() {
  alert("📩 Se ha reenviado el código a tu correo.");
});

// Acción al hacer clic en "Mandar por SMS"
btnSMS.addEventListener("click", function() {
  alert("📱 El código se ha enviado por SMS.");
});
