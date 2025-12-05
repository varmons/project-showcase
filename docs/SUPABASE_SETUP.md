# Supabase Database Setup Guide

This guide will walk you through setting up and initializing the Supabase database for the Project Showcase portfolio application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Schema Overview](#database-schema-overview)
3. [Setup Instructions](#setup-instructions)
4. [Initialize Sample Data](#initialize-sample-data)
5. [Storage Configuration](#storage-configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A new Supabase project created
- Your Supabase project URL and API keys (found in Project Settings → API)

---

## Database Schema Overview

The application uses the following tables:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `projects` | Portfolio projects | title, slug, content, is_featured, is_published |
| `posts` | Blog posts | title, slug, content, is_featured, is_published |
| `experiences` | Work experience entries | company, role, start_date, end_date |
| `skills` | Technical skills | name, category, display_order |
| `tags` | Project/Post tags | name, slug |
| `project_tags` | Project-Tag relationship | project_id, tag_id |
| `post_tags` | Post-Tag relationship | post_id, tag_id |
| `settings` | Site configuration | category, data (JSONB) |
| `messages` | Contact form submissions | name, email, message, status |

---

## Setup Instructions

### Step 1: Create Database Tables

Connect to your Supabase project and run the following migrations in the SQL Editor.

#### 1.1 Create Tags Table

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2 Create Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_projects_display_order ON projects(display_order);
```

#### 1.3 Create Project-Tags Junction Table

```sql
CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, tag_id)
);

CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON project_tags(tag_id);
```

#### 1.4 Create Posts Table

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_is_published ON posts(is_published);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_display_order ON posts(display_order);
```

#### 1.5 Create Post-Tags Junction Table

```sql
CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

#### 1.6 Create Skills Table

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_display_order ON skills(display_order);
```

#### 1.6 Create Skills Table

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_display_order ON skills(display_order);
```

#### 1.7 Create Experiences Table

```sql
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  achievements JSONB DEFAULT '[]',
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experiences_display_order ON experiences(display_order);
```

#### 1.8 Create Settings Table

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.9 Create Messages Table (Contact Form)

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### 1.10 Create Update Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Initialize Sample Data

### Step 2: Insert Default Settings

```sql
INSERT INTO settings (category, data) VALUES
  ('general', '{
    "name": "Project Showcase",
    "title": "Product Manager & Frontend Architect",
    "tagline": "Building Digital Products That Matter.",
    "bio": "Bridging design, engineering, and business strategy.",
    "status": "System Status: Available"
  }'),
  ('contact', '{
    "email": "hello@example.com",
    "phone": "",
    "location": ""
  }'),
  ('social', '{
    "twitter": "https://twitter.com",
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "resume": "/resume.pdf"
  }'),
  ('seo', '{
    "description": "Portfolio of a Product Manager and Frontend Architect",
    "url": "https://example.com",
    "ogImage": "https://example.com/og.jpg"
  }'),
  ('about', '{
    "content": "<p class=\"text-lg leading-relaxed\">I am a Product Manager and Frontend Architect with a passion for building software that solves real problems. With a background in both design and engineering, I thrive in the intersection of these disciplines.</p><p>Over the past 5 years, I have worked with startups and enterprise companies to launch products from 0 to 1, and scale existing platforms to millions of users.</p><p>My philosophy is simple: <strong>Shipping is the heartbeat of a product team.</strong> I believe in rapid iteration, user-centric design, and clean, maintainable code.</p>"
  }')
ON CONFLICT (category) DO NOTHING;
```

### Step 3: Insert Sample Skills

```sql
INSERT INTO skills (name, category, display_order) VALUES
  ('React', 'Tech', 0),
  ('Next.js', 'Tech', 1),
  ('TypeScript', 'Tech', 2),
  ('Tailwind CSS', 'Tech', 3),
  ('Node.js', 'Tech', 4),
  ('Figma', 'Design', 5),
  ('UI/UX Design', 'Design', 6),
  ('Design Systems', 'Design', 7),
  ('Product Strategy', 'Product', 8),
  ('User Research', 'Product', 9),
  ('Agile/Scrum', 'Product', 10);
```

### Step 4: Insert Sample Tags

```sql
INSERT INTO tags (name, slug) VALUES
  ('Frontend', 'frontend'),
  ('Backend', 'backend'),
  ('Full Stack', 'full-stack'),
  ('Design', 'design'),
  ('Mobile', 'mobile'),
  ('Product', 'product'),
  ('Enterprise', 'enterprise'),
  ('Startup', 'startup');
```

### Step 5: Insert Sample Experiences

```sql
INSERT INTO experiences (company, role, start_date, end_date, description, achievements, display_order) VALUES
  (
    'Tech Startup Inc.',
    'Senior Product Manager',
    '2022-01',
    NULL,
    'Leading product strategy and development for a B2B SaaS platform serving 10,000+ users.',
    '["Launched 3 major features that increased user engagement by 40%", "Reduced customer churn by 25% through data-driven product improvements", "Built and managed a cross-functional team of 8 engineers and designers"]',
    0
  ),
  (
    'Digital Agency Co.',
    'Frontend Architect',
    '2020-06',
    '2021-12',
    'Architected and built scalable frontend solutions for enterprise clients.',
    '["Designed and implemented a design system used across 15+ projects", "Improved page load time by 60% through performance optimization", "Mentored 5 junior developers on best practices"]',
    1
  );
```

### Step 6: Insert Sample Projects (Optional)

```sql
-- First, insert a sample project
INSERT INTO projects (
  slug, 
  title, 
  subtitle, 
  content, 
  is_featured, 
  is_published, 
  display_order
) VALUES (
  'fintech-dashboard',
  'Fintech Analytics Dashboard',
  'Real-time financial data visualization platform',
  'A comprehensive analytics dashboard for fintech companies to monitor transactions, user behavior, and market trends in real-time. Built with React, TypeScript, and D3.js for powerful data visualization.',
  true,
  true,
  0
);

-- Get the project ID and tag IDs to create relationships
-- Replace the UUIDs below with actual IDs from your database

-- Example: Link project to tags
-- INSERT INTO project_tags (project_id, tag_id)
-- SELECT 
--   (SELECT id FROM projects WHERE slug = 'fintech-dashboard'),
--   id 
-- FROM tags 
-- WHERE slug IN ('frontend', 'full-stack', 'enterprise');
```

---

## Storage Configuration

### Step 7: Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Create the following buckets:

#### Bucket 1: `project-images`
- **Name**: `project-images`
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

#### Bucket 2: `profile-images`
- **Name**: `profile-images`
- **Public**: ✅ Yes
- **File size limit**: 2 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

### Step 8: Configure Storage Policies

For each bucket, add the following policies:

#### Policy 1: Public Read Access
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `true`

#### Policy 2: Authenticated Upload
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `true`

#### Policy 3: Authenticated Update
- **Policy name**: `Authenticated users can update`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `true`

#### Policy 4: Authenticated Delete
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `true`

---

## Verification

### Check Tables

Run this query to verify all tables are created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected output:**
- `experiences`
- `messages`
- `project_tags`
- `projects`
- `settings`
- `skills`
- `tags`

### Check Sample Data

```sql
-- Check settings
SELECT category, data->>'name' as name FROM settings WHERE category = 'general';

-- Check skills count by category
SELECT category, COUNT(*) as count 
FROM skills 
GROUP BY category 
ORDER BY category;

-- Check experiences
SELECT company, role, start_date FROM experiences ORDER BY display_order;

-- Check tags
SELECT name, slug FROM tags ORDER BY name;
```

### Check Storage Buckets

Run this query:

```sql
SELECT id, name, public FROM storage.buckets;
```

**Expected output:**
- `project-images` (public: true)
- `profile-images` (public: true)

---

## Troubleshooting

### Issue: "permission denied for table"

**Solution**: Make sure you're running queries in the SQL Editor as the project owner, not as a specific user.

### Issue: "Bucket not found" when uploading images

**Solutions**:
1. Verify buckets exist: Go to Storage → Configuration
2. Check bucket policies are set up correctly
3. Ensure RLS is properly configured (or temporarily disable for testing)

### Issue: Settings not loading in frontend

**Solutions**:
1. Check data in `settings` table:
   ```sql
   SELECT * FROM settings;
   ```
2. Verify your `.env.local` has correct Supabase credentials
3. Check browser console for API errors

### Issue: Projects not showing on homepage

**Checklist**:
1. Verify projects exist and are published:
   ```sql
   SELECT title, is_published, is_featured FROM projects;
   ```
2. Set at least one project as featured:
   ```sql
   UPDATE projects SET is_featured = true, is_published = true WHERE id = 'YOUR_PROJECT_ID';
   ```

---

## Next Steps

After completing this setup:

1. **Update Site Settings**: Visit `/admin/settings` to customize your portfolio
2. **Add Projects**: Visit `/admin/projects/new` to add your projects
3. **Add Experiences**: Visit `/admin/experiences/new` to add work experiences
4. **Customize Skills**: Visit `/admin/skills` to edit or add skills
5. **Configure Storage**: Upload project thumbnails via the admin panel

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/overview)
- [Row Level Security (RLS) Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## Need Help?

If you encounter any issues not covered in this guide:

1. Check the application logs in your browser console
2. Review Supabase logs in the Dashboard → Logs
3. Verify your environment variables are correctly set
4. Consult the main [README.md](../README.md) for project-specific instructions

---

**Last Updated**: 2025-01-05  
**Version**: 1.0.0
