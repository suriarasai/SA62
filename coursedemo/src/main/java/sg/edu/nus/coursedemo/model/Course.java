package sg.edu.nus.coursedemo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;



public class Course {
	
	private Long courseId;
	//@NotBlank = must not be null, empty, or whitespace (for Strings)
    @NotBlank(message = "Course name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
	private String name;
	@NotBlank(message = "Instructor name is required")
	private String instructor;
	//@NotNull = must not be null (use for non-String types like Long, Double)
    @NotNull(message = "Launched year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    @Max(value = 2099, message = "Year must be 2099 or earlier")
	private Long launchedYear;
	@NotBlank(message = "Please select a company/school")
	private String company;
	@NotNull(message = "Fees are required")
    @DecimalMin(value = "200.0", message = "Fees must be at least $200")
    @DecimalMax(value = "3000.0", message = "Fees cannot exceed $3000")
	private Double fees;
	//@Size works on Strings — limit description length
    @Size(max = 500, message = "Description cannot exceed 500 characters")
	private String description;
	//@NotNull ensures a date is picked
    @NotNull(message = "Start date is required")
    @Future(message="The start date must refer to future date")
	private LocalDate startDate;
	private LocalDateTime createdOn;
	//Constructors
	public Course() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Course(Long courseId, String name, String instructor, Long launchedYear, String company, Double fees,
			String description, LocalDate startDate, LocalDateTime createdOn) {
		super();
		this.courseId = courseId;
		this.name = name;
		this.instructor = instructor;
		this.launchedYear = launchedYear;
		this.company = company;
		this.fees = fees;
		this.description = description;
		this.startDate = startDate;
		this.createdOn = createdOn;
	}
	//Setters & Getters

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInstructor() {
		return instructor;
	}

	public void setInstructor(String instructor) {
		this.instructor = instructor;
	}

	public Long getLaunchedYear() {
		return launchedYear;
	}

	public void setLaunchedYear(Long launchedYear) {
		this.launchedYear = launchedYear;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public Double getFees() {
		return fees;
	}

	public void setFees(Double fees) {
		this.fees = fees;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDateTime getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(LocalDateTime createdOn) {
		this.createdOn = createdOn;
	}

	@Override
	public String toString() {
		return "Course [courseId=" + courseId + ", name=" + name + ", instructor=" + instructor + ", launchedYear="
				+ launchedYear + ", company=" + company + ", fees=" + fees + ", description=" + description
				+ ", startDate=" + startDate + ", createdOn=" + createdOn + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(courseId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Course other = (Course) obj;
		return Objects.equals(courseId, other.courseId);
	}
	
	

}
