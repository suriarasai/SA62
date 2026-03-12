package com.example.demo.controller;

import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.View;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController

public class HelloController {
	
	@RequestMapping("/hello")
	public void sayHello() {
		System.out.println("Hello World!!!!");
        
	}

}
