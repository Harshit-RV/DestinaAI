import { Button } from "@/components/ui/button";

interface PreferenceBoxProps {
  title: string;
  selected: boolean;
  addItem: (item: string) => void;
}

const PreferenceBox = ({ title, selected, addItem }: PreferenceBoxProps) => {
  return (
    <Button 
      onClick={() => addItem(title)} 
      variant={'outline'} 
      size="sm"
      className={`bg-gray-50 hover:bg-gray-100 border-2 hover:cursor-pointer transition-colors ${selected ? "border-gray-700 bg-gray-200" : "border-gray-300"} `}
    >
      {title}
    </Button>
  );
};

export default PreferenceBox; 