function getProducts(){
  const saved = JSON.parse(localStorage.getItem("PRODUCTS") || "[]");

  if(saved.length === 0){
    return [
      {
        id:'m1',
        nombre:'Mensual',
        precio:19990,
        features:['Acceso 24/7','Clases básicas','App y progreso'],
        img:'plan_mensual.png'
      },
      {
        id:'t3',
        nombre:'Trimestral',
        precio:54990,
        features:['Todo Mensual','1 evaluación física','Invita a un amigo 1/mes'],
        img:'plan-trimestral.png'
      },
      {
        id:'a12',
        nombre:'Anual',
        precio:199990,
        features:['Todo Trimestral','2 evaluaciones físicas','Polera GymTastic'],
        img:'plan-anual.png'
      },
      {
        id:'acc1',
        nombre:'Botella GymTastic',
        precio:5990,
        features:['Botella plástica 750ml','Logo oficial'],
        img:'botella.png'
      },
      {
        id:'acc2',
        nombre:'Guantes Pro',
        precio:12990,
        features:['Cuero sintético','Protección de muñeca'],
        img:'guantes.png'
      },
      {
        id:'acc3',
        nombre:'Bandas Elásticas',
        precio:9990,
        features:['3 niveles de resistencia','Antideslizantes'],
        img:'bandas.png'
      }
    ];
  }

  return saved.map(p => ({
  id: p.codigo || p.id,
  nombre: p.nombre,
  precio: parseFloat(p.precio),
  img: p.img && p.img.trim() ? p.img : 'logo.svg',  // por ahora en logo hasta que pueda cambiarlo
  features: p.desc ? [p.desc] : ["Plan personalizado"]
}));

}

const PRODUCTS = getProducts();
