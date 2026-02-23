const ISSFooterData = () => {
	return (
		<div className="iss-footer-content">
			<div className="iss-footer-glow-line"></div>
			<p className="iss-footer-text">
				The International Space Station (ISS) is a collaborative space
				laboratory orbiting Earth. It serves as a platform for continuous
				scientific research in microgravity, conducted by astronauts from
				multiple nations.
			</p>
			<div className="iss-footer-meta">
				<span>DATA SOURCE: WHERETHEISS.AT</span>
				<span className="meta-divider"></span>
				<span>
					MAP DATA &copy;{" "}
					<a
						href="https://www.openstreetmap.org/copyright"
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: "inherit", textDecoration: "underline" }}
					>
						OPENSTREETMAP
					</a>{" "}
					CONTRIBUTORS, &copy;{" "}
					<a
						href="https://carto.com/attributions"
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: "inherit", textDecoration: "underline" }}
					>
						CARTO
					</a>
				</span>
			</div>
		</div>
	);
};

export default ISSFooterData;
