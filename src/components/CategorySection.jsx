'use client'

import { useInView } from 'react-intersection-observer'
import ScrollingImages from './ScrollingImages'

export default function CategorySection({ 
  title, 
  icon, 
  products, 
  direction = 'left', 
  backgroundImage = null,
  slug
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  if (!products || products.length === 0) return null

  return (
    <section 
      ref={ref}
      className={`category-section scroll-section ${inView ? 'visible' : ''}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : {}}
    >
      {/* Overlay for readability */}
      <div className="category-overlay">
        <div className="container">
          <h2 className="scrolling-title">
            <span>{icon} {title}</span>
          </h2>
          <p className="category-subtitle">Shop the latest {title.toLowerCase()} collection</p>
        </div>
        <ScrollingImages products={products} direction={direction} />
      </div>
    </section>
  )
}