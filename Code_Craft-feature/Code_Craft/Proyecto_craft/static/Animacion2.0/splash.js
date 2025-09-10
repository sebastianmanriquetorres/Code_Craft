document.addEventListener('DOMContentLoaded', function(){
  var bombillo = document.getElementById('bombillo');
  var texto = document.getElementById('texto');
  var splash = document.getElementById('splash');

  setTimeout(function(){
    bombillo.style.opacity = '1';
    bombillo.style.transform = 'scale(1.9)';
    bombillo.src = '../Animacion2.0/bombillo-medio.png';
  }, 100);

  setTimeout(function(){
    bombillo.src = '../Animacion2.0/bombillo-encendido.jpeg';
    bombillo.style.transform = 'scale(1.2)';
  }, 2500);

  setTimeout(function(){
    texto.style.opacity = '1';
    texto.style.animation = 'escribirYBorrar 6s steps(13) forwards';
  }, 3000);

  setTimeout(function(){
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(function(){
      splash.remove();
    }, 600);
  }, 9000);
});
