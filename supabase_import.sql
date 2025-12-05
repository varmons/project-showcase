-- =============================================================================
-- PORTFOLIO PROJECT - COMPLETE SUPABASE DATABASE SETUP
-- =============================================================================
-- This file contains everything needed to set up your portfolio database
-- Run this in the Supabase SQL Editor
-- 
-- IMPORTANT: After running this SQL, you must manually create Storage buckets:
--   1. Go to Storage in Supabase Dashboard
--   2. Create bucket: "project-images" (Public)
--   3. Create bucket: "profile-images" (Public)
--   4. Set RLS policies for both buckets to allow public read access
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Users Table (extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Project Categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    role TEXT,
    timeline TEXT,
    thumbnail_url TEXT,
    content TEXT,
    metrics JSONB DEFAULT '[]'::JSONB,
    links JSONB DEFAULT '{}'::JSONB,
    category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Project Media
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'link', 'embed')),
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tech', 'Design', 'Product', 'Other')),
    level TEXT CHECK (level IN ('Expert', 'Proficient', 'Familiar')),
    icon_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Project Skills (Junction Table)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_skills (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- -----------------------------------------------------------------------------
-- Experiences
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    description TEXT,
    achievements JSONB DEFAULT '[]'::JSONB,
    logo_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Posts (Blog)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    published_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Junction Tables for Tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_tags (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- Contact Messages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Site Settings (JSONB format)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL UNIQUE,
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- =============================================================================
-- TRIGGERS (Auto-update updated_at)
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_project_categories_updated_at ON public.project_categories;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON public.experiences;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_project_categories_updated_at BEFORE UPDATE ON public.project_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Public read policies
    DROP POLICY IF EXISTS "Public read projects" ON public.projects;
    DROP POLICY IF EXISTS "Public read categories" ON public.project_categories;
    DROP POLICY IF EXISTS "Public read media" ON public.project_media;
    DROP POLICY IF EXISTS "Public read skills" ON public.skills;
    DROP POLICY IF EXISTS "Public read project_skills" ON public.project_skills;
    DROP POLICY IF EXISTS "Public read experiences" ON public.experiences;
    DROP POLICY IF EXISTS "Public read posts" ON public.posts;
    DROP POLICY IF EXISTS "Public read tags" ON public.tags;
    DROP POLICY IF EXISTS "Public read project_tags" ON public.project_tags;
    DROP POLICY IF EXISTS "Public read post_tags" ON public.post_tags;
    DROP POLICY IF EXISTS "Public read settings" ON public.settings;
    
    -- Admin policies
    DROP POLICY IF EXISTS "Admin full access users" ON public.users;
    DROP POLICY IF EXISTS "Admin full access categories" ON public.project_categories;
    DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
    DROP POLICY IF EXISTS "Admin full access media" ON public.project_media;
    DROP POLICY IF EXISTS "Admin full access skills" ON public.skills;
    DROP POLICY IF EXISTS "Admin full access project_skills" ON public.project_skills;
    DROP POLICY IF EXISTS "Admin full access experiences" ON public.experiences;
    DROP POLICY IF EXISTS "Admin full access posts" ON public.posts;
    DROP POLICY IF EXISTS "Admin full access tags" ON public.tags;
    DROP POLICY IF EXISTS "Admin full access project_tags" ON public.project_tags;
    DROP POLICY IF EXISTS "Admin full access post_tags" ON public.post_tags;
    DROP POLICY IF EXISTS "Admin full access settings" ON public.settings;
    
    -- Contact message policies
    DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
    DROP POLICY IF EXISTS "Admin read messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Admin update messages" ON public.contact_messages;
END $$;

-- Public read access for published content
CREATE POLICY "Public read projects" ON public.projects
    FOR SELECT USING (is_published = true);
    
CREATE POLICY "Public read categories" ON public.project_categories
    FOR SELECT USING (true);
    
CREATE POLICY "Public read media" ON public.project_media
    FOR SELECT USING (true);
    
CREATE POLICY "Public read skills" ON public.skills
    FOR SELECT USING (true);
    
CREATE POLICY "Public read project_skills" ON public.project_skills
    FOR SELECT USING (true);
    
CREATE POLICY "Public read experiences" ON public.experiences
    FOR SELECT USING (true);
    
CREATE POLICY "Public read posts" ON public.posts
    FOR SELECT USING (is_published = true);
    
CREATE POLICY "Public read tags" ON public.tags
    FOR SELECT USING (true);
    
CREATE POLICY "Public read project_tags" ON public.project_tags
    FOR SELECT USING (true);
    
CREATE POLICY "Public read post_tags" ON public.post_tags
    FOR SELECT USING (true);

CREATE POLICY "Public read settings" ON public.settings
    FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access users" ON public.users
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access categories" ON public.project_categories
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access projects" ON public.projects
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access media" ON public.project_media
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access skills" ON public.skills
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access project_skills" ON public.project_skills
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access experiences" ON public.experiences
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access posts" ON public.posts
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access tags" ON public.tags
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access project_tags" ON public.project_tags
    FOR ALL USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin full access post_tags" ON public.post_tags
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access settings" ON public.settings
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Contact messages: anyone can insert, only admin can read/update
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Admin read messages" ON public.contact_messages
    FOR SELECT USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Admin update messages" ON public.contact_messages
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert default project categories
INSERT INTO public.project_categories (name, slug, description, display_order)
VALUES 
    ('Web Development', 'web-development', 'Full-stack web applications and websites', 1),
    ('Mobile Apps', 'mobile-apps', 'iOS and Android mobile applications', 2),
    ('Design', 'design', 'UI/UX design and visual design projects', 3),
    ('Product Management', 'product-management', 'Product strategy and management work', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert default skills
INSERT INTO public.skills (name, category, level, display_order)
VALUES 
    ('React', 'Tech', 'Expert', 1),
    ('TypeScript', 'Tech', 'Expert', 2),
    ('Next.js', 'Tech', 'Expert', 3),
    ('Node.js', 'Tech', 'Proficient', 4),
    ('Figma', 'Design', 'Expert', 5),
    ('UI/UX Design', 'Design', 'Proficient', 6),
    ('Product Strategy', 'Product', 'Expert', 7),
    ('Agile/Scrum', 'Product', 'Proficient', 8)
ON CONFLICT DO NOTHING;

-- Insert default tags
INSERT INTO public.tags (name, slug)
VALUES 
    ('React', 'react'),
    ('TypeScript', 'typescript'),
    ('Next.js', 'nextjs'),
    ('Tailwind CSS', 'tailwindcss'),
    ('UI/UX', 'ui-ux'),
    ('Product Management', 'product-management'),
    ('Web Development', 'web-development'),
    ('Mobile Development', 'mobile-development')
ON CONFLICT (name) DO NOTHING;

-- Insert default site settings
INSERT INTO public.settings (category, data)
VALUES 
    ('general', '{
        "name": "VyrnSynx",
        "title": "Product Manager & Frontend Architect",
        "tagline": "Building Digital Products That Matter.",
        "bio": "Bridging design, engineering, and business strategy.",
        "status": "System Status: Available"
    }'::JSONB),
    
    ('contact', '{
        "email": "hello@example.com",
        "phone": "",
        "location": ""
    }'::JSONB),
    
    ('social', '{
        "twitter": "https://twitter.com",
        "github": "https://github.com/varmons/",
        "linkedin": "https://linkedin.com",
        "resume": "/resume.pdf"
    }'::JSONB),
    
    ('seo', '{
        "description": "Portfolio of a Product Manager and Frontend Architect",
        "url": "https://example.com",
        "ogImage": "https://example.com/og.jpg"
    }'::JSONB),
    
    ('about', '{
        "content": "<p class=\"text-lg leading-relaxed\">I am a Product Manager and Frontend Architect with a passion for building software that solves real problems. With a background in both design and engineering, I thrive in the intersection of these disciplines.</p><p>Over the past 5 years, I have worked with startups and enterprise companies to launch products from 0 to 1, and scale existing platforms to millions of users.</p><p>My philosophy is simple: <strong>Shipping is the heartbeat of a product team.</strong> I believe in rapid iteration, user-centric design, and clean, maintainable code.</p>"
    }'::JSONB)
ON CONFLICT (category) DO UPDATE 
    SET data = EXCLUDED.data, 
        updated_at = NOW();

-- =============================================================================
-- STORAGE BUCKETS SETUP INSTRUCTIONS
-- =============================================================================
-- 
-- IMPORTANT: You must manually create Storage buckets in Supabase Dashboard:
--
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Create bucket "project-images" with:
--    - Public: Yes
--    - File size limit: 5MB
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
--
-- 4. Create bucket "profile-images" with same settings
--
-- 5. For each bucket, add RLS policies:
--    - Public read: Anyone can view files
--    - Authenticated write: Only logged-in users can upload
--
-- Example policy for public read:
--    SELECT: true (no conditions)
--
-- Example policy for authenticated write:
--    INSERT: auth.uid() IS NOT NULL
--    UPDATE: auth.uid() IS NOT NULL
--    DELETE: auth.uid() IS NOT NULL
--
-- =============================================================================

-- Verification queries
DO $$ 
BEGIN
    RAISE NOTICE 'Database setup complete!';
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE');
    RAISE NOTICE 'Project categories: %', (SELECT COUNT(*) FROM public.project_categories);
    RAISE NOTICE 'Skills: %', (SELECT COUNT(*) FROM public.skills);
    RAISE NOTICE 'Tags: %', (SELECT COUNT(*) FROM public.tags);
    RAISE NOTICE 'Settings: %', (SELECT COUNT(*) FROM public.settings);
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Go to Storage in Supabase Dashboard';
    RAISE NOTICE '2. Create buckets: project-images, profile-images';
    RAISE NOTICE '3. Set bucket policies for public read and authenticated write';
    RAISE NOTICE '4. Update .env file with your Supabase credentials';
    RAISE NOTICE '5. Run: npm install && npm run dev';
END $$;
