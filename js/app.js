// ========== 产品数据 ==========
const products = [
    { id: 1, name: "西湖龙井", category: "green", origin: "浙江杭州", price: 268, unit: "/50g", badge: "热销", desc: "明前特级龙井，豆香馥郁，回甘悠长", imageClass: "green-tea", emoji: "🍵" },
    { id: 2, name: "碧螺春", category: "green", origin: "江苏苏州", price: 198, unit: "/50g", badge: "", desc: "洞庭碧螺春，花果香浓，鲜爽生津", imageClass: "green-tea", emoji: "🍃" },
    { id: 3, name: "黄山毛峰", category: "green", origin: "安徽黄山", price: 158, unit: "/50g", badge: "", desc: "高山毛峰，清香高扬，滋味醇厚", imageClass: "green-tea", emoji: "🌿" },
    { id: 4, name: "正山小种", category: "red", origin: "福建武夷山", price: 328, unit: "/50g", badge: "推荐", desc: "桐木关正山小种，松烟香与桂圆甜交织", imageClass: "red-tea", emoji: "🫖" },
    { id: 5, name: "祁门红茶", category: "red", origin: "安徽祁门", price: 288, unit: "/50g", badge: "", desc: "祁门香著称，似花似果似蜜，世界三大高香红茶", imageClass: "red-tea", emoji: "🍂" },
    { id: 6, name: "金骏眉", category: "red", origin: "福建武夷山", price: 498, unit: "/50g", badge: "新品", desc: "芽尖精制，蜜香馥郁，汤色金黄", imageClass: "red-tea", emoji: "✨" },
    { id: 7, name: "铁观音", category: "oolong", origin: "福建安溪", price: 238, unit: "/50g", badge: "热销", desc: "清香型铁观音，兰花香幽雅，七泡余香", imageClass: "oolong-tea", emoji: "🪷" },
    { id: 8, name: "大红袍", category: "oolong", origin: "福建武夷山", price: 568, unit: "/50g", badge: "珍品", desc: "岩骨花香，岩韵明显，茶中之王", imageClass: "oolong-tea", emoji: "🏔️" },
    { id: 9, name: "凤凰单丛", category: "oolong", origin: "广东潮州", price: 358, unit: "/50g", badge: "", desc: "蜜兰香单丛，山韵独特，回甘力强", imageClass: "oolong-tea", emoji: "🌸" },
    { id: 10, name: "普洱生茶", category: "puer", origin: "云南西双版纳", price: 188, unit: "/饼(357g)", badge: "", desc: "古树春茶，苦涩化快，回甘生津", imageClass: "puer-tea", emoji: "🌳" },
    { id: 11, name: "普洱熟茶", category: "puer", origin: "云南临沧", price: 168, unit: "/饼(357g)", badge: "推荐", desc: "醇厚顺滑，陈香馥郁，暖胃佳品", imageClass: "puer-tea", emoji: "🤎" },
    { id: 12, name: "白毫银针", category: "green", origin: "福建福鼎", price: 388, unit: "/50g", badge: "珍品", desc: "白茶之王，毫香蜜韵，清热润肺", imageClass: "white-tea", emoji: "🤍" }
];

let cart = [];

document.addEventListener("DOMContentLoaded", function() {
    renderProducts("all");
    setupFilterTabs();
    setupScrollEffects();
    loadCart();
});

function renderProducts(filter) {
    var grid = document.getElementById("productsGrid");
    var filtered = filter === "all" ? products : products.filter(function(p) { return p.category === filter; });
    var html = "";
    filtered.forEach(function(product, index) {
        var badgeHtml = product.badge ? '<span class="product-badge">' + product.badge + '</span>' : "";
        html += '<div class="product-card fade-in" style="animation-delay:' + (index * 0.08) + 's">' +
            '<div class="product-image ' + product.imageClass + '">' +
                '<span style="font-size:3.5rem">' + product.emoji + '</span>' +
                badgeHtml +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-name">' + product.name + '</div>' +
                '<div class="product-origin">' + product.origin + '</div>' +
                '<div class="product-desc">' + product.desc + '</div>' +
                '<div class="product-bottom">' +
                    '<div class="product-price">¥' + product.price + '<span class="unit">' + product.unit + '</span></div>' +
                    '<button class="btn-add-cart" onclick="addToCart(' + product.id + ')">加入购物车</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    });
    grid.innerHTML = html;
}

function setupFilterTabs() {
    var tabs = document.querySelectorAll(".filter-btn");
    tabs.forEach(function(tab) {
        tab.addEventListener("click", function() {
            tabs.forEach(function(t) { t.classList.remove("active"); });
            tab.classList.add("active");
            renderProducts(tab.dataset.filter);
        });
    });
}

function setupScrollEffects() {
    window.addEventListener("scroll", function() {
        var navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) { navbar.classList.add("scrolled"); }
        else { navbar.classList.remove("scrolled"); }
        var cards = document.querySelectorAll(".product-card, .feature-card, .about-content, .about-image");
        cards.forEach(function(card) {
            var rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) { card.classList.add("fade-in"); }
        });
    });
}

function addToCart(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    var existing = cart.find(function(item) { return item.id === productId; });
    if (existing) { existing.qty += 1; }
    else { cart.push(Object.assign({}, product, { qty: 1 })); }
    updateCartUI();
    saveCart();
    showToast("已添加「" + product.name + "」到购物车");
}

function removeFromCart(productId) {
    cart = cart.filter(function(item) { return item.id !== productId; });
    updateCartUI();
    saveCart();
}

function changeQty(productId, delta) {
    var item = cart.find(function(i) { return i.id === productId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(productId); return; }
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    var countEl = document.getElementById("cartCount");
    var itemsEl = document.getElementById("cartItems");
    var totalEl = document.getElementById("cartTotal");
    var totalQty = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    var totalPrice = cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    countEl.textContent = totalQty;
    totalEl.textContent = "¥" + totalPrice;
    if (cart.length === 0) {
        itemsEl.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>购物车是空的</p></div>';
        return;
    }
    var html = "";
    cart.forEach(function(item) {
        html += '<div class="cart-item">' +
            '<div class="cart-item-image ' + item.imageClass + '">' + item.emoji + '</div>' +
            '<div class="cart-item-info">' +
                '<div class="cart-item-name">' + item.name + '</div>' +
                '<div class="cart-item-price">¥' + (item.price * item.qty) + '</div>' +
                '<div class="cart-item-qty">' +
                    '<button class="qty-btn" onclick="changeQty(' + item.id + ',-1)">-</button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button class="qty-btn" onclick="changeQty(' + item.id + ',1)">+</button>' +
                '</div>' +
                '<button class="remove-item" onclick="removeFromCart(' + item.id + ')">移除</button>' +
            '</div>' +
        '</div>';
    });
    itemsEl.innerHTML = html;
}

function toggleCart() {
    var sidebar = document.getElementById("cartSidebar");
    var overlay = document.getElementById("cartOverlay");
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
    document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";
}

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add("show"); });
    setTimeout(function() {
        toast.classList.remove("show");
        setTimeout(function() { toast.remove(); }, 300);
    }, 2000);
}

function saveCart() {
    localStorage.setItem("teaShopCart", JSON.stringify(cart));
}

function loadCart() {
    var saved = localStorage.getItem("teaShopCart");
    if (saved) {
        try { cart = JSON.parse(saved); updateCartUI(); }
        catch(e) { cart = []; }
    }
}
