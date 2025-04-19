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

function updateCartTotal() {
    let total = 0;
    const rows = document.querySelectorAll('#cartTable tbody tr');
    rows.forEach(row => {
        const priceText = row.children[2].textContent.replace('$', '');
        total += parseFloat(priceText);
    });
    const totalDisplay = document.getElementById('cartTotal');
    if (totalDisplay) {
        totalDisplay.textContent = `$${total}`;
    }
}

function setupCartButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            row.remove();
            updateCartTotal();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCartButtons();
});
document.addEventListener('DOMContentLoaded', function () {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('productList');
            if (!productList) return;

            products.forEach(product => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';

                col.innerHTML = `
  <div class="card h-100 text-center">
    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">${product.description}</p>
      <p class="text-success fw-bold">$${product.price}</p>
      <button class="btn btn-sm btn-primary">Add to Cart</button>
    </div>
  </div>
`;

                productList.appendChild(col);
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    // Add to Cart functionality (already added)
    document.querySelectorAll('.prod_buy').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const price = parseFloat(this.getAttribute('data-price'));
            if (!isNaN(price)) {
                let cartItems = parseInt(document.getElementById('cartItems').textContent) || 0;
                let cartTotal = parseFloat(document.getElementById('cartTotal').textContent.replace('$', '')) || 0;
                cartItems += 1;
                cartTotal += price;
                document.getElementById('cartItems').textContent = cartItems;
                document.getElementById('cartTotal').textContent = `$${cartTotal.toFixed(2)}`;
            }
        });
    });

    // Details toggle functionality
    document.querySelectorAll('.prod_details').forEach((button, index) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const desc = this.closest('.prod_box').querySelector('.product_description');
            if (desc) {
                desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
});
