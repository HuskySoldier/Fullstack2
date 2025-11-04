// src/tienda/js/products.ts
// Lógica para RENDERIZAR productos en las páginas

// 1. Importaciones
import { $ } from './utils/dom';
import { Product } from './types';
import { PRODUCTS } from './data/products'; // Importa la data
import { addToCart } from './cart';         // Importa la acción del carrito
import { CLP } from './utils/format';       // Importa el formateador de moneda




// --- Renderizado de Planes en el Home ---
// (app.ts la importa y la llama)
export function renderHomePlans(): void {
  // Asumo que tu contenedor en index.html tiene este ID
  const cont = $<HTMLDivElement>('#home-plans-container'); 
  if (!cont) return;

  // Filtramos solo los planes
  const planIds = ['m1', 't3', 'a12'];
  const planes = PRODUCTS.filter(p => planIds.includes(p.id));

  cont.innerHTML = planes.map((plan: Product) => `
    <article class="plan-card"> <img src="assets/${plan.img}" alt="${plan.nombre}">
      <h3>${plan.nombre}</h3>
      <p class="precio">${CLP(plan.precio)}</p>
      <ul>
        ${plan.features.map(f => `<li>✅ ${f}</li>`).join("")}
      </ul>
      <a href="pages/detalle.html?id=${plan.id}" class="btn">Ver más</a>
    </article>
  `).join("");
}

// --- Renderizado de Página de Productos (Accesorios) ---
// (app.ts la importa y la llama)
export function renderProductsPage(): void {
  // Asumo que tu contenedor en productos.html tiene este ID
  const cont = $<HTMLDivElement>('#products-container'); 
  if (!cont) return;
  
  // Filtramos solo los accesorios
  const accesorios = PRODUCTS.filter(p => p.id.startsWith('acc'));

  cont.innerHTML = accesorios.map((prod: Product) => `
    <article class="card">
      <img src="../assets/${prod.img}" alt="${prod.nombre}" class="prod-img">
      <h3>${prod.nombre}</h3>
      <p class="precio">${CLP(prod.precio)}</p>
      <button class="btn btn-add-cart" data-id="${prod.id}">Añadir al carrito</button>
    </article>
  `).join("");

  // Delegado de eventos para los botones "Añadir al carrito"
  // (Un solo listener en el contenedor padre)
  if (!cont.dataset.cartListener) {
    cont.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>('.btn-add-cart');
      
      if (btn) {
        const id = btn.dataset.id;
        if (id) {
          addToCart(id); // Llama a la función importada de cart.ts
        }
      }
    });
    cont.dataset.cartListener = 'true';
  }
}

// --- Renderizado de Página de Detalle ---
// (app.ts la importa y la llama)
export function renderDetailPage(): void {
  // Asumo que tu contenedor en detalle.html tiene este ID
  const cont = $<HTMLDivElement>('#detail-container'); 
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const prod = PRODUCTS.find((x: Product) => x.id === id);

  if (!prod) {
    cont.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  cont.innerHTML = `
    <div class="detalle-producto">
      <img src="../assets/${prod.img}" alt="${prod.nombre}">
      <div class="detalle-info">
        <h2>${prod.nombre}</h2>
        <p class="precio">${CLP(prod.precio)}</p>
        <p><strong>Características:</strong></p>
        <ul>
          ${prod.features.map(f => `<li>${f}</li>`).join("")}
        </ul>
        <button class="btn btn-add-cart" data-id="${prod.id}">Añadir al carrito</button>
      </div>
    </div>
  `;

  // Listener para el botón único en esta página
  const btn = $<HTMLButtonElement>('.btn-add-cart', cont);
  if (btn) {
    btn.addEventListener('click', () => {
      addToCart(prod.id); // Llama a la función importada de cart.ts
    });
  }
}