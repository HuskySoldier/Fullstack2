// src/tienda/js/cart.ts

// --- ¡¡AQUÍ ESTÁN LAS CORRECCIONES!! ---
import { $, $$ } from './utils/dom';
import { Product, CartItem, Order, SessionUser } from './types';
import { PRODUCTS } from './data/products'; // <--- IMPORTACIÓN REQUERIDA
import { CLP } from './utils/format';      // <--- IMPORTACIÓN REQUERIDA
// import { showModal } from './utils/modal'; // (Sigue pendiente)
// --- ---

const CART_KEY = "cart";
const ORDER_KEY = "orders";

// Helper para obtener el carrito tipado
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

// Helper para guardar el carrito
function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// 3. Exportar funciones

// Añadir producto al carrito
export function addToCart(id: string): void {
  let cart = getCart();
  const prod = PRODUCTS.find((p: Product) => p.id === id);
  
  if (!prod) {
    showModal({ title: "Error", body: "Producto no encontrado" });
    return;
  }

  const item = cart.find((x: CartItem) => x.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1 });
  }

  saveCart(cart);

  showModal({
    title: "Producto agregado",
    body: `<p>Se agregó <strong>${prod.nombre}</strong> al carrito.</p>`,
    actions: [
      { label: "Seguir comprando" },
      { label: "Ver carrito", primary: true, handler: () => { location.href = "carrito.html"; } }
    ]
  });
}

// Mostrar carrito en la página carrito.html
export function renderCart(): void {
  const cont = $<HTMLDivElement>("#cart-list");
  const totalEl = $<HTMLSpanElement>("#cart-total");
  if (!cont || !totalEl) return;

  // --- Manejador de eventos (Delegación) ---
  // Se añade solo una vez al contenedor padre
  if (!cont.dataset.cartListener) {
    cont.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      // Busca el botón .remove-btn más cercano
      const removeBtn = target.closest<HTMLButtonElement>('.remove-btn');
      if (removeBtn) {
        const id = removeBtn.dataset.id;
        if (id) {
          removeFromCart(id);
        }
      }
    });
    cont.dataset.cartListener = 'true';
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    cont.innerHTML = "<p>Carrito vacío</p>";
    totalEl.textContent = "Total: $0";
    return;
  }

  let total = 0;
  cont.innerHTML = cart.map((item: CartItem) => {
    const subtotal = item.precio * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <span>${item.nombre}</span>
        <span>${item.qty} x ${CLP(item.precio)}</span>
        <span>${CLP(subtotal)}</span>
        <button class="remove-btn" data-id="${item.id}" title="Eliminar">❌</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = "Total: " + CLP(total);
}

// Eliminar producto del carrito (ahora llamada por el delegado de eventos)
export function removeFromCart(id: string): void {
  let cart = getCart();
  cart = cart.filter((item: CartItem) => item.id !== id);
  saveCart(cart);
  renderCart(); // Volver a renderizar la lista
}

// Vaciar carrito
export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

// Confirmar compra (checkout simulado con orden)
export function checkout(): void {
  const cart = getCart();
  if (cart.length === 0) {
    showModal({ title: "Carrito vacío", body: "<p>No tienes productos en el carrito.</p>" });
    return;
  }

  // Calcular total
  const total = cart.reduce((acc: number, item: CartItem) => acc + (item.precio * item.qty), 0);

  // Crear orden
  const orderId = "ORD-" + new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const session = JSON.parse(localStorage.getItem("session_user") || "null") as SessionUser | null;
  const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]") as Order[];

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
    title: "Compra realizada",
    body: `
      <p>Número de orden: <strong>${orderId}</strong></p>
      <p>Total pagado: <strong>${CLP(total)}</strong></p>
      <p>${session ? `Se enviará comprobante a <strong>${session.email}</strong>` : "Puedes registrarte para guardar tus compras."}</p>
    `,
    actions: [{ label: "Aceptar", primary: true }]
  });
}