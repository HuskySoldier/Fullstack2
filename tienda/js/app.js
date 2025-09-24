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
});
