package sg.edu.nus.logindemo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
	
	@GetMapping("/")
	public String welcome() {
		
		return("login");
	}
	
	@GetMapping("/login")
	public String login() {
		
		return("login");
	}
	
	@PostMapping("/validate")
	public String validate(@RequestParam String username,
			@RequestParam String password, Model model) {
		String cpath = "login";
		if (username.equalsIgnoreCase("admin") && password.equalsIgnoreCase("password")) {
			cpath = "success";
			model.addAttribute("username", username);
		} else {cpath = "failure";}	
		return(cpath);
	}

}
