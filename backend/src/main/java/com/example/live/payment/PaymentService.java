package com.example.live.payment;

import com.example.live.booking.Booking;
import com.example.live.payment.dto.TransactionResponse;
import com.example.live.payment.dto.WalletResponse;
import com.example.live.user.User;
import com.example.live.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final UserWalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentService(
            UserWalletRepository walletRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WalletResponse getWallet(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserWallet wallet = walletRepository.findByUser(user)
            .orElseGet(() -> createWallet(user));

        List<TransactionResponse> transactions = wallet.getTransactions().stream()
            .limit(10)  // Get last 10 transactions
            .map(TransactionResponse::fromTransaction)
            .collect(Collectors.toList());

        WalletResponse response = new WalletResponse();
        response.setUserId(userId);
        response.setBalance(wallet.getBalance());
        response.setRecentTransactions(transactions);
        return response;
    }

    @Transactional
    public TransactionResponse mockDeposit(Long userId, BigDecimal amount) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserWallet wallet = walletRepository.findByUser(user)
            .orElseGet(() -> createWallet(user));

        Transaction transaction = Transaction.create(
            wallet,
            null,
            TransactionType.DEPOSIT,
            amount,
            "Mock deposit for testing"
        );

        wallet.addTransaction(transaction);
        transaction = transactionRepository.save(transaction);
        walletRepository.save(wallet);

        return TransactionResponse.fromTransaction(transaction);
    }

    @Transactional
    public boolean processPayment(Booking booking) {
        User consumer = booking.getConsumer();
        User provider = booking.getProvider();
        BigDecimal amount = booking.getAmount();

        // Get or create wallets
        UserWallet consumerWallet = walletRepository.findByUser(consumer)
            .orElseGet(() -> createWallet(consumer));
        UserWallet providerWallet = walletRepository.findByUser(provider)
            .orElseGet(() -> createWallet(provider));

        // Check if consumer has sufficient funds
        if (!consumerWallet.hasSufficientFunds(amount)) {
            return false;
        }

        // Create consumer payment transaction
        Transaction consumerPayment = Transaction.create(
            consumerWallet,
            booking,
            TransactionType.PAYMENT,
            amount,
            "Payment for " + booking.getService().getTitle()
        );

        // Create provider payment received transaction
        Transaction providerPayment = Transaction.create(
            providerWallet,
            booking,
            TransactionType.PAYMENT_RECEIVED,
            amount,
            "Payment received for " + booking.getService().getTitle()
        );

        // Process transactions
        consumerWallet.addTransaction(consumerPayment);
        providerWallet.addTransaction(providerPayment);

        // Save everything
        transactionRepository.save(consumerPayment);
        transactionRepository.save(providerPayment);
        walletRepository.save(consumerWallet);
        walletRepository.save(providerWallet);

        return true;
    }

    @Transactional
    public boolean processRefund(Booking booking) {
        User consumer = booking.getConsumer();
        User provider = booking.getProvider();
        BigDecimal amount = booking.getAmount();

        // Get wallets
        UserWallet consumerWallet = walletRepository.findByUser(consumer)
            .orElseThrow(() -> new RuntimeException("Consumer wallet not found"));
        UserWallet providerWallet = walletRepository.findByUser(provider)
            .orElseThrow(() -> new RuntimeException("Provider wallet not found"));

        // Check if provider has sufficient funds
        if (!providerWallet.hasSufficientFunds(amount)) {
            return false;
        }

        // Create refund transactions
        Transaction providerRefund = Transaction.create(
            providerWallet,
            booking,
            TransactionType.REFUND,
            amount,
            "Refund issued for " + booking.getService().getTitle()
        );

        Transaction consumerRefund = Transaction.create(
            consumerWallet,
            booking,
            TransactionType.REFUND_RECEIVED,
            amount,
            "Refund received for " + booking.getService().getTitle()
        );

        // Process transactions
        providerWallet.addTransaction(providerRefund);
        consumerWallet.addTransaction(consumerRefund);

        // Save everything
        transactionRepository.save(providerRefund);
        transactionRepository.save(consumerRefund);
        walletRepository.save(providerWallet);
        walletRepository.save(consumerWallet);

        return true;
    }

    private UserWallet createWallet(User user) {
        UserWallet wallet = UserWallet.createWallet(user);
        return walletRepository.save(wallet);
    }
}
