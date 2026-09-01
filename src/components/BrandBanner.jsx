'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function BrandBanner() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className={`brand-banner scroll-section ${inView ? 'visible' : ''}`}>
      <div className="brand-banner-overlay">
        <div className="container brand-banner-content">
          <span className="brand-banner-tag">A BRUSH OF PERFECTION</span>
          <h2 className="brand-banner-title">ADD DISTINCTION TO THE MODERN GENTLEMAN</h2>
          <p className="brand-banner-subtitle">
            Discover curated essentials designed to elevate your personal style
          </p>
          <Link href="/shop" className="btn-brand-banner">
            Explore Collection →
          </Link>
        </div>
      </div>
    </section>
  )
}