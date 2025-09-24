(function(){
  const users  = JSON.parse(localStorage.getItem('users') || '[]');
  const prods  = JSON.parse(localStorage.getItem('admin_products') || '[]'); // si usas otra clave, cámbiala
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const el = id => document.getElementById(id);
  el('kpi-users') && (el('kpi-users').textContent = users.length);
  el('kpi-prod')  && (el('kpi-prod').textContent  = prods.length);
  el('kpi-orders')&& (el('kpi-orders').textContent= orders.length);
  const total = orders.reduce((s,o)=> s+ (o.total||0), 0);
  el('kpi-rev')   && (el('kpi-rev').textContent   = total.toLocaleString('es-CL',{style:'currency',currency:'CLP'}));

  // Agrupar por día
  const byDay = {};
  orders.forEach(o=>{
    const d = (o.date||'').slice(0,10); // YYYY-MM-DD
    byDay[d] = (byDay[d]||0) + (o.total||0);
  });
  const labels = Object.keys(byDay).sort();
  const data   = labels.map(k=> byDay[k]);

  const ctx = document.getElementById('chart-sales');
  if(ctx && labels.length){
    new Chart(ctx, {
      type:'line',
      data:{ labels, datasets:[{ label:'Ventas (CLP)', data, tension:.2, fill:false }]},
      options:{ plugins:{legend:{display:true}}, scales:{ y:{ ticks:{ callback:v=> v.toLocaleString('es-CL')} } } }
    });
  }
})();
