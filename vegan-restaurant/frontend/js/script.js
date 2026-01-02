fetch('http://localhost:3000/products')
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById('product-list');
    products.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} - R$ ${p.price}`;
      list.appendChild(li);
    });
  });

function registerCustomer() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  fetch('http://localhost:3000/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}
