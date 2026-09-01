'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ReviewForm({ orderNumber, customerName, customerEmail }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('reviews').insert([
      {
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        rating: rating,
        comment: comment.trim(),
        is_approved: false, // Admin approval required
      }
    ])

    if (error) {
      console.error('Review error:', error)
      toast.error('Failed to submit review. Please try again.')
      setLoading(false)
      return
    }

    toast.success('Thank you for your feedback! Your review will appear once approved. ❤️')
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="review-success">
        <div className="review-success-icon">⭐</div>
        <h3>Thank You for Your Feedback!</h3>
        <p>Your review has been submitted and will appear once approved by our team.</p>
        <p className="review-success-note">We appreciate you taking the time to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="review-form-container">
      <h3>📝 Share Your Experience</h3>
      <p className="review-subtitle">
        How was your experience with <strong>{orderNumber}</strong>?
      </p>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Star Rating */}
        <div className="star-rating">
          <label>Your Rating *</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="rating-label">
            {rating > 0 && `${rating} ${rating === 1 ? 'star' : 'stars'}`}
            {rating === 0 && 'Select a rating'}
          </span>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Your Feedback</label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with the product, delivery, and overall service..."
            className="review-textarea"
          />
        </div>

        <button type="submit" className="btn-primary submit-review-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}