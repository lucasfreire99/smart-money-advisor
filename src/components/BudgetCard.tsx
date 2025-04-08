
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from './CircularProgress';
import { ExpenseCategory } from '@/types/budget';

interface BudgetCardProps {
  title: string;
  spent: number;
  allocated: number;
  remaining: number;
  category: ExpenseCategory;
}

const getCategoryColor = (category: ExpenseCategory): string => {
  switch (category) {
    case 'necessity':
      return '#2563eb'; // blue-600
    case 'want':
      return '#f97316'; // orange-500
    case 'saving':
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
};

const BudgetCard: React.FC<BudgetCardProps> = ({
  title,
  spent,
  allocated,
  remaining,
  category
}) => {
  // Calculate percentage spent
  const percentageSpent = Math.min((spent / allocated) * 100, 100);
  
  const color = getCategoryColor(category);
  
  // Format currency amounts
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0">
        <CircularProgress 
          percentage={percentageSpent} 
          color={color} 
          size={100} 
          strokeWidth={10}
          className="mb-4"
        />
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full text-sm">
          <div className="text-muted-foreground">Limite:</div>
          <div className="text-right font-medium">{formatCurrency(allocated)}</div>
          
          <div className="text-muted-foreground">Gasto:</div>
          <div className="text-right font-medium">{formatCurrency(spent)}</div>
          
          <div className="text-muted-foreground">Restante:</div>
          <div className="text-right font-medium">{formatCurrency(remaining)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
