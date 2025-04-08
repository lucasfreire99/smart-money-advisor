
import React, { useState } from 'react';
import { BudgetProvider } from '@/context/BudgetContext';
import BudgetDashboard from '@/components/BudgetDashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import IncomeForm from '@/components/IncomeForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, PlusCircle, ListChecks, DollarSign } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useIsMobile();

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center">Smart Money Advisor</h1>
            <p className="text-center text-muted-foreground mt-1">Método 50-30-20</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 pb-20">
          {isMobile ? (
            // Mobile layout - Tabs
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 py-3">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-xs">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="add" className="flex flex-col items-center gap-1 py-3">
                  <PlusCircle className="h-5 w-5" />
                  <span className="text-xs">Adicionar</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col items-center gap-1 py-3">
                  <ListChecks className="h-5 w-5" />
                  <span className="text-xs">Histórico</span>
                </TabsTrigger>
                <TabsTrigger value="income" className="flex flex-col items-center gap-1 py-3">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs">Renda</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <BudgetDashboard />
              </TabsContent>
              <TabsContent value="add">
                <ExpenseForm />
              </TabsContent>
              <TabsContent value="history">
                <ExpenseList />
              </TabsContent>
              <TabsContent value="income">
                <IncomeForm />
              </TabsContent>
            </Tabs>
          ) : (
            // Desktop layout - Grid
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BudgetDashboard />
                <ExpenseList />
              </div>
              <div className="space-y-6">
                <ExpenseForm />
                <IncomeForm />
              </div>
            </div>
          )}
        </main>
      </div>
    </BudgetProvider>
  );
};

export default App;
