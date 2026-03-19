package sg.edu.nus.coursedemo.service;

import org.springframework.stereotype.Service;
import sg.edu.nus.coursedemo.model.User;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService {

    // In-memory "database" of users (simulates a real DB table)
    private final ArrayList<User> users = new ArrayList<>();

    public UserService() {
        // Pre-load two demo users.
        // IMPORTANT: In a real app, passwords must be hashed (e.g. BCrypt).
        //            NEVER store plain-text passwords in production!
        users.add(new User(1L, "alice", "pass123", "ADMIN", "Alice Tan"));
        users.add(new User(2L, "bob",   "pass456", "USER",  "Bob Lim"));
        users.add(new User(3L, "clara",   "pass789", "USER",  "Clara Lee"));
        users.add(new User(3L, "ang",   "pass123", "USER",  "Ang Kok Leong"));
        users.add(new User(3L, "bryan",   "pass789", "USER",  "Bryan Pang"));
        users.add(new User(3L, "justin",   "pass789", "USER",  "Justin CHua"));
    }

    // findByUsername — looks up a user by their username
    // Returns Optional.empty() if not found
    public Optional<User> findByUsername(String username) {
        return users.stream()
                    .filter(u -> u.getUsername().equalsIgnoreCase(username))
                    .findFirst();
    }

    // authenticate — checks username AND password together
    // Returns the matching User wrapped in Optional, or empty if:
    //   - username not found
    //   - password does not match
    public Optional<User> authenticate(String username, String password) {
        return findByUsername(username)
                .filter(u -> u.getPassword().equals(password));
        //  .filter() keeps the User only if the password matches.
     }
}