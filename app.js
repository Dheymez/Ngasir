const products = [
    { id: 1, name: 'Kopi Hitam', price: 15000 },
    { id: 2, name: 'Teh Manis', price: 8000 },
    { id: 3, name: 'Roti Bakar', price: 12000 },
    { id: 4, name: 'Mie Goreng', price: 20000 },
    { id: 5, name: 'Nasi Goreng', price: 25000 },
    { id: 6, name: 'Es Jeruk', price: 10000 }
];

let cart = [];

// DOM Elements
const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const statusEl = document.getElementById('status');

// Init
function init() {
    loadCart();
    renderProducts();
    renderCart();
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    checkoutBtn.addEventListener('click', handleCheckout);
    clearCartBtn.addEventListener('click', clearCart);
}

// Online/Offline status
function updateOnlineStatus() {
    if (navigator.onLine) {
        statusEl.textContent = 'Online';
        statusEl.className = 'status online';
    } else {
        statusEl.textContent = 'Offline';
        statusEl.className = 'status offline';
    }
}

// Format Currency
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Render Products
function renderProducts() {
    productListEl.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>Rp ${formatRupiah(product.price)}</p>
            </div>
            <button class="btn" onclick="addToCart(${product.id})">Tambah</button>
        `;
        productListEl.appendChild(div);
    });
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.qty > 1) {
            existingItem.qty -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    saveCart();
    renderCart();
}

function clearCart() {
    if(confirm('Yakin ingin mengosongkan keranjang?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`Pembayaran berhasil! Total: Rp ${formatRupiah(total)}\nTerima kasih.`);
    cart = [];
    saveCart();
    renderCart();
}

function renderCart() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                <small>Rp ${formatRupiah(item.price)} x ${item.qty}</small>
            </div>
            <div class="cart-item-actions">
                <button class="btn" style="background:#888;" onclick="removeFromCart(${item.id})">-</button>
                <span>${item.qty}</span>
                <button class="btn" style="background:#888;" onclick="addToCart(${item.id})">+</button>
            </div>
        `;
        cartItemsEl.appendChild(li);
    });

    totalPriceEl.textContent = formatRupiah(total);
}

// Local Storage
function saveCart() {
    localStorage.setItem('kasir_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('kasir_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

// Start app
init();
