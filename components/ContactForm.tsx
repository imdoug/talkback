'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
    const { user } = useUser()
    console.log("User in Home Page:", user)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        throw new Error('Something went wrong')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
      <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl w-full max-w-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-[#B0B2C4]">Send us a message</h2>

        {['name', 'email', 'phone', 'subject'].map((field) => (
          <div key={field} className="mb-4">
            <input
              type="text"
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2E5F]"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D2E5F]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2D2E5F] text-white font-semibold py-2 rounded-full hover:bg-[#1f203d] transition"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'SUBMIT'}
        </button>

        {status === 'success' && <p className="text-green-600 mt-4">Message sent successfully!</p>}
        {status === 'error' && <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>}
      </form>
  )
}
