# Site Settings Update Guide

## How It Works

The site settings system has been updated to ensure that changes made in the Admin panel are immediately reflected on the frontend.

### Architecture

```
Admin Panel → API Route → Database Update → Cache Revalidation → Frontend Update
```

### Components

1. **Admin Settings Page** (`app/admin/settings/page.tsx`)
   - Client component for editing settings
   - Sends updates via API route

2. **API Route** (`app/api/settings/route.ts`)
   - Handles GET and PUT requests
   - Updates database
   - Triggers `revalidatePath()` to clear Next.js cache

3. **Frontend Components** (`components/features/home/hero.tsx`)
   - Server component that fetches settings
   - Automatically shows updated data after revalidation

### Flow

1. **Edit Settings in Admin**
   - Navigate to `/admin/settings`
   - Modify any field (name, tagline, bio, status, etc.)
   - Click "Save Changes"

2. **API Updates Database**
   - Settings are saved to `site_settings` table
   - Next.js cache is revalidated

3. **Frontend Shows Updates**
   - Refresh the homepage (`/`)
   - Changes are immediately visible
   - No manual cache clearing needed

## Testing the Feature

### Step 1: Access Admin Panel
```
1. Go to http://localhost:3000/login
2. Login with admin credentials
3. Navigate to Settings
```

### Step 2: Modify Settings
```
1. Change "Tagline" to something different
2. Update "Status Message"
3. Click "Save All Changes"
4. Wait for success toast notification
```

### Step 3: Verify Frontend Update
```
1. Open http://localhost:3000 in a new tab (or refresh existing)
2. Check that the tagline has changed
3. Check that the status message has updated
```

## Cache Strategy

### Development Mode
- `dynamic = "force-dynamic"` on homepage
- `revalidate = 0` to disable caching
- Changes are visible immediately after save

### Production Mode (Future)
Consider updating to:
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

This provides a balance between performance and freshness.

## API Endpoints

### GET /api/settings
Fetches all site settings as a JSON object.

**Response:**
```json
{
  "general": {
    "name": "John Doe",
    "title": "Product Manager",
    "tagline": "Building Digital Products",
    "bio": "I'm a PM and architect...",
    "status": "System Status: Available"
  },
  "contact": { ... },
  "social": { ... },
  "seo": { ... }
}
```

### PUT /api/settings
Updates a specific settings category.

**Request:**
```json
{
  "key": "general",
  "value": {
    "name": "Jane Doe",
    "title": "Product Manager",
    "tagline": "New tagline",
    "bio": "Updated bio",
    "status": "Updated status"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

## Troubleshooting

### Issue: Changes Not Showing on Frontend

**Solutions:**
1. **Hard Refresh Browser**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check Network Tab**
   - Open DevTools → Network
   - Verify PUT request to `/api/settings` succeeds
   - Check response is `{ success: true }`

4. **Check Console Errors**
   - Look for Supabase connection errors
   - Verify API route logs

### Issue: Cloudflare 500 Error

If you see Cloudflare errors:
- Wait a few minutes (temporary rate limiting)
- Check Supabase status: https://status.supabase.com/
- Try from a different network

## Files Modified

- ✅ `app/api/settings/route.ts` - New API route with revalidation
- ✅ `lib/api/settings.ts` - Updated to use API route
- ✅ `app/page.tsx` - Added dynamic rendering
- ✅ `app/admin/settings/page.tsx` - Improved success message

## Notes

- Settings are stored in `site_settings` table
- Each setting has a `key` and `value` (JSONB)
- Updates trigger revalidation of all affected pages
- The homepage Hero component uses these settings
