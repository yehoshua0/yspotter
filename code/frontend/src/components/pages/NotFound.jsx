import React from 'react'
import { Link } from 'react-router-dom' // Optional, if using React Router

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! It looks like you’ve wandered off the map. The page you’re
          looking for doesn’t exist.
        </p>

        {/* Button to return home */}
        <Link to="/" className="text-blue-600 hover:underline">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
