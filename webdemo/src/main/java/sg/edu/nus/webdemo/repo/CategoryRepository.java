package sg.edu.nus.webdemo.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import sg.edu.nus.webdemo.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
