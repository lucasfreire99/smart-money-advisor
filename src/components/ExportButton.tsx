
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import { exportExpensesToExcel } from '@/utils/exportUtils';
import { useToast } from "@/hooks/use-toast";

const ExportButton: React.FC = () => {
  const { expenses, summary } = useBudget();
  const { toast } = useToast();

  const handleExport = () => {
    try {
      exportExpensesToExcel(expenses, summary);
      toast({
        title: "Exportação concluída",
        description: "Seus dados foram exportados para Excel com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      variant="outline" 
      className="gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Exportar para Excel
    </Button>
  );
};

export default ExportButton;
