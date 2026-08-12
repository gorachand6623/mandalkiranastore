/* ==========================================
   Mandal Kirana Store - Complete JavaScript
   ========================================== */

const PRODUCTS = [
  { id: 1, name: "Fortune Chakki Fresh Atta", category: "staples", weight: "10 kg Pack", price: " 450", mrp: "Rs. 520", image: "ft.jpg" },
  { id: 2, name: "India Gate Basmati Rice", category: "staples", weight: "5 kg Pack", price: " 499", mrp: "Rs. 575", image: "rice.jpg" },
  { id: 3, name: "Toor / Arhar Dal (Fresh)", category: "pulses", weight: "1 kg Pack", price: " 145", mrp: "Rs. 160", image: "dal.jpg" },
  { id: 4, name: "Kachi Ghani Mustard Oil", category: "oils", weight: "1 Litre Pouch", price: " 170", mrp: "Rs. 182", image: "oil.jpg" },
  { id: 5, name: "Everest Turmeric Powder (Haldi)", category: "spices", weight: "200 g Pack", price: " 68", mrp: "Rs. 78", image: "tr.jpg" },
  { id: 6, name: "Tata Tea Gold Premium", category: "snacks", weight: "500 g Pack", price: " 239", mrp: " Rs.399", image: "tea.jpg" },
  { id: 7, name: "Pure Refined Sugar", category: "staples", weight: "1 kg Pack", price: " 54", mrp: " Rs.58", image: "sugar.jpg" },
  { id: 8, name: "Amul Pure Cow Ghee", category: "oils", weight: "1 Litre Jar", price: " 650", mrp: "Rs. 700", image: "ghee.jpg" }
];

let cart = [];
let activeCategory = 'all';
let searchQuery = '';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categoryPills = document.querySelectorAll('.category-pill');
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartCloseBtn = document.getElementById('cart-close');
const cartItemsList = document.getElementById('cart-items-list');
const cartBadge = document.getElementById('cart-badge');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartDelivery = document.getElementById('cart-delivery');
const cartTotal = document.getElementById('cart-total');
const hamburgerBtn = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderOrderFormCheckboxes();
  updateCartUI();
  initEventListeners();
});

// Event Listeners Setup
function initEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderProducts();
    });
  });

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      cartOverlay.classList.add('active');
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
      cartOverlay.classList.remove('active');
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
      }
    });
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  const shopGroceriesBtn = document.querySelector('a.btn-primary[href="#products"]');
  if (shopGroceriesBtn) {
    shopGroceriesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('catalog-only');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const orderForm = document.getElementById('store-order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitOrderFormViaWhatsApp();
    });
  }
}

// Render Products Grid
function renderProducts() {
  if (!productsGrid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.weight.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 10px; color: var(--accent);"></i>
        <p style="font-weight: 700; font-size: 1.1rem;">No matching groceries found</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(product => {
    const cartItem = cart.find(item => item.id === product.id);
    const qty = cartItem ? cartItem.qty : 0;

    const actionButtonHtml = qty === 0 ? `
      <button class="btn-add-cart" onclick="addToCart(${product.id})">
        <i class="fa-solid fa-plus"></i> Add
      </button>
    ` : `
      <div class="product-qty-control">
        <button class="prod-qty-btn" onclick="updateItemQty(${product.id}, ${qty - 1})">-</button>
        <span class="prod-qty-num">${qty}</span>
        <button class="prod-qty-btn" onclick="updateItemQty(${product.id}, ${qty + 1})">+</button>
      </div>
    `;

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-thumb">
        </div>
        <div>
          <span class="product-category-tag">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-weight">${product.weight}</p>
        </div>
        <div class="product-footer">
          <div>
            <span class="product-price">${product.price}</span>
            <span class="product-mrp">${product.mrp}</span>
          </div>
          ${actionButtonHtml}
        </div>
      </div>
    `;
  }).join('');
}

// Render Order Form Checkboxes Automatically from PRODUCTS
function renderOrderFormCheckboxes() {
  const container = document.getElementById('dynamic-form-items');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(product => `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
      <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.88rem; color: var(--text-dark); flex: 1;">
        <input type="checkbox" name="order_item" value="${product.name} (${product.weight}) - ${product.price}" data-id="${product.id}" style="width: 16px; height: 16px; accent-color: var(--primary);"> 
        ${product.name} <span style="font-size:0.75rem; color:var(--text-muted);">(${product.weight} | ${product.price})</span>
      </label>
      <input type="text" id="qty_input_${product.id}" placeholder="e.g. 1" style="width: 80px; padding: 4px 8px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.85rem;" />
    </div>
  `).join('');
}

// Add Item to Cart
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    // मूल्य को नंबर में बदलने के लिए (₹ सिंबल हटाकर)
    const numericPrice = parseInt(product.price.replace('₹', ''));
    cart.push({ ...product, priceNum: numericPrice, qty: 1 });
  }

  renderProducts();
  updateCartUI();
}

// Update Item Quantity in Cart
function updateItemQty(productId, newQty) {
  if (newQty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else {
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = newQty;
    }
  }

  renderProducts();
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px;"></i>
        <p style="font-weight: 700; font-size: 1.1rem; color: var(--text-dark);">Your cart is empty</p>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = '₹0';
    if (cartDelivery) cartDelivery.textContent = '₹0';
    if (cartTotal) cartTotal.textContent = '₹0';
    return;
  }

  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info" style="flex: 1; margin-left: 10px;">
        <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--text-dark);">${item.name}</h5>
        <p style="font-size: 0.78rem; color: var(--text-muted);">${item.weight} • ${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateItemQty(${item.id}, ${item.qty - 1})">-</button>
        <span style="font-weight: 700; font-size: 0.9rem; min-width: 20px; text-align: center;">${item.qty}</span>
        <button class="qty-btn" onclick="updateItemQty(${item.id}, ${item.qty + 1})">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.qty), 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const finalTotal = subtotal + deliveryFee;

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (cartDelivery) cartDelivery.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  if (cartTotal) cartTotal.textContent = `₹${finalTotal}`;
}

function closeCatalogView() {
  document.body.classList.remove('catalog-only');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// WhatsApp Checkout from Cart with Validation
function checkoutWhatsApp() {
  const custName = document.getElementById('cart-cust-name')?.value.trim();
  const custPhone = document.getElementById('cart-cust-phone')?.value.trim();
  const custAddress = document.getElementById('cart-cust-address')?.value.trim();

  // चेक करें कि नाम, फोन और एड्रेस भरा हुआ है या नहीं
  if (!custName || !custPhone || !custAddress) {
    alert('कृपया WhatsApp पर ऑर्डर भेजने से पहले अपना नाम, मोबाइल नंबर और डिलीवरी एड्रेस भरें!');
    return;
  }

  if (cart.length === 0) {
    alert('आपका कार्ट खाली है!');
    return;
  }

  let message = `🛒 *New Grocery Order - Mandal Kirana Store*\n\n`;
  message += `👤 *Customer Name:* ${custName}\n`;
  message += `📞 *Mobile Number:* ${custPhone}\n`;
  message += `📍 *Delivery Address:* ${custAddress}\n\n`;
  message += `📦 *Ordered Items:*\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.weight}) x ${item.qty} = Rs. ${item.priceNum * item.qty}\n`;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.qty), 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const finalTotal = subtotal + deliveryFee;

  message += `\n🎯 *Total Amount:* Rs. ${finalTotal}`;
  
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/916204339748?text=${encodedMessage}`, '_blank');
}
// Submit Order Form via WhatsApp
function submitOrderFormViaWhatsApp() {
  const name = document.getElementById('customer_name')?.value.trim();
  const phone = document.getElementById('phone_number')?.value.trim();
  const address = document.getElementById('delivery_address')?.value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your Name, Mobile Number, and Delivery Address.');
    return;
  }

  const checkboxes = document.querySelectorAll('input[name="order_item"]:checked');
  if (checkboxes.length === 0) {
    alert('Please select at least one grocery item using the checkboxes.');
    return;
  }

  let message = `🛒 *New Delivery Order Form - Mandal Kirana Store*\n\n`;
  message += `👤 *Customer Name:* ${name}\n`;
  message += `📞 *Mobile:* ${phone}\n`;
  message += `📍 *Address:* ${address}\n\n`;
  message += `📋 *Selected Items & Qty:*\n`;

  checkboxes.forEach((cb, index) => {
    const prodId = cb.getAttribute('data-id');
    const qtyVal = document.getElementById(`qty_input_${prodId}`)?.value.trim() || '1 item';
    message += `${index + 1}. ${cb.value} - Qty: ${qtyVal}\n`;
  });

  message += `\nPlease confirm my order!`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/916204339748?text=${encoded}`, '_blank');
}document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('auth-action-container');
  const savedUser = JSON.parse(localStorage.getItem('kirana_user'));

  // 1. Header Profile / Login Button Handle
  if (authContainer) {
    if (savedUser && savedUser.username) {
      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; background: #f0fdf4; padding: 6px 12px; border-radius: 20px; border: 1px solid #bbf7d0;">
          <i class="fa-solid fa-user-check" style="color: #15803d;"></i>
          <span style="font-size: 0.85rem; font-weight: 700; color: #166534;">${savedUser.username}</span>
          <button id="logout-btn" title="Logout" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.75rem; font-weight: 600; margin-left: 4px;">
            Logout
          </button>
        </div>
      `;

      // Logout Click Action
      document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          localStorage.removeItem('kirana_user');
          alert('Logged out successfully!');
          window.location.reload();
        }
      });
    } else {
      authContainer.innerHTML = `
        <a href="login.html" style="background: #15803d; color: white; padding: 8px 16px; font-size: 0.85rem; text-decoration: none; border-radius: 12px; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
          <i class="fa-solid fa-right-to-bracket"></i> Login
        </a>
      `;
    }
  }

  // 2. Auto-fill Form with Logged-in User Data & Address
  if (savedUser) {
    const custNameInput = document.getElementById('customer_name');
    const custAddressInput = document.getElementById('delivery_address');

    if (custNameInput && !custNameInput.value) custNameInput.value = savedUser.username || '';
    if (custAddressInput && !custAddressInput.value) custAddressInput.value = savedUser.address || '';
  }

  // 3. Cart Button Toggle Fix
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.getElementById('cart-close');

  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener('click', () => {
      cartOverlay.classList.add('active');
    });
  }

  if (cartClose && cartOverlay) {
    cartClose.addEventListener('click', () => {
      cartOverlay.classList.remove('active');
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // 1. LocalStorage से सेव किया हुआ यूजर डेटा निकालें
  const savedUser = JSON.parse(localStorage.getItem('kirana_user'));

  if (savedUser) {
    // 2. इनपुट बॉक्स की IDs के हिसाब से वैल्यू ऑटोमैटिक सेट करें
    // (ध्यान दें: अपने HTML में इनपुट फील्ड्स पर ये id जोड़ लें या नीचे दिए नामों से मैच करें)
    const nameInput = document.getElementById('delivery-name');
    const mobileInput = document.getElementById('delivery-mobile');
    const addressInput = document.getElementById('delivery-address');

    if (nameInput && savedUser.username) {
      nameInput.value = savedUser.username;
    }
    if (mobileInput && savedUser.mobile) {
      mobileInput.value = savedUser.mobile;
    }
    if (addressInput && savedUser.address) {
      addressInput.value = savedUser.address;
    }
  }
});