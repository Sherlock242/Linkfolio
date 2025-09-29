-- Drop existing policies and table if they exist, for easier re-running
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Linkfolio images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to linkfolio-images." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own objects." ON storage.objects;
DROP TABLE IF EXISTS public.profiles;

-- Create the main profiles table
CREATE TABLE public.profiles (
  id bigint PRIMARY KEY,
  updated_at timestamptz DEFAULT now(),
  name text,
  bio text,
  "profilePictureUrl" text,
  "socialLinks" jsonb,
  "customLinks" jsonb,
  "theme" jsonb
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- 1. Allow public read access for everyone
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

-- 2. Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( true );

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( true );

-- Create or update a bucket for linkfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('linkfolio-images', 'linkfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;


-- Create policies for linkfolio-images bucket
-- 1. Allow anonymous read access to all images
CREATE POLICY "Linkfolio images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'linkfolio-images' );

-- 2. Allow anonymous users to upload images
CREATE POLICY "Anyone can upload to linkfolio-images."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'linkfolio-images' );

-- 3. Allow anonymous users to update their own images
CREATE POLICY "Anyone can update their own objects."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'linkfolio-images' );
