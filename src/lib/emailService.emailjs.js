import emailjs from '@emailjs/browser'

const formatItemsList = (items) => {
  return items.map(item => 
    `${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('\n')
}

export const sendAdminOrderNotification = async (orderData) => {
  const templateParams = {
    admin_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    order_number: orderData.order_number,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone,
    customer_address: orderData.customer_address,
    items_list: formatItemsList(orderData.items),
    total: `₦${orderData.total.toLocaleString()}`,
  }

  console.log('📧 Admin email:', templateParams)

  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID,
      templateParams
    )
    console.log('✅ Admin email sent:', response)
    return { success: true }
  } catch (error) {
    console.error('❌ Admin error:', error)
    return { success: false, error }
  }
}

export const sendCustomerOrderConfirmation = async (orderData) => {
  const templateParams = {
    customer_email: orderData.customer_email,
    order_number: orderData.order_number,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    items_list: formatItemsList(orderData.items),
    total: `₦${orderData.total.toLocaleString()}`,
  }

  console.log('📧 Customer email:', templateParams)

  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID,
      templateParams
    )
    console.log('✅ Customer email sent:', response)
    return { success: true }
  } catch (error) {
    console.error('❌ Customer error:', error)
    return { success: false, error }
  }
}