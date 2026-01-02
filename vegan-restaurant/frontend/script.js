fetch("http://localhost:3000/products")
.then(r=>r.json())
.then(d=>{
const ul=document.getElementById('list');
d.forEach(p=>{
ul.innerHTML+=`<li>${p.name} - R$${p.price} <button>Adicionar</button></li>`;
});
});
