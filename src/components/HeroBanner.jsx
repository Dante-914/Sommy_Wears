'use client'

import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay">
        <div className="container hero-content">
          <span className="hero-tag">A WHOLE NEW LOOK</span>
          <h1 className="hero-title">SOMMY WEARS</h1>
          <p className="hero-subtitle">
            Discover effortless style with our collection of high-quality tees, 
            vintage shirts, and premium denim. Sophisticated fashion, thoughtfully 
            sized for everyone.
          </p>
          <Link href="/shop" className="btn-hero">VIEW MORE →</Link>
        </div>
      </div>
    </section>
  )
}