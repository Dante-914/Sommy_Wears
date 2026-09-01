'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const router = useRouter()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (cart.length === 0) {
    return (
      <main className="container cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.images?.[0] || '/placeholder-image.jpg'}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">
                  {formatPrice(item.sale_price || item.price)}
                </p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="btn-primary checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  )
}