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
    const saved = localStorage.getItem(DATA_KEY);

    if (!saved) {
      return {
        settings: {},
        products: []
      };
    }

    const data = JSON.parse(saved);

    if (!data.settings) {
      data.settings = {};
    }

    if (!Array.isArray(data.products)) {
      data.products = [];
    }

    return data;

  } catch (error) {
    return {
      settings: {},
      products: []
    };
  }
}


function normalizeProduct(product) {

  return {
    id: product.id || "",
    name: product.name || "Product",

    cat: String(
      product.cat ||
      product.category ||
      "other"
    ).toLowerCase(),

    image: product.image || "",

    price: Number(
      product.price || 0
    ),

    old: Number(
      product.old ??
      product.oldPrice ??
      0
    ),

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : [],

    youtube: product.youtube || "",

    desc:
      product.desc ??
      product.description ??
      ""
  };
}


/* =========================
   HTML SECURITY
========================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   SETTINGS
========================= */

function loadSettings() {

  const data = getData();
  const s = data.settings || {};

  const brand =
    document.getElementById("brandName");

  const hero =
    document.getElementById("heroTitle");

  const warning =
    document.getElementById("warningText");

  if (brand) {
    brand.textContent =
      s.brand ||
      "Arif Fashion House";
  }

  if (hero) {
    hero.textContent =
      s.hero ||
      "Style • Quality • Reliable Service";
  }

  if (warning) {
    warning.textContent =
      s.warning ||
      "অর্ডার করার আগে আপনার নাম, মোবাইল নম্বর, ঠিকানা এবং পণ্যের তথ্য যাচাই করুন।";
  }
}


/* =========================
   PRODUCTS
========================= */

function getProducts() {

  const data = getData();

  return data.products.map(
    normalizeProduct
  );
}


function categoryMatch(product, category) {

  if (category === "all") {
    return true;
  }

  return (
    String(product.cat)
      .toLowerCase() ===
    String(category)
      .toLowerCase()
  );
}


function renderProducts(category = "all") {

  const container =
    document.getElementById("products");

  if (!container) return;

  const products =
    getProducts().filter(
      product =>
        categoryMatch(
          product,
          category
        )
    );

  if (!products.length) {

    container.innerHTML = `
      <div class="empty-card">
        <h3>📦 No Products Found</h3>
        <p>এই category-তে কোনো product নেই।</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    products.map(function(product) {

      const discount =
        product.old > product.price
          ? Math.round(
              (
                (product.old - product.price) /
                product.old
              ) * 100
            )
          : 0;

      return `
        <div class="product-card">

          ${
            product.image
              ? `
                <img
                  src="${escapeHtml(product.image)}"
                  alt="${escapeHtml(product.name)}"
                  class="product-image"
                  onerror="this.style.display='none'"
                >
              `
              : `
                <div class="product-image placeholder">
                  📷
                </div>
              `
          }

          <div class="product-info">

            <h3>
              ${escapeHtml(product.name)}
            </h3>

            <div class="price-row">

              <strong>
                ৳${product.price}
              </strong>

              ${
                product.old > product.price
                  ? `
                    <del>
                      ৳${product.old}
                    </del>
                  `
                  : ""
              }

            </div>

            ${
              discount
                ? `
                  <span class="discount">
                    ${discount}% OFF
                  </span>
                `
                : ""
            }

            <button
              class="primary"
              onclick="openCheckout('${escapeHtml(product.id)}')"
            >
              🛒 Order Now
            </button>

          </div>

        </div>
      `;

    }).join("");
}


/* =========================
   CATEGORY BUTTONS
========================= */

function setupCategories() {

  const chips =
    document.querySelectorAll(
      ".chip"
    );

  chips.forEach(function(chip) {

    chip.addEventListener(
      "click",
      function() {

        chips.forEach(
          c =>
            c.classList.remove(
              "active"
            )
        );

        chip.classList.add(
          "active"
        );

        renderProducts(
          chip.dataset.cat || "all"
        );
      }
    );

  });
}


/* =========================
   CHECKOUT
========================= */

function openCheckout(id) {

  const products =
    getProducts();

  currentProduct =
    products.find(
      p =>
        String(p.id) ===
        String(id)
    );

  if (!currentProduct) {

    alert(
      "Product পাওয়া যায়নি।"
    );

    return;
  }

  selectedColor =
    currentProduct.colors.length
      ? currentProduct.colors[0]
      : "";

  selectedSize =
    currentProduct.sizes.length
      ? currentProduct.sizes[0]
      : "";

  selectedQty = 1;

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  const summary =
    document.getElementById(
      "summaryBox"
    );

  if (!modal || !summary) return;


  /* PRODUCT SUMMARY */

  summary.innerHTML = `

    ${
      currentProduct.image
        ? `
          <img
            src="${escapeHtml(
              currentProduct.image
            )}"
            style="
              width:100px;
              height:100px;
              object-fit:cover;
              border-radius:8px;
            "
          >
        `
        : ""
    }

    <h3>
      ${escapeHtml(
        currentProduct.name
      )}
    </h3>

    <p>
      Price:
      <strong>
        ৳${currentProduct.price}
      </strong>
    </p>

    ${
      currentProduct.colors.length
        ? `
          <div>
            <strong>🎨 Color:</strong>

            <div id="colorOptions"
                 class="option-group">

              ${currentProduct.colors
                .map(function(color, index) {

                  return `
                    <button
                      type="button"
                      class="option color-option ${
                        index === 0
                          ? "selected"
                          : ""
                      }"
                      data-color="${escapeHtml(color)}"
                      onclick="selectColor(this)"
                    >
                      ${escapeHtml(color)}
                    </button>
                  `;

                }).join("")}

            </div>
          </div>
        `
        : ""
    }


    ${
      currentProduct.sizes.length
        ? `
          <div>
            <strong>📏 Size:</strong>

            <div id="sizeOptions"
                 class="option-group">

              ${currentProduct.sizes
                .map(function(size, index) {

                  return `
                    <button
                      type="button"
                      class="option size-option ${
                        index === 0
                          ? "selected"
                          : ""
                      }"
                      data-size="${escapeHtml(size)}"
                      onclick="selectSize(this)"
                    >
                      ${escapeHtml(size)}
                    </button>
                  `;

                }).join("")}

            </div>
          </div>
        `
        : ""
    }


    <div style="margin-top:15px">

      <strong>
        Quantity:
      </strong>

      <div
        style="
          display:flex;
          align-items:center;
          gap:10px;
          margin-top:8px;
        "
      >

        <button
          type="button"
          onclick="changeQty(-1)"
        >
          −
        </button>

        <strong id="qtyValue">
          1
        </strong>

        <button
          type="button"
          onclick="changeQty(1)"
        >
          +
        </button>

      </div>

    </div>

  `;


  const ship =
    Number(
      getData().settings?.shipping || 0
    );

  const shipElement =
    document.getElementById(
      "shipCharge"
    );

  if (shipElement) {
    shipElement.textContent =
      "৳" + ship;
  }


  modal.classList.remove(
    "hidden"
  );

  updatePaymentInfo();

  updateTotal();
}


function closeCheckout() {

  const modal =
    document.getElementById(
      "checkoutModal"
    );

  if (modal) {
    modal.classList.add(
      "hidden"
    );
  }
}


/* =========================
   COLOR / SIZE
========================= */

function selectColor(button) {

  selectedColor =
    button.dataset.color || "";

  document
    .querySelectorAll(
      ".color-option"
    )
    .forEach(function(btn) {

      btn.classList.remove(
        "selected"
      );

    });

  button.classList.add(
    "selected"
  );
}


function selectSize(button) {

  selectedSize =
    button.dataset.size || "";

  document
    .querySelectorAll(
      ".size-option"
    )
    .forEach(function(btn) {

      btn.classList.remove(
        "selected"
      );

    });

  button.classList.add(
    "selected"
  );
}


/* =========================
   QUANTITY
========================= */

function changeQty(change) {

  selectedQty += change;

  if (selectedQty < 1) {
    selectedQty = 1;
  }

  if (selectedQty > 20) {
    selectedQty = 20;
  }

  const qty =
    document.getElementById(
      "qtyValue"
    );

  if (qty) {
    qty.textContent =
      selectedQty;
  }

  updateTotal();
}


/* =========================
   TOTAL
========================= */

function updateTotal() {

  if (!currentProduct) return;

  const shipping =
    Number(
      getData().settings?.shipping || 0
    );

  const productTotal =
    currentProduct.price *
    selectedQty;

  const total =
    productTotal +
    shipping;

  const totalElement =
    document.getElementById(
      "orderTotal"
    );

  if (totalElement) {

    totalElement.textContent =
      "৳" + total;

  }
}


/* =========================
   PAYMENT INFO
========================= */

function updatePaymentInfo() {

  const data = getData();
  const s = data.settings || {};

  let box =
    document.getElementById(
      "paymentNumbers"
    );

  if (!box) {

    const paymentBox =
      document.querySelector(
        'input[name="payment"]'
      )?.closest(".box");

    if (!paymentBox) return;

    box =
      document.createElement("div");

    box.id =
      "paymentNumbers";

    box.style.marginTop =
      "12px";

    paymentBox.appendChild(box);
  }


  box.innerHTML = `

    <div
      style="
        border:1px solid #ddd;
        padding:10px;
        border-radius:8px;
        background:#fafafa;
      "
    >

      <strong>
        💳 Advance Payment Numbers
      </strong>

      ${
        s.bkashNumber
          ? `
            <p>
              <b>bKash:</b>
              ${escapeHtml(
                s.bkashNumber
              )}
            </p>
          `
          : ""
      }

      ${
        s.nagadNumber
          ? `
            <p>
              <b>Nagad:</b>
              ${escapeHtml(
                s.nagadNumber
              )}
            </p>
          `
          : ""
      }

      ${
        s.rocketNumber
          ? `
            <p>
              <b>Rocket:</b>
              ${escapeHtml(
                s.rocketNumber
              )}
            </p>
          `
          : ""
      }

    </div>

  `;
}


/* =========================
   CONFIRM BUTTON
========================= */

function toggleConfirm() {

  const checkbox =
    document.getElementById(
      "confirmCheck"
    );

  const button =
    document.getElementById(
      "confirmBtn"
    );

  if (!checkbox || !button) return;

  button.disabled =
    !checkbox.checked;
}


/* =========================
   SUBMIT ORDER
========================= */

function submitOrder() {

  if (!currentProduct) {

    alert(
      "Product পাওয়া যায়নি।"
    );

    return;
  }

  const name =
    document.getElementById(
      "cName"
    )?.value.trim();

  const phone =
    document.getElementById(
      "cPhone"
    )?.value.trim();

  const address =
    document.getElementById(
      "cAddress"
    )?.value.trim();

  const checkbox =
    document.getElementById(
      "confirmCheck"
    );

  if (!name) {
    alert(
      "Customer Name দিন।"
    );
    return;
  }

  if (!phone) {
    alert(
      "Mobile Number দিন।"
    );
    return;
  }

  if (!address) {
    alert(
      "Full Delivery Address দিন।"
    );
    return;
  }

  if (!checkbox?.checked) {
    alert(
      "Order confirmation checkbox দিন।"
    );
    return;
  }


  const payment =
    document.querySelector(
      'input[name="payment"]:checked'
    )?.value || "COD";


  const shipping =
    Number(
      getData().settings?.shipping || 0
    );

  const productTotal =
    currentProduct.price *
    selectedQty;

  const total =
    productTotal +
    shipping;


  const order = {

    id:
      "AFH-" +
      Date.now(),

    date:
      new Date().toLocaleString(),

    name,

    phone,

    address,

    product:
      currentProduct.name,

    productName:
      currentProduct.name,

    productImage:
      currentProduct.image,

    productId:
      currentProduct.id,

    qty:
      selectedQty,

    quantity:
      selectedQty,

    color:
      selectedColor,

    size:
      selectedSize,

    price:
      currentProduct.price,

    productTotal,

    shipping,

    total,

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
        localStorage.getItem(
          ORDER_KEY
        )
      ) || [];

  } catch (error) {

    orders = [];

  }


  if (!Array.isArray(orders)) {
    orders = [];
  }


  orders.push(order);


  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify(orders)
  );


  alert(
    "✅ আপনার order successfully placed হয়েছে!"
  );


  closeCheckout();


  const formFields = [
    "cName",
    "cPhone",
    "cAddress"
  ];

  formFields.forEach(
    function(id) {

      const field =
        document.getElementById(id);

      if (field) {
        field.value = "";
      }

    }
  );


  const check =
    document.getElementById(
      "confirmCheck"
    );

  if (check) {
    check.checked = false;
  }


  const btn =
    document.getElementById(
      "confirmBtn"
    );

  if (btn) {
    btn.disabled = true;
  }

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSettings();

    renderProducts();

    setupCategories();

    const paymentRadios =
      document.querySelectorAll(
        'input[name="payment"]'
      );

    paymentRadios.forEach(
      function(radio) {

        radio.addEventListener(
          "change",
          updatePaymentInfo
        );

      }
    );

  }
);
