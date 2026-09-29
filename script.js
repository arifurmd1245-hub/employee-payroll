/* =========================================================
   ARIF FASHION HOUSE - STORE SCRIPT
   Color + Size + Quantity + Checkout + Orders
   ========================================================= */

const DATA_KEY = "afh_v3_data";
const ORDER_KEY = "afh_orders";

let currentProduct = null;
let selectedColor = "";
let selectedSize = "";
let selectedQty = 1;


/* =========================
   DATA
   ========================= */

function getData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);

    if (!raw) {
      return {
        settings: {},
        products: []
      };
    }

    const data = JSON.parse(raw);

    data.settings = data.settings || {};
    data.products = Array.isArray(data.products)
      ? data.products.map(normalizeProduct)
      : [];

    return data;

  } catch (error) {
    console.error("Data error:", error);

    return {
      settings: {},
      products: []
    };
  }
}


/* =========================
   PRODUCT NORMALIZER
   ========================= */

function normalizeProduct(p) {

  p = p || {};

  let colors = p.colors;
  let sizes = p.sizes;

  /* Color support */
  if (typeof colors === "string") {
    colors = colors
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(colors)) {
    colors = [];
  }

  /* Size support */
  if (typeof sizes === "string") {
    sizes = sizes
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(sizes)) {
    sizes = [];
  }

  return {
    ...p,

    id: p.id || p.productId || ("p-" + Date.now()),

    name: p.name || p.productName || "Product",

    image: p.image || p.productImage || "",

    category:
      p.category ||
      p.cat ||
      "men",

    cat:
      p.cat ||
      p.category ||
      "men",

    price:
      Number(p.price || p.productPrice || 0),

    oldPrice:
      Number(p.oldPrice || p.old || p.productOldPrice || 0),

    old:
      Number(p.old || p.oldPrice || p.productOldPrice || 0),

    colors: colors,

    sizes: sizes,

    youtube:
      p.youtube ||
      p.youtubeLink ||
      "",

    description:
      p.description ||
      p.desc ||
      "",

    desc:
      p.desc ||
      p.description ||
      ""
  };
}


function getProducts() {
  const data = getData();
  return data.products || [];
}


/* =========================
   SETTINGS
   ========================= */

function loadSettings() {

  const data = getData();
  const s = data.settings || {};

  const brand = document.getElementById("brandName");
  if (brand && s.brand) {
    brand.textContent = s.brand;
  }

  const shippingEl = document.getElementById("shippingCharge");

  if (shippingEl && s.shipping !== undefined) {
    shippingEl.value = s.shipping;
  }

  const hero = document.getElementById("heroText");

  if (hero && s.hero) {
    hero.textContent = s.hero;
  }
}


/* =========================
   PRODUCTS
   ========================= */

function renderProducts(category = "all") {

  const productsContainer =
    document.getElementById("productGrid") ||
    document.getElementById("products") ||
    document.querySelector(".product-grid");

  if (!productsContainer) return;

  const products = getProducts();

  const filtered = products.filter(product => {

    if (category === "all") return true;

    const cat = String(
      product.category ||
      product.cat ||
      ""
    ).toLowerCase();

    return cat === String(category).toLowerCase();
  });


  if (!filtered.length) {

    productsContainer.innerHTML =
      '<div class="no-products">No products found.</div>';

    return;
  }


  productsContainer.innerHTML = filtered.map(product => {

    const price = Number(product.price || 0);
    const oldPrice = Number(product.oldPrice || product.old || 0);

    return `
      <div class="product-card">

        <div class="product-image-wrap">
          ${
            product.image
              ? `<img src="${product.image}" class="product-image">`
              : `<div class="no-image">No Image</div>`
          }
        </div>

        <div class="product-info">

          <h3>${escapeHtml(product.name)}</h3>

          <div class="price-area">

            <span class="price">
              ৳${price}
            </span>

            ${
              oldPrice > price
                ? `<span class="old-price">৳${oldPrice}</span>`
                : ""
            }

          </div>

          <button
            class="order-btn"
            onclick="openCheckout('${product.id}')">
            Order Now
          </button>

        </div>

      </div>
    `;

  }).join("");
}


/* =========================
   CATEGORY
   ========================= */

function setupCategories() {

  const chips = document.querySelectorAll(".chip");

  chips.forEach(chip => {

    chip.addEventListener("click", function () {

      chips.forEach(c =>
        c.classList.remove("active")
      );

      this.classList.add("active");

      const category =
        this.dataset.category ||
        this.dataset.cat ||
        this.getAttribute("data-filter") ||
        "all";

      renderProducts(category);
    });

  });
}


/* =========================
   CHECKOUT
   ========================= */

function openCheckout(id) {

  const products = getProducts();

  currentProduct =
    products.find(p => String(p.id) === String(id));

  if (!currentProduct) {

    alert("Product not found.");
    return;
  }


  /* IMPORTANT:
     Color and Size are completely independent.
  */

  const colors = Array.isArray(currentProduct.colors)
    ? currentProduct.colors
    : [];

  const sizes = Array.isArray(currentProduct.sizes)
    ? currentProduct.sizes
    : [];


  selectedColor = colors.length
    ? colors[0]
    : "";

  selectedSize = sizes.length
    ? sizes[0]
    : "";

  selectedQty = 1;


  const modal =
    document.getElementById("checkoutModal") ||
    document.getElementById("checkout");

  if (!modal) {

    alert("Checkout section not found.");
    return;
  }


  /* Product name */

  const nameEl =
    document.getElementById("checkoutProductName");

  if (nameEl) {
    nameEl.textContent = currentProduct.name;
  }


  /* Product image */

  const imageEl =
    document.getElementById("checkoutProductImage");

  if (imageEl && currentProduct.image) {
    imageEl.src = currentProduct.image;
  }


  /* Product price */

  const priceEl =
    document.getElementById("checkoutPrice");

  if (priceEl) {
    priceEl.textContent =
      "৳" + Number(currentProduct.price || 0);
  }


  /* =========================
     COLOR
     ========================= */

  const colorBox =
    document.getElementById("colorOptions");

  if (colorBox) {

    if (colors.length) {

      colorBox.innerHTML = colors.map((color, index) => {

        return `
          <button
            type="button"
            class="color-option ${index === 0 ? "selected" : ""}"
            data-color="${escapeAttr(color)}"
            onclick="selectColor(this)">
            ${escapeHtml(color)}
          </button>
        `;

      }).join("");

    } else {

      colorBox.innerHTML =
        `<span class="option-unavailable">No color available</span>`;
    }
  }


  /* =========================
     SIZE
     ========================= */

  const sizeBox =
    document.getElementById("sizeOptions");

  if (sizeBox) {

    if (sizes.length) {

      sizeBox.innerHTML = sizes.map((size, index) => {

        return `
          <button
            type="button"
            class="size-option ${index === 0 ? "selected" : ""}"
            data-size="${escapeAttr(size)}"
            onclick="selectSize(this)">
            ${escapeHtml(size)}
          </button>
        `;

      }).join("");

    } else {

      sizeBox.innerHTML =
        `<span class="option-unavailable">No size available</span>`;
    }
  }


  /* =========================
     QUANTITY
     ========================= */

  updateQuantityDisplay();

  modal.classList.remove("hidden");

  updatePaymentInfo();
  updateTotal();
}


/* =========================
   COLOR SELECT
   ========================= */

function selectColor(button) {

  if (!button) return;

  const buttons =
    document.querySelectorAll(".color-option");

  buttons.forEach(btn =>
    btn.classList.remove("selected")
  );

  button.classList.add("selected");

  selectedColor =
    button.dataset.color ||
    button.textContent.trim();

  updateTotal();
}


/* =========================
   SIZE SELECT
   ========================= */

function selectSize(button) {

  if (!button) return;

  const buttons =
    document.querySelectorAll(".size-option");

  buttons.forEach(btn =>
    btn.classList.remove("selected")
  );

  button.classList.add("selected");

  selectedSize =
    button.dataset.size ||
    button.textContent.trim();

  updateTotal();
}


/* =========================
   QUANTITY
   ========================= */

function changeQty(amount) {

  selectedQty += Number(amount);

  if (selectedQty < 1) {
    selectedQty = 1;
  }

  if (selectedQty > 20) {
    selectedQty = 20;
  }

  updateQuantityDisplay();
  updateTotal();
}


function updateQuantityDisplay() {

  const qtyEl =
    document.getElementById("quantity") ||
    document.getElementById("orderQty");

  if (qtyEl) {
    qtyEl.textContent = selectedQty;
  }

  const input =
    document.querySelector(
      "#quantityInput, #orderQuantity"
    );

  if (input) {
    input.value = selectedQty;
  }
}


/* =========================
   TOTAL
   ========================= */

function updateTotal() {

  if (!currentProduct) return;

  const data = getData();
  const settings = data.settings || {};

  const productPrice =
    Number(currentProduct.price || 0);

  const shipping =
    Number(settings.shipping || 0);

  const productTotal =
    productPrice * selectedQty;

  const total =
    productTotal + shipping;


  const productTotalEl =
    document.getElementById("productTotal");

  if (productTotalEl) {
    productTotalEl.textContent =
      "৳" + productTotal;
  }


  const shippingEl =
    document.getElementById("orderShipping");

  if (shippingEl) {
    shippingEl.textContent =
      "৳" + shipping;
  }


  const totalEl =
    document.getElementById("orderTotal");

  if (totalEl) {
    totalEl.textContent =
      "৳" + total;
  }
}


/* =========================
   PAYMENT NUMBERS
   ========================= */

function updatePaymentInfo() {

  const data = getData();
  const settings = data.settings || {};

  let box =
    document.getElementById("paymentNumbers");


  const paymentArea =
    document.getElementById("paymentBox") ||
    document.querySelector(".payment-box") ||
    document.querySelector(".payment-methods");


  if (!paymentArea) return;


  if (!box) {

    box = document.createElement("div");

    box.id = "paymentNumbers";

    paymentArea.appendChild(box);
  }


  const bkash =
    settings.bkashNumber ||
    "";

  const nagad =
    settings.nagadNumber ||
    "";

  const rocket =
    settings.rocketNumber ||
    "";


  box.innerHTML = `
    ${
      bkash
        ? `<div><b>bKash:</b> ${escapeHtml(bkash)}</div>`
        : ""
    }

    ${
      nagad
        ? `<div><b>Nagad:</b> ${escapeHtml(nagad)}</div>`
        : ""
    }

    ${
      rocket
        ? `<div><b>Rocket:</b> ${escapeHtml(rocket)}</div>`
        : ""
    }
  `;
}


/* =========================
   CONFIRM CHECKBOX
   ========================= */

function toggleConfirm() {

  const checkbox =
    document.getElementById("confirmCheck");

  const button =
    document.getElementById("confirmOrder");

  if (!checkbox || !button) return;

  button.disabled =
    !checkbox.checked;
}


/* =========================
   SUBMIT ORDER
   ========================= */

function submitOrder() {

  if (!currentProduct) {
    alert("Please select a product.");
    return;
  }


  const name =
    getValue([
      "customerName",
      "orderName",
      "name"
    ]);

  const phone =
    getValue([
      "customerPhone",
      "orderPhone",
      "phone"
    ]);

  const address =
    getValue([
      "customerAddress",
      "orderAddress",
      "address"
    ]);


  const confirmCheck =
    document.getElementById("confirmCheck");


  if (!name) {

    alert("Please enter your name.");
    return;
  }


  if (!phone) {

    alert("Please enter your mobile number.");
    return;
  }


  if (!address) {

    alert("Please enter your address.");
    return;
  }


  if (confirmCheck && !confirmCheck.checked) {

    alert("Please confirm your order.");
    return;
  }


  const data = getData();
  const settings = data.settings || {};


  const price =
    Number(currentProduct.price || 0);

  const productTotal =
    price * selectedQty;

  const shipping =
    Number(settings.shipping || 0);

  const total =
    productTotal + shipping;


  const payment =
    getSelectedPayment();


  const order = {

    id:
      "AFH-" +
      Date.now(),

    date:
      new Date().toLocaleString(),

    name:
      name,

    phone:
      phone,

    address:
      address,

    product:
      currentProduct.name,

    productName:
      currentProduct.name,

    productImage:
      currentProduct.image || "",

    productId:
      currentProduct.id,

    qty:
      selectedQty,

    quantity:
      selectedQty,

    /* IMPORTANT */
    color:
      selectedColor,

    size:
      selectedSize,

    price:
      price,

    productTotal:
      productTotal,

    shipping:
      shipping,

    total:
      total,

    payment:
      payment,

    status:
      "Pending",

    source:
      "Direct Website"
  };


  let orders = [];

  try {

    orders =
      JSON.parse(
        localStorage.getItem(ORDER_KEY) || "[]"
      );

  } catch (e) {

    orders = [];
  }


  orders.push(order);


  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify(orders)
  );


  alert(
    "Order placed successfully!\n\n" +
    "Color: " +
    (selectedColor || "N/A") +
    "\nSize: " +
    (selectedSize || "N/A")
  );


  closeCheckout();
}


/* =========================
   PAYMENT METHOD
   ========================= */

function getSelectedPayment() {

  const checked =
    document.querySelector(
      'input[name="payment"]:checked'
    );

  if (checked) {
    return checked.value;
  }

  return "Cash on Delivery";
}


/* =========================
   CLOSE CHECKOUT
   ========================= */

function closeCheckout() {

  const modal =
    document.getElementById("checkoutModal") ||
    document.getElementById("checkout");

  if (modal) {
    modal.classList.add("hidden");
  }

  currentProduct = null;
  selectedColor = "";
  selectedSize = "";
  selectedQty = 1;
}


/* =========================
   HELPERS
   ========================= */

function getValue(ids) {

  for (const id of ids) {

    const el =
      document.getElementById(id);

    if (el && el.value !== undefined) {

      return el.value.trim();
    }
  }

  return "";
}


function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttr(value) {

  return escapeHtml(value);
}


/* =========================
   START
   ========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadSettings();

    renderProducts("all");

    setupCategories();


    document
      .querySelectorAll(
        'input[name="payment"]'
      )
      .forEach(input => {

        input.addEventListener(
          "change",
          updatePaymentInfo
        );

      });

  }
);
