'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function BrandBanner() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className={`brand-banner scroll-section ${inView ? 'visible' : ''}`}>
      <div className="brand-banner-fixed-bg" />
      <div className="brand-banner-overlay">
        <div className="container brand-banner-content">
          <div className={`banner-line ${inView ? 'animate' : ''}`}>
            <span className="brand-banner-tag">✦ A BRUSH OF PERFECTION</span>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="brand-banner-title">ADD DISTINCTION TO THE</h2>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <h2 className="brand-banner-title highlight">MODERN GENTLEMAN</h2>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <p className="brand-banner-subtitle">
              Discover curated essentials designed to elevate your personal style
            </p>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <Link href="/shop" className="btn-brand-banner">
              Explore Collection →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}