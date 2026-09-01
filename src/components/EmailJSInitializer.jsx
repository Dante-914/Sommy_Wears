'use client'

import { useEffect } from 'react'
import emailjs from '@emailjs/browser'

export default function EmailJSInitializer() {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (publicKey) {
      emailjs.init(publicKey)
      console.log('✅ EmailJS initialized')
    } else {
      console.warn('⚠️ EmailJS public key is missing')
    }
  }, [])

  return null
}