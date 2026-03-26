package sg.edu.nus.employeedemo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sg.edu.nus.employeedemo.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
	Optional<Department> findByName(String name);

	List<Department> findByNameContainingIgnoreCase(String name);

	// Eagerly fetch the associated employee
	@Query("SELECT d FROM Department d LEFT JOIN FETCH d.employee WHERE d.id = :id")
	Optional<Department> findByIdWithEmployee(@Param("id") Long id);

	// Check whether a department already has an assigned employee
	@Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END "
			+ "FROM Department d WHERE d.id = :id AND d.employee IS NOT NULL")
	boolean hasEmployee(@Param("id") Long id);
}
