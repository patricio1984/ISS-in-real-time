import { useRef, useState } from "react";
import "./MagneticButton.css";

const MagneticButton = ({ children, className = "", onClick, ...props }) => {
	const buttonRef = useRef(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e) => {
		if (!buttonRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			buttonRef.current.getBoundingClientRect();

		const x = (clientX - (left + width / 2)) * 0.3;
		const y = (clientY - (top + height / 2)) * 0.3;

		setPosition({ x, y });
	};

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0 });
	};

	return (
		<button
			ref={buttonRef}
			className={`magnetic-button ${className}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
				...props.style,
			}}
			{...props}
		>
			{children}
		</button>
	);
};

export default MagneticButton;
