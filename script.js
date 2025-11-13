// ========== DANH SÁCH SẢN PHẨM ==========
const products = [
  { id: 1, title: "Nước mắm 584 30°N (500ml)", price: 35000, img: "images/30nb.png", desc: "Ngon đậm vị, thích hợp chấm và nấu" },
  { id: 2, title: "Nước mắm 584 35°N (500ml)", price: 45000, img: "images/35nb.png", desc: "Đậm đà vị cá cơm truyền thống" },
  { id: 3, title: "Nước mắm nhĩ đặc biệt 40°N (500ml)-Bán chạy", price: 75000, img: "images/40nb.png", desc: "Tinh túy giọt nhĩ đầu tiên" },
  { id: 4, title: "Nước mắm 584 Gold 60°N (200ml)", price: 60000, img: "images/60nb.png", desc: "Dành cho bữa ăn sang trọng" },
  { id: 5, title: "Nước mắm 584 đại chúng 12°N (5l)-Đã hết", price: 50000, img: "images/12nb.png", desc: "Cá cơm là đây" },
  { id: 6, title: "Nước mắm nhĩ thượng hạng 60°N (200ml)-Đang nhập hàng", price: 65000, img: "images/60dbb.png", desc: "Dành cho người sành ăn, vị mặn mà tự nhiên" },
  { id: 7, title: "Nước mắm 584 truyền thống 20°N (500ml)", price: 25000, img: "images/20nb.png", desc: "Hương vị nhẹ, phù hợp nấu ăn hàng ngày" }
];

let cart = {};

// ========== HIỂN THỊ SẢN PHẨM ==========
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <p><strong>${p.price.toLocaleString()}₫</strong></p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    </div>
  `).join("");
}

// ========== GIỎ HÀNG WEB ==========
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  updateBadge();
  updateCartPopup();
}

// ========== HIỂN THỊ GIỎ HÀNG (WEB) ==========
function renderCart() {
  const container = document.getElementById("cart-items");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    container.innerHTML = "<p>Chưa có sản phẩm trong giỏ.</p>";
    document.getElementById("cart-total").textContent = "0₫";
    return;
  }

  let total = 0;
  container.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    const qty = cart[k];
    total += p.price * qty;

    return `
      <div class="cart-item">
        <strong>${p.title}</strong>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="changeQuantity(${p.id}, -1)">–</button>
          <span>${qty}</span>
          <button class="qty-btn" onclick="changeQuantity(${p.id}, 1)">+</button>
        </div>
        <button class="delete-btn" onclick="removeItem(${p.id})">Xóa</button>
      </div>`;
  }).join("");

  document.getElementById("cart-total").textContent = total.toLocaleString() + "₫";
}

function removeItem(id) {
  delete cart[id];
  renderCart();
  updateBadge();
  updateCartPopup();
}

// ========== TĂNG / GIẢM SỐ LƯỢNG ==========
function changeQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
  updateBadge();
  updateCartPopup();
}

function clearCart() {
  cart = {};
  renderCart();
  updateBadge();
  updateCartPopup();
}

function updateBadge() {
  const badge = document.querySelector(".cart-button .badge");
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

// ========== GIỎ HÀNG MOBILE ==========
function toggleCart() {
  const popup = document.getElementById("cart-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
  updateCartPopup();
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

// ========== GIỎ HÀNG (MOBILE) ==========
function updateCartPopup() {
  const list = document.getElementById("cart-popup-items");
  const totalDisplay = document.getElementById("cart-popup-total");

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    list.innerHTML = "<li>Chưa có sản phẩm</li>";
    totalDisplay.textContent = "0₫";
    return;
  }

  let total = 0;
  list.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    const qty = cart[k];
    total += p.price * qty;

    return `
      <li class="cart-item">
        <strong>${p.title}</strong>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="changeQuantity(${p.id}, -1)">–</button>
          <span>${qty}</span>
          <button class="qty-btn" onclick="changeQuantity(${p.id}, 1)">+</button>
        </div>
        <button class="delete-btn" onclick="removeItem(${p.id})">Xóa</button>
      </li>`;
  }).join("");

  totalDisplay.textContent = total.toLocaleString() + "₫";
}

// ========== THANH TOÁN ==========
function openCheckout() {
  const ids = Object.keys(cart);
  if (ids.length === 0) return alert("Giỏ hàng trống!");
  document.getElementById("checkout-overlay").style.display = "block";
  const modal = document.getElementById("checkout-modal");
  modal.classList.add("show"); // bật modal
}

function closeCheckout() {
  document.getElementById("checkout-overlay").style.display = "none";
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("show"); // ẩn modal
}


function confirmCheckout() {
  const name = document.getElementById("recipient-name").value.trim();
  const phone = document.getElementById("recipient-phone").value.trim();
  const address = document.getElementById("recipient-address").value.trim();

  if (!name || !phone || !address) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin giao hàng!");
    return;
  }

  alert(`✅ Cảm ơn ${name}! Đơn hàng của bạn sẽ được giao tới:\n${address}`);
  closeCheckout();
  clearCart();
}

// ========== KHỞI ĐỘNG ==========
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateBadge();
  updateCartPopup();
  document.getElementById("year").textContent = new Date().getFullYear();

  // ===== Modal ảnh sản phẩm =====
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.getElementById("close-modal");

// Bắt sự kiện click ảnh sản phẩm
document.getElementById("product-list").addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    modalImg.src = e.target.src;
    modal.classList.remove("hidden");
  }
});

// Đóng modal khi bấm nút X
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Đóng modal khi click ra ngoài ảnh
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

});

const translations = {
  vi: {
    title: "Nước Mắm 584 - Đại lý HCMC",
    home: "Trang chủ ▾",
    about: "Giới thiệu",
    product_link: "Sản phẩm",
    language: "Ngôn ngữ",
    product_list: "DANH MỤC SẢN PHẨM",
    cart_title: "GIỎ HÀNG CỦA BẠN",
    total: "Tổng tiền:",
    buy: "Mua hàng",
    clear: "Xóa giỏ hàng",
    close: "Đóng",
    shipping_info: "Thông tin giao hàng",
    fullname: "Họ và tên:",
    phone: "Số điện thoại:",
    address: "Địa chỉ:",
    confirm: "Xác nhận đặt hàng",
    cancel: "Hủy",
    empty_cart: "Chưa có sản phẩm",
    cart_popup_title: "Giỏ hàng của bạn",
    footer_text: "Bản quyền © 2025 Nước Mắm 584 - Nguyễn Hoàng Hiếu. Giữ toàn quyền."
  },
  en: {
    title: "Fish Sauce 584 - HCMC Agent",
    home: "Home ▾",
    about: "About",
    product_link: "Products",
    language: "Language",
    product_list: "PRODUCT CATEGORIES",
    cart_title: "YOUR CART",
    total: "Total:",
    buy: "Buy now",
    clear: "Clear cart",
    close: "Close",
    shipping_info: "Shipping Information",
    fullname: "Full name:",
    phone: "Phone number:",
    address: "Address",
    confirm: "Confirm order",
    cancel: "Cancel",
    empty_cart: "No items yet",
    cart_popup_title: "Your Cart",
    footer_text: "Copyright © 2025 Fish Sauce 584 - Nguyen Hoang Hieu. All rights reserved."
  },
  cn: {
    title: "584鱼露 - 胡志明市代理",
    home: "主页 ▾",
    about: "介绍",
    product_link: "产品",
    language: "语言",
    product_list: "产品目录",
    cart_title: "您的购物车",
    total: "总价:",
    buy: "购买",
    clear: "清空购物车",
    close: "关闭",
    shipping_info: "配送信息",
    fullname: "姓名:",
    phone: "电话号码:",
    address: "地址:",
    confirm: "确认下单",
    cancel: "取消",
    empty_cart: "暂无商品",
    cart_popup_title: "您的购物车",
    footer_text: "版权 © 2025 584鱼露 - 阮黄孝。保留所有权利。"
  },
  jp: {
    title: "584魚醤 - ホーチミン代理店",
    home: "ホーム ▾",
    about: "紹介",
    product_link: "製品",
    language: "言語",
    product_list: "製品カテゴリ",
    cart_title: "カート",
    total: "合計:",
    buy: "購入する",
    clear: "カートをクリア",
    close: "閉じる",
    shipping_info: "配送情報",
    fullname: "氏名:",
    phone: "電話番号:",
    address: "住所:",
    confirm: "注文を確認",
    cancel: "キャンセル",
    empty_cart: "商品がありません",
    cart_popup_title: "カート内容",
    footer_text: "著作権 © 2025 584魚醤 - グエン・ホアン・ヒエウ。全著作権所有。"
  },
  kr: {
    title: "584 피시소스 - 호치민 대리점",
    home: "홈 ▾",
    about: "소개",
    product_link: "제품",
    language: "언어",
    product_list: "제품 목록",
    cart_title: "장바구니",
    total: "총액:",
    buy: "구매하기",
    clear: "장바구니 비우기",
    close: "닫기",
    shipping_info: "배송 정보",
    fullname: "이름:",
    phone: "전화번호:",
    address: "주소:",
    confirm: "주문 확인",
    cancel: "취소",
    empty_cart: "상품이 없습니다",
    cart_popup_title: "장바구니",
    footer_text: "저작권 © 2025 584 피시소스 - 응우옌 호앙 히에우. 판권 소유."
  }
};

// Hàm set ngôn ngữ
function setLanguage(lang) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

// Khi load trang: luôn reset về tiếng Việt
window.addEventListener('DOMContentLoaded', () => {
  setLanguage('vi'); // Reset ngôn ngữ mặc định

// Mobile: toggle dropdown khi click (áp dụng cho tất cả dropdown)
document.querySelectorAll('.dropdown > a').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = btn.parentElement;
    dropdown.classList.toggle('active');
  });
});

  // Click ngoài sẽ đóng dropdown
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown.active').forEach(drop => {
      if (!drop.contains(e.target)) drop.classList.remove('active');
    });
  });
});

/*JS để bật/tắt modal khi bấm nút Mua hàng*/
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutModal = document.getElementById("checkout-modal");
const cancelOrder = document.getElementById("cancel-order");

// Mở modal khi bấm Mua hàng
checkoutBtn.addEventListener("click", () => {
  checkoutOverlay.style.display = "block";
  checkoutModal.style.display = "flex";
});

// Đóng modal khi bấm Hủy hoặc click overlay
cancelOrder.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);

function closeCheckout() {
  checkoutOverlay.style.display = "none";
  checkoutModal.style.display = "none";
}
