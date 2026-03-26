package sg.edu.nus.employeedemo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String name;
 
    // OneToOne (bidirectional) 
    // Department is the inverse side → mappedBy points to the field in Employee
    @OneToOne(
        mappedBy = "department",
        fetch = FetchType.LAZY
    )
    private Employee employee;
 
    // Constructors 
    public Department() {}
 
    public Department(String name) {
        this.name = name;
    }
 
    // Getters & Setters 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
