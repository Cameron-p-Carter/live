const API_BASE = 'http://localhost:8080/api/wallet';

const walletApi = {
    getWallet: async (userId) => {
        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch wallet');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw error;
        }
    },

    deposit: async (userId, amount) => {
        try {
            const response = await fetch(`${API_BASE}/${userId}/mock-deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to deposit funds');
            }
            return await response.json();
        } catch (error) {
            console.error('Error depositing funds:', error);
            throw error;
        }
    }
};

export default walletApi;
