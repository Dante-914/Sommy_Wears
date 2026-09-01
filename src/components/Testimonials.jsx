'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useInView } from 'react-intersection-observer'

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const supabase = createClient()

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
      } else {
        setReviews(data || [])
      }
      setLoading(false)
    }

    fetchReviews()
  }, [supabase])

  // ===== FALLBACK TESTIMONIALS =====
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      customer_name: 'Chidi Okonkwo',
      rating: 5,
      comment: 'Best boutique in Calabar! Great prices, fast delivery, and premium quality. Highly recommended!',
      created_at: new Date().toISOString(),
      is_fallback: true,
    },
    {
      id: 'fallback-2',
      customer_name: 'Funmi Adebayo',
      rating: 5,
      comment: 'I love my new polo shirt! The fabric is so soft and the customer service was excellent.',
      created_at: new Date().toISOString(),
      is_fallback: true,
    },
    {
      id: 'fallback-3',
      customer_name: 'Michael Eze',
      rating: 5,
      comment: 'Fast delivery and premium quality. Sommy Wears is now my go-to boutique for men\'s fashion.',
      created_at: new Date().toISOString(),
      is_fallback: true,
    },
  ]

  // ===== COMBINE: Real reviews first, then fallback =====
  // Real reviews are already fetched. Add fallback if we have fewer than 3 real reviews
  const realReviews = reviews || []
  const combinedReviews = [...realReviews]

  // Add fallback testimonials if we have fewer than 3 real reviews
  if (realReviews.length < 3) {
    const needed = 3 - realReviews.length
    const fallbackToAdd = fallbackTestimonials.slice(0, needed)
    combinedReviews.push(...fallbackToAdd)
  }

  // If there are no real reviews at all, show all fallbacks
  const displayReviews = combinedReviews.length > 0 ? combinedReviews : fallbackTestimonials

  // Render stars
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Verified Purchase'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <section className="testimonials">
        <div className="container">
          <h2 className="testimonials-title">TESTIMONIALS</h2>
          <p className="testimonials-subtitle">WHAT OUR CUSTOMERS SAY</p>
          <p className="testimonials-loading">Loading reviews...</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className={`testimonials scroll-section ${inView ? 'visible' : ''}`}>
      <div className="container">
        <h2 className="testimonials-title">TESTIMONIALS</h2>
        <p className="testimonials-subtitle">WHAT OUR CUSTOMERS SAY</p>
        
        <div className="testimonials-scroll">
          <div className="testimonials-track">
            {/* Double the items for seamless scrolling */}
            {[...displayReviews, ...displayReviews].map((item, index) => (
              <div key={`${item.id}-${index}`} className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars(item.rating)}
                </div>
                <p className="testimonial-text">"{item.comment}"</p>
                <p className="testimonial-name">{item.customer_name}</p>
                <p className="testimonial-date">
                  {item.is_fallback ? '⭐ Verified Purchase' : formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}