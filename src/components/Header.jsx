'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Sidebar from '@/components/Sidebar'
import { useWishlist } from '@/context/WishlistContext'

export default function Header() {
  const { getTotalItems } = useCart()
  const itemCount = getTotalItems()
  const [scrolled, setScrolled] = useState(false)
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <div className="header-left">
          {/* Sidebar is now self-contained — it renders its own hamburger button */}
          <Sidebar categories={[]} productCounts={{}} />
          <Link href="/" className="logo">Sommy Wears</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/wishlist" className="wishlist-link">
          Wishlist {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </Link>
        </nav>

        <Link href="/cart" className="cart-link">
          🛒 {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </div>
    </header>
  )
}