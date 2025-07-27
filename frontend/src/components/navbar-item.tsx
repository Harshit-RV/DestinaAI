interface NavBarItemProps {
  title: string;
}

const NavBarItem = ({ title }: NavBarItemProps) => {
  return (
    <div className="flex items-center gap-3 w-full p-3 bg-white text-md font-semibold border hover:bg-gray-50 rounded-lg cursor-pointer">
      <div className="text-gray-600">{title}</div>
    </div>
  );
};

export default NavBarItem;
