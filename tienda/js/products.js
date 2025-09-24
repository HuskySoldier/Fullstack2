// Render products in home, products page, and detail

function renderHomePlans(){
  const grid = document.getElementById('planes-grid'); 
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <h3>${p.nombre}</h3>
      <p class="price">${CLP(p.precio)}</p>
      <ul class="features">${p.features.map(f=>`<li>• ${f}</li>`).join('')}</ul>
      <div class="actions">
        <button class="btn primary" onclick="addToCart('${p.id}')">Agregar</button>
        <a class="btn subtle" href="pages/detalle.html?id=${p.id}">Ver detalle</a>
      </div>
    </article>`).join('');
}

function renderProductsPage(){
  const grid = document.getElementById('productos-grid'); 
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <h3>${p.nombre}</h3>
      <p class="price">${CLP(p.precio)}</p>
      <div class="actions">
        <button class="btn primary" onclick="addToCart('${p.id}')">Añadir</button>
        <a class="btn subtle" href="detalle.html?id=${p.id}">Detalle</a>
      </div>
    </article>`).join('');
}

function renderDetailPage(){
  const wrap = document.getElementById('prod-detail'); 
  if(!wrap) return;
  const sp = new URLSearchParams(location.search);
  const id = sp.get('id');
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ 
    wrap.innerHTML='<p>Producto no encontrado</p>'; 
    return; 
  }
  document.getElementById('prod-title').textContent = p.nombre;
  wrap.innerHTML = `
    <p class="price">${CLP(p.precio)}</p>
    <ul class="features">${p.features.map(f=>`<li>• ${f}</li>`).join('')}</ul>
    <div class="actions"><button class="btn primary" onclick="addToCart('${p.id}')">Añadir al carrito</button></div>`;
}
