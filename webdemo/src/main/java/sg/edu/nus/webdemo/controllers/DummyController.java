package sg.edu.nus.webdemo.controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import sg.edu.nus.webdemo.model.Category;
import sg.edu.nus.webdemo.model.Tag;
import sg.edu.nus.webdemo.model.User;
import sg.edu.nus.webdemo.repo.CategoryRepository;
import sg.edu.nus.webdemo.repo.TagRepository;
import sg.edu.nus.webdemo.repo.UserRepository;


@Controller
public class DummyController {
	
	@Autowired
	UserRepository uRepo;
	
	@Autowired
	CategoryRepository cRepo;
	
	@Autowired
	TagRepository tRepo;
	
	@GetMapping("/test")
	public String getMethodName(Model m) {
		Category c1 = new Category("Kitchen Knives", "Simple Home Knives");
		Category c2 = new Category("Chef Knives", "Simple Professional Knives");
		Category c3 = new Category("Protection Gear", "Kinfe Glove");
		cRepo.save(c1);cRepo.save(c2);cRepo.save(c3);
		
		
		Tag t1 = new Tag("Professional");
		Tag t2 = new Tag("On Sale");
		Tag t3 = new Tag("Carbon");
		Tag t4 = new Tag("Stainless Steel");
		tRepo.save(t1);tRepo.save(t2);tRepo.save(t3);tRepo.save(t4);
		
		User u1 = new User("ahbeng", "password", "ahbeng@nus.edu.sg", "AH", "BENG", null, null);
		uRepo.save(u1);
		m.addAttribute("message", "allok");
		return new String("test");
	}
	

}
