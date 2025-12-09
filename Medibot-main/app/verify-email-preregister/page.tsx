import React from 'react'

export default function VerifyEmailPreRegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center">
				<h1 className="text-xl font-semibold mb-2">Verify your email</h1>
				<p className="text-sm text-gray-600 dark:text-gray-300">A verification link has been sent to your email during pre-registration. Please check your inbox and follow the instructions to complete registration.</p>
			</div>
		</div>
	)
}
