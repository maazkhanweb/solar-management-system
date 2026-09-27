import "./Button.css";

function Button({
    text,
    variant = "primary",
    type = "button",
    onClick,
    className = "",
}) {
    return (
        <button
            type={type}
            className={`button ${variant} ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;