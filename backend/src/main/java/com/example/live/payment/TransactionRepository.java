package com.example.live.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWalletOrderByCreatedAtDesc(UserWallet wallet);
    List<Transaction> findByWalletAndTypeInOrderByCreatedAtDesc(UserWallet wallet, List<TransactionType> types);
}
