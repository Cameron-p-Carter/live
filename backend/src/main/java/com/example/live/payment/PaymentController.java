package com.example.live.payment;

import com.example.live.payment.dto.MockDepositRequest;
import com.example.live.payment.dto.TransactionResponse;
import com.example.live.payment.dto.WalletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<WalletResponse> getWallet(@PathVariable Long userId) {
        WalletResponse wallet = paymentService.getWallet(userId);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/{userId}/mock-deposit")
    public ResponseEntity<TransactionResponse> mockDeposit(
            @PathVariable Long userId,
            @RequestBody MockDepositRequest request) {
        try {
            request.validate();
            TransactionResponse transaction = paymentService.mockDeposit(userId, request.getAmount());
            return ResponseEntity.ok(transaction);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
