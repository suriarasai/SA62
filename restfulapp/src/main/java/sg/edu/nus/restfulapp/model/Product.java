package sg.edu.nus.restfulapp.model;

import java.time.LocalDateTime;
import java.util.HashSet;

import java.util.Objects;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 80)
    private String brand;

    /** Double – retail price in USD */
    @Column(nullable = false)
    private Double price;

    /** Double – percentage discount (0.0 – 100.0) */
    @Column(name = "discount_percent")
    private Double discountPercent = 0.0;

    /** Integer – units in stock */
    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    /** LocalDateTime – timestamp of product listing */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private Boolean active;
    
//  Associations 

    /** @ManyToOne – many products belong to one category; FK category_id on this table. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	/**
     * @ManyToMany – owner side.
     * Creates join table product_tags(product_id, tag_id).
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_tags",
        joinColumns        = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    //  Lifecycle 

    public Set<Tag> getTags() {
		return tags;
	}

	public void setTags(Set<Tag> tags) {
		this.tags = tags;
	}

	@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.active == null)          this.active          = true;
        if (this.discountPercent == null)  this.discountPercent = 0.0;
        if (this.stockQuantity   == null)  this.stockQuantity   = 0;
    }

    //  Business helpers 

    /** Effective price after applying discount. */
    public Double getEffectivePrice() {
        if (discountPercent == null || discountPercent == 0.0) return price;
        return price * (1.0 - discountPercent / 100.0);
    }

    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0;
    }


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getDiscountPercent() {
		return discountPercent;
	}

	public void setDiscountPercent(Double discountPercent) {
		this.discountPercent = discountPercent;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Product() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Product(String name, String description, String brand, Double price, Double discountPercent,
			Integer stockQuantity, LocalDateTime createdAt, Boolean active) {
		super();
		this.name = name;
		this.description = description;
		this.brand = brand;
		this.price = price;
		this.discountPercent = discountPercent;
		this.stockQuantity = stockQuantity;
		this.createdAt = createdAt;
		this.active = active;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Product other = (Product) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", description=" + description + ", brand=" + brand + ", price="
				+ price + ", discountPercent=" + discountPercent + ", stockQuantity=" + stockQuantity + ", imageUrl="
				+ imageUrl + ", createdAt=" + createdAt + ", active=" + active + "]";
	}

     

}
