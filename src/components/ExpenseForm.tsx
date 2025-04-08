
import React, { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExpenseCategory } from '@/types/budget';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExpenseForm: React.FC = () => {
  const { addExpense } = useBudget();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('necessity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount === '' || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return;
    }

    addExpense({
      amount: Number(amount),
      description,
      category,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('necessity');

    toast({
      title: "Despesa adicionada",
      description: `${description || 'Nova despesa'} adicionada com sucesso.`,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Adicionar Despesa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              required
              className="text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Aluguel, Cinema..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Categoria</Label>
            <RadioGroup 
              value={category} 
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="necessity" id="necessity" />
                <Label htmlFor="necessity" className="font-normal cursor-pointer">
                  <span className="inline-block w-3 h-3 rounded-full bg-necessity mr-2"></span>
                  Necessidades (50%)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="want" id="want" />
                <Label htmlFor="want" className="font-normal cursor-pointer">
                  <span className="inline-block w-3 h-3 rounded-full bg-want mr-2"></span>
                  Desejos (30%)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="saving" id="saving" />
                <Label htmlFor="saving" className="font-normal cursor-pointer">
                  <span className="inline-block w-3 h-3 rounded-full bg-saving mr-2"></span>
                  Poupança (20%)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">Adicionar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
