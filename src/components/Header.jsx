'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import Sidebar from '@/components/Sidebar'

export default function Header() {
  const { getTotalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const itemCount = getTotalItems()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Row 1: Logo + Hamburger + Cart */}
        <div className="header-inner">
          <div className="header-left">
            <Sidebar categories={[]} productCounts={{}} />
            <Link href="/" className="logo">Sommy Wears</Link>
          </div>
          <Link href="/cart" className="cart-link">
            🛒 {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>

        {/* Row 2: Navigation Bar */}
        <nav className="nav-bar">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/wishlist" className="nav-link wishlist-link">
            ❤️ {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}