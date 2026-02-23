import { DarkModeToggle } from "@anatoliygatt/dark-mode-toggle";
import { useEffect, useState } from "react";
import "./MenuBurger.css";

const MenuBurger = () => {
	const [mode, setMode] = useState("dark");
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		if (mode !== "dark") {
			document.body.classList.add("light-mode");
		} else {
			document.body.classList.remove("light-mode");
		}
	}, [mode]);

	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	return (
		<>
			<button
				className={`menu-toggle-btn ${menuOpen ? "is-open" : ""}`}
				type="button"
				aria-label={menuOpen ? "Close menu" : "Open menu"}
				aria-expanded={menuOpen}
				onClick={() => setMenuOpen((v) => !v)}
			>
				<span className="menu-bar top-bar" />
				<span className="menu-bar middle-bar" />
				<span className="menu-bar bottom-bar" />
			</button>

			<div className={`menu-overlay ${menuOpen ? "is-open" : ""}`}>
				<div className="menu-overlay-bg"></div>
				<nav className="menu-content">
					<ul className="menu-list">
						<li className="menu-item-wrapper" style={{ "--delay": "0.1s" }}>
							<DarkModeToggle
								ariaLabel="Toggle color scheme"
								mode={mode}
								dark="Dark"
								light="Light"
								size="md"
								inactiveLabelColor="#CCCCCC"
								activeLabelColor="#333333"
								activeTrackColor="#e2e8f0"
								activeTrackColorOnHover="#e2e8f0"
								activeTrackColorOnActive="#cbd5e1"
								inactiveTrackColor="#334155"
								inactiveTrackColorOnHover="#1e293b"
								inactiveTrackColorOnActive="#0f172a"
								inactiveThumbColor="#e2e8f0"
								activeThumbColor="#1e293b"
								onChange={(mode) => setMode(mode)}
							/>
						</li>

						<li className="menu-item-wrapper" style={{ "--delay": "0.2s" }}>
							<a
								className="menu-link"
								href="https://www.linkedin.com/in/patriciomainero/"
								target="_blank"
								rel="noopener noreferrer"
							>
								About me
							</a>
						</li>

						<li className="menu-item-wrapper" style={{ "--delay": "0.3s" }}>
							<a
								className="menu-link"
								href="https://patricio1984.github.io/port/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Portfolio
							</a>
						</li>

						<li className="menu-item-wrapper" style={{ "--delay": "0.4s" }}>
							<a
								className="menu-link"
								href="https://github.com/patricio1984"
								target="_blank"
								rel="noopener noreferrer"
							>
								Github
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
};

export default MenuBurger;
