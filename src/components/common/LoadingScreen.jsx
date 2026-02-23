import { useState, useEffect } from "react";
import "./LoadingScreen.css";

const messages = [
	"Initializing telemetry...",
	"Syncing orbital data...",
	"Establishing satellite link...",
	"Signal locked.",
];

const LoadingScreen = ({ isLoading }) => {
	const [messageIndex, setMessageIndex] = useState(0);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [isUnmounted, setIsUnmounted] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			// Add an artificial delay so the user can admire the loading screen
			const delayTimer = setTimeout(() => {
				setMessageIndex(messages.length - 1);
				setIsFadingOut(true);

				setTimeout(() => {
					setIsUnmounted(true);
				}, 1200); // Match CSS transition duration
			}, 2800); // 2.8 seconds delay before fading out

			return () => clearTimeout(delayTimer);
		}
	}, [isLoading]);

	useEffect(() => {
		if (!isFadingOut) {
			const interval = setInterval(() => {
				setMessageIndex((prev) => {
					if (prev < messages.length - 2) {
						return prev + 1;
					}
					return prev;
				});
			}, 800);
			return () => clearInterval(interval);
		}
	}, [isFadingOut]);

	useEffect(() => {
		const root = document.getElementById("root");
		
		const preventScroll = (e) => {
			e.preventDefault();
		};

		if (!isUnmounted) {
			// Bloquear scroll en html, body y root
			document.documentElement.style.overflow = "hidden";
			document.body.style.overflow = "hidden";
			if (root) root.style.overflow = "hidden";
			
			// Prevenir eventos de scroll por rueda o táctil
			window.addEventListener("wheel", preventScroll, { passive: false });
			window.addEventListener("touchmove", preventScroll, { passive: false });
		} else {
			// Restaurar
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
			if (root) root.style.overflow = "";
			
			window.removeEventListener("wheel", preventScroll);
			window.removeEventListener("touchmove", preventScroll);
		}

		return () => {
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
			if (root) root.style.overflow = "";
			
			window.removeEventListener("wheel", preventScroll);
			window.removeEventListener("touchmove", preventScroll);
		};
	}, [isUnmounted]);

	if (isUnmounted) return null;

	return (
		<div className={`loading-screen ${isFadingOut ? "fade-out" : ""}`}>
			<div className="loading-content">
				<div className="loading-logo">
					<svg
						width="80"
						height="80"
						viewBox="0 0 100 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mission-patch"
					>
						<circle
							cx="50"
							cy="50"
							r="48"
							stroke="currentColor"
							strokeWidth="1"
							opacity="0.15"
						/>
						<circle
							cx="50"
							cy="50"
							r="42"
							stroke="currentColor"
							strokeWidth="1"
							strokeDasharray="2 4"
							opacity="0.3"
						/>
						<circle
							cx="50"
							cy="50"
							r="12"
							stroke="currentColor"
							strokeWidth="1.5"
							opacity="0.8"
						/>
						<path
							d="M 15 50 A 35 15 0 0 1 85 50"
							transform="rotate(-20 50 50)"
							stroke="var(--accent, #60a5fa)"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<circle cx="78" cy="40" r="3" fill="var(--accent, #60a5fa)" />
						<circle
							cx="78"
							cy="40"
							r="8"
							fill="var(--accent, #60a5fa)"
							opacity="0.2"
						/>
						<path
							d="M 50 25 L 50 35 M 50 65 L 50 75 M 25 50 L 35 50 M 65 50 L 75 50"
							stroke="currentColor"
							strokeWidth="1"
							opacity="0.4"
						/>
					</svg>
				</div>
				<div className="loading-title">ISS TRACKER</div>
				<div className="loading-subtitle">MISSION CONTROL</div>

				<div className="loading-scanner">
					<div className="scanner-line"></div>
				</div>

				<div className="loading-message">{messages[messageIndex]}</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
