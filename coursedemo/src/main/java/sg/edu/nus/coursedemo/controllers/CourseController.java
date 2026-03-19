package sg.edu.nus.coursedemo.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import sg.edu.nus.coursedemo.model.Course;
import sg.edu.nus.coursedemo.service.CourseService;

@Controller
public class CourseController {
	
	private final CourseService courseService;
	 
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    // HELPER — isLoggedIn()
    //
    // session.getAttribute(key)
    //   → retrieves a value stored in the session by its key.
    //   → returns null if the key does not exist (user not logged in).
    //
    // We call this in every protected route below.
    // ------------------------------------------------------------------
    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("loggedInUser") != null;
         //  If "loggedInUser" was set during login, user is authenticated.
        //  If it's null, there is no active session for this user.
    }
	
	/*
	 * @GetMapping("/listall") public String findAllCourses(Model model) {
	 * model.addAttribute("courses", cservice.findAll()); return ("/courses"); }
	 */
	
	// 1. Home Page
    @GetMapping("/")
    public String home() {
        return "home";
    }
 
    // 2. Course List
    @GetMapping("/courses")
    public String listCourses(Model model,
    		HttpSession session,
            RedirectAttributes redirectAttrs)
       {
        // Guard: redirect to login if not logged in
        if (!isLoggedIn(session)) {
            redirectAttrs.addFlashAttribute("errorMessage",
                    "Please log in to view courses.");
            return "redirect:/login";
        }
     	
    	
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
                    return "coursedetail";
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
        return "courseform";
    }
 
    // 4b. Process Form Submission
	/*
	 * @PostMapping("/courses/add") public String saveCourse(@ModelAttribute Course
	 * course, RedirectAttributes redirectAttrs) { courseService.save(course);
	 * redirectAttrs.addFlashAttribute("successMessage", "'" + course.getName() +
	 * "' added successfully!"); return "redirect:/courses"; }
	 */

    // 4b. Process Form Submission with Validation
	
	  @PostMapping("/courses/add") 
	  public String saveCourse(@Valid @ModelAttribute Course course, // @Valid triggers the annotations 
			  BindingResult bindingResult, // catches any errors 
			  RedirectAttributes redirectAttrs) 
			  	{
	              // If there are errors, go BACK to the form (don't save)
	              if(bindingResult.hasErrors()) { 
	            	   return "courseform"; // return to form —Thymeleaf will show the errors 
	            	   }
	  	               // No errors — safe to save 
	              courseService.save(course);
	           
			  	  return "redirect:/courses"; }
	 

}
