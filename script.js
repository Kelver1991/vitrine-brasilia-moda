const products = [
  {
    name: "Blazer urbano cintura marcada",
    category: "feminino",
    price: "R$ 697,00",
    image:
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Vestido midi para noite",
    category: "feminino",
    price: "R$ 529,00",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Camisa masculina premium",
    category: "masculino",
    price: "R$ 349,00",
    image:
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Jeans reto escuro",
    category: "masculino",
    price: "R$ 398,00",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Bolsa pequena statement",
    category: "acessorios",
    price: "R$ 596,00",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Óculos fashion metal",
    category: "acessorios",
    price: "R$ 289,00",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Calca alfaiataria casual",
    category: "feminino",
    price: "R$ 488,00",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Jaqueta jeans assinatura",
    category: "masculino",
    price: "R$ 589,00",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80",
  },
];

const grid = document.querySelector("#productGrid");
const filters = document.querySelectorAll(".filter");
const interestList = document.querySelector("#interestList");
const interestCount = document.querySelector("#interestCount");
const interestTotal = document.querySelector("#interestTotal");
const clearInterest = document.querySelector("#clearInterest");
const contactForm = document.querySelector("#contactForm");
const formFeedback = document.querySelector("#formFeedback");
const selectedProducts = [];

function parsePrice(price) {
  return Number(price.replace("R$", "").replace(".", "").replace(",", ".").trim());
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function renderProducts(category = "todos") {
  const visibleProducts =
    category === "todos"
      ? products
      : products.filter((product) => product.category === category);

  grid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-card__body">
            <span>${product.category}</span>
            <h3>${product.name}</h3>
            <strong class="price">${product.price}</strong>
            <button class="add-interest" type="button" data-product="${product.name}">
              Adicionar à lista
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateInterestList() {
  const total = selectedProducts.reduce(
    (sum, product) => sum + parsePrice(product.price),
    0,
  );

  interestCount.textContent =
    selectedProducts.length === 1
      ? "1 item"
      : `${selectedProducts.length} itens`;
  interestTotal.textContent = formatCurrency(total);

  if (!selectedProducts.length) {
    interestList.innerHTML = "<p>Nenhum produto selecionado.</p>";
    return;
  }

  interestList.innerHTML = selectedProducts
    .map(
      (product) => `
        <article class="interest-item">
          <div>
            <span>${product.category}</span>
            <strong>${product.name}</strong>
          </div>
          <div class="interest-item__meta">
            <strong>${product.price}</strong>
            <button type="button" data-remove="${product.name}" aria-label="Remover ${product.name}">
              Remover
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProducts(button.dataset.filter);
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-interest");
  if (!button) return;

  const productName = button.dataset.product;
  const product = products.find((item) => item.name === productName);
  if (product && !selectedProducts.some((item) => item.name === productName)) {
    selectedProducts.push(product);
  }

  button.textContent = "Adicionado";
  button.disabled = true;
  updateInterestList();
});

interestList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  const productName = button.dataset.remove;
  const index = selectedProducts.findIndex((product) => product.name === productName);
  if (index >= 0) {
    selectedProducts.splice(index, 1);
  }

  document.querySelectorAll(".add-interest").forEach((addButton) => {
    if (addButton.dataset.product === productName) {
      addButton.textContent = "Adicionar à lista";
      addButton.disabled = false;
    }
  });

  updateInterestList();
});

clearInterest.addEventListener("click", () => {
  selectedProducts.length = 0;
  document.querySelectorAll(".add-interest").forEach((button) => {
    button.textContent = "Adicionar à lista";
    button.disabled = false;
  });
  updateInterestList();
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(contactForm).get("name");
  const productsText = selectedProducts.length
    ? ` Produtos selecionados: ${selectedProducts
        .map((product) => product.name)
        .join(", ")}. Total estimado: ${interestTotal.textContent}.`
    : "";

  formFeedback.textContent = `Solicitação registrada, ${name}.${productsText} Em um projeto real, esses dados seriam enviados para uma API.`;
  contactForm.reset();
});

renderProducts();
