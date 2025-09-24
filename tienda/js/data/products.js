// products.js en la tienda — ahora lee de admin_products en localStorage

function getProducts(){
  // Lee productos guardados en Admin (clave: admin_products)
  const saved = JSON.parse(localStorage.getItem("admin_products") || "[]");

  // Si no hay nada en Admin, usar productos base por defecto
  if(saved.length === 0){
    return [
      {id:'m1', nombre:'Mensual', precio:19990, features:['Acceso 24/7','Clases básicas','App y progreso']},
      {id:'t3', nombre:'Trimestral', precio:54990, features:['Todo Mensual','1 evaluación física','Invita a un amigo 1/mes']},
      {id:'a12', nombre:'Anual', precio:199990, features:['Todo Trimestral','2 evaluaciones físicas','Polera GymTastic']},
    ];
  }

  // Normalizamos productos creados en Admin → para que tengan las mismas propiedades
  return saved.map(p => ({
    id: p.codigo,
    nombre: p.nombre,
    precio: parseFloat(p.precio),
    features: p.desc ? [p.desc] : ["Plan personalizado"]
  }));
}

// Exponer los productos como constante para que otras funciones los usen
const PRODUCTS = getProducts();

