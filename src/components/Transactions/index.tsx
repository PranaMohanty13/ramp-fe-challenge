import { useState, useEffect, useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions: initialTransactions }) => {
  const [transactions, setTransactions] = useState(initialTransactions)
  const { fetchWithoutCache, loading } = useCustomFetch()

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })

      setTransactions((prevTransactions) =>
        prevTransactions
          ? prevTransactions.map((transaction) =>
              transaction.id === transactionId ? { ...transaction, approved: newValue } : transaction
            )
          : null
      )
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
