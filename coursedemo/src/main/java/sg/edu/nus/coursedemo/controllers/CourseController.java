package sg.edu.nus.coursedemo.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletResponse;
import sg.edu.nus.coursedemo.model.Course;
import sg.edu.nus.coursedemo.service.CourseService;

@Controller
@RequestMapping("/app")
public class CourseController {
	
	private final CourseService courseService;
	 
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
	
	/*
	 * @GetMapping("/listall") public String findAllCourses(Model model) {
	 * model.addAttribute("courses", cservice.findAll()); return ("/courses"); }
	 */
	
	// 1. Home Page
    @GetMapping("/")
    public String home() {
        return "index";
    }
 
    // 2. Course List
    @GetMapping("/courses")
    public String listCourses(Model model) {
        List<Course> allCourses = courseService.findAll();
        model.addAttribute("courses", allCourses);
        return "courses";
    }
 
    // 3. Course Detail
    @GetMapping("/courses/{id}")
    public String courseDetail(@PathVariable Long id,
                               Model model,
                               HttpServletResponse response) {
        return courseService.findById(id)
                .map(course -> {
                    model.addAttribute("course", course);
                    return "course-detail";
                })
                .orElseGet(() -> {
                    response.setStatus(404);
                    return "error/404";
                });
    }
 
    // 4a. Show Add Course Form
    @GetMapping("/courses/add")
    public String showAddCourseForm(Model model) {
        model.addAttribute("course", new Course());
        return "add-course";
    }
 
    // 4b. Process Form Submission
    @PostMapping("/courses/add")
    public String saveCourse(@ModelAttribute Course course,
                             RedirectAttributes redirectAttrs) {
        courseService.save(course);
        redirectAttrs.addFlashAttribute("successMessage",
                "'" + course.getName() + "' added successfully!");
        return "redirect:/courses";
    }

	

}
