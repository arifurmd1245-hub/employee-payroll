const DATA_KEY = "afh_v3_data";
const ORDER_KEY = "afh_orders";

const defaultData = {
  settings: {
    brand: "Arif Fashion House",
    hero: "Trendy • Stylish • Quality Clothing",
    shipping: 80,
    cod: true,
    advance: true,
    bkashNumber: "",
    nagadNumber: "",
    rocketNumber: "",
    warning:
      "📦 Order Confirmation\nআপনার অর্ডারটি নিশ্চিত করার আগে অনুগ্রহ করে পণ্য, সাইজ/কালার, ঠিকানা ও মোবাইল নম্বর ভালোভাবে যাচাই করুন।\nআপনি অর্ডারটি গ্রহণ করতে পারবেন—এটি নিশ্চিত হয়ে তারপর Confirm Order করুন।"
  },

  products: [
    {
      id: "p1",
      name: "Premium T-Shirt",
      cat: "men",
      category: "men",
      price: 650,
      old: 800,
      oldPrice: 800,
      colors: ["Black", "Blue"],
      sizes: ["M", "L", "XL"],
      image: "",
      youtube: "",
      desc: "Comfortable premium cotton T-shirt.",
      description: "Comfortable premium cotton T-shirt."
    }
  ]
};


/* =========================
   DATA
========================= */

function normalizeProduct(product) {
  product = product || {};

  const cat = String(
    product.cat ||
    product.category ||
    "other"
  ).toLowerCase();

  const oldPrice = Number(
    product.old ??
    product.oldPrice ??
    0
  );

  const description =
    product.desc ??
    product.description ??
    "";

  return {
    id: product.id || ("P" + Date.now()),
    name: product.name || "",
    cat: cat,
    category: cat,
    image: product.image || "",
    price: Number(product.price || 0),
    old: oldPrice,
    oldPrice: oldPrice,
    colors: Array.isArray(product.colors)
      ? product.colors
      : [],
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : [],
    youtube: product.youtube || "",
    desc: description,
    description: description
  };
}


function getData() {
  const saved = localStorage.getItem(DATA_KEY);

  if (!saved) {
    const data = JSON.parse(
      JSON.stringify(defaultData)
    );

    localStorage.setItem(
      DATA_KEY,
      JSON.stringify(data)
    );

    return data;
  }

  try {
    const data = JSON.parse(saved);

    if (!data.settings) {
      data.settings = {};
    }

    data.settings = {
      ...defaultData.settings,
      ...data.settings
    };

    if (!Array.isArray(data.products)) {
      data.products = [];
    }

    data.products =
      data.products.map(normalizeProduct);

    /*
      Old data repair:
      যদি Premium T-Shirt হারিয়ে যায়,
      একবার automatically ফিরিয়ে আনা হবে।
    */
    const repairKey =
      "afh_default_repair_v1";

    const premiumExists =
      data.products.some(
        p => p.id === "p1"
      );

    if (
      !premiumExists &&
      !localStorage.getItem(repairKey)
    ) {
      data.products.unshift(
        normalizeProduct(defaultData.products[0])
      );

      localStorage.setItem(
        repairKey,
        "done"
      );
    }

    saveData(data);

    return data;

  } catch (error) {

    const data = JSON.parse(
      JSON.stringify(defaultData)
    );

    localStorage.setItem(
      DATA_KEY,
      JSON.stringify(data)
    );

    return data;
  }
}


function saveData(data) {
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify(data)
  );
}


/* =========================
   WEBSITE SETTINGS
========================= */

function loadSettings() {

  const data = getData();
  const s = data.settings || {};

  const brand =
    document.getElementById("brand");

  const hero =
    document.getElementById("hero");

  const shipping =
    document.getElementById("shipping");

  const warning =
    document.getElementById("warning");

  const cod =
    document.getElementById("codEnabled");

  const advance =
    document.getElementById("advanceEnabled");

  if (brand) {
    brand.value = s.brand || "";
  }

  if (hero) {
    hero.value = s.hero || "";
  }

  if (shipping) {
    shipping.value = s.shipping || 0;
  }

  if (warning) {
    warning.value = s.warning || "";
  }

  if (cod) {
    cod.checked = s.cod !== false;
  }

  if (advance) {
    advance.checked = s.advance !== false;
  }

  const bkash =
    document.getElementById("bkashNumber");

  const nagad =
    document.getElementById("nagadNumber");

  const rocket =
    document.getElementById("rocketNumber");

  if (bkash) {
    bkash.value =
      s.bkashNumber || "";
  }

  if (nagad) {
    nagad.value =
      s.nagadNumber || "";
  }

  if (rocket) {
    rocket.value =
      s.rocketNumber || "";
  }
}


function saveSettings() {

  const data = getData();

  const brand =
    document.getElementById("brand");

  const hero =
    document.getElementById("hero");

  const shipping =
    document.getElementById("shipping");

  const warning =
    document.getElementById("warning");

  const cod =
    document.getElementById("codEnabled");

  const advance =
    document.getElementById("advanceEnabled");

  const bkash =
    document.getElementById("bkashNumber");

  const nagad =
    document.getElementById("nagadNumber");

  const rocket =
    document.getElementById("rocketNumber");

  data.settings = {
    ...data.settings,

    brand: brand
      ? brand.value.trim()
      : data.settings.brand,

    hero: hero
      ? hero.value.trim()
      : data.settings.hero,

    shipping: shipping
      ? Number(shipping.value) || 0
      : data.settings.shipping,

    cod: cod
      ? cod.checked
      : data.settings.cod,

    advance: advance
      ? advance.checked
      : data.settings.advance,

    warning: warning
      ? warning.value.trim()
      : data.settings.warning,

    bkashNumber: bkash
      ? bkash.value.trim()
      : data.settings.bkashNumber || "",

    nagadNumber: nagad
      ? nagad.value.trim()
      : data.settings.nagadNumber || "",

    rocketNumber: rocket
      ? rocket.value.trim()
      : data.settings.rocketNumber || ""
  };

  saveData(data);

  alert(
    "✅ Website settings saved successfully!"
  );
}


/* =========================
   PRODUCT SAVE
========================= */

function saveProduct() {

  const data = getData();

  const id =
    document.getElementById("productId").value ||
    "P" + Date.now();

  const name =
    document.getElementById("productName")
      .value.trim();

  const category =
    document.getElementById("productCategory")
      .value;

  const image =
    document.getElementById("productImage")
      .value.trim();

  const price =
    Number(
      document.getElementById("productPrice")
        .value
    ) || 0;

  const oldPrice =
    Number(
      document.getElementById("productOldPrice")
        .value
    ) || 0;

  const colorsText =
    document.getElementById("productColors")
      .value.trim();

  const sizesText =
    document.getElementById("productSizes")
      .value.trim();

  const youtube =
    document.getElementById("productYoutube")
      .value.trim();

  const description =
    document.getElementById(
      "productDescription"
    ).value.trim();

  if (!name) {
    alert("⚠️ Product name দিন");
    return;
  }

  if (!price) {
    alert("⚠️ Product price দিন");
    return;
  }

  const colors = colorsText
    ? colorsText
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
    : [];

  const sizes = sizesText
    ? sizesText
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
    : [];

  const cat =
    String(category || "other")
      .toLowerCase();

  const product = {
    id,
    name,

    cat,
    category: cat,

    image,

    price,

    old: oldPrice,
    oldPrice,

    colors,
    sizes,

    youtube,

    desc: description,
    description
  };

  const existingIndex =
    data.products.findIndex(
      p => String(p.id) === String(id)
    );

  if (existingIndex >= 0) {
    data.products[existingIndex] =
      product;
  } else {
    data.products.push(product);
  }

  saveData(data);

  clearProductForm();

  renderProducts();

  alert(
    "✅ Product saved successfully!"
  );
}


/* =========================
   CLEAR PRODUCT FORM
========================= */

function clearProductForm() {

  document.getElementById(
    "productId"
  ).value = "";

  document.getElementById(
    "productName"
  ).value = "";

  document.getElementById(
    "productCategory"
  ).value = "men";

  document.getElementById(
    "productImage"
  ).value = "";

  document.getElementById(
    "productPrice"
  ).value = "";

  document.getElementById(
    "productOldPrice"
  ).value = "";

  document.getElementById(
    "productColors"
  ).value = "";

  document.getElementById(
    "productSizes"
  ).value = "";

  document.getElementById(
    "productYoutube"
  ).value = "";

  document.getElementById(
    "productDescription"
  ).value = "";
    }
/* =========================
   EDIT PRODUCT
========================= */

function editProduct(id) {

  const data = getData();

  const product =
    data.products.find(
      p => String(p.id) === String(id)
    );

  if (!product) {
    alert("Product পাওয়া যায়নি");
    return;
  }

  document.getElementById(
    "productId"
  ).value = product.id || "";

  document.getElementById(
    "productName"
  ).value = product.name || "";

  document.getElementById(
    "productCategory"
  ).value =
    String(
      product.cat ||
      product.category ||
      "other"
    ).toLowerCase();

  document.getElementById(
    "productImage"
  ).value =
    product.image || "";

  document.getElementById(
    "productPrice"
  ).value =
    product.price || "";

  document.getElementById(
    "productOldPrice"
  ).value =
    product.old ??
    product.oldPrice ??
    "";

  document.getElementById(
    "productColors"
  ).value =
    (product.colors || []).join(", ");

  document.getElementById(
    "productSizes"
  ).value =
    (product.sizes || []).join(", ");

  document.getElementById(
    "productYoutube"
  ).value =
    product.youtube || "";

  document.getElementById(
    "productDescription"
  ).value =
    product.desc ??
    product.description ??
    "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id) {

  const ok = confirm(
    "এই product টি delete করতে চান?"
  );

  if (!ok) return;

  const data = getData();

  data.products =
    data.products.filter(
      p => String(p.id) !== String(id)
    );

  saveData(data);

  renderProducts();

  alert(
    "🗑️ Product deleted"
  );
}


/* =========================
   CATEGORY NAME
========================= */

function categoryName(category) {

  const cat =
    String(category || "")
      .toLowerCase();

  if (cat === "men") return "Men";
  if (cat === "women") return "Women";
  if (cat === "kids") return "Kids";

  return "Other";
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const data = getData();

  const container =
    document.getElementById(
      "productsGrid"
    );

  const count =
    document.getElementById(
      "productCount"
    );

  if (!container) return;

  if (count) {
    count.textContent =
      `${data.products.length} Products`;
  }

  if (!data.products.length) {

    container.innerHTML = `
      <div class="empty-card">
        <h3>📦 No Products</h3>
        <p>উপরে Product Add করুন।</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    data.products
      .map(function(product) {

        const price =
          Number(product.price || 0);

        const oldPrice =
          Number(
            product.old ??
            product.oldPrice ??
            0
          );

        const discount =
          oldPrice > price
            ? Math.round(
                ((oldPrice - price) /
                  oldPrice) * 100
              )
            : 0;

        const colors =
          Array.isArray(product.colors)
            ? product.colors
            : [];

        const sizes =
          Array.isArray(product.sizes)
            ? product.sizes
            : [];

        return `
          <div class="admin-card">

            ${
              product.image
                ? `
                  <img
                    src="${escapeHtml(
                      product.image
                    )}"
                    class="admin-product-image"
                    onerror="
                      this.style.display='none'
                    "
                  >
                `
                : `
                  <div class="image-placeholder">
                    📷
                  </div>
                `
            }

            <h3>
              ${escapeHtml(
                product.name
              )}
            </h3>

            <p>
              Category:
              <strong>
                ${escapeHtml(
                  categoryName(
                    product.cat ||
                    product.category
                  )
                )}
              </strong>
            </p>

            <p>
              Price:
              <strong>
                ৳${price}
              </strong>
            </p>

            ${
              oldPrice
                ? `
                  <p class="old-price">
                    Old Price:
                    ৳${oldPrice}
                  </p>
                `
                : ""
            }

            ${
              discount
                ? `
                  <p>
                    🔥 Discount:
                    ${discount}%
                  </p>
                `
                : ""
            }

            ${
              colors.length
                ? `
                  <p>
                    🎨 Colors:
                    ${escapeHtml(
                      colors.join(", ")
                    )}
                  </p>
                `
                : ""
            }

            ${
              sizes.length
                ? `
                  <p>
                    📏 Sizes:
                    ${escapeHtml(
                      sizes.join(", ")
                    )}
                  </p>
                `
                : ""
            }

            ${
              product.youtube
                ? `
                  <p>
                    ▶️ YouTube Video Added
                  </p>
                `
                : ""
            }

            <div class="button-row">

              <button
                class="secondary-btn"
                onclick="
                  editProduct(
                    '${escapeJs(
                      product.id
                    )}'
                  )
                "
              >
                ✏️ Edit
              </button>

              <button
                class="danger-btn"
                onclick="
                  deleteProduct(
                    '${escapeJs(
                      product.id
                    )}'
                  )
                "
              >
                🗑️ Delete
              </button>

            </div>

          </div>
        `;
      })
      .join("");
}


/* =========================
   ORDERS
========================= */

function getOrders() {

  const saved =
    localStorage.getItem(
      ORDER_KEY
    );

  if (!saved) {
    return [];
  }

  try {
    const orders =
      JSON.parse(saved);

    return Array.isArray(orders)
      ? orders
      : [];

  } catch (error) {
    return [];
  }
}


function saveOrders(orders) {

  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify(orders)
  );
    }
/* =========================
   ORDER HELPERS
========================= */

function getCustomerName(order) {

  return (
    order.name ||
    order.customer?.name ||
    ""
  );
}


function getCustomerPhone(order) {

  return (
    order.phone ||
    order.mobile ||
    order.customer?.mobile ||
    ""
  );
}


function getCustomerAddress(order) {

  return (
    order.address ||
    order.customer?.address ||
    ""
  );
}


function getProductName(order) {

  if (
    typeof order.product === "string"
  ) {
    return order.product;
  }

  return (
    order.product?.name ||
    order.productName ||
    ""
  );
}


function getProductImage(order) {

  if (
    order.product &&
    typeof order.product === "object"
  ) {
    return (
      order.product.image ||
      order.productImage ||
      ""
    );
  }

  return order.productImage || "";
}


function getQuantity(order) {

  return (
    order.qty ||
    order.quantity ||
    1
  );
}


function getPayment(order) {

  return (
    order.payment ||
    order.paymentMethod ||
    "COD"
  );
}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders() {

  const orders = getOrders();

  const container =
    document.getElementById(
      "ordersGrid"
    );

  const count =
    document.getElementById(
      "orderCount"
    );

  if (!container) return;

  if (count) {
    count.textContent =
      `${orders.length} Orders`;
  }

  if (!orders.length) {

    container.innerHTML = `
      <div class="empty-card">
        <h3>📋 No Orders</h3>
        <p>
          Customer order করলে
          এখানে দেখা যাবে।
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    orders
      .slice()
      .reverse()
      .map(function(order) {

        const customerName =
          getCustomerName(order);

        const phone =
          getCustomerPhone(order);

        const address =
          getCustomerAddress(order);

        const productName =
          getProductName(order);

        const quantity =
          getQuantity(order);

        const payment =
          getPayment(order);

        return `
          <div class="admin-card">

            <h3>
              🧾 Order #
              ${escapeHtml(
                String(
                  order.id || ""
                )
              )}
            </h3>

            <p>
              📅
              ${escapeHtml(
                order.date || ""
              )}
            </p>

            <hr>

            <p>
              👤
              <strong>
                Customer:
              </strong>
              ${escapeHtml(
                customerName
              )}
            </p>

            <p>
              📱
              <strong>
                Mobile:
              </strong>
              ${escapeHtml(
                phone
              )}
            </p>

            <p>
              📍
              <strong>
                Address:
              </strong>
              ${escapeHtml(
                address
              )}
            </p>

            <hr>

            <p>
              🛍️
              <strong>
                Product:
              </strong>
              ${escapeHtml(
                productName
              )}
            </p>

            <p>
              🔢
              <strong>
                Quantity:
              </strong>
              ${quantity}
            </p>

            ${
              order.color
                ? `
                  <p>
                    🎨 Color:
                    ${escapeHtml(
                      order.color
                    )}
                  </p>
                `
                : ""
            }

            ${
              order.size
                ? `
                  <p>
                    📏 Size:
                    ${escapeHtml(
                      order.size
                    )}
                  </p>
                `
                : ""
            }

            <p>
              💰
              <strong>
                Product Total:
              </strong>
              ৳${Number(
                order.productTotal ||
                order.price ||
                0
              )}
            </p>

            <p>
              🚚
              <strong>
                Delivery:
              </strong>
              ৳${Number(
                order.shipping || 0
              )}
            </p>

            <p>
              💰
              <strong>
                Total:
              </strong>
              ৳${Number(
                order.total || 0
              )}
            </p>

            <p>
              💳
              <strong>
                Payment:
              </strong>
              ${escapeHtml(
                payment
              )}
            </p>

            ${
              order.source
                ? `
                  <p>
                    📣
                    <strong>
                      Source:
                    </strong>
                    ${escapeHtml(
                      order.source
                    )}
                  </p>
                `
                : ""
            }

            <label>
              <strong>
                Order Status
              </strong>
            </label>

            <select
              onchange="
                updateStatus(
                  '${escapeJs(
                    order.id
                  )}',
                  this.value
                )
              "
            >

              ${statusOption(
                "Pending",
                order.status
              )}

              ${statusOption(
                "Confirmed",
                order.status
              )}

              ${statusOption(
                "Processing",
                order.status
              )}

              ${statusOption(
                "Shipped",
                order.status
              )}

              ${statusOption(
                "Delivered",
                order.status
              )}

              ${statusOption(
                "Cancelled",
                order.status
              )}

              ${statusOption(
                "Returned",
                order.status
              )}

            </select>

            <div class="button-row">

              <button
                class="primary-btn"
                onclick="
                  printOrder(
                    '${escapeJs(
                      order.id
                    )}',
                    false
                  )
                "
              >
                🖨️ Customer Form
              </button>

              <button
                class="secondary-btn"
                onclick="
                  printOrder(
                    '${escapeJs(
                      order.id
                    )}',
                    true
                  )
                "
              >
                📦 Packing Slip
              </button>

            </div>

          </div>
        `;
      })
      .join("");
}


/* =========================
   STATUS
========================= */

function statusOption(
  value,
  current
) {

  return `
    <option
      value="${escapeHtml(
        value
      )}"
      ${
        String(current) ===
        String(value)
          ? "selected"
          : ""
      }
    >
      ${escapeHtml(value)}
    </option>
  `;
}


function updateStatus(
  id,
  status
) {

  const orders =
    getOrders();

  const order =
    orders.find(
      o =>
        String(o.id) ===
        String(id)
    );

  if (!order) {
    alert(
      "Order পাওয়া যায়নি"
    );
    return;
  }

  order.status = status;

  saveOrders(orders);

  renderOrders();
    }
/* =========================
   PRINT ORDER
========================= */

function printOrder(
  id,
  packing = false
) {

  const orders =
    getOrders();

  const order =
    orders.find(
      o =>
        String(o.id) ===
        String(id)
    );

  if (!order) {
    alert(
      "Order পাওয়া যায়নি"
    );
    return;
  }

  const title =
    packing
      ? "Packing Slip"
      : "Customer Delivery Form";

  const customerName =
    getCustomerName(order);

  const customerPhone =
    getCustomerPhone(order);

  const customerAddress =
    getCustomerAddress(order);

  const productName =
    getProductName(order);

  const productImage =
    getProductImage(order);

  const quantity =
    getQuantity(order);

  const payment =
    getPayment(order);

  const logo =
    localStorage.getItem(
      "afh_logo"
    );

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

  if (!printWindow) {
    alert(
      "Print window খুলতে পারেনি। Browser popup permission check করুন।"
    );
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="bn">

<head>

<meta charset="UTF-8">

<title>
${escapeHtml(title)}
</title>

<style>

body {
  font-family: Arial, sans-serif;
  padding: 30px;
  color: #111;
}

.container {
  max-width: 750px;
  margin: auto;
}

.header {
  text-align: center;
  border-bottom: 2px solid #111;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.logo {
  max-width: 100px;
  max-height: 70px;
  object-fit: contain;
}

h1 {
  margin: 5px 0;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.box {
  border: 1px solid #999;
  padding: 12px;
  margin-bottom: 15px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td,
th {
  border: 1px solid #999;
  padding: 8px;
  text-align: left;
}

.total {
  font-size: 20px;
  font-weight: bold;
}

.signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 70px;
}

.signature {
  border-top: 1px solid #111;
  padding-top: 8px;
  text-align: center;
}

.print-btn {
  padding: 12px 20px;
  margin-bottom: 20px;
  cursor: pointer;
}

@media print {

  .print-btn {
    display: none;
  }

}

</style>

</head>

<body>

<div class="container">

<button
  class="print-btn"
  onclick="window.print()"
>
  🖨️ Print
</button>

<div class="header">

${
  logo
    ? `
      <img
        class="logo"
        src="${escapeHtml(
          logo
        )}"
      >
    `
    : ""
}

<h1>
Arif Fashion House
</h1>

<h2>
${escapeHtml(title)}
</h2>

</div>


<div class="info">

<div class="box">

<strong>
Order ID:
</strong>

<br>

${escapeHtml(
  String(order.id || "")
)}

</div>


<div class="box">

<strong>
Date:
</strong>

<br>

${escapeHtml(
  order.date || ""
)}

</div>


<div class="box">

<strong>
Status:
</strong>

<br>

${escapeHtml(
  order.status ||
  "Pending"
)}

</div>


<div class="box">

<strong>
Payment:
</strong>

<br>

${escapeHtml(
  payment
)}

</div>

</div>


<div class="box">

<h3>
👤 Customer Information
</h3>

<strong>
Name:
</strong>

${escapeHtml(
  customerName
)}

<br><br>

<strong>
Mobile:
</strong>

${escapeHtml(
  customerPhone
)}

<br><br>

<strong>
Address:
</strong>

${escapeHtml(
  customerAddress
)}

</div>


<div class="box">

<h3>
📦 Product Information
</h3>

${
  productImage
    ? `
      <img
        src="${escapeHtml(
          productImage
        )}"
        class="product-image"
      >
    `
    : ""
}

<br><br>

<table>

<tr>

<th>
Product
</th>

<td>
${escapeHtml(
  productName
)}
</td>

</tr>


<tr>

<th>
Product Code
</th>

<td>
${escapeHtml(
  order.productCode ||
  order.product?.code ||
  "N/A"
)}
</td>

</tr>


<tr>

<th>
Color
</th>

<td>
${escapeHtml(
  order.color ||
  "N/A"
)}
</td>

</tr>


<tr>

<th>
Size / Variant
</th>

<td>
${escapeHtml(
  order.size ||
  "N/A"
)}
</td>

</tr>


<tr>

<th>
Quantity
</th>

<td>
${quantity}
</td>

</tr>


<tr>

<th>
Product Price
</th>

<td>
৳${Number(
  order.productTotal ||
  order.price ||
  0
)}
</td>

</tr>


<tr>

<th>
Delivery Charge
</th>

<td>
৳${Number(
  order.shipping || 0
)}
</td>

</tr>


<tr>

<th>
Total
</th>

<td class="total">
৳${Number(
  order.total || 0
)}
</td>

</tr>

</table>

</div>


${
  !packing

    ? `
      <div class="box">

        <strong>
          Order Source:
        </strong>

        ${escapeHtml(
          order.source ||
          "Direct Website"
        )}

      </div>

      <div class="signatures">

        <div class="signature">
          Customer Signature
        </div>

        <div class="signature">
          Delivery Person Signature
        </div>

      </div>
    `

    : `
      <div class="signatures">

        <div class="signature">
          Packed By
        </div>

        <div class="signature">
          Checked By
        </div>

      </div>
    `
}

</div>

</body>

</html>
  `);

  printWindow.document.close();
}


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


function escapeJs(value) {

  return String(
    value ?? ""
  )
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    )
    .replace(
      /"/g,
      '\\"'
    )
    .replace(
      /\r?\n/g,
      "\\n"
    );
}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSettings();

    renderProducts();

    renderOrders();

  }
);
