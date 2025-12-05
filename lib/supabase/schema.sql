-- =============================================================================
-- SUPABASE DATABASE SCHEMA
-- Run this in the Supabase SQL Editor to create all tables
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- USERS (extends Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- PROJECT CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE public.project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- PROJECTS
-- -----------------------------------------------------------------------------
CREATE TABLE public.projects (
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
-- PROJECT MEDIA
-- -----------------------------------------------------------------------------
CREATE TABLE public.project_media (
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
-- SKILLS
-- -----------------------------------------------------------------------------
CREATE TABLE public.skills (
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
-- PROJECT_SKILLS (Junction Table)
-- -----------------------------------------------------------------------------
CREATE TABLE public.project_skills (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- -----------------------------------------------------------------------------
-- EXPERIENCES
-- -----------------------------------------------------------------------------
CREATE TABLE public.experiences (
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
-- POSTS
-- -----------------------------------------------------------------------------
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    published_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- TAGS
-- -----------------------------------------------------------------------------
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- JUNCTION TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE public.project_tags (
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- CONTACT MESSAGES
-- -----------------------------------------------------------------------------
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_category ON public.projects(category_id);
CREATE INDEX idx_projects_published ON public.projects(is_published);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_published ON public.posts(is_published, published_at);
CREATE INDEX idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Contact messages: anyone can insert, only admin can read/update
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON public.contact_messages
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin update messages" ON public.contact_messages
    FOR UPDATE USING (auth.uid() IS NOT NULL);
