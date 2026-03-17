package sg.edu.nus.coursedemo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import sg.edu.nus.coursedemo.model.Course;

@Service
public class CourseService {
    // Service methods are encapsulating your business logic
	// Service methods may join mutiple objects
	// Service will use association mappings
	private final ArrayList<Course> courses = new ArrayList<>();
	private final AtomicLong idCounter = new AtomicLong(1L);
	public CourseService() {
		super();
		// TODO Auto-generated constructor stub
		Course c1 = new Course(idCounter.getAndIncrement(), "Web Programming", "Vincent",
				2023L, "NUS-ISS", 1000.00, "Some funny HTML", LocalDate.now(), LocalDateTime.now());
		Course c2 = new Course(idCounter.getAndIncrement(), "Database", "Yuen Kwan",
				2023L, "NUS-ISS", 1000.00, "Some RDBMS", LocalDate.now(), LocalDateTime.now());
		Course c3 = new Course(idCounter.getAndIncrement(), "Design Thinking", "Esther",
				2023L, "NUS-ISS", 1000.00, "Some funny HTML", LocalDate.now(), LocalDateTime.now());
		courses.add(c1);courses.add(c2);courses.add(c3);
	}
	// List all the courses
	public ArrayList<Course> findAll() {
		return courses;
	}
	
	public Optional<Course> findById(Long id) {
        return courses.stream()
                      .filter(c -> c.getCourseId().equals(id))
                      .findFirst();
    }
 
    public void save(Course course) {
        course.setCourseId(idCounter.getAndIncrement());
        courses.add(course);
    }

	
	
}
