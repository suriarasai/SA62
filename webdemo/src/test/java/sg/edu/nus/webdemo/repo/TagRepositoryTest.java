package sg.edu.nus.webdemo.repo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import sg.edu.nus.webdemo.model.Tag;

@DataJpaTest
@Sql("/data.sql")
public class TagRepositoryTest {

    @Autowired
    private TagRepository tagRepository;

    // Read Tests

    @Test
    public void testFindAll_returnsEightSeededTags() {
        List<Tag> tags = tagRepository.findAll();
        assertThat(tags).hasSize(8);
    }

    @Test
    public void testFindById_premiumTagExists() {
        // "Premium" is the first insert → id = 1
        Optional<Tag> found = tagRepository.findById(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Premium");
    }

    @Test
    public void testFindById_beginnerFriendlyTagExists() {
        // "Beginner Friendly" is the last (8th) insert → id = 8
        Optional<Tag> found = tagRepository.findById(8L);
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Beginner Friendly");
    }

    @Test
    public void testFindById_nonExistentId_returnsEmpty() {
        Optional<Tag> found = tagRepository.findById(999L);
        assertThat(found).isNotPresent();
    }

    // Create Tests

    @Test
    public void testSave_newTag_persistsAndAssignsId() {
        Tag newTag = new Tag("Vintage");
        Tag saved = tagRepository.save(newTag);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Vintage");
        assertThat(tagRepository.findAll()).hasSize(9);
    }

    // Update Tests

    @Test
    public void testUpdate_changeName() {
        Tag tag = tagRepository.findById(7L).orElseThrow();  // Limited Edition
        tag.setName("Collector's Edition");
        tagRepository.save(tag);

        Tag updated = tagRepository.findById(7L).orElseThrow();
        assertThat(updated.getName()).isEqualTo("Collector's Edition");
    }

    // Delete Tests

    @Test
    public void testDeleteById_reducesCount() {
        tagRepository.deleteById(3L);  // Professional
        assertThat(tagRepository.findAll()).hasSize(7);
        assertThat(tagRepository.findById(3L)).isNotPresent();
    }
}