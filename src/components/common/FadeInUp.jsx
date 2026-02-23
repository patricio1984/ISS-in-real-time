import React, { useEffect, useRef, useState } from "react";
import "./FadeInUp.css";

const FadeInUp = ({
	children,
	delay = 0,
	threshold = 0.1,
	className = "",
	...props
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold },
		);

		const currentRef = domRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [threshold]);

	return (
		<div
			ref={domRef}
			className={`fade-in-up ${isVisible ? "is-visible" : ""} ${className}`}
			style={{ transitionDelay: `${delay}ms`, ...props.style }}
		>
			{children}
		</div>
	);
};

export default FadeInUp;
