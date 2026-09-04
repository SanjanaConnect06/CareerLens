function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
}) {
  const baseStyle =
    "rounded-lg px-5 py-2.5 font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "border border-slate-700 text-white hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;