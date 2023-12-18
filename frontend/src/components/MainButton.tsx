interface MainButtonProps {
  title: string;
  containerStyles: string;
  iconRight?: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}

export default function MainButton(props: MainButtonProps) {
  const { title, containerStyles, iconRight, type, onClick } = props;
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`inline-flex items-center text-base ${containerStyles}`}
    >
      {title}

      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
}
