document.addEventListener('DOMContentLoaded', function () {
  var raiz = document.documentElement;
  var boton = document.getElementById('btnTema');
  var icono = document.getElementById('iconoTema');
  var texto = document.getElementById('textoTema');

  if (!boton) {
    console.error('No se encontró el botón con id="btnTema"');
    return;
  }

  function actualizarBoton(tema) {
    var esOscuro = tema === 'dark';
    if (icono) icono.textContent = esOscuro ? '☀' : '☾';
    if (texto) texto.textContent = esOscuro ? 'Tema claro' : 'Tema oscuro';
    boton.setAttribute('aria-label', esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    boton.setAttribute('aria-pressed', String(esOscuro));
  }

  function aplicarTema(tema) {
    raiz.setAttribute('data-bs-theme', tema);
    actualizarBoton(tema);
    try {
      localStorage.setItem('tema', tema);
    } catch (e) {
      console.warn('LocalStorage no disponible');
    }
  }

  // 1. Obtener tema inicial
  var temaInicial = 'light';
  try {
    temaInicial = localStorage.getItem('tema');
  } catch (e) {}

  if (!temaInicial) {
    temaInicial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  aplicarTema(temaInicial);

  // 2. Evento Click para alternar
  boton.addEventListener('click', function (e) {
    e.preventDefault();
    var temaActual = raiz.getAttribute('data-bs-theme') || 'light';
    var nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevoTema);
  });

  // 3. Listener para cambio en el sistema operativo
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var guardado = null;
    try { guardado = localStorage.getItem('tema'); } catch (err) {}
    if (!guardado) {
      aplicarTema(e.matches ? 'dark' : 'light');
    }
  });

  // 4. Cerrar menú móvil al hacer clic en un enlace
  var menu = document.getElementById('menu');
  if (menu && typeof bootstrap !== 'undefined') {
    document.querySelectorAll('#menu .nav-link').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        if (menu.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  // 5. Año del footer
  var elAnio = document.getElementById('anio');
  if (elAnio) elAnio.textContent = new Date().getFullYear();
});