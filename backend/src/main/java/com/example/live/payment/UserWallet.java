package com.example.live.payment;

import com.example.live.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_wallets")
public class UserWallet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    // Helper methods
    public void addTransaction(Transaction transaction) {
        transaction.setWallet(this);
        transactions.add(transaction);
        updateBalance(transaction);
    }

    private void updateBalance(Transaction transaction) {
        switch (transaction.getType()) {
            case DEPOSIT:
            case PAYMENT_RECEIVED:
            case REFUND_RECEIVED:
                balance = balance.add(transaction.getAmount());
                break;
            case WITHDRAWAL:
            case PAYMENT:
            case REFUND:
                balance = balance.subtract(transaction.getAmount());
                break;
        }
    }

    public boolean hasSufficientFunds(BigDecimal amount) {
        return balance.compareTo(amount) >= 0;
    }

    // Factory method
    public static UserWallet createWallet(User user) {
        UserWallet wallet = new UserWallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        return wallet;
    }
}
