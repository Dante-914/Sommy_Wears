'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCategories } from '@/context/CategoryContext'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { categories, productCounts, loading } = useCategories()
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Only show categories with 2 or more products
  const visibleCategories = categories.filter(cat => {
    const count = productCounts[cat.slug] || 0
    return count >= 2  // ← ONLY categories with 2+ items
  })

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? 'hidden' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? 'active' : ''}`} />
        <span className={`hamburger-line ${isOpen ? 'active' : ''}`} />
        <span className={`hamburger-line ${isOpen ? 'active' : ''}`} />
      </button>

      {/* Backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation">
        <div className="sidebar-header">
          <span className="sidebar-title">Shop by Category</span>
          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="sidebar-empty">Loading categories...</p>
        ) : visibleCategories.length === 0 ? (
          <p className="sidebar-empty">
            {categories.length === 0 
              ? 'No categories found.' 
              : 'Categories with 2+ products will appear here.'}
          </p>
        ) : (
          <div className="sidebar-categories">
            {visibleCategories.map((cat) => {
              const count = productCounts[cat.slug] || 0
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="sidebar-category"
                  onClick={closeSidebar}
                >
                  <span className="sidebar-category-icon">{cat.icon || '📦'}</span>
                  <span className="sidebar-category-name">{cat.name}</span>
                  <span className="sidebar-category-count">{count}</span>
                </Link>
              )
            })}
          </div>
        )}

        <div className="sidebar-footer">
          <Link href="/shop" className="sidebar-shop-all" onClick={closeSidebar}>
            View All Products
          </Link>
        </div>
      </aside>
    </>
  )
}