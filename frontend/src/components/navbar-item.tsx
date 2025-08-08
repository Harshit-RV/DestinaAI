import { useNavigate } from "react-router-dom";

interface NavBarItemProps {
  title: string;
  path: string;
}

const NavBarItem = ({ title, path }: NavBarItemProps) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(path)} className="flex items-center gap-3 w-full p-3 bg-white text-md font-semibold border hover:bg-gray-50 rounded-lg cursor-pointer">
      <div className="text-gray-600">{title}</div>
    </div>
  );
};

export default NavBarItem;
