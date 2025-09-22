-- Create mobile_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.mobile_uploads (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('uploading', 'uploaded', 'processing', 'pending', 'approved', 'denied', 'completed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comments TEXT
);

-- Enable Row Level Security
ALTER TABLE public.mobile_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (admin access)
CREATE POLICY "Service role can do everything" ON public.mobile_uploads
    FOR ALL USING (true);

-- Create policy for authenticated users to read their own uploads
CREATE POLICY "Users can view their own uploads" ON public.mobile_uploads
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert their own uploads
CREATE POLICY "Users can insert their own uploads" ON public.mobile_uploads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS mobile_uploads_user_id_idx ON public.mobile_uploads(user_id);
CREATE INDEX IF NOT EXISTS mobile_uploads_status_idx ON public.mobile_uploads(status);
CREATE INDEX IF NOT EXISTS mobile_uploads_created_at_idx ON public.mobile_uploads(created_at);

-- Insert some test data
INSERT INTO public.mobile_uploads (user_id, file_name, file_path, file_size, status, comments) VALUES
    (
        '12345678-1234-1234-1234-123456789012', 
        'test_floorplan_1.jpg', 
        '/uploads/test_floorplan_1.jpg', 
        2048000, 
        'pending',
        NULL
    ),
    (
        '12345678-1234-1234-1234-123456789012', 
        'test_floorplan_2.pdf', 
        '/uploads/test_floorplan_2.pdf', 
        3072000, 
        'approved',
        'This looks great!'
    ),
    (
        '87654321-4321-4321-4321-210987654321', 
        'test_floorplan_3.png', 
        '/uploads/test_floorplan_3.png', 
        1536000, 
        'denied',
        'Missing required dimensions'
    )
ON CONFLICT DO NOTHING;