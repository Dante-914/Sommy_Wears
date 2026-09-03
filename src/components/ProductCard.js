'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import WishlistButton from '@/components/WishlistButton'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const isInStock = product.stock > 0

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/images/placeholder-image.jpg'

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isInStock) {
      toast.error('Sorry, this item is out of stock!')
      return
    }
    addToCart(product, 1)
    toast.success(`${product.name} added to cart! 🛒`)
  }

  return (
    <div className="product-card-wrapper">
      <div className="product-image-wrapper">
        <Link href={`/shop/${product.slug}`} className="product-card">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-image"
          />
        </Link>
        <WishlistButton product={product} />
        {!isInStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-header">
          <Link href={`/shop/${product.slug}`} className="product-name">
            {product.name}
          </Link>
          <span className={`stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
            {isInStock ? 'In Stock' : '❌ Out of Stock'}
          </span>
        </div>
        <div className="product-price">
          {isInStock ? (
            <>
              {product.sale_price ? (
                <>
                  <span className="sale-price">{formatPrice(product.sale_price)}</span>
                  <span className="original-price">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span>{formatPrice(product.price)}</span>
              )}
            </>
          ) : (
            <span className="out-of-stock-price">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart} 
          className={`add-to-cart-btn ${!isInStock ? 'disabled' : ''}`}
          disabled={!isInStock}
        >
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}