package sg.edu.nus.webdemo.repo;

import sg.edu.nus.webdemo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findUsersByUsername(String username);
	Optional<User> findUsersByUsernameAndPassword(String username, String passwrd);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
