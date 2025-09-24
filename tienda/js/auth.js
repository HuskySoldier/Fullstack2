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
  if(!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)){ 
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

  // Guardar usuario con estructura completa (aunque algunos campos vacíos)
  users.push({
    run: "", 
    nombre, 
    apellidos: "", 
    email, 
    pass, 
    fnac: "", 
    rol: "Cliente", 
    region: "", 
    comuna: "", 
    dir: ""
  });

  // Guardar usuario
  users.push({ nombre, email, pass });
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
  window.location.href = "login.html";
  return false;
}

// ----------------- Login -----------------
function loginUser(){
  const email = document.getElementById("log-email").value.trim();
  const pass  = document.getElementById("log-pass").value.trim();

  // Validaciones
  if(!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)){ 
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
  window.location.href = "../index.html";
  return false;
}

// ----------------- Cerrar sesión -----------------
function logoutUser(){
  localStorage.removeItem("session_user");
  alert("Sesión cerrada");
  window.location.href = "../index.html";
}
