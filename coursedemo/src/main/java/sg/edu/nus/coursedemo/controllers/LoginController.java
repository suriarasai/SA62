package sg.edu.nus.coursedemo.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import sg.edu.nus.coursedemo.service.UserService;

@Controller
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    // WHAT IS A SESSION?
    // HTTP is stateless — the server forgets the user after every request.
    // A Session solves this: the server stores data (like a logged-in user)
    // linked to a browser via a cookie called JSESSIONID.
    //
    // 1. Show Login Form  (GET /login)
    @GetMapping("/login")
    public String showLoginForm() {
        return "login";          // renders login.html
    }


    // 2. Process Login  (POST /login)
    //
    //    HttpSession session  → Spring injects the current session object.
    //    If no session exists yet, Spring creates one automatically.
    @PostMapping("/login")
    public String processLogin(
            @RequestParam String username,          // from the form field name="username"
            @RequestParam String password,          // from the form field name="password"
            HttpSession session,                    // the session for this browser
            Model model,
            RedirectAttributes redirectAttrs) {

        // Ask UserService to verify username + password
        return userService.authenticate(username, password)
                .map(user -> {
                	
                    // LOGIN SUCCESS
                    // session.setAttribute(key, value)
                    //   → stores data on the server, tied to this browser
                    //   → key is a String you choose; value is any Object
                    session.setAttribute("loggedInUser", user);
 
                    // Optionally store just the role for quick checks
                    session.setAttribute("userRole", user.getRole());

                    // Set how long the session lasts: 10 minutes of inactivity
                    session.setMaxInactiveInterval(10 * 60);   // seconds

                    // Flash message shows once on the next page, then disappears
                    redirectAttrs.addFlashAttribute("successMessage",
                            "Welcome back, " + user.getFullName() + "!");

                    return "redirect:/courses";      // go to course list
                })
                .orElseGet(() -> {
                    // LOGIN FAILURE — bad username or password
                    // Do NOT redirect; return the view name so the Model
                    // (with the error) is still available to the template.
                     model.addAttribute("errorMessage",
                            "Invalid username or password. Please try again.");
                    return "login";
                });
    }


    // 3. Logout  (GET /logout)
    //
    //    session.invalidate()
    //      → destroys the entire session on the server.
    //      → the JSESSIONID cookie becomes useless.
    //      → ALL attributes (loggedInUser, userRole, etc.) are removed.
    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttrs) {
    	 // Read the user's name before we wipe the session (for the goodbye message)
        Object userObj = session.getAttribute("loggedInUser");
        String name = "Guest";
        if (userObj instanceof sg.edu.nus.coursedemo.model.User loggedUser) {
            name = loggedUser.getFullName();
        }

       
        // Destroy the session — user is now logged out
        session.invalidate();
        //  This one call removes ALL session data and invalidates
        //  the JSESSIONID cookie. The browser will get a NEW session
        //  on the next request.

        redirectAttrs.addFlashAttribute("logoutMessage",
                "Goodbye, " + name + "! You have been logged out.");

        return "redirect:/login";
    }
}