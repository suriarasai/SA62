-- schema.sql  –  Spring Boot will run this automatically on startup
-- Place in: src/main/resources/schema.sql
-- application.properties: spring.sql.init.mode=always

--  departments
CREATE TABLE IF NOT EXISTS departments (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (id),
    CONSTRAINT uq_departments_name UNIQUE (name)
);

-- employees  
CREATE TABLE IF NOT EXISTS employees (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,
    department_id BIGINT,
    CONSTRAINT pk_employees        PRIMARY KEY (id),
    CONSTRAINT fk_employees_dept   FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT uq_employees_dept   UNIQUE (department_id)   -- enforces OneToOne
);

--  projects 
CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    start_date  DATE,
    end_date    DATE,
    CONSTRAINT pk_projects PRIMARY KEY (id)
);

-- employee_projects  (ManyToMany join table) 
CREATE TABLE IF NOT EXISTS employee_projects (
    employee_id BIGINT NOT NULL,
    project_id  BIGINT NOT NULL,
    CONSTRAINT pk_employee_projects  PRIMARY KEY (employee_id, project_id),
    CONSTRAINT fk_ep_employee        FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ep_project         FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- courses 
CREATE TABLE IF NOT EXISTS courses (
    id                  BIGINT         NOT NULL AUTO_INCREMENT,
    name                VARCHAR(255)   NOT NULL,
    duration_in_months  DOUBLE,
    starts              DATE,
    employee_id         BIGINT,
    CONSTRAINT pk_courses          PRIMARY KEY (id),
    CONSTRAINT fk_courses_employee FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);