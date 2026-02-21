const FooterData = ({ latitude, longitude, timestamp, velocity, altitude }) => {
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const formattedTimestamp = new Date(timestamp * 1000).toLocaleString(
		"es-ES",
		{
			timeZone: userTimeZone,
			timeZoneName: "short",
		},
	);

	return (
		<div className="footer-data">
			<ul className="footer-data__list">
				<li>
					<h2 className="footer-data__list__title">Latitude</h2>
					<p className="footer-data__list__data">{latitude}</p>
				</li>
				<li>
					<h2 className="footer-data__list__title">Longitude</h2>
					<p className="footer-data__list__data">{longitude}</p>
				</li>
				<li>
					<h2 className="footer-data__list__title">Date</h2>
					<p className="footer-data__list__data">{formattedTimestamp}</p>
				</li>
				<li>
					<h2 className="footer-data__list__title">Velocity</h2>
					<p className="footer-data__list__data">{velocity} Kph</p>
				</li>
				<li>
					<h2 className="footer-data__list__title">Altitude</h2>
					<p className="footer-data__list__data">{altitude} Km</p>
				</li>
			</ul>
		</div>
	);
};

export default FooterData;
