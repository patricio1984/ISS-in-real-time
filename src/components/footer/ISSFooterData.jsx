import { useEffect } from "react";

const ISSFooterData = () => {
	useEffect(() => {
		// Ensure accessible inline styles on the footer paragraph and its container
		// Reapply styles if some other script overwrites them later.
		const p = document.querySelector(".ISSFooterData .iss-footer-text");
		const container = document.querySelector(".ISSFooterData");
		if (!p || !container) return;

		const applyAccessibleStyles = () => {
			try {
				const isLight = document.body.classList.contains("light-mode");
				// paragraph styles (foreground and background)
				// explicitly set a solid background color so WAVE can calculate contrast
				p.style.color = isLight ? "#111111" : "#ffffff";
				p.style.backgroundColor = isLight ? "#ffffff" : "#242424";
				p.style.opacity = "1";

				// container: ensure it doesn't force a white background on the paragraph
				container.style.backgroundColor = isLight ? "#ffffff" : "#242424";
			} catch (_err) {
				// ignore
			}
		};

		// Apply now
		applyAccessibleStyles();

		// Observe changes to inline styles on both paragraph and container
		const mo = new MutationObserver((records) => {
			for (const r of records) {
				if (r.type === "attributes" && r.attributeName === "style") {
					// Reapply accessible styles immediately to override injected ones
					applyAccessibleStyles();
				}
			}
		});

		mo.observe(p, { attributes: true, attributeFilter: ["style"] });
		mo.observe(container, { attributes: true, attributeFilter: ["style"] });

		// Also reapply when body class changes (theme toggle)
		const bodyObserver = new MutationObserver(() => applyAccessibleStyles());
		bodyObserver.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => {
			mo.disconnect();
			bodyObserver.disconnect();
		};
	}, []);

	return (
		<p className="iss-footer-text">
			The International Space Station (ISS) is a collaborative space laboratory
			orbiting Earth. It serves as a platform for continuous scientific research
			in microgravity, conducted by astronauts from multiple nations. The ISS
			symbolizes international cooperation and technological achievement,
			enabling advancements in physics, biology, medicine, astronomy, and space
			technology.
		</p>
	);
};

export default ISSFooterData;
