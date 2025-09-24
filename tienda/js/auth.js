// Helper para resolver la ruta correcta del index según la ubicación
function resolveTiendaIndex(){
  const p = location.pathname.replace(/\\/g,'/');
  if (p.includes('/tienda/pages/')) return '../index.html';
  if (p.includes('/tienda/')) return 'index.html';
  return '/tienda/index.html';
}

// ----------------- Registro -----------------
function registerUser(){
  const nombre = document.getElementById("reg-nombre").value.trim();
  const email  = document.getElementById("reg-email").value.trim();
  const pass   = document.getElementById("reg-pass").value.trim();

  // Validaciones
  if(nombre.length < 3){ 
    alert("El nombre debe tener al menos 3 caracteres"); 
    return false; 
  }
  if(!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)){ 
    alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com"); 
    return false; 
  }
  if(pass.length < 4 || pass.length > 10){ 
    alert("La contraseña debe tener entre 4 y 10 caracteres"); 
    return false; 
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  // Evitar duplicados
  if(users.find(u => u.email === email)){
    alert("Ya existe un usuario registrado con este correo");
    return false;
  }

  // Guardar usuario con estructura completa
  users.push({
    run: "",
    nombre,
    apellidos: "",
    email,
    pass,
    fnac: "",
    rol: "Cliente",   // 👈 clave para el header dinámico y admin
    region: "",
    comuna: "",
    dir: ""
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
  window.location.href = "login.html"; // redirige desde /tienda/pages/
  return false;
}

// ----------------- Login -----------------
function loginUser(){
  const email = document.getElementById("log-email").value.trim();
  const pass  = document.getElementById("log-pass").value.trim();

  // Validaciones
  if(!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)){ 
    alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com"); 
    return false; 
  }
  if(pass.length < 4 || pass.length > 10){ 
    alert("Contraseña inválida"); 
    return false; 
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let user = users.find(u => u.email === email && u.pass === pass);

  if(!user){
    alert("❌ Usuario o contraseña incorrectos");
    return false;
  }

  // Guardar sesión
  localStorage.setItem("session_user", JSON.stringify(user));

  alert(`Bienvenido ${user.nombre}`);
  window.location.href = "../index.html"; // desde /tienda/pages/login.html
  return false;
}

// ----------------- Cerrar sesión -----------------
function logoutUser(){
  localStorage.removeItem("session_user");
  alert("Sesión cerrada");
  location.href = resolveTiendaIndex();
}

// ----------------- Header dinámico -----------------
function updateHeader(){
  const nav = document.querySelector('.header .nav');
  if(!nav) return;

  // ¿desde /tienda/pages/ o desde /tienda/ ?
  const inPages = location.pathname.includes('/tienda/pages/');
  const adminHref = inPages ? '../../admin/index.html' : '../admin/index.html';

  // Usuario en sesión
  const session = JSON.parse(localStorage.getItem('session_user') || 'null');

  // Limpiar estados previos
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

// ----------------- Conectar formularios -----------------
document.addEventListener("DOMContentLoaded", ()=>{
  const fReg = document.getElementById("form-registro");
  if(fReg){
    fReg.addEventListener("submit", e=>{
      e.preventDefault();
      registerUser();
    });
  }

  const fLog = document.getElementById("form-login");
  if(fLog){
    fLog.addEventListener("submit", e=>{
      e.preventDefault();
      loginUser();
    });
  }

  // Actualizar header en todas las páginas
  updateHeader();
});

// Semilla de usuario Admin si no existe
(function seedAdmin(){
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if(!users.find(u => u.email === "admin@duoc.cl")){
    users.push({
      run: "12345678K",
      nombre: "Admin",
      apellidos: "Principal",
      email: "admin@duoc.cl",
      pass: "1234",
      fnac: "",
      rol: "Administrador",
      region: "",
      comuna: "",
      dir: ""
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
})();

