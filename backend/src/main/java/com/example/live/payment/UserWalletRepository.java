package com.example.live.payment;

import com.example.live.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {
    Optional<UserWallet> findByUser(User user);
    
    @Query("SELECT w.balance FROM UserWallet w WHERE w.user = :user")
    Optional<BigDecimal> findBalanceByUser(@Param("user") User user);
    
    boolean existsByUser(User user);
}
