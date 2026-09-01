import { NextResponse } from 'next/server'
import emailjs from '@emailjs/browser'

export async function GET() {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID,
      {
        order_number: 'TEST-001',
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '08012345678',
        customer_address: 'Test Address',
        items_list: 'Test Item x 1 = ₦1,000',
        total: '₦1,000',
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent!', 
      response 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      status: error.status,
      text: error.text,
    }, { status: 500 })
  }
}