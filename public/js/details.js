// public/js/details.js
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.purchase');
  if (!wrapper) return;
  const unit = Number(wrapper.getAttribute('data-preco'));
  const qty = document.getElementById('qty');
  const total = document.getElementById('total');

  function formatBRL(n) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  function update() {
    const q = Math.max(1, Number(qty.value || 1));
    total.textContent = formatBRL(unit * q);
  }

  qty.addEventListener('input', update);
  update();
});
