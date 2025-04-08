
import React from 'react';
import { useBudget } from '@/context/BudgetContext';
import BudgetCard from './BudgetCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const BudgetDashboard: React.FC = () => {
  const { summary } = useBudget();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  // Data for pie chart
  const pieData = [
    { name: 'Necessidades', value: summary.spent.necessity, color: '#2563eb' },
    { name: 'Desejos', value: summary.spent.want, color: '#f97316' },
    { name: 'Poupança', value: summary.spent.saving, color: '#16a34a' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Renda Mensal</p>
              <h2 className="text-2xl font-bold">{formatCurrency(summary.totalIncome)}</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <h2 className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponível</p>
              <h2 className="text-2xl font-bold">{formatCurrency(summary.totalRemaining)}</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <h2 className="text-2xl font-bold">Abril 2025</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <BudgetCard
          title="Necessidades (50%)"
          spent={summary.spent.necessity}
          allocated={summary.allocations.necessity}
          remaining={summary.remaining.necessity}
          category="necessity"
        />
        <BudgetCard
          title="Desejos (30%)"
          spent={summary.spent.want}
          allocated={summary.allocations.want}
          remaining={summary.remaining.want}
          category="want"
        />
        <BudgetCard
          title="Poupança (20%)"
          spent={summary.spent.saving}
          allocated={summary.allocations.saving}
          remaining={summary.remaining.saving}
          category="saving"
        />
      </div>

      {pieData.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetDashboard;
