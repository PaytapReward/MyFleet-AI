import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Filter } from "lucide-react";
import { TransactionFilters as ITransactionFilters } from "@/types/transaction";
import { TransactionFilters } from "@/components/TransactionFilters";

interface MobileFilterBarProps {
  initialFilters?: ITransactionFilters;
  onFiltersChange: (filters: ITransactionFilters) => void;
}

export const MobileFilterBar = ({ initialFilters, onFiltersChange }: MobileFilterBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-30 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b mb-4">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Refine results</div>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 touch-target">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-safe">
            <DrawerHeader>
              <DrawerTitle>Filter Transactions</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <TransactionFilters initialFilters={initialFilters} onFiltersChange={onFiltersChange} />
            </div>
            <DrawerFooter className="px-4 pb-4">
              <DrawerClose asChild>
                <Button className="w-full">Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
