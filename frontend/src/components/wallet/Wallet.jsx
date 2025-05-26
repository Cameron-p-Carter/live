import React, { useState, useEffect } from 'react';
import walletApi from '../../services/walletApi';
import './wallet.css';

const Wallet = ({ userId, userType }) => {
    const [wallet, setWallet] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadWallet();
    }, [userId]);

    const loadWallet = async () => {
        try {
            setLoading(true);
            const walletData = await walletApi.getWallet(userId);
            setWallet(walletData);
            setError('');
        } catch (err) {
            setError('Failed to load wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setError('');

        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            await walletApi.deposit(userId, parseFloat(depositAmount));
            setDepositAmount('');
            await loadWallet(); // Reload wallet to show updated balance
        } catch (err) {
            setError('Failed to deposit funds');
        }
    };

    const formatDateTime = (dateTimeStr) => {
        // Create a date object in UTC
        const utcDate = new Date(dateTimeStr);
        
        // Convert to Sydney time by adding the offset
        const sydneyOffset = 10; // Sydney is UTC+10
        const sydneyDate = new Date(utcDate.getTime() + (sydneyOffset * 60 * 60 * 1000));
        
        // Format the date
        const formatter = new Intl.DateTimeFormat('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Australia/Sydney'
        });
        
        return formatter.format(sydneyDate);
    };

    const getTransactionSign = (transaction) => {
        if (userType === 'PROVIDER') {
            switch (transaction.type) {
                case 'PAYMENT_RECEIVED':
                    return '+';
                case 'REFUND':
                    return '-';
                default:
                    return '+';
            }
        } else {
            // For consumers
            switch (transaction.type) {
                case 'PAYMENT':
                    return '-';
                case 'REFUND_RECEIVED':
                case 'DEPOSIT':
                    return '+';
                default:
                    return '+';
            }
        }
    };

    const isPositiveTransaction = (transaction) => {
        if (userType === 'PROVIDER') {
            return transaction.type === 'PAYMENT_RECEIVED';
        } else {
            return transaction.type === 'REFUND_RECEIVED' || transaction.type === 'DEPOSIT';
        }
    };

    if (loading) {
        return <div className="loading-message">Loading wallet...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!wallet) {
        return <div className="error-message">Wallet not found</div>;
    }

    return (
        <div className="wallet-container">
            <div className="wallet-header">
                <h2>My Wallet</h2>
                <div className="wallet-balance">
                    <span className="balance-label">Current Balance:</span>
                    <span className="balance-amount">${wallet.balance}</span>
                </div>
            </div>

            {userType === 'CONSUMER' && (
                <div className="deposit-section">
                    <h3>Add Funds</h3>
                    <form onSubmit={handleDeposit} className="deposit-form">
                        <div className="form-group">
                            <label>Amount:</label>
                            <div className="input-group">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="deposit-button">
                            Deposit
                        </button>
                    </form>
                </div>
            )}

            <div className="transactions-section">
                <h3>Transaction History</h3>
                {wallet.recentTransactions.length === 0 ? (
                    <p className="no-transactions">No transactions yet</p>
                ) : (
                    <div className="transactions-list">
                        {wallet.recentTransactions.map(transaction => (
                            <div key={transaction.id} className="transaction-item">
                                <div className="transaction-info">
                                    <span className="transaction-type">
                                        {transaction.type.replace(/_/g, ' ')}
                                    </span>
                                    <span className="transaction-date">
                                        {formatDateTime(transaction.createdAt)}
                                    </span>
                                </div>
                                <div className="transaction-amount">
                                    <span className={`amount ${isPositiveTransaction(transaction) ? 'positive' : 'negative'}`}>
                                        {getTransactionSign(transaction)}${transaction.amount}
                                    </span>
                                </div>
                                <div className="transaction-description">
                                    {transaction.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
