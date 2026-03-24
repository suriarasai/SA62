package sg.edu.nus.restfulapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sg.edu.nus.restfulapp.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
