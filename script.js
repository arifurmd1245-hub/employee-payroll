const KEY = "afh_v3_data";

const defaultData = {
  settings: {
    brand: "Arif Fashion House",
    hero: "Style • Quality • Reliable Service",
    shipping: 80,
    cod: true,
    advance: true,
    warning:
      "আপনার অর্ডারটি নিশ্চিত করার আগে অনুগ্রহ করে পণ্য, সাইজ/কালার, ঠিকানা ও মোবাইল নম্বর ভালোভাবে যাচাই করুন। আপনি অর্ডারটি গ্রহণ করতে পারবেন—এটি নিশ্চিত হয়ে তারপর Confirm Order করুন।"
  },

  products: [
    {
      id: "p1",
      name: "Premium T-Shirt",
      cat: "men",
      price: 650,
      old: 800,
      colors: ["Black", "Blue"],
      sizes: ["M", "L", "XL"],
      image: "",
      desc: "Comfortable premium cotton T-shirt."
    },
    {
      id: "p2",
      name: "Ladies Three Piece",
      cat: "women",
      price: 1250,
      old: 1500,
      colors: ["Black", "Blue", "Red"],
      sizes: [],
      image: "",
      desc: "Stylish three piece for everyday fashion."
    }
  ]
};

function getData() {
  const saved = localStorage.getItem(KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(KEY, JSON.stringify(defaultData));
  return defaultData;
}

function money(number) {
  return "৳" + Number(number || 0).toLocaleString("en-BD");
}

let selectedProduct = null;
let selectedColor = "";
let selectedSize = "";

function renderProducts(category = "all") {
  const data = getData();

  document.getElementById("brandName").textContent =
    data.settings.brand;

  document.getElementById("heroTitle").textContent =
    data.settings.hero;

  const productsBox = document.getElementById("products");

  const products = data.products.filter(function (product) {
    return category === "all" || product.cat === category;
  });

  if (products.length === 0) {
    productsBox.innerHTML =
      "<p>No products available.</p>";
    return;
  }

  productsBox.innerHTML = products
    .map(function (product) {
      let discount = "";

      if (product.old && product.old > product.price) {
        discount =
          Math.round(
            (1 - product.price / product.old) * 100
          ) + "% OFF";
      }

      let colorsHTML = "";

      if (product.colors && product.colors.length) {
        colorsHTML = `
          <div>
            <small><b>Color:</b></small>
            <div class="options">
              ${product.colors
                .map(
                  function (color) {
                    return `
                    <button
                      type="button"
                      class="option"
                      onclick="selectColor('${product.id}','${color}',this)">
                      ${color}
                    </button>
                    `;
                  }
                )
                .join("")}
            </div>
          </div>
        `;
      }

      let sizesHTML = "";

      if (product.sizes && product.sizes.length) {
        sizesHTML = `
          <div>
            <small><b>Size:</b></small>
            <div class="options">
              ${product.sizes
                .map(
                  function (size) {
                    return `
                    <button
                      type="button"
                      class="option"
                      onclick="selectSize('${product.id}','${size}',this)">
                      ${size}
                    </button>
                    `;
                  }
                )
                .join("")}
            </div>
          </div>
        `;
      }

      return `
        <div class="card">

          <img
            src="${product.image || "cover.png"}"
            alt="${product.name}"
          >

          <h3>${product.name}</h3>

          <div>
            <span class="price">
              ${money(product.price)}
            </span>

            ${
              product.old
                ? `<span class="old">
                    ${money(product.old)}
                   </span>`
                : ""
            }

            ${
              discount
                ? `<span class="discount">
                    ${discount}
                   </span>`
                : ""
            }
          </div>

          <p class="muted">
            ${product.desc || ""}
          </p>

          ${colorsHTML}

          ${sizesHTML}

          <div
            style="
              display:flex;
              gap:7px;
              margin-top:10px;
            "
          >

            <input
              id="qty-${product.id}"
              type="number"
              min="1"
              value="1"
              style="max-width:80px"
            >

            <button
              class="primary"
              onclick="openCheckout('${product.id}')"
            >
              Order Now
            </button>

          </div>

        </div>
      `;
    })
    .join("");
}

function selectColor(productId, color, button) {
  selectedColor = color;

  const card = button.closest(".card");

  card
    .querySelectorAll(".option")
    .forEach(function (item) {
      item.style.background = "";
      item.style.color = "";
    });

  button.style.background = "#111";
  button.style.color = "#fff";
}

function selectSize(productId, size, button) {
  selectedSize = size;

  const card = button.closest(".card");

  const sizeButtons = card.querySelectorAll(".option");

  sizeButtons.forEach(function (item) {
    item.style.background = "";
    item.style.color = "";
  });

  button.style.background = "#111";
  button.style.color = "#fff";
}

function openCheckout(id) {
  const data = getData();

  const product = data.products.find(function (item) {
    return item.id === id;
  });

  if (!product) {
    alert("Product not found.");
    return;
  }

  selectedColor = "";
  selectedSize = "";

  const quantityInput =
    document.getElementById("qty-" + id);

  const quantity = Number(
    quantityInput ? quantityInput.value : 1
  );

  selectedProduct = {
    ...product,
    qty: quantity
  };

  let optionsText = "";

  if (product.colors && product.colors.length) {
    optionsText += `
      <p>
        <b>Color:</b>
        Please select before confirming.
      </p>
    `;
  }

  if (product.sizes && product.sizes.length) {
    optionsText += `
      <p>
        <b>Size:</b>
        Please select before confirming.
      </p>
    `;
  }

  document.getElementById("summaryBox").innerHTML = `
    <h3>🛍️ Order Summary</h3>

    <div class="row">
      <span>
        ${product.name} × ${quantity}
      </span>

      <b>
        ${money(product.price * quantity)}
      </b>
    </div>

    ${optionsText}
  `;

  document.getElementById("shipCharge").textContent =
    money(data.settings.shipping);

  document.getElementById("warningText").textContent =
    data.settings.warning;

  const codRadio =
    document.querySelector(
      'input[name="payment"][value="COD"]'
    );

  const advanceRadio =
    document.querySelector(
      'input[name="payment"][value="Advance"]'
    );

  if (codRadio) {
    codRadio.parentElement.style.display =
      data.settings.cod ? "block" : "none";

    codRadio.checked = data.settings.cod;
  }

  if (advanceRadio) {
    advanceRadio.parentElement.style.display =
      data.settings.advance ? "block" : "none";

    if (!data.settings.cod && data.settings.advance) {
      advanceRadio.checked = true;
    }
  }

  document.getElementById("cName").value = "";
  document.getElementById("cPhone").value = "";
  document.getElementById("cAddress").value = "";

  document.getElementById("confirmCheck").checked = false;

  toggleConfirm();

  document
    .getElementById("checkoutModal")
    .classList.remove("hidden");
}

function closeCheckout() {
  document
    .getElementById("checkoutModal")
    .classList.add("hidden");
}

function toggleConfirm() {
  const checkbox =
    document.getElementById("confirmCheck");

  const button =
    document.getElementById("confirmBtn");

  button.disabled = !checkbox.checked;
}

function submitOrder() {
  const data = getData();

  if (!selectedProduct) {
    alert("Please select a product.");
    return;
  }

  if (
    selectedProduct.colors &&
    selectedProduct.colors.length &&
    !selectedColor
  ) {
    alert("Please select a color.");
    return;
  }

  if (
    selectedProduct.sizes &&
    selectedProduct.sizes.length &&
    !selectedSize
  ) {
    alert("Please select a size.");
    return;
  }

  const name =
    document.getElementById("cName").value.trim();

  const phone =
    document.getElementById("cPhone").value.trim();

  const address =
    document.getElementById("cAddress").value.trim();

  if (!name || !phone || !address) {
    alert(
      "Please fill Customer Name, Mobile Number and Address."
    );
    return;
  }

  const paymentElement =
    document.querySelector(
      'input[name="payment"]:checked'
    );

  if (!paymentElement) {
    alert("Please select a payment method.");
    return;
  }

  const payment = paymentElement.value;

  if (payment === "COD" && !data.settings.cod) {
    alert("Cash on Delivery is currently unavailable.");
    return;
  }

  if (
    payment === "Advance" &&
    !data.settings.advance
  ) {
    alert("Advance payment is currently unavailable.");
    return;
  }

  const shipping =
    Number(data.settings.shipping || 0);

  const productTotal =
    Number(selectedProduct.price) *
    Number(selectedProduct.qty);

  const total = productTotal + shipping;

  const orders = JSON.parse(
    localStorage.getItem("afh_orders") || "[]"
  );

  const newOrder = {
    id: "AFH-" + Date.now(),

    date: new Date().toLocaleString(),

    name: name,

    phone: phone,

    address: address,

    product: selectedProduct.name,

    qty: selectedProduct.qty,

    color: selectedColor,

    size: selectedSize,

    price: selectedProduct.price,

    shipping: shipping,

    productTotal: productTotal,

    total: total,

    payment: payment,

    status: "Pending",

    image: selectedProduct.image || "",

    source:
      new URLSearchParams(
        window.location.search
      ).get("source") || "Website"
  };

  orders.unshift(newOrder);

  localStorage.setItem(
    "afh_orders",
    JSON.stringify(orders)
  );

  alert(
    "✅ Order submitted successfully!\n\n" +
    "Order ID: " +
    newOrder.id
  );

  closeCheckout();
}

document
  .querySelectorAll(".chip")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".chip")
        .forEach(function (item) {
          item.classList.remove("active");
        });

      button.classList.add("active");

      renderProducts(button.dataset.cat);
    });
  });

renderProducts();
