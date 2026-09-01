'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { sendAdminOrderNotification, sendCustomerOrderConfirmation } from '@/lib/emailService'
import toast from 'react-hot-toast'
import WhatsAppIcon from '@/components/WhatsAppIcon'

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()

  // State
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [orderTotal, setOrderTotal] = useState(0) // ← ADD THIS: store total before clearing
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      router.push('/shop')
    }
  }, [cart.length, orderComplete, router])

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle blur
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Full name is required'
    } else if (formData.customer_name.trim().length < 2) {
      newErrors.customer_name = 'Name must be at least 2 characters'
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address'
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required'
    } else if (!/^[0-9]{10,15}$/.test(formData.customer_phone.replace(/[^0-9]/g, ''))) {
      newErrors.customer_phone = 'Please enter a valid phone number'
    }

    if (!formData.customer_address.trim()) {
      newErrors.customer_address = 'Delivery address is required'
    } else if (formData.customer_address.trim().length < 5) {
      newErrors.customer_address = 'Please enter a full address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formData).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    try {
      // Calculate and store total BEFORE clearing cart
      const total = getTotalPrice()
      const orderNum = `SOM-${Date.now().toString().slice(-6)}`

      const orderPayload = {
        order_number: orderNum,
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim().toLowerCase(),
        customer_phone: formData.customer_phone.trim(),
        customer_address: formData.customer_address.trim(),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.sale_price || item.price,
          quantity: item.quantity,
          image: item.images?.[0] || null,
        })),
        total: total,
        status: 'pending',
        payment_method: 'bank_transfer',
      }

      // Save order to Supabase
      const { error } = await supabase.from('orders').insert([orderPayload])

      if (error) {
        console.error('Supabase error:', error)
        toast.error('Failed to place order. Please try again.')
        setLoading(false)
        return
      }

      // Save total before clearing cart
      setOrderTotal(total)

      // Send email notifications
      try {
        await Promise.all([
          sendAdminOrderNotification(orderPayload),
          sendCustomerOrderConfirmation(orderPayload),
        ])
        toast.success('Order placed! Check your email for confirmation.')
      } catch (emailError) {
        console.warn('Email notification failed:', emailError)
        toast.success('Order placed successfully!')
      }

      setOrderNumber(orderNum)
      setOrderComplete(true)
      clearCart() 
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="container checkout-page">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Placing your order...</p>
        </div>
      </main>
    )
  }

  // Order confirmation
  if (orderComplete && orderNumber) {
    return (
      <main className="container checkout-page">
        <div className="order-confirmation">
          <div className="confirmation-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-number">
            Order Number: <strong>{orderNumber}</strong>
          </p>
          <p className="order-total">
            Total: {formatPrice(orderTotal)} {/* ✅: Use stored total */}
          </p>

          <div className="payment-instructions">
            <h2>Payment Instructions</h2>
            <p>Please complete your payment using the details below:</p>
            
            <div className="bank-details">
              <p><strong>Bank:</strong> Opay (PayCom)</p>
              <p><strong>Account Name:</strong> Chigozie Martins</p>
              <p><strong>Account Number:</strong> 8162151494</p>
            </div>

            <div className="whatsapp-section">
              <p>
                💬 After making the transfer, send a screenshot of your payment receipt to our WhatsApp number. Use Order Number as Narration:
              </p>
              <a
                href={`https://wa.me/2348162151494?text=Hello%20Sommy%20Wears%2C%20I%20just%20placed%20order%20${orderNumber}%20and%20have%20sent%20the%20payment.%20Please%20confirm.`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <WhatsAppIcon size={20} color="#ffffff" /> Send Proof on WhatsApp
              </a>
            </div>

            <p className="note">
              Your order will be shipped once we confirm payment in our account.
            </p>
          </div>

          <div className="review-invite">
            <h3>⭐ Love Your Purchase?</h3>
            <p>
              After you receive your order, we'd love to hear your feedback! 
              You'll receive a review link in your delivery confirmation email.
            </p>
          </div>

          <div className="confirmation-actions">
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Checkout form
  return (
    <main className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          <h2>Shipping Information</h2>

          <div className="form-group">
            <label htmlFor="customer_name">Full Name *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={touched.customer_name && errors.customer_name ? 'error' : ''}
              disabled={loading}
            />
            {touched.customer_name && errors.customer_name && (
              <span className="error-text">{errors.customer_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customer_email">Email Address *</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={touched.customer_email && errors.customer_email ? 'error' : ''}
              disabled={loading}
            />
            {touched.customer_email && errors.customer_email && (
              <span className="error-text">{errors.customer_email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customer_phone">Phone Number *</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="08012345678"
              className={touched.customer_phone && errors.customer_phone ? 'error' : ''}
              disabled={loading}
            />
            {touched.customer_phone && errors.customer_phone && (
              <span className="error-text">{errors.customer_phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customer_address">Delivery Address *</label>
            <textarea
              id="customer_address"
              name="customer_address"
              rows="3"
              value={formData.customer_address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="House number, street, city, state"
              className={touched.customer_address && errors.customer_address ? 'error' : ''}
              disabled={loading}
            />
            {touched.customer_address && errors.customer_address && (
              <span className="error-text">{errors.customer_address}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary place-order-btn" 
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Your Order</h2>
          
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-qty">× {item.quantity}</span>
                </div>
                <span className="order-item-price">
                  {formatPrice((item.sale_price || item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-total-row">
            <span>Total</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>

          <p className="payment-note">
            🔒 You will pay via Bank Transfer. Instructions will be shown after placing your order.
          </p>
        </div>
      </div>
    </main>
  )
}