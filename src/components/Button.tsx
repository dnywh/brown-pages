interface ButtonProps {
  title: string;
}

export default function Button({ title }: ButtonProps) {
  return (
    <button className="bg-teal-300 hover:bg-teal-400 active:bg-teal-500 text-black rounded-xl duration-200">
      {title}
    </button>
  );
}
