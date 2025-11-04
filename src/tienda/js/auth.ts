// src/tienda/js/auth.ts

// --- 1. Importaciones ---
import { $ } from './utils/dom'; // Importamos nuestro selector $
import { User, SessionUser } from './types'; // Importamos los tipos
// Asumo que 'showModal' está en globals.d.ts o se importará
// import { showModal } from './utils/modal'; 

// --- 2. Funciones Exportadas (las que usa app.ts) ---

/**
 * Conecta los listeners de los formularios de login/registro
 * y ejecuta la semilla del admin.
 */
export function initAuth(): void {
  // Conectar formularios (lógica que estaba en DOMContentLoaded)
  const fReg = $<HTMLFormElement>("#form-registro");
  if (fReg) {
    fReg.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      registerUser();
    });
  }

  const fLog = $<HTMLFormElement>("#form-login");
  if (fLog) {
    fLog.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      loginUser();
    });
  }
  
  // Ejecutar la semilla de admin
  seedAdmin();
}

/**
 * Cierra la sesión del usuario y recarga la página.
 */
export function logoutUser(): void {
  localStorage.removeItem('session_user');
  location.href = resolveTiendaIndex(); // Usamos el helper para ir al index
}


// --- 3. Funciones Internas (NO se exportan) ---

// Helper para resolver la ruta correcta del index según la ubicación
function resolveTiendaIndex(): string {
  const p = location.pathname.replace(/\\/g,'/');
  if (p.includes('/tienda/pages/')) return '../index.html';
  if (p.includes('/tienda/')) return 'index.html';
  return '/tienda/index.html';
}

// ----------------- Registro -----------------
function registerUser(): void { // <-- Cambiado a 'void'
  // --- ¡ARREGLO! Se usa $<HTMLInputElement> para acceder a .value ---
  const nombreInput = $<HTMLInputElement>("#reg-nombre");
  const emailInput = $<HTMLInputElement>("#reg-email");
  const passInput = $<HTMLInputElement>("#reg-pass");

  // Validamos que los inputs existan
  if (!nombreInput || !emailInput || !passInput) return;

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  // Validaciones (TODO: Reemplazar 'alert' por 'showModal')
  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres");
    return; // <-- Cambiado de 'return false'
  }
  if (!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)) {
    alert("Correo inválido. Solo se permiten @duoc.cl, @profesor\.duoc\.cl o @gmail.com");
    return;
  }
  if (pass.length < 4 || pass.length > 10) {
    alert("La contraseña debe tener entre 4 y 10 caracteres");
    return;
  }

  // Tipamos el array de usuarios
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  // Evitar duplicados
  if (users.find((u: User) => u.email === email)) {
    alert("Ya existe un usuario registrado con este correo");
    return;
  }

  // Guardar usuario (TypeScript valida que 'rol' sea uno de los valores permitidos)
  users.push({
    run: "",
    nombre,
    apellidos: "",
    email,
    pass,
    fnac: "",
    rol: "Cliente", // por defecto
    region: "",
    comuna: "",
    dir: ""
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registro exitoso. Ahora puedes iniciar sesión.");
  window.location.href = "login.html"; // redirige desde /tienda/pages/
}

// ----------------- Login -----------------
function loginUser(): void { // <-- Cambiado a 'void'
  // --- ¡ARREGLO! Se usa $<HTMLInputElement> para acceder a .value ---
  const emailInput = $<HTMLInputElement>("#log-email");
  const passInput = $<HTMLInputElement>("#log-pass");
  
  if (!emailInput || !passInput) return;

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  // Validaciones
  if (!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)) {
    alert("Correo inválido. Solo se permiten @duoc.cl, @profesor\.duoc\.cl o @gmail.com");
    return;
  }
  if (pass.length < 4 || pass.length > 10) {
    alert("Contraseña inválida");
    return;
  }

  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  // Tipamos 'user'
  const user = users.find((u: User) => u.email === email && u.pass === pass);

  if (!user) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  // Guardar sesión (TypeScript comprueba que 'user' cumpla con SessionUser)
  // (Asumiendo que SessionUser y User son compatibles)
  localStorage.setItem("session_user", JSON.stringify(user));

  alert(`Bienvenido ${user.nombre}`);
  window.location.href = "../index.html"; // desde /tienda/pages/login.html
}


// --- 4. Lógica de Inicialización (Semilla) ---

/**
 * Semilla de usuario Admin si no existe
 */
function seedAdmin(): void {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  
  if (!users.find((u: User) => u.email === "admin@duoc.cl")) {
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
}

