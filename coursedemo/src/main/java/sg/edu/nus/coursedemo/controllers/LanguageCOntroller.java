package sg.edu.nus.coursedemo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class LanguageCOntroller {
	// 1. Home Page
    @GetMapping("/language")
    public String home() {
        return "language";
    }
}
