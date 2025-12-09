"use client"

import React from 'react'
import Link from 'next/link'

export default function PreRegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-lg text-center">
				<h1 className="text-2xl font-bold mb-4">Pre-register</h1>
				<p className="text-sm text-gray-600">This page is used to collect pre-registration interest. You can replace this placeholder with your full pre-register UI.</p>
				<div className="mt-6">
					<Link href="/auth/signup" className="text-blue-600 underline">Go to signup</Link>
				</div>
			</div>
		</div>
	)
}

