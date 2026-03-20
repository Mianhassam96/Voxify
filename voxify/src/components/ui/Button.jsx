export function Button({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100'
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/40 focus:ring-violet-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 focus:ring-gray-400',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-400 text-white shadow-md shadow-red-200 dark:shadow-red-900/40 focus:ring-red-400',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
