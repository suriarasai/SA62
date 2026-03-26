package sg.edu.nus.employeedemo.repository;



import sg.edu.nus.employeedemo.model.Course;
import sg.edu.nus.employeedemo.model.Department;
import sg.edu.nus.employeedemo.model.Employee;
import sg.edu.nus.employeedemo.model.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
 
import static org.assertj.core.api.Assertions.assertThat;
 
@DataJpaTest
class EmployeeRepositoryTest {
 
    @Autowired private EmployeeRepository   employeeRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private ProjectRepository    projectRepository;
    @Autowired private CourseRepository     courseRepository;
 
    
    
}