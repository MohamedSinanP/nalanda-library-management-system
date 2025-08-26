import { BookOpen } from 'lucide-react'

const Logo = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Nalanda</h1>
      <p className="text-blue-600 text-lg font-medium">Library Management System</p>
      <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account</p>
    </div>
  )
}

export default Logo
