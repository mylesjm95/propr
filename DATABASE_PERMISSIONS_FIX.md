# Database Permissions Fix

## Issue
The admin tables are showing "permission denied for schema public" error because the Supabase client doesn't have the right permissions to access the database tables.

## Root Cause
The server actions are using the anon key which doesn't have permission to access the `User`, `agents`, and `buildings` tables in the public schema.

## Solutions

### Option 1: Enable RLS and Create Policies (Recommended)

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "agents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "buildings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "building_agents" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Admin can access all users" ON "User"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can read their own data" ON "User"
  FOR SELECT USING (auth.uid() = id);

-- Create policies for agents table
CREATE POLICY "Admin can access all agents" ON "agents"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Create policies for buildings table
CREATE POLICY "Admin can access all buildings" ON "buildings"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Create policies for building_agents table
CREATE POLICY "Admin can access all building_agents" ON "building_agents"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );
```

### Option 2: Use Service Role Key

1. Get your service role key from Supabase Dashboard > Settings > API
2. Add it to your environment variables as `SUPABASE_SERVICE_ROLE_KEY`
3. Update the server actions to use the service role key instead of the anon key

### Option 3: Disable RLS (Not Recommended for Production)

```sql
-- Disable RLS on all tables (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "agents" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "buildings" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "building_agents" DISABLE ROW LEVEL SECURITY;
```

## Current Status

The admin interface is currently in **read-only mode** with mock data. Once you apply one of the above solutions, you can:

1. Update the table components to use the real server actions again
2. Replace the mock data with actual database queries
3. Enable full CRUD functionality

## Files to Update After Fixing Permissions

1. `src/components/admin/UserTable.jsx` - Replace `getUsersData` with `getUsers`
2. `src/components/admin/BuildingTable.jsx` - Replace `getBuildingsData` with `getBuildings`
3. `src/components/admin/AgentTable.jsx` - Replace `getAgentsData` with `getAgents`
4. Restore the full CRUD functionality in the form handlers

## Testing

After applying the fix:

1. Navigate to the admin panel
2. Check that data loads without permission errors
3. Test CRUD operations (create, edit, delete)
4. Verify that only admin users can access the data
