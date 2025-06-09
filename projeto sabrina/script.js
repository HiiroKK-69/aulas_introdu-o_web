// banco de dados com os produtos
const products = [
    { id: 1, name: "Mouse Gamer", price: 150.00, image: "assets/img/MOUSEGAMER.jpg" },
    { id: 2, name: "Teclado Mecânico", price: 300.00, image: "assets/img/TECLADOGAMER.JPG" },
    { id: 3, name: "Headset RGB", price: 200.00, image: "assets/img/HEADSETRGB.jpg" },
    { id: 4, name: "Monitor 24\"", price: 900.00, image: "assets/img/MONITORGAMER.JPG" },
    { id: 5, name: "Mousepad Grande", price: 50.00, image: "assets/img/MOUSEPADIRADO.JPG" },
    { id: 6, name: "Webcam Full HD", price: 250.00, image: "assets/img/WEBCAMSHEREK.JPG" }
];

// COUPONZINHOS DELICIA
const validCoupons = {
    "DESCONTO10": 10,
    "RAVO100":100,
    "HIBRA90":90,
    "HIOSHE80":80,
    "PIGLET70":70

}

// VARIAVEIS GLOBAIS
let cart = [];
let discount = 0;

// ELEMENTOS DO DOM(INADOR?????)
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.querySelector(".close-modal");

// Controle do Modal
cartIcon.addEventListener("click", () => {
    cartModal.style.display = "flex";
    document.body.style.overflow = "hidden"; // NAO DEIXA ROLAR A PAGINA
});

closeModal.addEventListener("click", () => {
    closeCartModal();
});

window.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        closeCartModal();
    }
});

function closeCartModal() {
    cartModal.style.animation = "slideOut 0.3s forwards";
    setTimeout(() => {
        cartModal.style.display = "none";
        cartModal.style.animation = "slideIn 0.3s forwards";
        document.body.style.overflow = "auto";
    }, 300);
}

// ANIMAÇAO DE SLIDEOUT
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// RENDERIZA OS PRODUTOS NA PAGINA
function renderProducts() {
    const productsSection = document.querySelector('.products');
    productsSection.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <input type="number" class="quantity-selector" min="1" value="1" id="qty-${product.id}">
            <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
        `;
        productsSection.appendChild(productDiv);
    });
}

// ADCICONA OS PRODUTOS NO CCARRINHO
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    
    for (let i = 0; i < quantity; i++) {
        cart.push({ 
            ...product, 
            cartId: Date.now() + Math.random() // ID 1 PRA CADA ITEM
        });
    }
    
    updateCart();
    
    // CARRINHO TREMENDO DE FELICIDADE POR UMA POSSIVEL COMPRA
    cartIcon.classList.add("shake");
    setTimeout(() => cartIcon.classList.remove("shake"), 500);
    
}

// TIRAR ITENS DO CARRINHO
function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCart();
}

// CUPOM SENDO COLOCADO
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    
    if (validCoupons[couponCode]) {
        discount = validCoupons[couponCode];
        alert(`Cupom aplicado: ${discount}% de desconto!`);
    } else {
        discount = 0;
        alert("Cupom inválido! Tenteum desses: DESCONTO10, RAVO100, HIBRA90, HIOSHE80 ou PIGLET70");
    }
    
    updateCart();
}

// ATUALIZA O CARRINHO
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    // JUSTA ITENS IGUAIS PRA NAO ENCHER DE COISA NATELA
    const groupedItems = {};
    cart.forEach(item => {
        if (!groupedItems[item.id]) {
            groupedItems[item.id] = { ...item, quantity: 0 };
        }
        groupedItems[item.id].quantity++;
    });
    
    //MOSTRA OS ITENS JUNTOS
    Object.values(groupedItems).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromCart(${item.cartId})">X</button>
        `;
        cartItems.appendChild(li);
        subtotal += item.price * item.quantity;
    });
    
    // CALCULOS INSANOS DE DESCONTO E VALOR FINAL
    const discountValue = (subtotal * discount / 100);
    const total = subtotal - discountValue;
    
    subtotalElement.textContent = subtotal.toFixed(2);
    discountElement.textContent = discountValue.toFixed(2);
    totalElement.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
    
    // MOSTRA O BOTAO DE CHECKOUT
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
    
    // Salva no LocalStorage para o checkout
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', total.toFixed(2));
}

// JOGA O CARRINHO PRO ALTO TIRANDO TUDO DE DENTRO(METAFORICAMENTE, ELE SO LIMPA O CARRINHO MESMO)
document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        discount = 0;
        document.getElementById('coupon-code').value = '';
        updateCart();
        alert('Carrinho limpo!');
    }
});

// INICIALIZAÇÃO
window.onload = function() {
    renderProducts();
    
    // CARREGA O CARRINHO DO LOCALSTORAGE SE TIVER
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
};