
import React, { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IncomeForm: React.FC = () => {
  const { monthlyIncome, updateIncome } = useBudget();
  const { toast } = useToast();
  
  const [income, setIncome] = useState<number | ''>(monthlyIncome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (income === '' || income <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return;
    }

    updateIncome(Number(income));

    toast({
      title: "Renda atualizada",
      description: "Sua renda mensal foi atualizada com sucesso.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Renda Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Valor da renda líquida (R$)</Label>
            <Input
              id="income"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={income}
              onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : '')}
              required
              className="text-lg"
            />
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            <p>Método 50-30-20:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>50% para necessidades básicas</li>
              <li>30% para desejos pessoais</li>
              <li>20% para poupança e investimentos</li>
            </ul>
          </div>

          <Button type="submit" className="w-full">Atualizar Renda</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;
