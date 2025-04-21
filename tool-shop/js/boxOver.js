const supportForm = document.getElementById('supportForm');
if (supportForm) {
    supportForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Support request submitted! We will contact you shortly.');
        supportForm.reset();
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for contacting us! We will reply shortly.');
        contactForm.reset();
    });
}

function updateMiniCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const cartItemsElem = document.getElementById('cartItems');
    const cartTotalElem = document.getElementById('cartTotal');

    if (cartItemsElem) cartItemsElem.textContent = totalItems;
    if (cartTotalElem) cartTotalElem.textContent = `$${totalPrice.toFixed(2)}`;
}

function setupAddToCartButtons(scope = document) {
    const buttons = scope.querySelectorAll('.prod_buy');
    buttons.forEach(button => {
        if (!button.dataset.bound) {
            button.dataset.bound = 'true'; // prevent duplicate events

            button.addEventListener('click', function (e) {
                e.preventDefault();

                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price);
                const quantity = parseInt(this.dataset.quantity) || 1;

                if (!id || !name || isNaN(price)) return;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(item => item.id === id);

                if (item) {
                    item.quantity += quantity;
                } else {
                    cart.push({ id, name, price, quantity });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateMiniCart();
                alert(`${name} added to cart.`);
            });
        }
    });
}

function updateCartTable() {
    const tableBody = document.querySelector('#cartTable tbody');
    const totalDisplay = document.getElementById('cartTotal');
    if (!tableBody || !totalDisplay) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    tableBody.innerHTML = '';

    cart.forEach(item => {
        const rowTotal = item.price * item.quantity;
        total += rowTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${rowTotal.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm remove-btn">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });

    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function setupCartRemoveButtons() {
    const table = document.getElementById('cartTable');
    if (!table) return;

    table.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-btn')) {
            const row = e.target.closest('tr');
            const name = row.querySelector('td')?.textContent;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.name !== name);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
            updateMiniCart();
        }
    });
}

function setupProductDetailToggles() {
    document.querySelectorAll('.prod_details').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const desc = this.closest('.prod_box')?.querySelector('.product_description');
            if (desc) {
                desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}


function loadTopProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = '';
            products.forEach(product => {
                const div = document.createElement('div');
                div.className = 'col-md-12 mb-4';
                div.innerHTML = `
                    <div class="card h-100 text-center">
                        <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="text-success fw-bold">$${product.price}</p>
                            <button class="btn btn-sm btn-primary prod_buy" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-quantity="1">Add to Cart</button>
                        </div>
                    </div>
                `;
                productList.appendChild(div);
            });
            setupAddToCartButtons();
        })
        .catch(error => console.error('Error loading top products:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    setupAddToCartButtons();
    setupCartRemoveButtons();
    setupProductDetailToggles();
    updateMiniCart();
    updateCartTable();
    loadTopProducts();
});
