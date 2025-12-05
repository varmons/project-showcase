# Quick Start Guide

Get your Project Showcase portfolio up and running in 5 minutes!

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd Portfolio
npm install
```

## 2. Set Up Supabase

### Create a Supabase Project

1. Go to https://supabase.com and sign up
2. Click **New Project**
3. Fill in:
   - Project Name: `portfolio`
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)

### Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public key**

### Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Initialize Database

Copy and run this **complete SQL script** in Supabase SQL Editor:

```sql
-- Create all tables
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, tag_id)
);

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

CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_is_published ON posts(is_published);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_messages_status ON messages(status);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (category, data) VALUES
  ('general', '{"name": "Project Showcase", "title": "Product Manager & Frontend Architect", "tagline": "Building Digital Products That Matter.", "bio": "Bridging design, engineering, and business strategy.", "status": "System Status: Available"}'),
  ('contact', '{"email": "hello@example.com", "phone": "", "location": ""}'),
  ('social', '{"twitter": "https://twitter.com", "github": "https://github.com", "linkedin": "https://linkedin.com", "resume": "/resume.pdf"}'),
  ('seo', '{"description": "Portfolio of a Product Manager and Frontend Architect", "url": "https://example.com", "ogImage": "https://example.com/og.jpg"}'),
  ('about', '{"content": "<p class=\"text-lg leading-relaxed\">I am a Product Manager and Frontend Architect with a passion for building software that solves real problems.</p><p>Over the past 5 years, I have worked with startups and enterprise companies to launch products from 0 to 1.</p>"}');

-- Insert sample skills
INSERT INTO skills (name, category, display_order) VALUES
  ('React', 'Tech', 0),
  ('Next.js', 'Tech', 1),
  ('TypeScript', 'Tech', 2),
  ('Tailwind CSS', 'Tech', 3),
  ('Figma', 'Design', 4),
  ('UI/UX Design', 'Design', 5),
  ('Product Strategy', 'Product', 6),
  ('User Research', 'Product', 7);

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
  ('Frontend', 'frontend'),
  ('Design', 'design'),
  ('Product', 'product'),
  ('Full Stack', 'full-stack');
```

## 4. Set Up Storage (Optional - for Image Uploads)

### Create Buckets

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create bucket:
   - Name: `project-images`
   - Public: ✅ **Check this!**
   
4. Repeat for `profile-images`

### Add Policies (Simple Way)

For each bucket:

1. Go to bucket → **Policies**
2. Click **New Policy** → **For full customization**
3. Add these 4 policies:

**Policy 1 - Public Read:**
```sql
-- Name: Public read
-- Operation: SELECT
-- Target roles: public
CREATE POLICY "Public read" ON storage.objects FOR SELECT TO public USING (true);
```

**Policy 2 - Auth Insert:**
```sql
-- Name: Auth users can upload
-- Operation: INSERT
-- Target roles: authenticated
CREATE POLICY "Auth users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
```

**Policy 3 - Auth Update:**
```sql
-- Name: Auth users can update
-- Operation: UPDATE
-- Target roles: authenticated
CREATE POLICY "Auth users can update" ON storage.objects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

**Policy 4 - Auth Delete:**
```sql
-- Name: Auth users can delete
-- Operation: DELETE
-- Target roles: authenticated
CREATE POLICY "Auth users can delete" ON storage.objects FOR DELETE TO authenticated USING (true);
```

## 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 6. Access Admin Panel

1. Visit http://localhost:3000/login
2. Default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

⚠️ **Important**: Change these credentials in production!

## 7. Customize Your Portfolio

### Update Site Settings
http://localhost:3000/admin/settings
- Change name, bio, social links, etc.

### Add Projects
http://localhost:3000/admin/projects/new
- Create your first project
- Check "Featured" to show on homepage
- Check "Published" to make it visible

### Add Experience
http://localhost:3000/admin/experiences/new
- Add your work history

### Manage Skills
http://localhost:3000/admin/skills
- Edit or add new skills

## Troubleshooting

### ❌ "Invalid API key" error
- Check `.env.local` has correct Supabase URL and key
- Restart dev server after changing `.env.local`

### ❌ "Relation does not exist" error
- Run the SQL script in Step 3 completely
- Refresh the SQL editor and check tables exist

### ❌ "Bucket not found" when uploading images
- Create storage buckets in Step 4
- Add storage policies

### ❌ Homepage shows no projects
- Add at least one project in admin
- Set it as "Featured" and "Published"

## Next Steps

- 📖 Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed database documentation
- 🎨 Customize design in `app/globals.css`
- 🚀 Deploy to Vercel (see README.md)

## Need Help?

Check the full documentation:
- [README.md](../README.md) - Project overview
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed database guide
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guidelines
