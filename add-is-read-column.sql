-- Add is_read column to mobile_uploads table for notification system
ALTER TABLE public.mobile_uploads 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT true;

-- Update existing records to be marked as read (true) by default
UPDATE public.mobile_uploads 
SET is_read = true 
WHERE is_read IS NULL;

-- Create index for better performance on notification queries
CREATE INDEX IF NOT EXISTS mobile_uploads_is_read_idx ON public.mobile_uploads(is_read);

-- Set all current uploads to unread (false) so admin gets notifications
-- Comment out this line if you don't want to mark existing uploads as unread
UPDATE public.mobile_uploads SET is_read = false;