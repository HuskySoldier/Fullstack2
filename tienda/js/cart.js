// ----------------- Carrito -----------------

// Añadir producto al carrito
function addToCart(id){
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) return alert("Producto no encontrado");

  let item = cart.find(x => x.id === id);
  if(item){
    item.qty += 1;
  } else {
    cart.push({id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1});
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Se agregó "${prod.nombre}" al carrito`);
}

// Mostrar carrito en la página carrito.html
function renderCart(){
  const cont = document.getElementById("cart-list");
  const totalEl = document.getElementById("cart-total");

  if(!cont || !totalEl) return;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if(cart.length === 0){
    cont.innerHTML = "<p>Carrito vacío</p>";
    totalEl.textContent = "Total: $0";
    return;
  }

  let total = 0;
  cont.innerHTML = cart.map(item => {
    const subtotal = item.precio * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <span>${item.nombre}</span>
        <span>${item.qty} x ${CLP(item.precio)}</span>
        <span>${CLP(subtotal)}</span>
        <button onclick="removeFromCart('${item.id}')">❌</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = "Total: " + CLP(total);
}

// Eliminar producto del carrito
function removeFromCart(id){
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Vaciar carrito
function clearCart(){
  localStorage.removeItem("cart");
  renderCart();
}

// Confirmar compra (checkout simulado)
function checkout(){
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if(cart.length === 0){
    alert("Tu carrito está vacío");
    return;
  }

  // Calcular total
  let total = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);

  // Simulación de pago
  alert(`Compra realizada con éxito.\nTotal pagado: ${CLP(total)}\n¡Gracias por preferir GymTastic!`);

  // Vaciar carrito
  localStorage.removeItem("cart");

  // Refrescar vista
  renderCart();
}


