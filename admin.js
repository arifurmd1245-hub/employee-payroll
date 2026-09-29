const DATA_KEY = "afh_v3_data";
const ORDER_KEY = "afh_orders";

const defaultData = {
  settings: {
    brand: "Arif Fashion House",
    hero: "Trendy • Stylish • Quality Clothing",
    shipping: 80,
    cod: true,
    advance: true,
    warning:
      "📦 Order Confirmation\nআপনার অর্ডারটি নিশ্চিত করার আগে অনুগ্রহ করে পণ্য, সাইজ/কালার, ঠিকানা ও মোবাইল নম্বর ভালোভাবে যাচাই করুন।\nআপনি অর্ডারটি গ্রহণ করতে পারবেন—এটি নিশ্চিত হয়ে তারপর Confirm Order করুন।"
  },
  products: []
};

function getData() {
  const saved = localStorage.getItem(DATA_KEY);

  if (!saved) {
    localStorage.setItem(DATA_KEY, JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}


/* =========================
   WEBSITE SETTINGS
========================= */

function loadSettings() {
  const data = getData();
  const s = data.settings || {};

  document.getElementById("brand").value = s.brand || "";
  document.getElementById("hero").value = s.hero || "";
  document.getElementById("shipping").value = s.shipping || 0;
  document.getElementById("warning").value = s.warning || "";

  document.getElementById("codEnabled").checked =
    s.cod !== false;

  document.getElementById("advanceEnabled").checked =
    s.advance !== false;
}

function saveSettings() {
  const data = getData();

  data.settings = {
    brand: document.getElementById("brand").value.trim(),
    hero: document.getElementById("hero").value.trim(),
    shipping:
      Number(document.getElementById("shipping").value) || 0,
    cod: document.getElementById("codEnabled").checked,
    advance: document.getElementById("advanceEnabled").checked,
    warning: document.getElementById("warning").value.trim()
  };

  saveData(data);

  alert("✅ Website settings saved successfully!");
}


/* =========================
   PRODUCT
========================= */

function saveProduct() {

  const data = getData();

  const id =
    document.getElementById("productId").value ||
    "P" + Date.now();

  const name =
    document.getElementById("productName").value.trim();

  const category =
    document.getElementById("productCategory").value;

  const image =
    document.getElementById("productImage").value.trim();

  const price =
    Number(document.getElementById("productPrice").value) || 0;

  const oldPrice =
    Number(document.getElementById("productOldPrice").value) || 0;

  const colorsText =
    document.getElementById("productColors").value.trim();

  const sizesText =
    document.getElementById("productSizes").value.trim();

  const youtube =
    document.getElementById("productYoutube").value.trim();

  const description =
    document.getElementById("productDescription").value.trim();

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

  const product = {
    id,
    name,
    category,
    image,
    price,
    oldPrice,
    colors,
    sizes,
    youtube,
    description
  };

  const existingIndex =
    data.products.findIndex(p => p.id === id);

  if (existingIndex >= 0) {
    data.products[existingIndex] = product;
  } else {
    data.products.push(product);
  }

  saveData(data);

  clearProductForm();
  renderProducts();

  alert("✅ Product saved successfully!");
}


/* =========================
   CLEAR PRODUCT FORM
========================= */

function clearProductForm() {

  document.getElementById("productId").value = "";

  document.getElementById("productName").value = "";

  document.getElementById("productCategory").value = "Men";

  document.getElementById("productImage").value = "";

  document.getElementById("productPrice").value = "";

  document.getElementById("productOldPrice").value = "";

  document.getElementById("productColors").value = "";

  document.getElementById("productSizes").value = "";

  document.getElementById("productYoutube").value = "";

  document.getElementById("productDescription").value = "";
}


/* =========================
   EDIT PRODUCT
========================= */

function editProduct(id) {

  const data = getData();

  const product =
    data.products.find(p => p.id === id);

  if (!product) return;

  document.getElementById("productId").value =
    product.id;

  document.getElementById("productName").value =
    product.name || "";

  document.getElementById("productCategory").value =
    product.category || "Men";

  document.getElementById("productImage").value =
    product.image || "";

  document.getElementById("productPrice").value =
    product.price || "";

  document.getElementById("productOldPrice").value =
    product.oldPrice || "";

  document.getElementById("productColors").value =
    (product.colors || []).join(", ");

  document.getElementById("productSizes").value =
    (product.sizes || []).join(", ");

  document.getElementById("productYoutube").value =
    product.youtube || "";

  document.getElementById("productDescription").value =
    product.description || "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id) {

  const ok =
    confirm("এই product টি delete করতে চান?");

  if (!ok) return;

  const data = getData();

  data.products =
    data.products.filter(p => p.id !== id);

  saveData(data);

  renderProducts();

  alert("🗑️ Product deleted");
}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const data = getData();

  const container =
    document.getElementById("productsGrid");

  const count =
    document.getElementById("productCount");

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
    data.products.map(product => {

      const discount =
        product.oldPrice > product.price
          ? Math.round(
              ((product.oldPrice - product.price) /
                product.oldPrice) * 100
            )
          : 0;

      return `
        <div class="admin-card">

          ${
            product.image
              ? `<img src="${escapeHtml(product.image)}"
                   class="admin-product-image"
                   onerror="this.style.display='none'">`
              : `<div class="image-placeholder">📷</div>`
          }

          <h3>${escapeHtml(product.name)}</h3>

          <p>
            Category:
            <strong>${escapeHtml(product.category)}</strong>
          </p>

          <p>
            Price:
            <strong>৳${product.price}</strong>
          </p>

          ${
            product.oldPrice
              ? `<p class="old-price">
                   Old Price: ৳${product.oldPrice}
                 </p>`
              : ""
          }

          ${
            discount
              ? `<p>🔥 Discount: ${discount}%</p>`
              : ""
          }

          ${
            product.colors?.length
              ? `<p>🎨 Colors: ${escapeHtml(
                  product.colors.join(", ")
                )}</p>`
              : ""
          }

          ${
            product.sizes?.length
              ? `<p>📏 Sizes: ${escapeHtml(
                  product.sizes.join(", ")
                )}</p>`
              : ""
          }

          <div class="button-row">

            <button
              class="secondary-btn"
              onclick="editProduct('${product.id}')">
              ✏️ Edit
            </button>

            <button
              class="danger-btn"
              onclick="deleteProduct('${product.id}')">
              🗑️ Delete
            </button>

          </div>

        </div>
      `;

    }).join("");
}


/* =========================
   ORDERS
========================= */

function getOrders() {

  const saved =
    localStorage.getItem(ORDER_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved);
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
   RENDER ORDERS
========================= */

function renderOrders() {

  const orders = getOrders();

  const container =
    document.getElementById("ordersGrid");

  const count =
    document.getElementById("orderCount");

  if (count) {
    count.textContent =
      `${orders.length} Orders`;
  }

  if (!orders.length) {

    container.innerHTML = `
      <div class="empty-card">
        <h3>📋 No Orders</h3>
        <p>Customer order করলে এখানে দেখা যাবে।</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    orders.slice().reverse().map(order => {

      return `
        <div class="admin-card">

          <h3>🧾 Order #${escapeHtml(
            String(order.id || "")
          )}</h3>

          <p>
            📅 ${escapeHtml(
              order.date || ""
            )}
          </p>

          <hr>

          <p>
            👤 <strong>Customer:</strong>
            ${escapeHtml(
              order.customer?.name ||
              order.name ||
              ""
            )}
          </p>

          <p>
            📱 <strong>Mobile:</strong>
            ${escapeHtml(
              order.customer?.mobile ||
              order.mobile ||
              ""
            )}
          </p>

          <p>
            📍 <strong>Address:</strong>
            ${escapeHtml(
              order.customer?.address ||
              order.address ||
              ""
            )}
          </p>

          <hr>

          <p>
            🛍️ <strong>Product:</strong>
            ${escapeHtml(
              order.product?.name ||
              order.productName ||
              ""
            )}
          </p>

          <p>
            🔢 <strong>Quantity:</strong>
            ${order.quantity || 1}
          </p>

          ${
            order.color
              ? `<p>🎨 Color: ${escapeHtml(order.color)}</p>`
              : ""
          }

          ${
            order.size
              ? `<p>📏 Size: ${escapeHtml(order.size)}</p>`
              : ""
          }

          <p>
            💰 <strong>Total:</strong>
            ৳${order.total || 0}
          </p>

          <p>
            💳 <strong>Payment:</strong>
            ${escapeHtml(
              order.paymentMethod || "COD"
            )}
          </p>

          ${
            order.source
              ? `<p>
                  📣 <strong>Source:</strong>
                  ${escapeHtml(order.source)}
                </p>`
              : ""
          }

          <label><strong>Order Status</strong></label>

          <select
            onchange="updateStatus('${order.id}', this.value)">

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
              onclick="printOrder('${order.id}', false)">
              🖨️ Customer Form
            </button>

            <button
              class="secondary-btn"
              onclick="printOrder('${order.id}', true)">
              📦 Packing Slip
            </button>

          </div>

        </div>
      `;

    }).join("");
}


/* =========================
   STATUS
========================= */

function statusOption(value, current) {

  return `
    <option
      value="${value}"
      ${current === value ? "selected" : ""}>
      ${value}
    </option>
  `;
}


function updateStatus(id, status) {

  const orders = getOrders();

  const order =
    orders.find(
      o => String(o.id) === String(id)
    );

  if (!order) return;

  order.status = status;

  saveOrders(orders);

  renderOrders();
}


/* =========================
   PRINT ORDER
========================= */

function printOrder(id, packing = false) {

  const orders = getOrders();

  const order =
    orders.find(
      o => String(o.id) === String(id)
    );

  if (!order) {
    alert("Order পাওয়া যায়নি");
    return;
  }

  const product =
    order.product || {};

  const customer =
    order.customer || {};

  const title =
    packing
      ? "Packing Slip"
      : "Customer Delivery Form";

  const image =
    product.image ||
    order.productImage ||
    "";

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="bn">

<head>

<meta charset="UTF-8">

<title>${title}</title>

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

td, th {
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
  onclick="window.print()">
  🖨️ Print
</button>

<div class="header">

${
  localStorage.getItem("afh_logo")
    ? `<img class="logo"
        src="${localStorage.getItem("afh_logo")}">`
    : ""
}

<h1>Arif Fashion House</h1>

<h2>${title}</h2>

</div>


<div class="info">

<div class="box">
<strong>Order ID:</strong><br>
${escapeHtml(String(order.id || ""))}
</div>

<div class="box">
<strong>Date:</strong><br>
${escapeHtml(order.date || "")}
</div>

<div class="box">
<strong>Status:</strong><br>
${escapeHtml(order.status || "Pending")}
</div>

<div class="box">
<strong>Payment:</strong><br>
${escapeHtml(order.paymentMethod || "COD")}
</div>

</div>


<div class="box">

<h3>👤 Customer Information</h3>

<strong>Name:</strong>
${escapeHtml(
  customer.name ||
  order.name ||
  ""
)}

<br><br>

<strong>Mobile:</strong>
${escapeHtml(
  customer.mobile ||
  order.mobile ||
  ""
)}

<br><br>

<strong>Address:</strong>
${escapeHtml(
  customer.address ||
  order.address ||
  ""
)}

</div>


<div class="box">

<h3>📦 Product Information</h3>

${
  image
    ? `<img
        src="${escapeHtml(image)}"
        class="product-image">`
    : ""
}

<br><br>

<table>

<tr>
<th>Product</th>
<td>
${escapeHtml(
  product.name ||
  order.productName ||
  ""
)}
</td>
</tr>

<tr>
<th>Product Code</th>
<td>
${escapeHtml(
  product.code ||
  order.productCode ||
  "N/A"
)}
</td>
</tr>

<tr>
<th>Color</th>
<td>
${escapeHtml(order.color || "N/A")}
</td>
</tr>

<tr>
<th>Size / Variant</th>
<td>
${escapeHtml(order.size || "N/A")}
</td>
</tr>

<tr>
<th>Quantity</th>
<td>
${order.quantity || 1}
</td>
</tr>

<tr>
<th>Product Price</th>
<td>
৳${order.productTotal || order.price || 0}
</td>
</tr>

<tr>
<th>Delivery Charge</th>
<td>
৳${order.shipping || 0}
</td>
</tr>

<tr>
<th>Total</th>
<td class="total">
৳${order.total || 0}
</td>
</tr>

</table>

</div>


${
  !packing
    ? `
<div class="box">

<strong>Order Source:</strong>
${escapeHtml(order.source || "Direct Website")}

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
   SECURITY / HTML SAFETY
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
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadSettings();

    renderProducts();

    renderOrders();

  }
);
