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