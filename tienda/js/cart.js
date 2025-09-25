// ----------------- Carrito -----------------
const CART_KEY = "cart";
const ORDER_KEY = "orders";

// Añadir producto al carrito
function addToCart(id){
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) {
    showModal({ title: "Error", body: "Producto no encontrado" });
    return;
  }

  let item = cart.find(x => x.id === id);
  if(item){
    item.qty += 1;
  } else {
    cart.push({id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1});
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  showModal({
    title: "Producto agregado",
    body: `<p>Se agregó <strong>${prod.nombre}</strong> al carrito.</p>`,
    actions: [
      { label: "Seguir comprando" },
      { label: "Ver carrito", primary: true, handler: ()=>{ location.href="carrito.html"; } }
    ]
  });
}

// Mostrar carrito en la página carrito.html
function renderCart(){
  const cont = document.getElementById("cart-list");
  const totalEl = document.getElementById("cart-total");
  if(!cont || !totalEl) return;

  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
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
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

// Vaciar carrito
function clearCart(){
  localStorage.removeItem(CART_KEY);
  renderCart();
}

// Confirmar compra (checkout simulado con orden)
function checkout(){
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  if(cart.length === 0){
    showModal({ title: "Carrito vacío", body: "<p>No tienes productos en el carrito.</p>" });
    return;
  }

  // Calcular total
  let total = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);

  // Crear orden
  const orderId = "ORD-" + new Date().toISOString().replace(/[-:.TZ]/g,"").slice(0,14);
  const session = JSON.parse(localStorage.getItem("session_user") || "null");
  const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");

  orders.push({
    id: orderId,
    date: new Date().toISOString(),
    items: cart,
    total,
    user: session ? session.email : null
  });

  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));

  // Vaciar carrito
  localStorage.removeItem(CART_KEY);
  renderCart();

  // Mostrar comprobante
  showModal({
    title: " Compra realizada",
    body: `
      <p>Número de orden: <strong>${orderId}</strong></p>
      <p>Total pagado: <strong>${CLP(total)}</strong></p>
      <p>${session ? `Se enviará comprobante a <strong>${session.email}</strong>` : "Puedes registrarte para guardar tus compras."}</p>
    `,
    actions: [{ label: "Aceptar", primary: true }]
  });
}


