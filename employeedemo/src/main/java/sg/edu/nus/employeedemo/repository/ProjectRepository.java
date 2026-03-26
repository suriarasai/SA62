package sg.edu.nus.employeedemo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sg.edu.nus.employeedemo.model.Project;
 
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
 
    Optional<Project> findByName(String name);
 
    List<Project> findByNameContainingIgnoreCase(String name);
 
    // All projects that are still active
    List<Project> findByEndDateAfter(LocalDate date);
 
    // Eagerly fetch the employees on a project
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.employees WHERE p.id = :id")
    Optional<Project> findByIdWithEmployees(@Param("id") Long id);
 
    // Projects assigned to a specific employee
    @Query("SELECT DISTINCT p FROM Project p JOIN p.employees e WHERE e.id = :employeeId")
    List<Project> findByEmployeeId(@Param("employeeId") Long employeeId);
 
    // Projects within a date range
    @Query("SELECT p FROM Project p WHERE p.startDate >= :from AND p.endDate <= :to")
    List<Project> findByDateRange(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
 
