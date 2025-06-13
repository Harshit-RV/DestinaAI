import { cn } from '@/lib/utils';
import { type ClassValue } from 'clsx';

interface LayoutDivProps {
  children: React.ReactNode;
  className?: ClassValue;
}

const LayoutDiv = ({ children, className }: LayoutDivProps) => {
  return (
    <div className={cn("bg-white rounded-xl w-full p-7 my-5 mr-5 flex-col flex gap-3 items-center", className)}>
      {children}
    </div>
  );
};

export default LayoutDiv; 