package sg.edu.nus.webdemo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * A single line-item in a user's shopping cart.
 *
 * Associations:
 * 
 * @ManyToOne → Cart (many items belong to one cart)
 * @ManyToOne → Product (many cart-lines reference one product)
 *
 *            Data types: Integer – quantity LocalDateTime – addedAt
 */
@Entity
@Table(name = "cart_items")
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Integer – number of units the shopper wants to buy */
	@Column(nullable = false)
	private Integer quantity;

	@Column(name = "added_at")
	private LocalDateTime addedAt;

	/** @ManyToOne – FK cart_id. Many items belong to one cart. */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cart_id", nullable = false)
	private Cart cart;

	/** @ManyToOne – FK product_id. Many cart lines reference one product. */
	@ManyToOne(fetch = FetchType.EAGER) // EAGER so Thymeleaf can read name/price
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@PrePersist
	protected void onCreate() {
		this.addedAt = LocalDateTime.now();
	}

	public Double getSubtotal() {
		if (product == null || quantity == null)
			return 0.0;
		return product.getEffectivePrice() * quantity;
	}

	public CartItem() {
	}

	public CartItem(Cart cart, Product product, Integer quantity) {
		this.cart = cart;
		this.product = product;
		this.quantity = quantity;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public LocalDateTime getAddedAt() {
		return addedAt;
	}

	public void setAddedAt(LocalDateTime t) {
		this.addedAt = t;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
}