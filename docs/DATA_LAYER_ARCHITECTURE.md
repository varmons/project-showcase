# Data Layer Architecture

This document describes the unified data layer architecture for the Project Showcase portfolio application.

## Architecture Overview

All application data is stored in and retrieved from **Supabase (PostgreSQL)**. There is **no hardcoded data** in the codebase.

### Design Principles

1. **Single Source of Truth**: All content managed through Supabase database
2. **Type Safety**: Strict TypeScript interfaces for all data models
3. **Server-First**: Data fetching happens on the server using Server Components
4. **ISR Support**: Static generation with revalidation for optimal performance
5. **Consistent Patterns**: Uniform API layer across all content types

---

## Data Flow

```
┌─────────────┐
│  Supabase   │ ← Single source of truth
│  Database   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Server API  │   │   Admin     │
│  (lib/api)  │   │   Panel     │
└──────┬──────┘   └─────────────┘
       │
       ▼
┌─────────────┐
│   Server    │
│ Components  │
│ (app/*.tsx) │
└─────────────┘
```

---

## Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **projects** | Portfolio projects | ISR, featured flag, tags, media |
| **posts** | Blog articles | ISR, featured flag, tags, published_at |
| **experiences** | Work history | Achievements (JSONB), display order |
| **skills** | Technical skills | Categorized, display order |
| **tags** | Shared tags | Used by projects & posts |
| **settings** | Site config | JSONB data by category |
| **messages** | Contact form | Status tracking |

### Junction Tables

- `project_tags` - Many-to-many: Projects ↔ Tags
- `post_tags` - Many-to-many: Posts ↔ Tags

### Settings Categories

The `settings` table uses a flexible JSONB structure:

```sql
settings (
  category TEXT UNIQUE,  -- 'general', 'contact', 'social', 'seo', 'about'
  data JSONB             -- Flexible key-value data
)
```

Example:
```json
{
  "category": "general",
  "data": {
    "name": "Project Showcase",
    "title": "Product Manager & Frontend Architect",
    "tagline": "Building Digital Products That Matter.",
    "bio": "...",
    "status": "System Status: Available"
  }
}
```

---

## API Layer (`lib/api/`)

### Consistent API Patterns

All content types follow the same API structure:

#### 1. **List All** (`getXxxs`)
```typescript
export async function getProjects(options?: QueryOptions): Promise<Project[]>
export async function getPosts(options?: QueryOptions): Promise<Post[]>
```

**Features:**
- Filtering (featured, published, category/tag)
- Sorting (orderBy, ascending)
- Pagination (limit, offset)

#### 2. **Get Single** (`getXxxBySlug`)
```typescript
export async function getProjectBySlug(slug: string): Promise<Project | null>
export async function getPostBySlug(slug: string): Promise<Post | null>
```

**Features:**
- Returns `null` if not found (triggers Next.js `notFound()`)
- Includes related data (tags, media)
- Only returns published items

#### 3. **Get All Slugs** (`getAllXxxSlugs`)
```typescript
export async function getAllProjectSlugs(): Promise<string[]>
export async function getAllPostSlugs(): Promise<string[]>
```

**Purpose:**
- Used by `generateStaticParams()` for SSG
- Uses anonymous Supabase client (no auth)
- Only returns published items

---

## Server Components Pattern

### List Pages

```typescript
// app/projects/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjects({ published: true });
  return <ProjectsList projects={projects} />;
}
```

### Detail Pages with ISR

```typescript
// app/projects/[slug]/page.tsx
export const revalidate = 900; // 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

**ISR Configuration:**
- `revalidate: 900` - Regenerate every 15 minutes
- `generateStaticParams()` - Pre-render all published items at build time
- `notFound()` - 404 for missing/unpublished items

---

## Type Definitions

### Shared Interface Pattern

All content types share common fields:

```typescript
interface BaseContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}
```

### Specific Types

```typescript
// lib/api/projects.ts
export interface Project extends BaseContent {
  subtitle?: string;
  thumbnail_url?: string;
  role?: string;
  timeline?: string;
  metrics?: string[];
  links?: { demo?: string; repo?: string; };
}

// lib/api/posts.ts
export interface Post extends BaseContent {
  excerpt: string;
  cover_image_url?: string;
  published_at?: string;
}
```

---

## Data Retrieval Strategies

### 1. Server Components (Default)

**Used for:** Initial page load, SEO-critical content

```typescript
// Server Component
export default async function Page() {
  const data = await getData(); // Direct database access
  return <Component data={data} />;
}
```

**Benefits:**
- Zero client-side JavaScript for data fetching
- Optimal SEO
- Fast initial load

### 2. Client Components (When Needed)

**Used for:** Interactive filtering, real-time updates

```typescript
"use client";
import { useState, useEffect } from "react";

export function FilterableList() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
  
  return <List data={data} />;
}
```

### 3. API Routes (Admin Panel)

**Used for:** CRUD operations requiring authentication

```typescript
// app/api/projects/route.ts
export async function POST(request: Request) {
  const supabase = await createClient(); // Server-side with auth
  const body = await request.json();
  const { data, error } = await supabase.from("projects").insert(body);
  return NextResponse.json(data);
}
```

---

## Removed Legacy Code

The following have been **removed** to ensure data layer consistency:

### ❌ Deleted Files

- `data/index.ts` - Hardcoded mock data (projects, experiences, skills, posts)

### ✅ Replaced With

All data now comes from:
- `lib/api/projects.ts`
- `lib/api/posts.ts`
- `lib/api/settings.ts` (server)
- `lib/api/settings.ts` (client, via API routes)

---

## Admin Panel Integration

### Data Flow for Content Management

```
Admin UI → API Route → Supabase → Revalidation → Frontend Update
```

**Example: Creating a Project**

1. User fills form in `/admin/projects/new`
2. Form submits to Supabase directly (client-side)
3. On success, `router.push('/admin/projects')` triggers revalidation
4. Next revalidation, new project appears on `/projects`

**Revalidation Triggers:**
- Time-based: `revalidate: 900` (15 min)
- On-demand: Via API routes with `revalidatePath()`

---

## Performance Optimizations

### 1. ISR (Incremental Static Regeneration)

- **Detail Pages**: Pre-render at build, refresh every 15 min
- **List Pages**: Force dynamic (always fresh data)

### 2. Database Indexes

All frequently queried fields are indexed:
```sql
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
```

### 3. Selective Data Loading

Only load what's needed:
```typescript
// List view: minimal fields
.select('id, slug, title, subtitle, thumbnail_url')

// Detail view: full data + relations
.select('*, tags:project_tags(tag:tags(*)), media:project_media(*)')
```

---

## Migration from Hardcoded Data

### Before (❌)

```typescript
// data/index.ts
export const projects = [
  { id: "1", title: "Project 1", ... },
  { id: "2", title: "Project 2", ... },
];

// app/page.tsx
import { projects } from "@/data";
export default function Home() {
  return <Projects projects={projects.slice(0, 3)} />;
}
```

### After (✅)

```typescript
// lib/api/projects.ts
export async function getProjects() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*");
  return data || [];
}

// app/page.tsx
export default async function Home() {
  const projects = await getProjects({ featured: true, limit: 3 });
  return <Projects projects={projects} />;
}
```

---

## Testing Data Layer

### Verify Database Connection

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check data counts
SELECT 
  (SELECT COUNT(*) FROM projects WHERE is_published = true) as projects,
  (SELECT COUNT(*) FROM posts WHERE is_published = true) as posts,
  (SELECT COUNT(*) FROM experiences) as experiences,
  (SELECT COUNT(*) FROM skills) as skills;
```

### Verify ISR Behavior

1. **Build**: `npm run build`
2. **Check static pages**: `.next/server/app/projects/[slug]/*.html`
3. **Start**: `npm start`
4. **Update data** in admin panel
5. **Wait 15 min** or trigger revalidation
6. **Verify update** appears on frontend

---

## Best Practices

### ✅ Do

- Use Server Components for data fetching
- Implement ISR for detail pages
- Handle `null` returns with `notFound()`
- Use TypeScript interfaces
- Index frequently queried fields
- Implement proper error handling

### ❌ Don't

- Fetch data in Client Components unnecessarily
- Hardcode content in components
- Skip error handling
- Query database directly in components (use API layer)
- Forget to set `revalidate` on detail pages

---

## Troubleshooting

### Issue: Data not updating on frontend

**Solutions:**
1. Check `revalidate` setting on page
2. Manually trigger: `revalidatePath('/projects')`
3. Verify data is actually saved in database
4. Clear `.next` cache and rebuild

### Issue: "Relation does not exist"

**Solutions:**
1. Run all migrations from `SUPABASE_SETUP.md`
2. Check table name spelling (case-sensitive)
3. Verify Supabase connection credentials

### Issue: ISR not working

**Solutions:**
1. Ensure `generateStaticParams()` is present
2. Check `revalidate` is set (not `force-dynamic`)
3. Verify build logs show static pages generated
4. Use `npm run build && npm start`, not `npm run dev`

---

## Future Enhancements

Potential improvements to the data layer:

1. **Caching**: Add Redis for frequently accessed data
2. **Search**: Implement full-text search with Postgres
3. **Analytics**: Track view counts, popular posts
4. **Versioning**: Store content revision history
5. **Webhooks**: Trigger revalidation on Supabase changes
6. **Edge Functions**: Move some API logic to Supabase Edge Functions

---

**Last Updated**: 2025-01-05  
**Version**: 2.0.0
