package sg.edu.nus.restfulapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sg.edu.nus.restfulapp.model.Product;
import sg.edu.nus.restfulapp.repository.ProductRepository;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Angular 4200
@RequestMapping("/api/products")
public class ProductAPIController {
	
    @Autowired
    ProductRepository productRepo;
	
	
    @GetMapping
    public List<Product> getAllActive() {
        return productRepo.findByActiveTrue();
    }
    
    /** Returns a single product by id. */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Returns active products belonging to a specific category. */
    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Long categoryId) {
        return productRepo.findByCategoryIdAndActiveTrue(categoryId);
    }
    /** Creates a new product. */
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        Product saved = productRepo.save(product);
        return ResponseEntity.status(201).body(saved);
    }

    /** Replaces an existing product. */
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id,
                                           @RequestBody Product updated) {
        return productRepo.findById(id).map(existing -> {
            updated.setId(id);
            return ResponseEntity.ok(productRepo.save(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Soft-deletes a product (sets active = false). */
	/*
	 * @DeleteMapping("/{id}") public ResponseEntity<Void> softDelete(@PathVariable
	 * Long id) { return productRepo.findById(id).map(p -> { p.setActive(false);
	 * productRepo.save(p); return ResponseEntity.<Void>noContent().build();
	 * }).orElse(ResponseEntity.notFound().build()); }
	 */



}
