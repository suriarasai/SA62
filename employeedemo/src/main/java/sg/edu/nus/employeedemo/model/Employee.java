package sg.edu.nus.employeedemo.model;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
 
@Entity
@Table(name = "employees")
public class Employee {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String name;
 
    // OneToOne (bidirectional) 
    // Employee owns the FK column via @JoinColumn
    @OneToOne(
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    @JoinColumn(name = "department_id", referencedColumnName = "id")
    private Department department;
 
    // ManyToMany with Project (bidirectional) 
    // Employee is the owning side → defines the join table
    @ManyToMany(
        cascade = { CascadeType.PERSIST, CascadeType.MERGE },
        fetch = FetchType.LAZY
    )
    @JoinTable(
        name = "employee_projects",
        joinColumns        = @JoinColumn(name = "employee_id"),
        inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects = new HashSet<>();
 
    // OneToMany with Course (bidirectional) 
    // Employee is the "one" side; Course holds the FK
    @OneToMany(
        mappedBy = "employee",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY,
        orphanRemoval = true
    )
    private List<Course> courses = new ArrayList<>();
 
    //  Constructors 
    public Employee() {}
 
    public Employee(String name) {
        this.name = name;
    }
 
    // Bidirectional helpers 
    public void addProject(Project project) {
        this.projects.add(project);
        project.getEmployees().add(this);
    }
 
    public void removeProject(Project project) {
        this.projects.remove(project);
        project.getEmployees().remove(this);
    }
 
    public void addCourse(Course course) {
        this.courses.add(course);
        course.setEmployee(this);
    }
 
    public void removeCourse(Course course) {
        this.courses.remove(course);
        course.setEmployee(null);
    }
 
    // Getters & Setters 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
 
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) {
        this.department = department;
        if (department != null && department.getEmployee() != this) {
            department.setEmployee(this);
        }
    }
 
    public Set<Project> getProjects() { return projects; }
    public void setProjects(Set<Project> projects) { this.projects = projects; }
 
    public List<Course> getCourses() { return courses; }
    public void setCourses(List<Course> courses) { this.courses = courses; }
}
