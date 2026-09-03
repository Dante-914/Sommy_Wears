'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { WhatsAppIcon, PhoneIcon } from '@/components/WhatsAppIcon'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'iamsommy1@gmail.com',
          subject: `New Contact Message from ${formData.name}`,
          html: `
            <h2>New Contact Form Message</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>Sent from Sommy Wears Contact Form</p>
          `
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Message sent! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        toast.error('Failed to send message. Please try again.')
        console.error('Email error:', result.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <main className="container contact-page">
      <h1>Contact Us</h1>
      
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have a question about an order, sizing, or delivery? Reach out to us, we're happy to help!</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div>
                <strong>Phone</strong>
                <a href="tel:+2348162151494" className="contact-link">
                  <PhoneIcon size={18} color="#25D366" /> +234 816 215 1494
                </a>
              </div>
            </div>
            <div className="contact-item">
              <div>
                <strong>WhatsApp</strong>
                <a href="https://wa.me/2348162151494" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={18} color="#25D366" /> Chat with us
                </a>
              </div>
            </div>
            <div className="contact-item">
              <div>
                <strong>Email</strong>
                <a href="mailto:iamsommy1@gmail.com">iamsommy1@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <div>
                <strong>Location</strong>
                <span>Marian by Ediba, beside Unity Bank, Calabar Municipal, Cross River State</span>
              </div>
            </div>
          </div>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday – Saturday: 9:00 AM – 7:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send a Message</h2>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  )
}