-- Equipment Rentals Table for Young Circle Empire
-- This table stores equipment rental requests and bookings

CREATE TABLE IF NOT EXISTS equipment_rentals (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  contact_method VARCHAR(50) DEFAULT 'WhatsApp',
  equipment TEXT[] NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  return_date DATE NOT NULL,
  return_time TIME NOT NULL,
  duration VARCHAR(50),
  quantity JSONB,
  notes TEXT,
  instagram_handle VARCHAR(100),
  tiktok_handle VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_rentals_email ON equipment_rentals(email);
CREATE INDEX IF NOT EXISTS idx_equipment_rentals_pickup_date ON equipment_rentals(pickup_date);
CREATE INDEX IF NOT EXISTS idx_equipment_rentals_status ON equipment_rentals(status);
CREATE INDEX IF NOT EXISTS idx_equipment_rentals_created_at ON equipment_rentals(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE equipment_rentals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for new rental requests)
CREATE POLICY "Allow public inserts" ON equipment_rentals
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to view their own rentals
CREATE POLICY "Users can view own rentals" ON equipment_rentals
  FOR SELECT 
  USING (auth.jwt() ->> 'email' = email);

-- Create policy for admin access (you can modify this based on your admin setup)
CREATE POLICY "Admin full access" ON equipment_rentals
  FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add comments for documentation
COMMENT ON TABLE equipment_rentals IS 'Stores equipment rental requests and bookings for Young Circle Empire';
COMMENT ON COLUMN equipment_rentals.equipment IS 'Array of equipment IDs or names being rented';
COMMENT ON COLUMN equipment_rentals.quantity IS 'JSON object storing quantity for each equipment item';
COMMENT ON COLUMN equipment_rentals.status IS 'Rental status: pending, confirmed, picked_up, returned, cancelled';
