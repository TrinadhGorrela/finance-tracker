package com.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.dto.SummaryResponse;
import com.backend.entity.Category;
import com.backend.entity.Transaction;
import com.backend.entity.User;
import com.backend.repository.CategoryRepository;
import com.backend.repository.TransactionRepository;
import com.backend.repository.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public Transaction createTransaction(String email, Long categoryId, BigDecimal amount,
            Category.TransactionType type,
            String note, LocalDate transactionDate) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setNote(note);
        transaction.setTransactionDate(transactionDate);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUser(user);
        transaction.setCategory(category);

        return transactionRepository.save(transaction);
    }

    public SummaryResponse calculateMonthlyExpenses(String email, YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));

        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(user.getId(),
                startDate,
                endDate);

        BigDecimal expense = BigDecimal.ZERO;
        BigDecimal income = BigDecimal.ZERO;
        for (Transaction t : transactions) {
            if (t.getType() == Category.TransactionType.EXPENSE) {
                expense = expense.add(t.getAmount());
            } else {
                income = income.add(t.getAmount());
            }
        }

        BigDecimal budget = user.getMonthlyBudget();
        if (budget == null || budget.compareTo(BigDecimal.ZERO) == 0) {
            return new SummaryResponse(income, expense, income.subtract(expense), BigDecimal.ZERO, "safe");
        }
        BigDecimal warningThreshold = budget.multiply(new BigDecimal("0.8"));

        String status;
        if (expense.compareTo(budget) > 0) {
            status = "danger";
        } else if (expense.compareTo(warningThreshold) >= 0) {
            status = "warning";
        } else {
            status = "safe";
        }

        return new SummaryResponse(income, expense, income.subtract(expense),
                user.getMonthlyBudget(), status);
    }

    public Transaction updateTransaction(Long id, Long categoryId, BigDecimal amount, String note,
            Category.TransactionType type, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found " + id));
        if (!user.getEmail().equals(transaction.getUser().getEmail())) {
            throw new RuntimeException("Unauthorized: You do not own this transaction");
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        transaction.setAmount(amount);
        transaction.setCategory(category);
        transaction.setNote(note);
        transaction.setType(type);
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found " + id));
        if (user.getEmail().equals(transaction.getUser().getEmail())) {
            transactionRepository.deleteById(id);
        }
    }

    public List<Transaction> getAllUserTransactions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));

        return transactionRepository.findByUserId(user.getId());
    }

    public List<Transaction> getTransactionsByMonth(String email, YearMonth yearMonth) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with Email: " + email));

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        return transactionRepository.findByUserIdAndTransactionDateBetween(user.getId(), startDate, endDate);
    }
}
