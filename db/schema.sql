-- Real Estate Attorney Management System Database Schema
-- PostgreSQL DDL for complete application functionality

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS contract_templates CASCADE;
DROP TABLE IF EXISTS contract_generations CASCADE;
DROP TABLE IF EXISTS document_signatures CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS property_transactions CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS attorneys CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (base table for all user types)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'attorney', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attorneys table (extends users)
CREATE TABLE attorneys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    bar_admission_date DATE,
    specializations TEXT[],
    years_experience INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    total_cases INTEGER DEFAULT 0,
    active_cases INTEGER DEFAULT 0,
    client_satisfaction DECIMAL(3,2) DEFAULT 0.00,
    hourly_rate DECIMAL(10,2),
    bio TEXT,
    office_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table (extends users)
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_type VARCHAR(20) NOT NULL CHECK (client_type IN ('buyer', 'seller', 'both')),
    preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'text')),
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    preferred_locations TEXT[],
    notes TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'pending')),
    assigned_attorney_id INTEGER REFERENCES attorneys(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('house', 'condo', 'townhouse', 'apartment', 'commercial', 'land')),
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size DECIMAL(10,2),
    year_built INTEGER,
    price DECIMAL(12,2) NOT NULL,
    listing_date DATE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'withdrawn')),
    description TEXT,
    features TEXT[],
    images TEXT[],
    mls_number VARCHAR(50),
    listing_agent_name VARCHAR(200),
    listing_agent_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property Transactions table
CREATE TABLE property_transactions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'lease', 'refinance')),
    status VARCHAR(30) DEFAULT 'initiated' CHECK (status IN ('initiated', 'under_contract', 'pending_inspection', 'pending_appraisal', 'pending_financing', 'pending_closing', 'completed', 'cancelled')),
    offer_amount DECIMAL(12,2),
    final_amount DECIMAL(12,2),
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(10,2),
    closing_date DATE,
    contract_date DATE,
    inspection_date DATE,
    appraisal_date DATE,
    financing_contingency_date DATE,
    progress_percentage INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES property_transactions(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'signed', 'executed')),
    version INTEGER DEFAULT 1,
    is_template BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Signatures table
CREATE TABLE document_signatures (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    signer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    signer_type VARCHAR(20) NOT NULL CHECK (signer_type IN ('buyer', 'seller', 'attorney', 'witness')),
    signature_status VARCHAR(20) DEFAULT 'pending' CHECK (signature_status IN ('pending', 'signed', 'declined')),
    signed_at TIMESTAMP,
    signature_data TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Events table
CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id),
    transaction_id INTEGER REFERENCES property_transactions(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('consultation', 'contract_review', 'closing', 'inspection', 'meeting', 'court_appearance', 'deadline')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(300),
    is_all_day BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    attendees TEXT[],
    reminder_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    transaction_id INTEGER REFERENCES property_transactions(id),
    subject VARCHAR(200),
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'direct' CHECK (message_type IN ('direct', 'group', 'system', 'notification')),
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Contract Templates table
CREATE TABLE contract_templates (
    id SERIAL PRIMARY KEY,
    attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL,
    form_fields JSONB,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contract Generations table
CREATE TABLE contract_generations (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES contract_templates(id) ON DELETE CASCADE,
    transaction_id INTEGER REFERENCES property_transactions(id) ON DELETE CASCADE,
    attorney_id INTEGER REFERENCES attorneys(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    contract_data JSONB NOT NULL,
    generated_content TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'executed')),
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_attorneys_user_id ON attorneys(user_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_attorney_id ON clients(assigned_attorney_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_transactions_client_id ON property_transactions(client_id);
CREATE INDEX idx_transactions_attorney_id ON property_transactions(attorney_id);
CREATE INDEX idx_transactions_status ON property_transactions(status);
CREATE INDEX idx_documents_transaction_id ON documents(transaction_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_calendar_attorney_id ON calendar_events(attorney_id);
CREATE INDEX idx_calendar_start_time ON calendar_events(start_time);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attorneys_updated_at BEFORE UPDATE ON attorneys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON property_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON contract_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generations_updated_at BEFORE UPDATE ON contract_generations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

