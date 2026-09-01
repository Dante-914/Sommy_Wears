'use client'


import Link from 'next/link'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import { InstagramIcon } from '@/components/WhatsAppIcon'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Sommy Wears</h3>
            <p>Premium men's fashion — crafted for style and comfort.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:+2348162151494">+234 816 215 1494</a>
            <a href="mailto:iamsommy1@gmail.com">iamsommy1@gmail.com</a>
            <span>Marian by Ediba, beside Unity Bank, Calabar Municipal, Cross River State</span>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <a href="https://wa.me/2348162151494" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} color="#25D366" /> WhatsApp
            </a>
            <a href="https://instagram.com/sommywears" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={18} color="#E4405F" /> Instagram
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sommy Wears. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}