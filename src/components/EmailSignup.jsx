'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    setLoading(true)
    // Simulate subscription (you can connect to Supabase later)
    setTimeout(() => {
      toast.success('Subscribed successfully! 🎉')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="email-signup">
      <div className="container email-container">
        <h2 className="email-title">SIGN-UP THE SOMMY WEARS FAN CLUB</h2>
        <p className="email-subtitle">Be the first to know about new arrivals and exclusive offers.</p>
        <form onSubmit={handleSubmit} className="email-form">
          <input
            type="email"
            placeholder="Enter your email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" className="email-btn" disabled={loading}>
            {loading ? 'Subscribing...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>
    </section>
  )
}