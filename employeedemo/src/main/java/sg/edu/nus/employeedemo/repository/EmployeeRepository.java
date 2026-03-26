package sg.edu.nus.employeedemo.repository;

import sg.edu.nus.employeedemo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	List<Employee> findByNameContainingIgnoreCase(String name);
	
	@Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department WHERE e.id = :id")
    Optional<Employee> findByIdWithDepartment(@Param("id") Long id);
 
    @Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.projects WHERE e.id = :id")
    Optional<Employee> findByIdWithProjects(@Param("id") Long id);
 
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.courses WHERE e.id = :id")
    Optional<Employee> findByIdWithCourses(@Param("id") Long id);
    
    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId")
    List<Employee> findByDepartmentId(@Param("departmentId") Long departmentId);
 
    @Query("SELECT DISTINCT e FROM Employee e JOIN e.projects p WHERE p.id = :projectId")
    List<Employee> findByProjectId(@Param("projectId") Long projectId);


}
