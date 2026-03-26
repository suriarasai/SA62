package sg.edu.nus.employeedemo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sg.edu.nus.employeedemo.model.Course;
 
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
 
    List<Course> findByNameContainingIgnoreCase(String name);
 
    // All courses belonging to a specific employee
    List<Course> findByEmployeeId(Long employeeId);
 
    // Courses starting after a given date
    List<Course> findByStartsAfter(LocalDate date);
 
    // Courses shorter than a given number of months
    List<Course> findByDurationInMonthsLessThanEqual(Double months);
 
    // Eagerly fetch the owning employee
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.employee WHERE c.id = :id")
    java.util.Optional<Course> findByIdWithEmployee(@Param("id") Long id);
 
    // Courses for a given employee that start after a certain date
    @Query("SELECT c FROM Course c WHERE c.employee.id = :employeeId AND c.starts >= :from")
    List<Course> findByEmployeeIdAndStartsAfter(
        @Param("employeeId") Long employeeId,
        @Param("from") LocalDate from
    );
}
