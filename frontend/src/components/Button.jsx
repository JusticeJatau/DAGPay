import { Link } from "react-router-dom"

const Button = ({isLink = false, to, text, className}) => {
  const handleClick = ()=>{
    alert("Button Clicked")
  }

  const baseStyle = "w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2 mx-auto mb-4 transition-colors"

  return (
    <div>
      {isLink?(
        <Link
          to={to}
          className={`${baseStyle} ${className}`}
        >
          {text}
        </Link>
      ):(
        <button
          className={`${baseStyle} ${className}`}
          onClick={handleClick}
        >
          {text}
        </button>
      )}
    </div>
  )
}

export default Button
