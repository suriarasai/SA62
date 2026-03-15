INSERT INTO category (name, description) VALUES
  ('Chef Knives',     'High-precision kitchen blades for the professional cook'),
  ('Hunting Knives',  'Rugged fixed and folding blades for the outdoors'),
  ('Axes & Hatchets', 'Splitting mauls, felling axes and camping hatchets'),
  ('Protective Gear', 'Cut-resistant gloves, blade guards and storage solutions');
INSERT INTO tag (name) VALUES
  ('Premium'),
  ('Handcrafted'),
  ('Professional'),
  ('Outdoor'),
  ('Stainless Steel'),
  ('Carbon Steel'),
  ('Limited Edition'),
  ('Beginner Friendly');
INSERT INTO users (username, email, password, first_name, last_name, dob, created_at) VALUES
  ('ahbeng', 'ab@nus.edu.sg',       'password123', 'Ah',    'Beng',    '1999-05-14', NOW()),
  ('alice',  'alice@nus.edu.sg',    'secret456',   'Alice', 'Tan',     '1985-11-30', NOW()),
  ('admin',  'admin@choppee.com',   'admin',       'Admin', 'Choppee', '1980-01-01', NOW());