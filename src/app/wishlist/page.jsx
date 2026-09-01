'use client'

import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist()

  return (
    <main className="container wishlist-page">
      <div className="wishlist-header">
        <h1>❤️ Your Wishlist</h1>
        {wishlist.length > 0 && (
          <button onClick={clearWishlist} className="btn-secondary">
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <Link href="/shop" className="btn-primary">
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}