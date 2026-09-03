'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

export default function FloatingCart() {
  const { cart, getTotalItems, getTotalPrice, removeFromCart, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const cartRef = useRef(null)
  const pathname = usePathname()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  // ===== CLOSE CART ON NAVIGATION =====
  useEffect(() => {
    setIsOpen(false)
    if (pathname === '/checkout') {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
  }, [pathname])

  // ===== CLOSE CART ON ESC KEY =====
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // ===== CLOSE CART ON CLICK OUTSIDE =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && cartRef.current && !cartRef.current.contains(e.target)) {
        if (e.target.closest('.cart-toggle')) return
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load saved position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('floatingCartPosition')
    if (saved) {
      try {
        setPosition(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (isMounted && (position.x !== 20 || position.y !== 80)) {
      localStorage.setItem('floatingCartPosition', JSON.stringify(position))
    }
  }, [position, isMounted])

  // ===== HANDLE CHECKOUT =====
  const handleCheckout = () => {
    setIsOpen(false)
    setIsHidden(true)
  }

  // ===== DRAG HANDLERS (ENTIRE CART IS DRAGGABLE) =====
  const handleDragStart = (e) => {
    // Don't drag if clicking on interactive elements
    if (
      e.target.closest('.cart-toggle') ||
      e.target.closest('.cart-content') ||
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('.qty-btn-small') ||
      e.target.closest('.remove-item-btn') ||
      e.target.closest('.cart-checkout-btn')
    ) {
      return
    }
    
    setIsDragging(true)
    const rect = cartRef.current?.getBoundingClientRect()
    if (rect) {
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      })
    }
  }

  // Mouse drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      let newX = e.clientX - dragOffset.x
      let newY = e.clientY - dragOffset.y
      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 80
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Touch drag
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging) return
      const touch = e.touches[0]
      if (!touch) return
      let newX = touch.clientX - dragOffset.x
      let newY = touch.clientY - dragOffset.y
      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 80
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
      setPosition({ x: newX, y: newY })
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragOffset])

  if (totalItems === 0 || isHidden) {
    return null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const cartContent = (
    <div
      ref={cartRef}
      className={`floating-cart ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Drag handle indicator (visible on hover) */}
      <div className="drag-handle">⋮⋮</div>

      <button
        className="cart-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart"
      >
        <span className="cart-icon">🛒</span>
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        <span className="cart-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="cart-content">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <span className="cart-item-count">{totalItems} items</span>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="floating-cart-item">
                <img
                  src={item.images?.[0] || '/images/placeholder.jpg'}
                  alt={item.name}
                  className="floating-cart-item-image"
                />
                <div className="floating-cart-item-info">
                  <p className="floating-cart-item-name">{item.name}</p>
                  <p className="floating-cart-item-price">
                    {formatPrice((item.sale_price || item.price) * item.quantity)}
                  </p>
                </div>
                <div className="floating-cart-item-actions">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn-small"
                  >
                    −
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn-small"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-item-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-price">{formatPrice(totalPrice)}</span>
            </div>
            <Link 
              href="/checkout" 
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              Checkout →
            </Link>
          </div>
        </div>
      )}
    </div>
  )

  return isMounted ? createPortal(cartContent, document.body) : null
}