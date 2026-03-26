package sg.edu.nus.employeedemo.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import sg.edu.nus.employeedemo.model.Course;
import sg.edu.nus.employeedemo.model.Department;
import sg.edu.nus.employeedemo.model.Employee;

@DataJpaTest

public class CourseRepositoryTest {
    @Autowired private CourseRepository     courseRepository;
    @Autowired private EmployeeRepository   employeeRepository;
    @Autowired private DepartmentRepository departmentRepository;


}
