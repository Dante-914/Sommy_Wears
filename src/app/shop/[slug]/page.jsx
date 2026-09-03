'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ProductCard'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Spinner from '@/components/Spinner'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const supabase = createClient()

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (productData) {
        setProduct(productData)

        // Fetch related products (same category, exclude current)
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', productData.id)
          .limit(6)

        setRelatedProducts(related || [])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [slug, supabase])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, 1)
    toast.success(`${product.name} added to cart! 🛒`)
  }

  if (loading) {
    return (
      <main className="container product-page">
        <Spinner />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container product-page">
        <h1>Product not found</h1>
        <Link href="/shop">← Back to Shop</Link>
      </main>
    )
  }

  const imageUrl = product.images?.[0] || '/images/placeholder.jpg'

  return (
    <main className="container product-page">
      {/* Main Product */}
      <div className="product-details">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.name} className="product-main-image" />
        </div>
        <div className="product-info-container">
          <h1>{product.name}</h1>
          <p className={`stock-badge-large ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
          </p>
          <p className="product-category">{product.category}</p>
          <div className="product-price-large">
            {product.sale_price ? (
              <>
                <span className="sale-price-large">{formatPrice(product.sale_price)}</span>
                <span className="original-price-large">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="product-description">{product.description}</p>
          <button 
            onClick={handleAddToCart} 
            className="btn-primary add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>More {product.category} You Might Like</h2>
          <div className="product-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}