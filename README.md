# Propr - Property Management Platform

A comprehensive property management platform built with Next.js, Supabase, and modern web technologies. Propr helps users discover, track, and manage property listings with automated email notifications and admin management tools.

## 🚀 Features

- **Property Listings**: Browse and search property listings from AMPRE API
- **User Authentication**: Secure signup/login with Supabase Auth
- **Saved Searches**: Users can save building-specific searches
- **Daily Email Notifications**: Automated daily emails with new listings
- **Admin Panel**: Complete CRUD management for users, agents, and buildings
- **Responsive Design**: Modern UI with shadcn/ui components
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Tailwind CSS
- **Email Service**: Resend
- **Property Data**: AMPRE API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── condo/             # Property listing pages
│   └── settings/          # User settings
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── condo/             # Property-related components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and server actions
├── hooks/                 # Custom React hooks
└── utils/                 # Helper utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- AMPRE API access
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mylesjm95/propr.git
   cd propr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   AMPRE_API_KEY=your_ampre_api_key
   AMPRE_API_URL=your_ampre_api_url
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=your_from_email
   TO_EMAIL=your_to_email
   DATABASE_URL=your_database_url
   ```

4. **Set up the database**
   - Run the SQL trigger in your Supabase SQL Editor:
   ```sql
   -- Create a function to handle new user creation
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS trigger
   LANGUAGE plpgsql
   SECURITY DEFINER SET search_path = public
   AS $$
   BEGIN
     INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
       COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
       NOW(),
       NOW()
     );
     RETURN NEW;
   END;
   $$;

   -- Create the trigger
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 GitHub Actions

The project includes automated workflows for daily email notifications:

### Daily Email Workflow
- **Schedule**: Runs daily at 10:00 AM UTC
- **Purpose**: Sends property update emails to users with saved searches
- **Manual Trigger**: Available in GitHub Actions tab

### Test Email Workflow
- **Trigger**: Manual only
- **Purpose**: Test email functionality for specific users
- **Input**: User ID to test

### Required Secrets
Configure these in your GitHub repository settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AMPRE_API_KEY`
- `AMPRE_API_URL`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `TO_EMAIL`
- `DATABASE_URL`

See [.github/workflows/README.md](.github/workflows/README.md) for detailed setup instructions.

## 📧 Email System

The platform includes a comprehensive email notification system:

- **Daily Property Updates**: Automated daily emails with new listings
- **Building Subscriptions**: Users can subscribe to specific buildings
- **Admin Notifications**: System notifications for admin users
- **Email Templates**: Customizable HTML email templates

## 🔐 Authentication

- **Supabase Auth**: Secure user authentication
- **Email Confirmation**: Optional email verification
- **Role-based Access**: Admin and user roles
- **Session Management**: Secure session handling

## 🎨 UI Components

Built with shadcn/ui components:
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Dark Mode**: Theme support
- **Custom Components**: Property-specific UI elements

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 📊 Admin Features

- **User Management**: CRUD operations for users
- **Agent Management**: Manage real estate agents
- **Building Management**: Property building administration
- **Email Monitoring**: Track email delivery and engagement
- **Analytics**: User activity and engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@propr.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Resend](https://resend.com/) for email delivery
