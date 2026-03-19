package sg.edu.nus.coursedemo.model;

// A simple User model — no validation annotations here for clarity.
// In a real app you would add @NotBlank, @Email, etc.

public class User {

    private Long userId;
    private String username;
    private String password;
    private String role;        // e.g. "ADMIN" or "USER"
    private String fullName;

    
    // Constructors


    public User() {
        super();
    }

    public User(Long userId, String username, String password,
                String role, String fullName) {
        this.userId   = userId;
        this.username = username;
        this.password = password;
        this.role     = role;
        this.fullName = fullName;
    }

    // Getters & Setters

    public Long getUserId()              { return userId; }
    public void setUserId(Long userId)   { this.userId = userId; }

    public String getUsername()                  { return username; }
    public void   setUsername(String username)   { this.username = username; }

    public String getPassword()                  { return password; }
    public void   setPassword(String password)   { this.password = password; }

    public String getRole()              { return role; }
    public void   setRole(String role)   { this.role = role; }

    public String getFullName()                  { return fullName; }
    public void   setFullName(String fullName)   { this.fullName = fullName; }

    @Override
    public String toString() {
        // NOTE: never print password in a real application!
        return "User [userId=" + userId + ", username=" + username
                + ", role=" + role + ", fullName=" + fullName + "]";
    }
}