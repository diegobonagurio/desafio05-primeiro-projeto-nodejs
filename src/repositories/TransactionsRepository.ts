import Transaction from '../models/Transaction';
import { response } from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CretateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculator(operator: Type): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((acc, tr) => acc + tr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculator(Type.INCOME);
    const outcome = this.calculator(Type.OUTCOME);
    const total = income - outcome;
    const balance: Balance = { income, outcome, total }

    return balance;
  }

  public create({ title, value, type}: CretateTransaction): Transaction  {
    const transaction = new Transaction({ title, value, type});

    const { total } = this.getBalance();
    if(type === Type.OUTCOME && total < value ) {
      throw Error('Error');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
