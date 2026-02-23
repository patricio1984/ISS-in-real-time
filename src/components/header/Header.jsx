import { useState, useEffect } from "react";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Apply scrolled styles after 50px
			setScrolled(currentScrollY > 50);

			// Hide when scrolling down, show when scrolling up
			if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setHidden(true);
			} else {
				setHidden(false);
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`header ${scrolled ? "header--scrolled" : ""} ${hidden ? "header--hidden" : ""}`}
		>
			<div className="wrapper header-wrapper">
				<div className="header-brand">
					<div className="logo" aria-hidden="true">
						<svg
							width="44"
							height="44"
							viewBox="0 0 100 100"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="mission-patch"
						>
							{/* Outer boundary */}
							<circle
								cx="50"
								cy="50"
								r="48"
								stroke="currentColor"
								strokeWidth="1"
								opacity="0.15"
							/>

							{/* Inner boundary */}
							<circle
								cx="50"
								cy="50"
								r="42"
								stroke="currentColor"
								strokeWidth="1"
								strokeDasharray="2 4"
								opacity="0.3"
							/>

							{/* Central Planet */}
							<circle
								cx="50"
								cy="50"
								r="12"
								stroke="currentColor"
								strokeWidth="1.5"
								opacity="0.8"
							/>

							{/* Trajectory Arc */}
							<path
								d="M 15 50 A 35 15 0 0 1 85 50"
								transform="rotate(-20 50 50)"
								stroke="var(--accent, #60a5fa)"
								strokeWidth="2"
								strokeLinecap="round"
							/>

							{/* ISS Dot */}
							<circle cx="78" cy="40" r="3" fill="var(--accent, #60a5fa)" />
							<circle
								cx="78"
								cy="40"
								r="8"
								fill="var(--accent, #60a5fa)"
								opacity="0.2"
							/>

							{/* Crosshair / Reticle */}
							<path
								d="M 50 25 L 50 35 M 50 65 L 50 75 M 25 50 L 35 50 M 65 50 L 75 50"
								stroke="currentColor"
								strokeWidth="1"
								opacity="0.4"
							/>
						</svg>
					</div>
					<div className="header-text">
						<div className="title">ISS TRACKER</div>
						<div className="subtitle">MISSION CONTROL</div>
					</div>
				</div>
				<div className="header-actions">
					{/* MenuBurger is rendered in App; keep header actions minimal */}
				</div>
			</div>
		</header>
	);
};

export default Header;
