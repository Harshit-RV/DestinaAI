import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

const Signin = () => {
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';
  
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <SignIn
        redirectUrl={redirectTo}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
export default Signin;