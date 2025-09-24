// Init
window.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  renderHomePlans();
  renderProductsPage();
  renderDetailPage();
  renderBlogsList();
  renderBlogDetail();
  renderCartPage();
  initAuth();
  // ---- Header dinámico (déjalo FUERA del DOMContentLoaded)
function updateHeader(){
  const nav = document.querySelector('.header .nav');
  if(!nav) return;

  // ¿desde /tienda/pages/ o desde /tienda/ ?
  const inPages = location.pathname.includes('/tienda/pages/');
  const adminHref = inPages ? '../../admin/index.html' : '../admin/index.html';

  // Sesión
  const session = JSON.parse(localStorage.getItem('session_user') || 'null');

  // Limpia restos anteriores
  nav.querySelectorAll('[data-dyn]').forEach(el => el.remove());

  if(session){
    // Saludo
    const hello = document.createElement('span');
    hello.className = 'badge';
    hello.textContent = `Hola, ${session.nombre || 'Usuario'}`;
    hello.setAttribute('data-dyn','1');
    nav.appendChild(hello);

    // Link Admin (solo Admin/Vendedor)
    if(session.rol === 'Administrador' || session.rol === 'Vendedor'){
      const aAdmin = document.createElement('a');
      aAdmin.href = adminHref;
      aAdmin.textContent = 'Admin';
      aAdmin.setAttribute('data-dyn','1');
      nav.appendChild(aAdmin);
    }

    // Cerrar sesión
    const aOut = document.createElement('a');
    aOut.href = '#';
    aOut.textContent = 'Cerrar sesión';
    aOut.onclick = (e)=>{ e.preventDefault(); logoutUser(); };
    aOut.setAttribute('data-dyn','1');
    nav.appendChild(aOut);

    // Ocultar Registro/Login
    nav.querySelectorAll('a').forEach(a=>{
      if(/registro\.html|login\.html/i.test(a.getAttribute('href')||'')){
        a.style.display = 'none';
      }
    });
  }
}

// ---- Init (deja SOLO este listener)
window.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // Llama solo si la función existe, para no romper en páginas donde no aplica
  const call = name => (typeof window[name] === 'function') && window[name]();

  call('renderHomePlans');
  call('renderProductsPage');
  call('renderDetailPage');
  call('renderBlogsList');
  call('renderBlogDetail');

  // OJO: tu cart.js define renderCart(), no renderCartPage()
  call('renderCart'); // <--- este sí existe

  call('initAuth');

  // Ahora sí, actualiza el header
  updateHeader();
});
  // Llamar en el DOMContentLoaded (ya existía tu listener)
});
