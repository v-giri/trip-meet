import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css' // Import Mapbox CSS globally
import { Inter } from 'next/font/google'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFAB from '../components/ui/WhatsAppFAB'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TripMeet - AI-Powered Travel Planning',
  description: 'AI-powered itineraries, hidden gems, and unforgettable experiences in India.',
  openGraph: {
    title: 'TripMeet - Travel Smarter. Discover Deeper.',
    description: 'AI-powered itineraries, hidden gems, and unforgettable experiences in India.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <WhatsAppFAB />
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
