-- Add missing columns to mobile_uploads table
ALTER TABLE public.mobile_uploads 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' 
CHECK (status IN ('uploading', 'uploaded', 'processing', 'pending', 'approved', 'denied', 'completed', 'error'));

ALTER TABLE public.mobile_uploads 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.mobile_uploads 
ADD COLUMN IF NOT EXISTS comments TEXT;

-- Update existing records to have pending status
UPDATE public.mobile_uploads 
SET status = 'pending' 
WHERE status IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS mobile_uploads_status_idx ON public.mobile_uploads(status);
CREATE INDEX IF NOT EXISTS mobile_uploads_updated_at_idx ON public.mobile_uploads(updated_at);