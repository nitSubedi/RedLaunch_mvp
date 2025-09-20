-- Core tables for structured data
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    stock_level INT NOT NULL,
    location VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personnel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    location VARCHAR(50),
    status VARCHAR(20),
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usage_log (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES inventory(id),
    used_by INT REFERENCES personnel(id),
    quantity INT NOT NULL,
    usage_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE weather (
    id SERIAL PRIMARY KEY,
    location VARCHAR(50),
    temperature FLOAT,
    precipitation FLOAT,
    disruption_level INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for unstructured data (e.g., sensor logs, images, JSON blobs)
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50),
    location VARCHAR(50),
    data JSONB, -- Store unstructured sensor readings
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    doc_type VARCHAR(50),
    description TEXT,
    file_data BYTEA, -- Store binary data (images, PDFs, etc.)
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO inventory (item_name, stock_level, location) VALUES
('Medical Kit', 75, 'Depot A'),
('Battery Pack', 200, 'Depot B'),
('Tool Set', 40, 'Depot C'),
('Food Ration', 500, 'Depot A'),
('Protective Gear', 60, 'Depot B'),
('Spare Tire', 30, 'Depot C'),
('Radio Unit', 25, 'Depot A'),
('First Aid Kit', 90, 'Depot B'),
('Lubricant', 110, 'Depot C'),
('Flashlight', 150, 'Depot A');

INSERT INTO personnel (name, role, location, status) VALUES
('Dana White', 'Medic', 'Depot A', 'Active'),
('Eli Brown', 'Driver', 'Depot B', 'Active'),
('Fiona Green', 'Engineer', 'Depot C', 'Active'),
('George Black', 'Operator', 'Depot A', 'Inactive'),
('Helen Blue', 'Technician', 'Depot B', 'Active'),
('Ian Gray', 'Supervisor', 'Depot C', 'Active'),
('Julia Red', 'Operator', 'Depot A', 'Active'),
('Kevin Gold', 'Technician', 'Depot B', 'Inactive'),
('Laura Silver', 'Engineer', 'Depot C', 'Active'),
('Mike Bronze', 'Operator', 'Depot A', 'Active');


INSERT INTO usage_log (item_id, used_by, quantity, notes) VALUES
(4, 4, 15, 'Medical supplies restock'),
(5, 5, 30, 'Battery replacement'),
(6, 6, 8, 'Tool maintenance'),
(7, 7, 50, 'Food distribution'),
(8, 8, 12, 'Gear check'),
(9, 9, 3, 'Tire change'),
(10, 10, 5, 'Radio test'),
(1, 2, 20, 'Fuel for generator'),
(2, 3, 25, 'Water for field ops'),
(3, 1, 7, 'Spare part installation');

INSERT INTO weather (location, temperature, precipitation, disruption_level) VALUES
('Depot A', 21.0, 0.5, 1),
('Depot B', 19.5, 2.1, 2),
('Depot C', 26.3, 0.0, 0),
('Depot A', 23.2, 1.2, 1),
('Depot B', 17.8, 4.0, 3),
('Depot C', 24.7, 0.0, 0);

INSERT INTO sensor_data (sensor_type, location, data) VALUES
('RFID', 'Depot B', '{"stock_level": 300, "last_scan": "2025-09-07T11:00:00Z"}'),
('RFID', 'Depot C', '{"stock_level": 50, "last_scan": "2025-09-07T12:00:00Z"}'),
('Temperature', 'Depot A', '{"value": 22.5, "unit": "C"}'),
('Humidity', 'Depot B', '{"value": 60, "unit": "%"}'),
('Camera', 'Depot C', '{"image_id": "img_002", "status": "obstructed"}'),
('RFID', 'Depot A', '{"stock_level": 75, "last_scan": "2025-09-07T13:00:00Z"}');

INSERT INTO documents (doc_type, description, file_data) VALUES
('Report', 'Medical kit usage report', NULL),
('Image', 'Depot C maintenance photo', NULL),
('PDF', 'Weather disruption analysis', NULL),
('Report', 'Personnel status summary', NULL),
('Image', 'Depot A overview', NULL);