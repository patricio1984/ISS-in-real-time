import { DarkModeToggle } from "@anatoliygatt/dark-mode-toggle";
import { useEffect, useRef, useState } from "react";
import { slide as Menu } from "react-burger-menu";

const MenuBurger = () => {
	const [mode, setMode] = useState("dark");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const overlayRef = useRef(null);
	const burgerButtonId = "react-burger-cross-btn";

	const handleOverlayClick = (event) => {
		const burgerButton = document.querySelector(`#${burgerButtonId}`);
		if (event.target === overlayRef.current && burgerButton) {
			burgerButton.click();
		}
	};

	const _handleOverlayKeyUp = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			handleOverlayClick(event);
		}
	};

	useEffect(() => {
		const menuWrap = document.querySelector(".bm-menu-wrap");
		const observer = new MutationObserver(() => {
			const isHidden = menuWrap.getAttribute("aria-hidden") === "true";
			setIsMenuOpen(!isHidden);
		});

		observer.observe(menuWrap, { attributes: true });
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (mode !== "dark") {
			document.body.classList.add("light-mode");
		} else {
			document.body.classList.remove("light-mode");
		}
	}, [mode]);

	useEffect(() => {
		const burgerButton = document.getElementById("react-burger-cross-btn");

		if (burgerButton) {
			if (isMenuOpen) {
				burgerButton.classList.add("burger-button--hide");
			} else {
				setTimeout(() => {
					burgerButton.classList.remove("burger-button--hide");
				}, 500);
			}
		}
	}, [isMenuOpen]);

	return (
		<>
			{isMenuOpen && (
				<button
					className={`overlay ${isMenuOpen ? "overlay-open" : ""}`}
					ref={overlayRef}
					onClick={handleOverlayClick}
					onKeyUp={_handleOverlayKeyUp}
					type="button"
					aria-label="Overlay"
				/>
			)}
			<div className="container">
				<Menu right noOverlay>
					<ul>
						<li>
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
								onChange={(mode) => {
									setMode(mode);
								}}
							/>
						</li>

						<li className="menulist">
							<a
								className="menuitem"
								href="https://www.linkedin.com/in/patriciomainero/"
								target="_blank"
								rel="noopener noreferrer"
							>
								About me
							</a>
						</li>

						<li className="menulist">
							<a
								className="menuitem"
								href="https://patricio1984.github.io/port/"
								target="_blank"
								rel="noopener noreferrer"
							>
								My portfolio page
							</a>
						</li>

						<li className="menulist">
							<a
								className="menuitem"
								href="https://github.com/patricio1984"
								target="_blank"
								rel="noopener noreferrer"
							>
								My Github repositories
							</a>
						</li>
					</ul>
				</Menu>
			</div>
		</>
	);
};

export default MenuBurger;
