function validateForm() {
    (() => {
        'use strict';

        const forms = document.querySelectorAll('.needs-validation');

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert("Preencha todos os campos obrigatorios para concluir a compra");
                } else {
                    event.preventDefault();
                    window.location.href = "encomendaFeita.html";
                }

                form.classList.add('was-validated');
            }, false);
        });
    })();
}

function loadCartForCheckout() {
    const savedCart = localStorage.getItem('cart');
    const cartList = document.querySelector('.list-group.mb-3');
    const cartCountElement = document.querySelector('.badge.bg-primary.rounded-pill');
    const promoInput = document.querySelector('.input-group input');
    const promoButton = document.querySelector('.input-group button');
    let total = 0;
    let itemCount = 0;
    let discountApplied = false;

    if (savedCart) {
        const cart = JSON.parse(savedCart);
        cartList.innerHTML = '';

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            itemCount += item.quantity;
            cartList.innerHTML += `
                <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 class="my-0 fw-bold">${item.name}</h6>
                        <small class="text-body-secondary">Quantidade: ${item.quantity}</small>
                        <div>
                            <button class="btn btn-sm btn-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
                            <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <span class="text-body-secondary">${(item.price * item.quantity).toFixed(2)}&euro;</span>
                </li>
            `;
        });

        cartList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <span class="fw-bold">Total (&euro;)</span>
                <strong id="cart-total">${total.toFixed(2)}&euro;</strong>
            </li>
        `;

        promoButton.addEventListener('click', () => {

            const promoCode = promoInput.value.trim();

            if (promoCode === "NATAL20" && !discountApplied) {
                total *= 0.8;
                document.getElementById('cart-total').innerText = `${total.toFixed(2)}`;
                discountApplied = true;
                erroCodigo.classList.add('d-none');

            } else if (promoCode === "BEMVINDO10" && !discountApplied) {
                total *= 0.9;
                document.getElementById('cart-total').innerText = `${total.toFixed(2)}`;
                discountApplied = true;
                erroCodigo.classList.add('d-none');

            } else if (discountApplied) {
                alert("A promocao ja foi aplicada!");

            } else {
                erroCodigo.classList.remove('d-none');
            }
        });
    }
    else {

        cartList.innerHTML = `
            <li class="list-group-item">
                <div class="text-center">Carrinho vazio</div>
            </li>
        `;
    }

    cartCountElement.textContent = itemCount;
}

function logout() {
    console.log("SAI");
    localStorage.removeItem("user-index");
    window.location.reload(); 
}
function updateQuantity(index, delta) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        cart[index].quantity += delta;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartForCheckout();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const user_index = JSON.parse(localStorage.getItem("user-index"));
    users = JSON.parse(localStorage.getItem("users"));

    if (user_index != null) {
        document.getElementById("loginLI").classList.add("d-none");
        document.getElementById("userMenu").classList.remove("d-none");
        document.getElementById("logoNav").style.width = "260px";
        document.getElementById("userMenu").innerHTML = `
            <label class="nav-link text-light" id="welcomeMessage">
                Bem-vindo, ${users[user_index].name}
                <button class="btn btn-secondary btn-sm" onclick= "window.location.href = 'settings.html'">
                  <i class="fa fa-cogs" aria-hidden="true"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="logout()">
                    <i class="fa fa-sign-out" aria-hidden="true"></i>
                </button>
            </label>`;
    }
    else {
        alert("Tens de te registar para continuar o teu pedido!");
        window.location.href = "login.html";
    }
    loadCartForCheckout();
});
