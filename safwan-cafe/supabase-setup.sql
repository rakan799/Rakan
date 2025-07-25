-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('hot_drinks', 'cold_drinks', 'shisha')),
    description TEXT,
    emoji VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table_orders table
CREATE TABLE IF NOT EXISTS table_orders (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default menu items
INSERT INTO menu_items (name, price, category, description, emoji) VALUES
-- Hot drinks
('قهوة عربية', 3000, 'hot_drinks', 'نكهة أصيلة بطابع شرقي', '☕'),
('إسبريسو مزدوج', 4000, 'hot_drinks', 'قوة ونكهة مركّزة', '☕'),
('لاتيه بالفانيلا', 5000, 'hot_drinks', 'نعومة وحلاوة في فنجان', '☕'),
('شاي أعشاب طبيعي', 2500, 'hot_drinks', 'صحة ودفء', '🍵'),

-- Cold drinks
('آيس لاتيه كراميل', 6000, 'cold_drinks', 'نكهة منعشة', '🧊'),
('فرابتشينو شوكولا', 7000, 'cold_drinks', 'لمحبي الحلا', '🍫'),
('موهيتو كلاسيك', 5500, 'cold_drinks', 'نعناع ولمون', '🍃'),
('عصير برتقال فريش', 4000, 'cold_drinks', 'طبيعي 100%', '🍊'),

-- Shisha
('تفاح أحمر', 15000, 'shisha', 'نكهة كلاسيكية', '🍎'),
('ليمون نعناع', 15000, 'shisha', 'منعش ومميز', '🍋'),
('تين إنجليزي', 18000, 'shisha', 'نكهة فاخرة', '🫐'),
('عنب مع نعناع', 16000, 'shisha', 'خليط رائع', '🍇'),
('معسل خاص', 20000, 'shisha', 'خلطات مميزة', '🔥')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_table_orders_status ON table_orders(status);
CREATE INDEX IF NOT EXISTS idx_table_orders_table_number ON table_orders(table_number);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a cafe management system)
-- You may want to restrict these in production

-- Menu items policies
CREATE POLICY "Allow all operations on menu_items" ON menu_items FOR ALL USING (true);

-- Table orders policies
CREATE POLICY "Allow all operations on table_orders" ON table_orders FOR ALL USING (true);

-- Reservations policies
CREATE POLICY "Allow all operations on reservations" ON reservations FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_table_orders_updated_at BEFORE UPDATE ON table_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();