
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControl = ({ currentPage, totalPages, onPageChange, itemName = "elementos" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t mt-4">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Simple logic to show window of pages around current
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                    <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </Button>
                );
            })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControl;
