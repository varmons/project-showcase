# Project Showcase Portfolio

A modern, database-driven portfolio website built with **Next.js 14+**, **TypeScript**, **Tailwind CSS**, and **Supabase**. Designed with a **Cassette Futurism / Retro Office** aesthetic and a complete admin panel for content management.

![Project Screenshot](https://via.placeholder.com/1200x630)

## ✨ Features

- **🎨 Cassette Futurism Design**: High-contrast, chunky UI with CRT scanlines and hard shadows
- **🌓 Theme Support**: 
  - **Light Mode**: "Retro Office" (Beige/Black/Orange)
  - **Dark Mode**: "System Online" (Black/Amber)
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **🔐 Admin Panel**: Complete CMS for managing projects, experiences, skills, and settings
- **💾 Database-Driven**: All content stored in Supabase (no hardcoded data)
- **📦 Storage Support**: Image uploads for projects and profiles
- **✉️ Contact Form**: Integrated with database for message management
- **⚡ Type-Safe**: Built with strict TypeScript
- **🎯 SEO Ready**: Meta tags and structured data support

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Storage + RLS)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components built on `class-variance-authority`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Supabase Setup](./docs/SUPABASE_SETUP.md)** - Detailed database configuration guide
- **[Database Import](./supabase_import.sql)** - Complete SQL script for one-click setup
- **[Contributing Guidelines](./CONTRIBUTING.md)** - Development best practices

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/portfolio.git
cd Portfolio
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your Project URL and API key from **Project Settings** → **API**
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Initialize Database

**Option 1: One-Click Import (Recommended)**

Import the complete database setup using the provided SQL file:

1. Open Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase_import.sql`
4. Click **Run** to execute

This will create all tables, indexes, RLS policies, and seed initial data automatically.

**Option 2: Step-by-Step Setup**

Follow the [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) for manual configuration

### 4. Configure Storage Buckets

Create two public storage buckets in Supabase Dashboard → **Storage**:

1. **project-images** (Public, 5MB limit)
2. **profile-images** (Public, 5MB limit)

Add RLS policies for each bucket:
- **SELECT**: Allow public access
- **INSERT/UPDATE/DELETE**: Require authentication

See `supabase_import.sql` for detailed instructions.

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Access Admin Panel

Visit http://localhost:3000/admin to manage your content!

## 📋 Project Structure

```
Portfolio/
├── app/                      # Next.js App Router
│   ├── (frontend)/          # Public pages (home, projects, about)
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   └── login/               # Authentication
├── components/
│   ├── features/            # Feature-specific components
│   ├── layout/              # Layout components
│   ├── ui/                  # Reusable UI components
│   └── admin/               # Admin panel components
├── lib/
│   ├── supabase/            # Supabase client configuration
│   └── api/                 # API utilities
├── config/                  # Site configuration
├── docs/                    # Documentation
└── types/                   # TypeScript type definitions
```

## 🎯 Key Features

### Content Management System

- **Projects**: Create and manage portfolio projects with tags, images, and detailed descriptions
- **Experience**: Track your work history with achievements and timelines
- **Skills**: Organize skills by category (Tech, Design, Product)
- **Settings**: Configure site-wide settings (name, bio, social links, SEO)
- **Messages**: View and manage contact form submissions

### Dynamic Homepage

- Featured projects automatically pulled from database
- Skills grouped by category
- Status indicator and customizable hero section
- All content editable via admin panel

### Admin Features

- ✅ CRUD operations for all content types
- ✅ Image upload with Supabase Storage
- ✅ Rich text editing
- ✅ Tag management
- ✅ Display order control
- ✅ Publish/unpublish content
- ✅ Featured content selection

## 🔧 Configuration

### Database Schema

The project uses the following Supabase tables:

- **users**: User authentication and profiles
- **projects**: Portfolio projects with tags and categories
- **experiences**: Work history and achievements
- **skills**: Technical and soft skills by category
- **posts**: Blog posts (future feature)
- **tags**: Project tagging system
- **settings**: Site-wide configuration (JSON stored)
- **messages**: Contact form submissions

All tables include RLS policies for security. See `supabase_import.sql` for complete schema.

### Site Configuration

Edit site-wide settings in the admin panel at `/admin/settings` or modify defaults in `config/site.ts`:

```typescript
export const siteConfig = {
  name: "John Doe",
  title: "John Doe | Product Manager",
  // ...
};
```

## License

This project is licensed under the [MIT License](LICENSE).
