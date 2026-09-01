import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json()

    const mailOptions = {
      from: `Sommy Wears <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.messageId)
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })
  } catch (error) {
    console.error('❌ Email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}