'use client'

import Link from 'next/link'

export default function ScrollingImages({ products, direction = 'left' }) {
  if (!products || products.length === 0) return null

  // Duplicate products for seamless infinite scroll
  const doubled = [...products, ...products]

  return (
    <div className="scrolling-wrapper">
      <div className={`scrolling-track ${direction}`}>
        {doubled.map((product, idx) => (
          <Link
            href={`/shop/${product.slug}`}
            key={`${product.id}-${idx}`}
            className="scroll-item"
          >
            <img
              src={product.images?.[0] || '/images/placeholder.jpg'}
              alt={product.name}
              className="scroll-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg'
              }}
            />
            <p className="scroll-name">{product.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}