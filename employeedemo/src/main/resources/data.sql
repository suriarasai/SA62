-- data.sql  –  Spring Boot will run this automatically after schema.sql
-- Place in: src/main/resources/data.sql
-- application.properties: spring.sql.init.mode=always
-- departments
INSERT INTO departments (id, name) VALUES
    (1, 'Engineering'),
    (2, 'Product Management'),
    (3, 'Human Resources'),
    (4, 'Data Science');
 -- employees
 INSERT INTO employees (id, name, department_id) VALUES
    (1, 'Dilbert',  1),   -- Engineering
    (2, 'Pointy Head', 2),   -- Product Management
    (3, 'Catbert', 3),   -- Human Resources
    (4, 'Alice',  4);   -- Data Science
 -- projects
 INSERT INTO projects (id, name, description, start_date, end_date) VALUES
    (1, 'Project Apollo',  'Core platform re-architecture',    '2024-01-15', '2024-09-30'),
    (2, 'Project Hermes',  'Internal tooling automation',      '2024-03-01', '2024-12-31'),
    (3, 'Project Athena',  'ML recommendation engine',         '2024-06-01', '2025-06-01'),
    (4, 'Project Titan',   'Mobile application overhaul',      '2024-02-01', '2024-11-30');
 -- employee_projects
 INSERT INTO employee_projects (employee_id, project_id) VALUES
    (1, 1),   -- Dilbert   → Apollo
    (1, 2),   -- Dilbert   → Hermes
    (2, 1),   -- Pointy     → Apollo
    (2, 4),   -- Pointy     → Titan
    (3, 2),   -- Catbert   → Hermes
    (4, 3),   -- Alice   → Athena
    (4, 1);   -- Alice   → Apollo
    
 -- courses
 INSERT INTO courses (id, name, duration_in_months, starts, employee_id) VALUES
    (1,  'Spring Boot Fundamentals',   2.0,  '2024-02-01', 1),
    (2,  'Advanced JPA & Hibernate',   1.5,  '2024-03-15', 1),
    (3,  'Product Strategy 101',       3.0,  '2024-01-10', 2),
    (4,  'Agile & Scrum Mastery',      1.0,  '2024-04-01', 2),
    (5,  'Effective Communication',    1.0,  '2024-02-20', 3),
    (6,  'HR Analytics',               2.5,  '2024-05-01', 3),
    (7,  'Python for Data Science',    4.0,  '2024-01-20', 4),
    (8,  'Deep Learning Foundations',  3.5,  '2024-04-10', 4),
    (9,  'MLOps & Model Deployment',   2.0,  '2024-07-01', 4);
