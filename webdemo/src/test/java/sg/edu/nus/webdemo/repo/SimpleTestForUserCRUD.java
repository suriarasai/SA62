package sg.edu.nus.webdemo.repo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import sg.edu.nus.webdemo.model.User;

@DataJpaTest
public class SimpleTestForUserCRUD {

	 @Autowired
	 UserRepository userRepo;
	 
	 @Autowired
	 private TestEntityManager em;
	 
	 @Test
     @DisplayName("Test User Creation")
     void saveUser() {
		 User u1 = new User("ahbeng", "password", "ahbeng@nus.edu.sg", "AH", "BENG", null, null);
		 User savedUser = userRepo.save(u1);
		 em.persistAndFlush(savedUser);
         assertThat(savedUser.getId()).isNotNull().isPositive();
     }
	 
	 @Test
     @DisplayName("Test User Creation")
     void findUser() {
		 List<User> list = userRepo.findAll();
		 assertThat(list.size()>0);
     }
	 
	 @Test
     @DisplayName("Test User Creation")
     void findUserByUserName() {
		 Optional<User> list = userRepo.findUsersByUsername("notinrecord");
		 assertThat(list.isPresent());
     } 
	 
	 
}
