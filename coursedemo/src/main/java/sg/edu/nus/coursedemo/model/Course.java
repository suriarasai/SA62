package sg.edu.nus.coursedemo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

public class Course {
	
	private Long courseId;
	private String name;
	private String instructor;
	private Long launchedYear;
	private String company;
	private Double fees;
	private String description;
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
