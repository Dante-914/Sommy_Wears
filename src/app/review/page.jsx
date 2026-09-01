'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ReviewForm from '@/components/ReviewForm'
import Link from 'next/link'

function ReviewContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const customerName = searchParams.get('name')
  const customerEmail = searchParams.get('email')

  if (!orderNumber || !customerName || !customerEmail) {
    return (
      <main className="container review-page">
        <div className="review-error">
          <h2>⚠️ Invalid Review Link</h2>
          <p>Please use the link sent in your order confirmation email.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container review-page">
      <div className="review-wrapper">
        <h1>⭐ Share Your Experience</h1>
        <p className="review-intro">
          We'd love to hear about your experience with <strong>Sommy Wears</strong>.
          Your feedback helps us improve and helps other customers make informed decisions.
        </p>
        <ReviewForm 
          orderNumber={orderNumber}
          customerName={customerName}
          customerEmail={customerEmail}
        />
      </div>
    </main>
  )
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="container review-page"><p>Loading...</p></div>}>
      <ReviewContent />
    </Suspense>
  )
}