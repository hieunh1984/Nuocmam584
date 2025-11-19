// =================== GIỎ HÀNG ===================
let cart = {};

// Lấy phần tử cart-section và badge số lượng
const cartSection = document.querySelector('.cart-section');

// Tạo badge hiển thị số sản phẩm trên icon
let cartBadge = document.createElement('span');
cartBadge.style.position = 'absolute';
cartBadge.style.top = '4px';
cartBadge.style.right = '4px';
cartBadge.style.background = '#e74c3c';
cartBadge.style.color = '#fff';
cartBadge.style.borderRadius = '50%';
cartBadge.style.width = '20px';
cartBadge.style.height = '20px';
cartBadge.style.fontSize = '12px';
cartBadge.style.display = 'flex';
cartBadge.style.justifyContent = 'center';
cartBadge.style.alignItems = 'center';
cartBadge.style.pointerEvents = 'none';
cartSection.appendChild(cartBadge);

// Toggle mở/đóng cart khi bấm vào icon
cartSection.addEventListener('click', function(e) {
  cartSection.classList.toggle('active');
});

// Thêm sản phẩm vào giỏ
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

// Xóa sản phẩm
function removeItem(id) {
  delete cart[id];
  renderCart();
}

// Thay đổi số lượng
function changeQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

// Xóa hết giỏ
function clearCart() {
  cart = {};
  renderCart();
}

// =================== HIỂN THỊ GIỎ HÀNG ===================
function renderCart() {
  const container = document.getElementById("cart-items");
  const ids = Object.keys(cart);
  const totalEl = document.getElementById("cart-total");

  // Cập nhật số lượng trên badge icon
  let totalQty = ids.reduce((sum, k) => sum + cart[k], 0);
  cartBadge.textContent = totalQty;
  cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';

  if (ids.length === 0) {
    container.innerHTML = `<p>${translations[currentLang].cart_empty}</p>`;
    totalEl.textContent = "0₫";
    return;
  }

  let total = 0;
  container.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    const title = productTranslations[currentLang][p.id].title;
    const qty = cart[k];
    total += p.price * qty;

    return `
      <div class="cart-item">
        <img class="cart-thumb" src="${p.img}" alt="${title}">
        <div class="cart-info">
          <strong>${title}</strong>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="changeQuantity(${p.id}, -1)">–</button>
            <span>${qty}</span>
            <button class="qty-btn" onclick="changeQuantity(${p.id}, 1)">+</button>
          </div>
        </div>
        <button class="delete-btn" onclick="removeItem(${p.id})">Xóa</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = total.toLocaleString() + "₫";
}
