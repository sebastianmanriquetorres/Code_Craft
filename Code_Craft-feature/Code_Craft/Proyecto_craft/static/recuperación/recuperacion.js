document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form1");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Formulario enviado correctamente ✅");
  });
});
