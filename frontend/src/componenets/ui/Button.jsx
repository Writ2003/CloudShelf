import clsx from 'clsx';

export function Button({
  children,
  type = "button",
  variant = "default", // options: default, outline, ghost
  size = "md",         // options: sm, md, lg
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100",
    ghost: "text-blue-600 hover:bg-blue-100",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-base",
    lg: "px-4 py-2 text-lg",
  };

  return (
    <button
      type={type}
      className={clsx(base, variants[variant], sizes[size], className, 'cursor-pointer')}
      {...props}
    >
      {children}
    </button>
  );
}
