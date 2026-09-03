import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { CategoryProvider } from '@/context/CategoryContext'
import { Toaster } from 'react-hot-toast'
import FloatingCart from '@/components/FloatingCart'
import EmailJSInitializer from '@/components/EmailJSInitializer'
import BackToTop from '@/components/BackToTop'
import { WishlistProvider } from '@/context/WishlistContext'

export const metadata = {
  title: 'Sommy Wears - Premium Men\'s Fashion',
  description: 'Shop premium polo shirts, shorts, trousers, and matching sets.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body>
        <EmailJSInitializer />
        <WishlistProvider>
        <CategoryProvider>
           <CartProvider>
            <Header />
            {children}
            <FloatingCart />
            <BackToTop />
            <Footer />
            <Toaster position="top-center" />
          </CartProvider>
        </CategoryProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}