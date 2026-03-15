package sg.edu.nus.webdemo.repo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import sg.edu.nus.webdemo.model.User;

@DataJpaTest
@Sql("/data.sql")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    // ── Read ─────────────────────────────────────────────────────────────────

    @Test
    public void testFindAll_returnsThreeSeededUsers() {
        List<User> users = userRepository.findAll();
        assertThat(users).hasSize(3);
    }

    @Test
    public void testFindById_ahbengExists() {
        // "ahbeng" is the first insert → id = 1
        Optional<User> found = userRepository.findById(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("ahbeng");
        assertThat(found.get().getEmail()).isEqualTo("ab@nus.edu.sg");
    }

    @Test
    public void testFindById_nonExistentId_returnsEmpty() {
        Optional<User> found = userRepository.findById(999L);
        assertThat(found).isNotPresent();
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Test
    public void testSave_newUser_persistsAndAssignsId() {
        User newUser = new User("newuser", "newpass");
        User saved = userRepository.save(newUser);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUsername()).isEqualTo("newuser");
        assertThat(userRepository.findAll()).hasSize(4);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Test
    public void testUpdate_changeEmail() {
        User user = userRepository.findById(2L).orElseThrow();  // alice
        user.setEmail("alice.new@nus.edu.sg");
        userRepository.save(user);

        User updated = userRepository.findById(2L).orElseThrow();
        assertThat(updated.getEmail()).isEqualTo("alice.new@nus.edu.sg");
    }

    @Test
    public void testUpdate_changePassword() {
        User user = userRepository.findById(3L).orElseThrow();  // admin
        user.setPassword("newAdminPass");
        userRepository.save(user);

        User updated = userRepository.findById(3L).orElseThrow();
        assertThat(updated.getPassword()).isEqualTo("newAdminPass");
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Test
    public void testDeleteById_reducesCount() {
        userRepository.deleteById(1L);  // ahbeng
        assertThat(userRepository.findAll()).hasSize(2);
        assertThat(userRepository.findById(1L)).isNotPresent();
    }

    // ── Custom query methods ──────────────────────────────────────────────────

    @Test
    public void testFindUsersByUsername_aliceFound() {
        Optional<User> found = userRepository.findUsersByUsername("alice");
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("alice@nus.edu.sg");
    }

    @Test
    public void testFindUsersByUsername_unknownUser_returnsEmpty() {
        Optional<User> found = userRepository.findUsersByUsername("ghost");
        assertThat(found).isNotPresent();
    }

    @Test
    public void testFindUsersByUsernameAndPassword_correctCredentials() {
        Optional<User> found = userRepository.findUsersByUsernameAndPassword("ahbeng", "password123");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("ahbeng");
    }

    @Test
    public void testFindUsersByUsernameAndPassword_wrongPassword_returnsEmpty() {
        Optional<User> found = userRepository.findUsersByUsernameAndPassword("alice", "wrongpass");
        assertThat(found).isNotPresent();
    }

    @Test
    public void testFindByEmail_adminEmailFound() {
        Optional<User> found = userRepository.findByEmail("admin@choppee.com");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("admin");
    }

    @Test
    public void testFindByEmail_unknownEmail_returnsEmpty() {
        Optional<User> found = userRepository.findByEmail("nobody@nowhere.com");
        assertThat(found).isNotPresent();
    }

    @Test
    public void testExistsByUsername_existingUser_returnsTrue() {
        assertThat(userRepository.existsByUsername("alice")).isTrue();
    }

    @Test
    public void testExistsByUsername_missingUser_returnsFalse() {
        assertThat(userRepository.existsByUsername("phantom")).isFalse();
    }

    @Test
    public void testExistsByEmail_existingEmail_returnsTrue() {
        assertThat(userRepository.existsByEmail("ab@nus.edu.sg")).isTrue();
    }

    @Test
    public void testExistsByEmail_missingEmail_returnsFalse() {
        assertThat(userRepository.existsByEmail("missing@example.com")).isFalse();
    }
}