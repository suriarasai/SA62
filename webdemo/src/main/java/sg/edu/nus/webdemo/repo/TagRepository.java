package sg.edu.nus.webdemo.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import sg.edu.nus.webdemo.model.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

}
