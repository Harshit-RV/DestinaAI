import { cn } from '@/lib/utils';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { type ClassValue } from 'clsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutDivProps {
  children: React.ReactNode;
  className?: ClassValue;
}

const LayoutDiv = ({ children, className }: LayoutDivProps) => {
  return (
    <>
      <div className={cn("bg-white rounded-xl w-full p-2 py-4 md:p-7 lg:my-5 lg:mr-5 flex-col flex gap-3 items-center", className)}>
        {children}
      </div>
    </>
  );
};

const RedirectToSignIn = () => {

  const navigate = useNavigate();

  const redirect = async () => {
    await setTimeout(() => navigate("/sign-in"), 2000)
  }

  useEffect(() => {
    redirect();
  }, []);

  return (
    <>Unauthenticated! Redirecting to sign in page..</>
  )
}

export default LayoutDiv; 