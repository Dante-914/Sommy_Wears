'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import WishlistButton from '@/components/WishlistButton'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-image.jpg'

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="product-card-wrapper">
      <Link href={`/shop/${product.slug}`} className="product-card">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="product-image"
        />
        <WishlistButton product={product} />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
          </span>
          <div className="product-price">
            {product.sale_price ? (
              <>
                <span className="sale-price">{formatPrice(product.sale_price)}</span>
                <span className="original-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  )
}