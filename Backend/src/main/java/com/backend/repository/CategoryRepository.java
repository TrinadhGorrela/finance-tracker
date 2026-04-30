package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
