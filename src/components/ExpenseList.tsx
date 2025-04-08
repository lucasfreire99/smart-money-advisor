
import React from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListX, Trash2 } from 'lucide-react';
import { ExpenseCategory } from '@/types/budget';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useBudget();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Get category badge color
  const getCategoryBadge = (category: ExpenseCategory) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (category) {
      case 'necessity':
        return `${baseClasses} bg-necessity/20 text-necessity-dark`;
      case 'want':
        return `${baseClasses} bg-want/20 text-want-dark`;
      case 'saving':
        return `${baseClasses} bg-saving/20 text-saving-dark`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'necessity':
        return 'Necessidade';
      case 'want':
        return 'Desejo';
      case 'saving':
        return 'Poupança';
      default:
        return category;
    }
  };

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Últimas Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ListX className="h-12 w-12 mb-2" />
            <p>Nenhuma despesa registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-start gap-3">
                  <div className="font-medium">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {expense.description || 'Sem descrição'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={getCategoryBadge(expense.category)}>
                    {getCategoryLabel(expense.category)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteExpense(expense.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
