import React, { useEffect, useState } from "react";
import "./Particles.css";

const Particles = () => {
	const [particles, setParticles] = useState([]);

	useEffect(() => {
		const particleCount = 30;
		const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
			id: i,
			left: `${Math.random() * 100}vw`,
			top: `${Math.random() * 100}vh`,
			animationDuration: `${Math.random() * 10 + 10}s`,
			animationDelay: `${Math.random() * 5}s`,
			size: `${Math.random() * 3 + 1}px`,
			opacity: Math.random() * 0.3 + 0.1,
		}));
		setParticles(newParticles);
	}, []);

	return (
		<div className="particles-container" aria-hidden="true">
			{particles.map((p) => (
				<div
					key={p.id}
					className="particle"
					style={{
						left: p.left,
						top: p.top,
						width: p.size,
						height: p.size,
						animationDuration: p.animationDuration,
						animationDelay: p.animationDelay,
						"--opacity": p.opacity,
					}}
				/>
			))}
		</div>
	);
};

export default Particles;
