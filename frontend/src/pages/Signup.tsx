import { SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

const Signup = () => {
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';
  
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <SignUp 
        redirectUrl={redirectTo}
        signInUrl="/sign-in"
      />
    </div>
  );
}

export default Signup;