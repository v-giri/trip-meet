# TripMeet - Travel Smarter. Discover Deeper. 🌍✨

TripMeet is an end-to-end travel platform designed for the modern Indian traveler. It combines cutting-edge AI trip planning with a community-driven "Khazana Map" to uncover hidden gems that standard travel agencies miss.

## 🚀 Core Features

- **🤖 AI Trip Planner**: Leverages Google Gemini 1.5 Pro to generate personalized, day-wise itineraries in seconds.
- **🗺️ Khazana Map (Hidden Gems)**: A Mapbox-powered interactive map to discover offbeat locations shared by the community. Includes clustering, category filters, and detailed popups.
- **🛌 Integrated Booking System**: Seamless tour discovery, travelers management, and price calculation.
- **💳 Secure Payments**: Integrated with **Razorpay** for safe and fast Indian payment methods (UPI, Cards, Netbanking).
- **🛡️ Admin Dashboard**: Full control over Tours, Bookings, Users, and Hidden Gem moderations.
- **📧 Automatic Notifications**: Real-time booking confirmations sent via **Resend** and Supabase Edge Functions.
- **📱 Mobile-First Design**: Fully responsive UI built with Tailwind CSS and modern aesthetics.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Mapbox GL JS & React Map GL
- **Notifications**: React Hot Toast
- **Authentication**: Supabase Auth

### Backend & Database
- **Server**: Node.js & Express (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Pro
- **Payments**: Razorpay
- **Email**: Resend (via Supabase Edge Functions)
- **Storage**: Supabase Storage (for avatars and gem photos)

## 📁 Project Structure

```text
/tripmeet
  /apps
    /web         # Next.js 14 Frontend Application
    /api         # Node.js Express Backend Service
  /supabase      # Supabase migrations and Edge Functions
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- NPM or PNPM
- Supabase Account
- Mapbox Token
- Razorpay Key (Test or Live)
- Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/v-giri/trip-meet.git
   cd trip-meet
   ```

2. **Setup Frontend**
   ```bash
   cd apps/web
   npm install
   cp .env.example .env.local
   # Enter your Supabase, Mapbox, and Razorpay keys
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd ../api
   npm install
   cp .env.example .env
   # Enter your Gemini, Razorpay Secret, and Supabase keys
   npm run dev
   ```

4. **Setup Database**
   - Apply migrations in `/supabase/migrations` to your Supabase SQL editor.
   - Deploy Edge Functions: `supabase functions deploy send-booking-confirmation`.

## 🔒 Security

- **Row Level Security (RLS)**: Enforced on all Supabase tables.
- **Server-Side Verification**: Payment signatures are verified using HMAC SHA256 on the backend.
- **Environment Separation**: Public keys use `NEXT_PUBLIC_` prefix while secrets stay strictly in the backend `.env`.

## 📄 License
© 2026 TripMeet. All rights reserved.
Built with ❤️ for Indian Travelers.
