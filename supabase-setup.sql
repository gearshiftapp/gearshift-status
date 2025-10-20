-- Create the statuses table for GearShift Status Page
CREATE TABLE IF NOT EXISTS statuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('Operational', 'Partial Outage', 'Major Outage', 'Maintenance')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the service column for faster lookups
CREATE INDEX IF NOT EXISTS idx_statuses_service ON statuses(service);

-- Create an index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_statuses_updated_at ON statuses(updated_at);

-- Insert initial data
INSERT INTO statuses (service, status) VALUES
  ('API', 'Operational'),
  ('Database', 'Operational'),
  ('CDN', 'Operational'),
  ('Authentication', 'Operational'),
  ('File Storage', 'Operational')
ON CONFLICT (service) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_statuses_updated_at ON statuses;
CREATE TRIGGER update_statuses_updated_at
  BEFORE UPDATE ON statuses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read statuses (public status page)
CREATE POLICY "Allow public read access to statuses" ON statuses
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to update statuses (admin dashboard)
CREATE POLICY "Allow authenticated users to update statuses" ON statuses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to insert statuses
CREATE POLICY "Allow authenticated users to insert statuses" ON statuses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to delete statuses
CREATE POLICY "Allow authenticated users to delete statuses" ON statuses
  FOR DELETE USING (auth.role() = 'authenticated');
