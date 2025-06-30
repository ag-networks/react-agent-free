-- Real Estate Attorney Management System Seed Data
-- Comprehensive mock data for development and testing

-- Clear existing data
TRUNCATE TABLE contract_generations, contract_templates, messages, calendar_events, document_signatures, documents, property_transactions, properties, clients, attorneys, users RESTART IDENTITY CASCADE;

-- Insert Users (attorneys, clients, admin)
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, avatar_url) VALUES
-- Attorneys
('sarah.johnson@agentfree.com', '$2b$10$example_hash_1', 'Sarah', 'Johnson', '(555) 123-4567', 'attorney', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'),
('michael.chen@agentfree.com', '$2b$10$example_hash_2', 'Michael', 'Chen', '(555) 234-5678', 'attorney', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('jennifer.davis@agentfree.com', '$2b$10$example_hash_3', 'Jennifer', 'Davis', '(555) 345-6789', 'attorney', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),

-- Clients
('david.wilson@email.com', '$2b$10$example_hash_4', 'David', 'Wilson', '(555) 456-7890', 'client', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('emily.rodriguez@email.com', '$2b$10$example_hash_5', 'Emily', 'Rodriguez', '(555) 567-8901', 'client', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
('michelle.lee@email.com', '$2b$10$example_hash_6', 'Michelle', 'Lee', '(555) 678-9012', 'client', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'),
('robert.chen@email.com', '$2b$10$example_hash_7', 'Robert', 'Chen', '(555) 789-0123', 'client', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('jennifer.walsh@email.com', '$2b$10$example_hash_8', 'Jennifer', 'Walsh', '(555) 890-1234', 'client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('james.martinez@email.com', '$2b$10$example_hash_9', 'James', 'Martinez', '(555) 901-2345', 'client', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
('lisa.thompson@email.com', '$2b$10$example_hash_10', 'Lisa', 'Thompson', '(555) 012-3456', 'client', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150'),

-- Admin
('admin@agentfree.com', '$2b$10$example_hash_11', 'Admin', 'User', '(555) 999-0000', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');

-- Insert Attorneys
INSERT INTO attorneys (user_id, license_number, bar_admission_date, specializations, years_experience, success_rate, total_cases, active_cases, client_satisfaction, hourly_rate, bio, office_address) VALUES
(1, 'CA12345', '2015-06-15', ARRAY['Real Estate Law', 'Contract Law', 'Property Disputes'], 8, 94.50, 156, 12, 4.8, 350.00, 'Experienced real estate attorney specializing in residential and commercial property transactions.', '123 Legal Plaza, San Francisco, CA 94102'),
(2, 'CA23456', '2018-09-20', ARRAY['Real Estate Law', 'Corporate Law', 'Litigation'], 5, 91.20, 89, 8, 4.6, 325.00, 'Dedicated attorney with expertise in complex real estate transactions and dispute resolution.', '456 Attorney Ave, Oakland, CA 94607'),
(3, 'CA34567', '2012-03-10', ARRAY['Real Estate Law', 'Family Law', 'Estate Planning'], 11, 96.80, 203, 15, 4.9, 375.00, 'Senior attorney with over a decade of experience in residential real estate and estate planning.', '789 Law Center Dr, Berkeley, CA 94704');

-- Insert Clients
INSERT INTO clients (user_id, client_type, preferred_contact, budget_min, budget_max, preferred_locations, notes, rating, status, assigned_attorney_id) VALUES
(4, 'seller', 'email', 800000, 1200000, ARRAY['San Francisco', 'Oakland'], 'Selling family home, needs quick closing', 4.5, 'completed', 1),
(5, 'buyer', 'phone', 400000, 600000, ARRAY['Berkeley', 'Richmond'], 'First-time homebuyer, needs guidance', 0.0, 'pending', 2),
(6, 'buyer', 'email', 500000, 750000, ARRAY['San Francisco', 'Daly City'], 'Looking for 2-3 bedroom condo', 4.2, 'active', 1),
(7, 'seller', 'text', 600000, 900000, ARRAY['Oakland', 'Alameda'], 'Investment property sale', 4.8, 'active', 2),
(8, 'buyer', 'email', 300000, 500000, ARRAY['Berkeley', 'El Cerrito'], 'Urgent purchase needed', 0.0, 'pending', 3),
(9, 'both', 'phone', 700000, 1000000, ARRAY['San Francisco', 'Marin'], 'Selling and buying simultaneously', 4.3, 'active', 1),
(10, 'buyer', 'email', 450000, 650000, ARRAY['Oakland', 'Fremont'], 'Young professional, flexible timing', 4.7, 'active', 3);

-- Insert Properties
INSERT INTO properties (address, city, state, zip_code, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built, price, listing_date, status, description, features, mls_number, listing_agent_name, listing_agent_phone) VALUES
('123 Oak Street', 'San Francisco', 'CA', '94102', 'house', 3, 2.5, 1850, 0.15, 1925, 1150000, '2024-03-15', 'pending', 'Beautiful Victorian home with modern updates', ARRAY['Hardwood floors', 'Updated kitchen', 'Garden', 'Parking'], 'MLS001234', 'Jane Smith', '(555) 111-2222'),
('456 Pine Avenue', 'Oakland', 'CA', '94607', 'condo', 2, 2.0, 1200, NULL, 2010, 650000, '2024-04-01', 'available', 'Modern condo with city views', ARRAY['Balcony', 'In-unit laundry', 'Gym', 'Concierge'], 'MLS002345', 'Bob Johnson', '(555) 222-3333'),
('789 Elm Drive', 'Berkeley', 'CA', '94704', 'townhouse', 3, 2.5, 1600, 0.08, 2005, 850000, '2024-03-28', 'available', 'Spacious townhouse near UC Berkeley', ARRAY['Garage', 'Patio', 'Storage', 'Near transit'], 'MLS003456', 'Carol Davis', '(555) 333-4444'),
('321 Maple Court', 'San Francisco', 'CA', '94115', 'condo', 1, 1.0, 750, NULL, 2018, 575000, '2024-04-10', 'available', 'Luxury studio in Pacific Heights', ARRAY['City views', 'Doorman', 'Roof deck', 'Pet friendly'], 'MLS004567', 'David Wilson', '(555) 444-5555'),
('654 Cedar Lane', 'Oakland', 'CA', '94610', 'house', 4, 3.0, 2200, 0.20, 1950, 925000, '2024-03-20', 'sold', 'Charming craftsman with large yard', ARRAY['Original details', 'Updated systems', 'Workshop', 'Fruit trees'], 'MLS005678', 'Emma Rodriguez', '(555) 555-6666');

-- Insert Property Transactions
INSERT INTO property_transactions (property_id, client_id, attorney_id, transaction_type, status, offer_amount, final_amount, commission_rate, commission_amount, closing_date, contract_date, progress_percentage, notes) VALUES
(1, 3, 1, 'purchase', 'pending_closing', 1100000, 1125000, 2.50, 28125, '2024-05-15', '2024-04-05', 85, 'Inspection completed, financing approved'),
(2, 2, 2, 'purchase', 'under_contract', 625000, NULL, 2.50, NULL, '2024-05-30', '2024-04-12', 45, 'Awaiting appraisal results'),
(3, 5, 3, 'purchase', 'pending_inspection', 825000, NULL, 2.50, NULL, '2024-06-10', '2024-04-20', 25, 'Contract signed, inspection scheduled'),
(5, 1, 1, 'sale', 'completed', 900000, 925000, 3.00, 27750, '2024-04-01', '2024-03-01', 100, 'Successful sale, client very satisfied'),
(4, 6, 1, 'purchase', 'initiated', NULL, NULL, 2.50, NULL, NULL, NULL, 10, 'Initial consultation completed');

-- Insert Documents
INSERT INTO documents (transaction_id, client_id, attorney_id, document_type, title, file_name, file_path, status, requires_signature, created_by) VALUES
(1, 3, 1, 'purchase_agreement', 'Purchase Agreement - 123 Oak Street', 'purchase_agreement_123_oak.pdf', '/documents/purchase_agreement_123_oak.pdf', 'signed', true, 1),
(1, 3, 1, 'inspection_report', 'Property Inspection Report', 'inspection_report_123_oak.pdf', '/documents/inspection_report_123_oak.pdf', 'approved', false, 1),
(2, 2, 2, 'purchase_agreement', 'Purchase Agreement - 456 Pine Avenue', 'purchase_agreement_456_pine.pdf', '/documents/purchase_agreement_456_pine.pdf', 'review', true, 2),
(4, 1, 1, 'listing_agreement', 'Listing Agreement - 654 Cedar Lane', 'listing_agreement_654_cedar.pdf', '/documents/listing_agreement_654_cedar.pdf', 'executed', true, 1),
(4, 1, 1, 'disclosure_statement', 'Property Disclosure Statement', 'disclosure_654_cedar.pdf', '/documents/disclosure_654_cedar.pdf', 'signed', true, 4);

-- Insert Document Signatures
INSERT INTO document_signatures (document_id, signer_id, signer_type, signature_status, signed_at) VALUES
(1, 3, 'buyer', 'signed', '2024-04-06 14:30:00'),
(1, 1, 'attorney', 'signed', '2024-04-06 15:00:00'),
(4, 1, 'seller', 'signed', '2024-03-02 10:15:00'),
(4, 1, 'attorney', 'signed', '2024-03-02 10:30:00'),
(5, 1, 'seller', 'signed', '2024-03-02 11:00:00');

-- Insert Calendar Events
INSERT INTO calendar_events (attorney_id, client_id, transaction_id, title, description, event_type, start_time, end_time, location, priority, status, attendees) VALUES
(1, 3, 1, 'Final Walkthrough - 123 Oak Street', 'Final property walkthrough before closing', 'inspection', '2024-05-14 10:00:00', '2024-05-14 11:00:00', '123 Oak Street, San Francisco, CA', 'high', 'scheduled', ARRAY['Michelle Lee', 'Sarah Johnson']),
(1, 3, 1, 'Closing - 123 Oak Street', 'Property closing and key transfer', 'closing', '2024-05-15 14:00:00', '2024-05-15 16:00:00', 'Title Company Office', 'urgent', 'scheduled', ARRAY['Michelle Lee', 'Sarah Johnson', 'Title Officer']),
(2, 2, 2, 'Initial Consultation', 'First-time buyer consultation and document review', 'consultation', '2024-04-25 09:00:00', '2024-04-25 10:30:00', 'Law Office', 'medium', 'completed', ARRAY['Emily Rodriguez', 'Michael Chen']),
(3, 5, 3, 'Contract Review Meeting', 'Review purchase agreement terms', 'contract_review', '2024-04-22 15:00:00', '2024-04-22 16:00:00', 'Law Office', 'high', 'scheduled', ARRAY['Jennifer Walsh', 'Jennifer Davis']),
(1, 6, 5, 'Property Consultation', 'Discuss simultaneous buy/sell strategy', 'consultation', '2024-04-30 11:00:00', '2024-04-30 12:00:00', 'Law Office', 'medium', 'scheduled', ARRAY['James Martinez', 'Sarah Johnson']),
(2, NULL, NULL, 'Bar Association Meeting', 'Monthly real estate law committee meeting', 'meeting', '2024-05-01 18:00:00', '2024-05-01 20:00:00', 'Bar Association', 'low', 'scheduled', ARRAY['Michael Chen']),
(1, NULL, NULL, 'Court Appearance', 'Property dispute hearing', 'court_appearance', '2024-05-03 09:00:00', '2024-05-03 12:00:00', 'Superior Court', 'urgent', 'scheduled', ARRAY['Sarah Johnson']);

-- Insert Messages
INSERT INTO messages (sender_id, recipient_id, transaction_id, subject, message_text, message_type, is_read, is_urgent) VALUES
(3, 1, 1, 'Question about closing documents', 'Hi Sarah, I have a question about the closing disclosure. Can we schedule a call to review it?', 'direct', false, false),
(1, 3, 1, 'RE: Question about closing documents', 'Hi Michelle, absolutely! I''ll call you this afternoon at 2pm to go over everything. The closing disclosure looks good overall.', 'direct', true, false),
(2, 2, 2, 'Financing update', 'Michael, my lender says they need additional documentation. Can you help me understand what they''re asking for?', 'direct', false, false),
(2, 2, 2, 'RE: Financing update', 'Emily, I''ll review the lender''s request and prepare the additional documents. This is normal in the process.', 'direct', true, false),
(5, 3, 3, 'Urgent: Inspection issues', 'Jennifer, the inspection revealed some electrical issues. What are our options for negotiating repairs?', 'direct', false, true),
(3, 5, 3, 'RE: Urgent: Inspection issues', 'Jennifer, I''ve reviewed the inspection report. Let''s schedule an emergency meeting tomorrow to discuss our negotiation strategy.', 'direct', true, true),
(1, 1, 4, 'Thank you!', 'Sarah, thank you for all your help with the sale. Everything went smoothly and I couldn''t be happier with the outcome!', 'direct', true, false),
(1, 1, 4, 'RE: Thank you!', 'David, it was my pleasure working with you! Congratulations on the successful sale. Please don''t hesitate to reach out if you need anything in the future.', 'direct', true, false);

-- Insert Contract Templates
INSERT INTO contract_templates (attorney_id, template_name, template_type, category, description, template_content, form_fields, is_active, is_public, usage_count) VALUES
(1, 'Standard Purchase Agreement', 'purchase_agreement', 'purchase', 'Standard residential purchase agreement template for California properties', 'RESIDENTIAL PURCHASE AGREEMENT\n\nThis agreement is made between {{buyer_name}} (Buyer) and {{seller_name}} (Seller) for the purchase of property located at {{property_address}}.\n\nPurchase Price: ${{purchase_price}}\nDeposit Amount: ${{deposit_amount}}\nClosing Date: {{closing_date}}\n\n[Additional terms and conditions...]', '{"buyer_name": {"type": "text", "required": true}, "seller_name": {"type": "text", "required": true}, "property_address": {"type": "text", "required": true}, "purchase_price": {"type": "number", "required": true}, "deposit_amount": {"type": "number", "required": true}, "closing_date": {"type": "date", "required": true}}', true, true, 15),

(2, 'Commercial Lease Agreement', 'lease_agreement', 'lease', 'Comprehensive commercial lease agreement template', 'COMMERCIAL LEASE AGREEMENT\n\nThis lease agreement is between {{landlord_name}} (Landlord) and {{tenant_name}} (Tenant) for the premises located at {{property_address}}.\n\nMonthly Rent: ${{monthly_rent}}\nLease Term: {{lease_term}} months\nSecurity Deposit: ${{security_deposit}}\n\n[Additional lease terms...]', '{"landlord_name": {"type": "text", "required": true}, "tenant_name": {"type": "text", "required": true}, "property_address": {"type": "text", "required": true}, "monthly_rent": {"type": "number", "required": true}, "lease_term": {"type": "number", "required": true}, "security_deposit": {"type": "number", "required": true}}', true, false, 8),

(3, 'Contract Amendment', 'amendment', 'amendment', 'General contract amendment template for modifying existing agreements', 'CONTRACT AMENDMENT\n\nThis amendment modifies the original contract dated {{original_date}} between {{party1_name}} and {{party2_name}}.\n\nOriginal Contract: {{contract_reference}}\nAmendment Details: {{amendment_details}}\nEffective Date: {{effective_date}}\n\n[Amendment terms...]', '{"original_date": {"type": "date", "required": true}, "party1_name": {"type": "text", "required": true}, "party2_name": {"type": "text", "required": true}, "contract_reference": {"type": "text", "required": true}, "amendment_details": {"type": "textarea", "required": true}, "effective_date": {"type": "date", "required": true}}', true, true, 12);

-- Insert Contract Generations
INSERT INTO contract_generations (template_id, transaction_id, attorney_id, client_id, contract_data, status) VALUES
(1, 1, 1, 3, '{"buyer_name": "Michelle Lee", "seller_name": "Property Owner", "property_address": "123 Oak Street, San Francisco, CA", "purchase_price": 1125000, "deposit_amount": 56250, "closing_date": "2024-05-15"}', 'approved'),
(1, 2, 2, 2, '{"buyer_name": "Emily Rodriguez", "seller_name": "Property Owner", "property_address": "456 Pine Avenue, Oakland, CA", "purchase_price": 625000, "deposit_amount": 31250, "closing_date": "2024-05-30"}', 'review'),
(3, 1, 1, 3, '{"original_date": "2024-04-05", "party1_name": "Michelle Lee", "party2_name": "Property Owner", "contract_reference": "Purchase Agreement 123 Oak Street", "amendment_details": "Extend closing date by 5 days due to financing delays", "effective_date": "2024-04-20"}', 'draft');

-- Update sequences to ensure proper ID generation
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('attorneys_id_seq', (SELECT MAX(id) FROM attorneys));
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));
SELECT setval('property_transactions_id_seq', (SELECT MAX(id) FROM property_transactions));
SELECT setval('documents_id_seq', (SELECT MAX(id) FROM documents));
SELECT setval('document_signatures_id_seq', (SELECT MAX(id) FROM document_signatures));
SELECT setval('calendar_events_id_seq', (SELECT MAX(id) FROM calendar_events));
SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));
SELECT setval('contract_templates_id_seq', (SELECT MAX(id) FROM contract_templates));
SELECT setval('contract_generations_id_seq', (SELECT MAX(id) FROM contract_generations));

