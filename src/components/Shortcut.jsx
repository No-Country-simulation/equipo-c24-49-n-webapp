import Image from "next/image";

const Shortcut = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
      <Image src={icon} alt={text} width={16} height={20} className="h-auto object-contain" />
      <span className="text-secondary-content text-[16px]">{text}</span>
    </div>
  );
};

export default Shortcut;
