
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, BudgetSummary, ExpenseCategory } from '../types/budget';

// Dummy data for initial state
const INITIAL_MONTHLY_INCOME = 5000;
const DEFAULT_EXPENSES: Expense[] = [
  {
    id: uuidv4(),
    amount: 1200,
    category: 'necessity',
    description: 'Rent',
    date: new Date(2025, 3, 1),
  },
  {
    id: uuidv4(),
    amount: 300,
    category: 'necessity',
    description: 'Groceries',
    date: new Date(2025, 3, 5),
  },
  {
    id: uuidv4(),
    amount: 150,
    category: 'want',
    description: 'Dining out',
    date: new Date(2025, 3, 7),
  },
  {
    id: uuidv4(),
    amount: 500,
    category: 'saving',
    description: 'Emergency fund',
    date: new Date(2025, 3, 10),
  },
];

// Define action types
type Action =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_INCOME'; payload: number };

// Define context state
interface BudgetState {
  monthlyIncome: number;
  expenses: Expense[];
  summary: BudgetSummary;
}

// Define context type
interface BudgetContextType extends BudgetState {
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  updateIncome: (income: number) => void;
}

// Create context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Calculate budget summary
const calculateSummary = (income: number, expenses: Expense[]): BudgetSummary => {
  // Calculate allocations based on 50-30-20 rule
  const allocations = {
    necessity: income * 0.5, // 50% for necessities
    want: income * 0.3,      // 30% for wants
    saving: income * 0.2,    // 20% for savings
  };

  // Calculate spent amounts by category
  const spent = {
    necessity: expenses
      .filter(exp => exp.category === 'necessity')
      .reduce((total, exp) => total + exp.amount, 0),
    want: expenses
      .filter(exp => exp.category === 'want')
      .reduce((total, exp) => total + exp.amount, 0),
    saving: expenses
      .filter(exp => exp.category === 'saving')
      .reduce((total, exp) => total + exp.amount, 0),
  };

  // Calculate remaining amounts
  const remaining = {
    necessity: allocations.necessity - spent.necessity,
    want: allocations.want - spent.want,
    saving: allocations.saving - spent.saving,
  };

  // Calculate totals
  const totalSpent = spent.necessity + spent.want + spent.saving;
  const totalRemaining = income - totalSpent;

  return {
    totalIncome: income,
    allocations,
    spent,
    remaining,
    totalSpent,
    totalRemaining,
  };
};

// Reducer function
const budgetReducer = (state: BudgetState, action: Action): BudgetState => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense = {
        ...action.payload,
        id: uuidv4(),
        date: new Date(),
      };
      const updatedExpenses = [...state.expenses, newExpense];
      return {
        ...state,
        expenses: updatedExpenses,
        summary: calculateSummary(state.monthlyIncome, updatedExpenses),
      };
    }
    case 'DELETE_EXPENSE': {
      const updatedExpenses = state.expenses.filter(exp => exp.id !== action.payload);
      return {
        ...state,
        expenses: updatedExpenses,
        summary: calculateSummary(state.monthlyIncome, updatedExpenses),
      };
    }
    case 'UPDATE_INCOME': {
      return {
        ...state,
        monthlyIncome: action.payload,
        summary: calculateSummary(action.payload, state.expenses),
      };
    }
    default:
      return state;
  }
};

// Load state from localStorage
const loadState = (): BudgetState => {
  try {
    const savedState = localStorage.getItem('budgetState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Convert date strings back to Date objects
      const expenses = parsedState.expenses.map((exp: any) => ({
        ...exp,
        date: new Date(exp.date),
      }));
      return {
        ...parsedState,
        expenses,
        summary: calculateSummary(parsedState.monthlyIncome, expenses),
      };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  
  // Return default state if localStorage is empty or invalid
  return {
    monthlyIncome: INITIAL_MONTHLY_INCOME,
    expenses: DEFAULT_EXPENSES,
    summary: calculateSummary(INITIAL_MONTHLY_INCOME, DEFAULT_EXPENSES),
  };
};

// Provider component
export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, loadState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetState', JSON.stringify(state));
  }, [state]);

  // Context actions
  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const updateIncome = (income: number) => {
    dispatch({ type: 'UPDATE_INCOME', payload: income });
  };

  return (
    <BudgetContext.Provider
      value={{
        ...state,
        addExpense,
        deleteExpense,
        updateIncome,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook for using the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
