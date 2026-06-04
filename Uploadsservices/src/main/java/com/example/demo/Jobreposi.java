package com.example.demo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface Jobreposi extends JpaRepository<Jobs, Long> {

    List<Jobs> findByPostedById(Long userId);

    List<Jobs> findTop5ByOrderByCreatedAtDesc();

    List<Jobs> findTop5ByPostedByIdOrderByCreatedAtDesc(Long userId);

    long countByPostedById(Long userId);
}
