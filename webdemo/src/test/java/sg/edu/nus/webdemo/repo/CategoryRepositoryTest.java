package sg.edu.nus.webdemo.repo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import sg.edu.nus.webdemo.model.Category;

@DataJpaTest
@Sql("/data.sql")
public class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    //  Read Tests

    @Test
    public void testFindAll_returnsFourSeededCategories() {
        List<Category> categories = categoryRepository.findAll();
        assertThat(categories).hasSize(4);
    }

    @Test
    public void testFindById_chefKnivesExists() {
        // "Chef Knives" is the first insert → id = 1
        Optional<Category> found = categoryRepository.findById(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Chef Knives");
        assertThat(found.get().getDescription())
                .isEqualTo("High-precision kitchen blades for the professional cook");
    }

    @Test
    public void testFindById_nonExistentId_returnsEmpty() {
        Optional<Category> found = categoryRepository.findById(999L);
        assertThat(found).isNotPresent();
    }

    //  Create Tests

    @Test
    public void testSave_newCategory_persistsAndAssignsId() {
        Category newCategory = new Category("Pocket Knives", "Compact everyday-carry blades");
        Category saved = categoryRepository.save(newCategory);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Pocket Knives");
        assertThat(categoryRepository.findAll()).hasSize(5);
    }

    // Update Tests

    @Test
    public void testUpdate_changeDescription() {
        Category category = categoryRepository.findById(1L).orElseThrow();
        category.setDescription("Updated description for Chef Knives");
        categoryRepository.save(category);

        Category updated = categoryRepository.findById(1L).orElseThrow();
        assertThat(updated.getDescription()).isEqualTo("Updated description for Chef Knives");
    }

    @Test
    public void testUpdate_changeName() {
        Category category = categoryRepository.findById(2L).orElseThrow();
        category.setName("Survival Knives");
        categoryRepository.save(category);

        Category updated = categoryRepository.findById(2L).orElseThrow();
        assertThat(updated.getName()).isEqualTo("Survival Knives");
    }

    // Delete Tests

    @Test
    public void testDeleteById_reducesCount() {
        categoryRepository.deleteById(4L);   // Protective Gear
        assertThat(categoryRepository.findAll()).hasSize(3);
        assertThat(categoryRepository.findById(4L)).isNotPresent();
    }
}