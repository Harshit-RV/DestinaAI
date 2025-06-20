import { cn } from '@/lib/utils';
import { type ClassValue } from 'clsx';

interface LayoutDivProps {
  children: React.ReactNode;
  className?: ClassValue;
}

const LayoutDiv = ({ children, className }: LayoutDivProps) => {
  return (
    <div className={cn("bg-white rounded-xl w-full p-2 py-4 lg:p-7 lg:my-5 lg:mr-5 flex-col flex gap-3 items-center", className)}>
      {children}
    </div>
  );
};

export default LayoutDiv; 