package sg.edu.nus.employeedemo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "courses")
public class Course {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   private String name;

   @Column(name = "duration_in_months")
   private Double durationInMonths;

   @Column(name = "starts")
   private LocalDate starts;

   // ManyToOne (bidirectional)
   // Course is the "many" side → holds the FK column employee_id
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "employee_id")
   private Employee employee;

   // Constructors 
   public Course() {}

   public Course(String name, Double durationInMonths, LocalDate starts) {
       this.name = name;
       this.durationInMonths = durationInMonths;
       this.starts = starts;
   }

   // Getters & Setters 
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getName() { return name; }
   public void setName(String name) { this.name = name; }

   public Double getDurationInMonths() { return durationInMonths; }
   public void setDurationInMonths(Double durationInMonths) { this.durationInMonths = durationInMonths; }

   public LocalDate getStarts() { return starts; }
   public void setStarts(LocalDate starts) { this.starts = starts; }

   public Employee getEmployee() { return employee; }
   public void setEmployee(Employee employee) { this.employee = employee; }
}

