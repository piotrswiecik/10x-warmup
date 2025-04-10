import {
  BankAccount,
  WithdrawalRequest,
  WithdrawalResult,
  WithdrawalError,
} from "./types";

export function createAccount(account: BankAccount) {
  // Zgodnie ze specyfikacją, sprawdzamy tylko czy konto ma wymagane pola
  if (!account.id || !account.currency || !account.owner) {
    return {
      code: "INVALID_AMOUNT",
      message: "Missing required account fields",
    };
  }

  // Zwracamy utworzone konto
  return account;
}

export function processWithdrawal(
  account: BankAccount,
  withdrawal: WithdrawalRequest
): WithdrawalResult | WithdrawalError {
  // Sprawdzenie czy konto istnieje
  if (withdrawal.accountId !== account.id) {
    return {
      code: "ACCOUNT_NOT_FOUND",
      message: "Account not found",
    };
  }

  // Sprawdzenie czy kwota jest dodatnia
  if (withdrawal.amount <= 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Withdrawal amount must be positive",
    };
  }

  // Sprawdzenie czy waluta się zgadza
  if (withdrawal.currency !== account.currency) {
    return {
      code: "INVALID_AMOUNT",
      message: "Currency mismatch",
    };
  }

  // Sprawdzenie czy jest wystarczające saldo
  if (withdrawal.amount > account.balance) {
    return {
      code: "INSUFFICIENT_FUNDS",
      message: "Insufficient funds for withdrawal",
    };
  }

  // Obliczenie nowego salda
  const remainingBalance = account.balance - withdrawal.amount;
  account.balance = remainingBalance;

  // Utworzenie unikalnego ID transakcji
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  // Zwrócenie udanej transakcji
  return {
    success: true,
    transaction: {
      id: transactionId,
      amount: withdrawal.amount,
      currency: withdrawal.currency,
      timestamp: withdrawal.timestamp,
      remainingBalance,
    },
  };
}
