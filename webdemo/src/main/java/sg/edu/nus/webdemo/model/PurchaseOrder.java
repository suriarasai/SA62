package sg.edu.nus.webdemo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * A completed purchase (snapshot of the cart at checkout time). Named
 * PurchaseOrder to avoid clashing with the SQL reserved word ORDER. Table
 * mapped to "purchase_orders".
 *
 * Associations:
 * 
 * @ManyToOne → User (many orders placed by one user)
 * @OneToMany → OrderItem (one order contains many line-items) inverse
 *
 *            Data types: Long – id Double – totalAmount String –
 *            shippingAddress, notes OrderStatus – status (stored as STRING
 *            via @Enumerated) LocalDateTime – orderDate, deliveredAt
 */
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Double – grand total including all items at checkout prices */
	@Column(name = "total_amount", nullable = false)
	private Double totalAmount;

	/** String – full delivery address captured at checkout */
	@Column(name = "shipping_address", length = 500)
	private String shippingAddress;

	@Column(length = 300)
	private String notes;

	/** Enum stored as VARCHAR; never as ordinal to survive reordering. */
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private OrderStatus status;

	/** LocalDateTime – when the order was placed */
	@Column(name = "order_date", nullable = false)
	private LocalDateTime orderDate;

	/** LocalDateTime – when the order was delivered (nullable until delivered) */
	@Column(name = "delivered_at")
	private LocalDateTime deliveredAt;

	/** @ManyToOne – many orders belong to one user; FK user_id. */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	/** @OneToMany – one order has many line-items. */
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OrderItem> items = new ArrayList<>();

	@PrePersist
	protected void onCreate() {
		this.orderDate = LocalDateTime.now();
		if (this.status == null)
			this.status = OrderStatus.PENDING;
	}

	public int getTotalQuantity() {
		return items.stream().mapToInt(OrderItem::getQuantity).sum();
	}

	public PurchaseOrder() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double ta) {
		this.totalAmount = ta;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(String sa) {
		this.shippingAddress = sa;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime t) {
		this.orderDate = t;
	}

	public LocalDateTime getDeliveredAt() {
		return deliveredAt;
	}

	public void setDeliveredAt(LocalDateTime t) {
		this.deliveredAt = t;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}
}
