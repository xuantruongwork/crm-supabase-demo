-- Schema for CRM Pro - Sales Intelligence

-- 1. Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  title TEXT,
  status TEXT DEFAULT 'Mới', -- Trạng thái: Mới, Đang tư vấn, Đã mua, Từ chối
  source TEXT, -- Nguồn: Facebook Ads, Google Search, Khác...
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create activities table
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- Ghi chú, Cuộc gọi, Cuộc hẹn
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, completed
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Settings
-- Enable RLS for all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Users can view all leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert leads" ON leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete leads" ON leads FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for activities
CREATE POLICY "Users can view all activities" ON activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert activities" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update activities" ON activities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete activities" ON activities FOR DELETE USING (auth.role() = 'authenticated');
