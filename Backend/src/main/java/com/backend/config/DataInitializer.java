package com.backend.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.backend.entity.Category;
import com.backend.repository.CategoryRepository;

@Configuration
public class DataInitializer {

    @Autowired
    private CategoryRepository categoryRepository;

    @Bean
    public CommandLineRunner initCategories() {
        return args -> {
            if (categoryRepository.count() == 0) {
                List<Category> defaultCategories = List.of(
                        new Category(null, "Salary", Category.TransactionType.INCOME),
                        new Category(null, "Rent", Category.TransactionType.EXPENSE),
                        new Category(null, "Food", Category.TransactionType.EXPENSE),
                        new Category(null, "Transport", Category.TransactionType.EXPENSE),
                        new Category(null, "Shopping", Category.TransactionType.EXPENSE),
                        new Category(null, "Entertainment", Category.TransactionType.EXPENSE),
                        new Category(null, "Health", Category.TransactionType.EXPENSE),
                        new Category(null, "Others", Category.TransactionType.EXPENSE)
                    );
                categoryRepository.saveAll(defaultCategories);
            }
        };
    }
}