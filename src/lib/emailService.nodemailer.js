/**
 * Send email using the API route (server-side only)
 */
const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    })

    const result = await response.json()

    if (result.success) {
      console.log('✅ Email sent:', result.messageId)
      return { success: true }
    } else {
      console.error('❌ Email error:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}

/**
 * Format order items into a plain text string
 */
const formatItemsList = (items) => {
  return items.map(item => 
    `${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('\n')
}

/**
 * Send admin notification when order is placed
 */
export const sendAdminOrderNotification = async (orderData) => {
  const itemsText = formatItemsList(orderData.items)

  const html = `
    <h2>🔔 New Order Alert!</h2>
    <p><strong>Order #:</strong> ${orderData.order_number}</p>
    <p><strong>Customer:</strong> ${orderData.customer_name}</p>
    <p><strong>Email:</strong> ${orderData.customer_email}</p>
    <p><strong>Phone:</strong> ${orderData.customer_phone}</p>
    <p><strong>Address:</strong> ${orderData.customer_address}</p>
    <p><strong>Items:</strong></p>
    <pre>${itemsText}</pre>
    <p><strong>Total:</strong> ₦${orderData.total.toLocaleString()}</p>
    <p><strong>Status:</strong> Pending ⏳</p>
    <hr>
    <p><a href="https://sommywears.ct.ws/admin/dashboard">📊 View in Dashboard</a></p>
    <p>Sommy Wears — Premium Men's Fashion</p>
  `

  return await sendEmail(
    process.env.ADMIN_EMAIL || 'daniboi001@gmail.com',
    `New Order #${orderData.order_number}`,
    html
  )
}

/**
 * Send customer confirmation email when order is placed
 */
export const sendCustomerOrderConfirmation = async (orderData) => {
  const itemsText = formatItemsList(orderData.items)

  const html = `
    <h1>Thank You, ${orderData.customer_name}! ✅</h1>
    <p>Your order <strong>#${orderData.order_number}</strong> has been confirmed.</p>
    <h3>Order Summary</h3>
    <pre>${itemsText}</pre>
    <p><strong>Total:</strong> ₦${orderData.total.toLocaleString()}</p>
    <h3>Payment Instructions</h3>
    <p>Please transfer to:</p>
    <p><strong>Bank:</strong> Opay</p>
    <p><strong>Account Name:</strong> Martins Chigozie</p>
    <p><strong>Account Number:</strong> 8162151494</p>
    <p>💬 After payment, send screenshot to WhatsApp:<a href="https://wa.me/2348162151494" style="display:inline-block; background:#25D366; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px; display:flex; align-items:center; gap:8px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat with us on WhatsApp
    </a>
    </p>
    <hr>
    <p>Sommy Wears — Premium Men's Fashion</p>
  `

  return await sendEmail(
    orderData.customer_email,
    `Order Confirmation #${orderData.order_number}`,
    html
  )
}

/**
 * Send order status update email to customer
 */
export const sendOrderStatusUpdate = async (orderData, newStatus) => {
  const statusMessages = {
    paid: {
      subject: `Payment Confirmed #${orderData.order_number}`,
      body: `
        <h1>✅ Payment Confirmed!</h1>
        <p>Your payment for order <strong>#${orderData.order_number}</strong> has been confirmed.</p>
        <p>We're now preparing your order for shipping. You'll receive another notification when it's on its way.</p>
        <p><strong>Total:</strong> ₦${orderData.total.toLocaleString()}</p>
        <hr>
        <p><strong>💬 Questions? Chat us on WhatsApp:</strong> <a href="https://wa.me/2348162151494" style="display:inline-block; background:#25D366; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px; display:flex; align-items:center; gap:8px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat with us on WhatsApp
    </a>
          </p>
        <p>Sommy Wears — Premium Men's Fashion</p>
      `
    },
    shipped: {
      subject: `Order Shipped #${orderData.order_number}`,
      body: `
        <h1>Your Order is on its Way!</h1>
        <p>Great news! Your order <strong>#${orderData.order_number}</strong> has been shipped.</p>
        <p>You'll receive a delivery confirmation once it arrives.</p>
        <p><strong>Total:</strong> ₦${orderData.total.toLocaleString()}</p>
        <hr>
        <p><strong>💬 Questions? Chat us on WhatsApp:</strong> <a href="https://wa.me/2348162151494" style="display:inline-block; background:#25D366; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px; display:flex; align-items:center; gap:8px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat with us on WhatsApp
    </a></p>
        <p>Sommy Wears — Premium Men's Fashion</p>
      `
    },
    delivered: {
      subject: `Order Delivered #${orderData.order_number}`,
      body: `
        <h1>Order Delivered!</h1>
        <p>Your order <strong>#${orderData.order_number}</strong> has been delivered.</p>
        <p>We hope you love your new items! If you have any feedback, we'd love to hear from you.</p>
        <p>Thank you for shopping with Sommy Wears! ❤️</p>

        <h3>⭐ Love Your Purchase?</h3>
        <p>Share your experience with us! Your feedback helps us improve and helps other customers make informed decisions.</p>
        
        <p>
          <a href="https://sommywears.ct.ws/review?order=${orderData.order_number}&name=${encodeURIComponent(orderData.customer_name)}&email=${orderData.customer_email}" 
            style="display:inline-block;background:#ffd700;color:#000;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:700;">
            ⭐ Leave a Review
          </a>
        </p>

        <hr>
        <p><strong>💬 Questions? Chat us on WhatsApp:</strong> <a href="https://wa.me/2348162151494" style="display:inline-block; background:#25D366; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px; display:flex; align-items:center; gap:8px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat with us on WhatsApp
    </a>
    </p>
        <p>Sommy Wears — Premium Men's Fashion</p>
      `
    }
  }

  const status = statusMessages[newStatus]
  if (!status) {
    console.warn('Unknown status:', newStatus)
    return { success: false, error: 'Unknown status' }
  }

  return await sendEmail(
    orderData.customer_email,
    status.subject,
    status.body
  )
}