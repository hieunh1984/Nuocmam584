// =================== GIỎ HÀNG ===================
let cart = {};

// Lấy phần tử giỏ hàng web
const cartSection = document.getElementById('giohang');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// ===== Thêm sản phẩm vào giỏ =====
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

// ===== Xóa sản phẩm =====
function removeItem(id) {
  delete cart[id];
  renderCart();
}

// ===== Thay đổi số lượng =====
function changeQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

// ===== Xóa hết giỏ =====
function clearCart() {
  cart = {};
  renderCart();
}

// ===== HIỂN THỊ GIỎ HÀNG =====
function renderCart() {
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItems.innerHTML = `<p>${translations[currentLang]?.cart_empty || 'Giỏ hàng trống'}</p>`;
    cartTotal.textContent = "0₫";
    return;
  }

  let total = 0;
  cartItems.innerHTML = ids.map(k => {
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

  cartTotal.textContent = total.toLocaleString() + "₫";
}

// =================== MOBILE CART ICON ===================
if (window.innerWidth <= 768) {
  // Tạo nút icon nhỏ
  const cartIcon = document.createElement('div');
  cartIcon.className = 'cart-mobile-icon';
  cartIcon.innerHTML = '🛒 <span class="cart-badge">0</span>';
  document.body.appendChild(cartIcon);

  const badge = cartIcon.querySelector('.cart-badge');

  // Update badge số lượng
  function updateBadge() {
    const totalQty = Object.values(cart).reduce((sum, v) => sum + v, 0);
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'inline-flex' : 'none';
  }

  updateBadge();

  cartIcon.addEventListener('click', () => {
    cartSection.classList.toggle('active');
  });

  // Cập nhật badge mỗi khi renderCart
  const oldRenderCart = renderCart;
  renderCart = function () {
    oldRenderCart();
    updateBadge();
  };
}
