const KEY = "afh_v3_data";


const defaultData = {

  settings: {

    brand: "Arif Fashion House",

    hero: "Style • Quality • Reliable Service",

    shipping: 80,

    cod: true,

    advance: true,

    warning:
      "আপনার অর্ডারটি নিশ্চিত করার আগে অনুগ্রহ করে পণ্য, সাইজ/কালার, ঠিকানা ও মোবাইল নম্বর ভালোভাবে যাচাই করুন। আপনি অর্ডারটি গ্রহণ করতে পারবেন—এটি নিশ্চিত হয়ে তারপর Confirm Order করুন।",

    bkashEnabled: true,
    bkashNumber: "",

    nagadEnabled: true,
    nagadNumber: "",

    rocketEnabled: true,
    rocketNumber: ""

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
      desc: "Comfortable premium cotton T-shirt.",
      description: "Comfortable premium cotton T-shirt."
    },


    {
      id: "p2",
      name: "Ladies Three Piece",
      cat: "women",
      category: "women",
      price: 1250,
      old: 1500,
      oldPrice: 1500,
      colors: ["Black", "Blue", "Red"],
      sizes: [],
      image: "",
      desc: "Stylish three piece for everyday fashion.",
      description: "Stylish three piece for everyday fashion."
    }

  ]

};


function getData() {

  const saved =
    localStorage.getItem(KEY);


  if (!saved) {

    localStorage.setItem(
      KEY,
      JSON.stringify(defaultData)
    );

    return defaultData;

  }


  try {

    const data =
      JSON.parse(saved);


    if (!data.settings) {
      data.settings = {};
    }


    if (!data.products) {
      data.products = [];
    }


    /*
      Repair category format
    */

    data.products.forEach(
      function(product) {

        if (!product.cat) {

          product.cat =
            String(
              product.category ||
              "other"
            ).toLowerCase();

        }


        if (!product.category) {

          product.category =
            String(
              product.cat ||
              "other"
            ).toLowerCase();

        }


        if (product.old === undefined) {

          product.old =
            Number(
              product.oldPrice ||
              0
            );

        }


        if (product.oldPrice === undefined) {

          product.oldPrice =
            Number(
              product.old ||
              0
            );

        }


        if (!product.desc) {

          product.desc =
            product.description ||
            "";

        }


        if (!product.description) {

          product.description =
            product.desc ||
            "";

        }

      }
    );


    /*
      Restore Premium T-Shirt
    */

    const hasPremium =
      data.products.some(
        function(product) {

          return (
            product.id === "p1" ||
            String(
              product.name
            ).toLowerCase() ===
              "premium t-shirt"
          );

        }
      );


    if (!hasPremium) {

      data.products.unshift(
        defaultData.products[0]
      );

    }


    /*
      Payment defaults
    */

    if (
      data.settings.bkashEnabled ===
      undefined
    ) {

      data.settings.bkashEnabled =
        true;

    }


    if (
      data.settings.nagadEnabled ===
      undefined
    ) {

      data.settings.nagadEnabled =
        true;

    }


    if (
      data.settings.rocketEnabled ===
      undefined
    ) {

      data.settings.rocketEnabled =
        true;

    }


    if (
      data.settings.bkashNumber ===
      undefined
    ) {

      data.settings.bkashNumber =
        "";

    }


    if (
      data.settings.nagadNumber ===
      undefined
    ) {

      data.settings.nagadNumber =
        "";

    }


    if (
      data.settings.rocketNumber ===
      undefined
    ) {

      data.settings.rocketNumber =
        "";

    }


    localStorage.setItem(
      KEY,
      JSON.stringify(data)
    );


    return data;

  } catch (error) {

    return defaultData;

  }

}



function money(number) {

  return (
    "৳" +
    Number(
      number || 0
    ).toLocaleString("en-BD")
  );

}



let selectedProduct = null;

let selectedProductId = "";

let selectedColor = "";

let selectedSize = "";



/* =========================
   PRODUCTS
========================= */

function renderProducts(
  category = "all"
) {

  const data =
    getData();


  document.getElementById(
    "brandName"
  ).textContent =
    data.settings.brand ||
    "Arif Fashion House";


  document.getElementById(
    "heroTitle"
  ).textContent =
    data.settings.hero ||
    "";


  const productsBox =
    document.getElementById(
      "products"
    );


  const products =
    data.products.filter(
      function(product) {

        const productCategory =
          String(
            product.cat ||
            product.category ||
            ""
          ).toLowerCase();


        return (
          category === "all" ||
          productCategory ===
            String(
              category
            ).toLowerCase()
        );

      }
    );


  if (!products.length) {

    productsBox.innerHTML =
      "<p>No products available.</p>";

    return;

  }


  productsBox.innerHTML =
    products
      .map(
        function(product) {

          let discount = "";


          const oldPrice =
            Number(
              product.old ||
              product.oldPrice ||
              0
            );


          if (
            oldPrice >
            Number(product.price)
          ) {

            discount =
              Math.round(
                (
                  1 -
                  Number(product.price) /
                    oldPrice
                ) * 100
              ) +
              "% OFF";

          }


          let colorsHTML =
            "";


          if (
            product.colors &&
            product.colors.length
          ) {

            colorsHTML = `

              <div>

                <small>
                  <b>Color:</b>
                </small>


                <div class="options">

                  ${product.colors
                    .map(
                      function(color) {

                        return `

                          <button
                            type="button"
                            class="option color-option"
                            onclick="selectColor(
                              '${product.id}',
                              '${escapeAttribute(color)}',
                              this
                            )">

                            ${escapeHtml(color)}

                          </button>

                        `;

                      }
                    )
                    .join("")}

                </div>

              </div>

            `;

          }


          let sizesHTML =
            "";


          if (
            product.sizes &&
            product.sizes.length
          ) {

            sizesHTML = `

              <div>

                <small>
                  <b>Size:</b>
                </small>


                <div class="options">

                  ${product.sizes
                    .map(
                      function(size) {

                        return `

                          <button
                            type="button"
                            class="option size-option"
                            onclick="selectSize(
                              '${product.id}',
                              '${escapeAttribute(size)}',
                              this
                            )">

                            ${escapeHtml(size)}

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

            <div
              class="card"
              data-product-id="${escapeAttribute(
                product.id
              )}"
            >


              <img
                src="${
                  product.image ||
                  "cover.png"
                }"
                alt="${escapeHtml(
                  product.name
                )}"
              >


              <h3>
                ${escapeHtml(
                  product.name
                )}
              </h3>


              <div>

                <span class="price">
                  ${money(
                    product.price
                  )}
                </span>


                ${
                  oldPrice

                    ? `<span class="old">
                        ${money(
                          oldPrice
                        )}
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
                ${escapeHtml(
                  product.desc ||
                  product.description ||
                  ""
                )}
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
                  id="qty-${escapeAttribute(
                    product.id
                  )}"
                  type="number"
                  min="1"
                  value="1"
                  style="max-width:80px"
                >


                <button
                  class="primary"
                  onclick="openCheckout(
                    '${escapeAttribute(
                      product.id
                    )}'
                  )"
                >
                  Order Now
                </button>

              </div>


            </div>

          `;

        }
      )
      .join("");

}



/* =========================
   COLOR
========================= */

function selectColor(
  productId,
  color,
  button
) {

  selectedProductId =
    productId;


  selectedColor =
    color;


  const card =
    button.closest(
      ".card"
    );


  if (!card) return;


  card
    .querySelectorAll(
      ".color-option"
    )
    .forEach(
      function(item) {

        item.style.background =
          "";

        item.style.color =
          "";

      }
    );


  button.style.background =
    "#111";


  button.style.color =
    "#fff";

}



/* =========================
   SIZE
========================= */

function selectSize(
  productId,
  size,
  button
) {

  selectedProductId =
    productId;


  selectedSize =
    size;


  const card =
    button.closest(
      ".card"
    );


  if (!card) return;


  card
    .querySelectorAll(
      ".size-option"
    )
    .forEach(
      function(item) {

        item.style.background =
          "";

        item.style.color =
          "";

      }
    );


  button.style.background =
    "#111";


  button.style.color =
    "#fff";

}



/* =========================
   CHECKOUT
========================= */

function openCheckout(id) {

  const data =
    getData();


  const product =
    data.products.find(
      function(item) {

        return item.id === id;

      }
    );


  if (!product) {

    alert(
      "Product not found."
    );

    return;

  }


  /*
    Important:
    Reset only when changing to another product.
  */

  if (
    selectedProductId !==
    id
  ) {

    selectedColor =
      "";

    selectedSize =
      "";

  }


  selectedProductId =
    id;


  const quantityInput =
    document.getElementById(
      "qty-" + id
    );


  const quantity =
    Number(
      quantityInput
        ? quantityInput.value
        : 1
    );


  selectedProduct = {

    ...product,

    qty:
      quantity > 0
        ? quantity
        : 1

  };


  let optionsText =
    "";


  if (
    product.colors &&
    product.colors.length
  ) {

    optionsText += `

      <p>

        <b>Color:</b>

        ${
          selectedColor
            ? escapeHtml(
                selectedColor
              )
            : "Please select before confirming."
        }

      </p>

    `;

  }


  if (
    product.sizes &&
    product.sizes.length
  ) {

    optionsText += `

      <p>

        <b>Size:</b>

        ${
          selectedSize
            ? escapeHtml(
                selectedSize
              )
            : "Please select before confirming."
        }

      </p>

    `;

  }


  /*
    Payment information
  */

  let paymentInfo =
    "";


  if (
    data.settings.advance
  ) {

    const methods = [];


    if (
      data.settings.bkashEnabled &&
      data.settings.bkashNumber
    ) {

      methods.push(
        "📱 bKash: " +
        escapeHtml(
          data.settings.bkashNumber
        )
      );

    }


    if (
      data.settings.nagadEnabled &&
      data.settings.nagadNumber
    ) {

      methods.push(
        "📱 Nagad: " +
        escapeHtml(
          data.settings.nagadNumber
        )
      );

    }


    if (
      data.settings.rocketEnabled &&
      data.settings.rocketNumber
    ) {

      methods.push(
        "📱 Rocket: " +
        escapeHtml(
          data.settings.rocketNumber
        )
      );

    }


    if (methods.length) {

      paymentInfo = `

        <div
          style="
            margin-top:12px;
            padding:10px;
            border:1px solid #ddd;
            border-radius:8px;
          "
        >

          <b>
            💳 Advance Payment Numbers
          </b>

          ${methods
            .map(
              function(method) {

                return `
                  <p style="margin:6px 0;">
                    ${method}
                  </p>
                `;

              }
            )
            .join("")}

        </div>

      `;

    }

  }


  document.getElementById(
    "summaryBox"
  ).innerHTML = `

    <h3>
      🛍️ Order Summary
    </h3>


    <div class="row">

      <span>

        ${escapeHtml(
          product.name
        )}
        ×
        ${quantity}

      </span>


      <b>

        ${money(
          Number(
            product.price
          ) *
          quantity
        )}

      </b>

    </div>


    ${optionsText}


    ${paymentInfo}

  `;


  document.getElementById(
    "shipCharge"
  ).textContent =
    money(
      data.settings.shipping
    );


  document.getElementById(
    "warningText"
  ).textContent =
    data.settings.warning ||
    "";


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
      data.settings.cod
        ? "block"
        : "none";


    codRadio.checked =
      data.settings.cod;

  }


  if (advanceRadio) {

    advanceRadio.parentElement.style.display =
      data.settings.advance
        ? "block"
        : "none";


    if (
      !data.settings.cod &&
      data.settings.advance
    ) {

      advanceRadio.checked =
        true;

    }

  }


  document.getElementById(
    "cName"
  ).value = "";


  document.getElementById(
    "cPhone"
  ).value = "";


  document.getElementById(
    "cAddress"
  ).value = "";


  document.getElementById(
    "confirmCheck"
  ).checked =
    false;


  toggleConfirm();


  document
    .getElementById(
      "checkoutModal"
    )
    .classList
    .remove("hidden");

}



/* =========================
   CLOSE
========================= */

function closeCheckout() {

  document
    .getElementById(
      "checkoutModal"
    )
    .classList
    .add("hidden");

}



/* =========================
   CONFIRM CHECKBOX
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


  button.disabled =
    !checkbox.checked;

}



/* =========================
   SUBMIT ORDER
========================= */

function submitOrder() {

  const data =
    getData();


  if (!selectedProduct) {

    alert(
      "Please select a product."
    );

    return;

  }


  /*
    COLOR ONLY IF PRODUCT HAS COLOR
  */

  if (
    selectedProduct.colors &&
    selectedProduct.colors.length &&
    !selectedColor
  ) {

    alert(
      "Please select a color."
    );

    return;

  }


  /*
    SIZE ONLY IF PRODUCT HAS SIZE
  */

  if (
    selectedProduct.sizes &&
    selectedProduct.sizes.length &&
    !selectedSize
  ) {

    alert(
      "Please select a size."
    );

    return;

  }


  const name =
    document
      .getElementById(
        "cName"
      )
      .value
      .trim();


  const phone =
    document
      .getElementById(
        "cPhone"
      )
      .value
      .trim();


  const address =
    document
      .getElementById(
        "cAddress"
      )
      .value
      .trim();


  if (
    !name ||
    !phone ||
    !address
  ) {

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

    alert(
      "Please select a payment method."
    );

    return;

  }


  const payment =
    paymentElement.value;


  if (
    payment === "COD" &&
    !data.settings.cod
  ) {

    alert(
      "Cash on Delivery is currently unavailable."
    );

    return;

  }


  if (
    payment === "Advance" &&
    !data.settings.advance
  ) {

    alert(
      "Advance payment is currently unavailable."
    );

    return;

  }


  const shipping =
    Number(
      data.settings.shipping ||
      0
    );


  const productTotal =
    Number(
      selectedProduct.price
    ) *
    Number(
      selectedProduct.qty
    );


  const total =
    productTotal +
    shipping;


  const orders =
    JSON.parse(
      localStorage.getItem(
        "afh_orders"
      ) ||
      "[]"
    );


  let paymentNumber =
    "";


  /*
    Save first available
    advance payment number
  */

  if (
    payment === "Advance"
  ) {

    if (
      data.settings.bkashEnabled &&
      data.settings.bkashNumber
    ) {

      paymentNumber =
        data.settings.bkashNumber;

    } else if (
      data.settings.nagadEnabled &&
      data.settings.nagadNumber
    ) {

      paymentNumber =
        data.settings.nagadNumber;

    } else if (
      data.settings.rocketEnabled &&
      data.settings.rocketNumber
    ) {

      paymentNumber =
        data.settings.rocketNumber;

    }

  }


  const newOrder = {

    id:
      "AFH-" +
      Date.now(),


    date:
      new Date()
        .toLocaleString(),


    name,


    phone,


    address,


    product:
      selectedProduct.name,


    qty:
      selectedProduct.qty,


    color:
      selectedColor,


    size:
      selectedSize,


    price:
      selectedProduct.price,


    shipping,


    productTotal,


    total,


    payment,


    paymentNumber,


    status:
      "Pending",


    image:
      selectedProduct.image ||
      "",


    source:
      new URLSearchParams(
        window.location.search
      ).get("source") ||
      "Website"

  };


  orders.unshift(
    newOrder
  );


  localStorage.setItem(
    "afh_orders",
    JSON.stringify(
      orders
    )
  );


  alert(
    "✅ Order submitted successfully!\n\n" +
    "Order ID: " +
    newOrder.id
  );


  closeCheckout();


  /*
    Reset AFTER successful order
  */

  selectedProduct =
  
