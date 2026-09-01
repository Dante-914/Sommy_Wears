'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function ScrollBanner() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="scroll-banner">
      <div className="scroll-banner-overlay">
        <div className="container scroll-banner-content">
          <div className={`banner-line ${inView ? 'animate' : ''}`}>
            <span className="banner-tag">✦ A BRUSH OF PERFECTION</span>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="banner-title">ADD DISTINCTION TO THE</h2>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <h2 className="banner-title highlight">MODERN GENTLEMAN</h2>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <p className="banner-subtitle">
              Discover curated essentials designed to elevate your personal style
            </p>
          </div>
          <div className={`banner-line ${inView ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <Link href="/shop" className="btn-banner">
              Explore Collection →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}