import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const CTA = () => {
  return (
    <section className='cta-section'>
        <div className='cta-badge'>Start learning your way.</div>
        <h2 className='text-3xl font-bold'>Build and personalize Yooly</h2>
        <p >Pick a name, subject, voice, & personality - and start learning through voice conversations that feel natural and fun.</p>
        {/* <Image
            src="/images/cta.svg"
            alt="CTA Image"
            width={500}
            height={300}
            className='cta-image'
        /> */}
        <button className='btn-primary bg-white text-[#272a4c]'>
            <Image
                src="/icons/plus.svg"
                alt="Plus Icon"
                width={16}
                height={16}
            />
            <Link href="/companions/new">
                <p>Build a New Companion</p>
            </Link>
        </button>
        <p className='text-sm'>No credit card required</p>
    </section>
  )
}

export default CTA