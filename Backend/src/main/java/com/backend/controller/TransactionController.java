package com.backend.controller;

import java.time.YearMonth;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.backend.dto.SummaryResponse;
import com.backend.entity.Transaction;
import com.backend.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping()
    public ResponseEntity<Transaction> createTransaction(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Transaction transaction) {
        try {
            Transaction savedTransaction = transactionService.createTransaction(userDetails.getUsername(),
                    transaction.getCategory().getId(),
                    transaction.getAmount(), transaction.getType(), transaction.getNote(),
                    transaction.getTransactionDate());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> calculateMonthlyExpenses(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam YearMonth yearMonth) {
        try {
            SummaryResponse expenses = transactionService.calculateMonthlyExpenses(userDetails.getUsername(),
                    yearMonth);
            return ResponseEntity.status(HttpStatus.OK).body(expenses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<Transaction>> getAllUserTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) YearMonth month) {
        try {
            List<Transaction> list;

            if (month == null) {
                list = transactionService.getAllUserTransactions(userDetails.getUsername());
            } else {
                list = transactionService.getTransactionsByMonth(userDetails.getUsername(), month);
            }

            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Transaction updatedTransaction = transactionService.updateTransaction(id, transaction.getCategory().getId(),
                    transaction.getAmount(), transaction.getNote(), transaction.getType(), userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(updatedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            transactionService.deleteTransaction(id, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
