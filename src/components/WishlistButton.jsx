'use client'

import { useWishlist } from '@/context/WishlistContext'
import toast from 'react-hot-toast'

export default function WishlistButton({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    
    if (isWishlisted) {
      toast.success('Removed from wishlist')
    } else {
      toast.success('Added to wishlist')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? '❤️' : '🤍'}
    </button>
  )
}