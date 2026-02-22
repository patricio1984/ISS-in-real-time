import AnimatedNumber from "../common/AnimatedNumber";

const FooterData = ({ latitude, longitude, timestamp, velocity, altitude }) => {
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const formattedTimestamp = new Date(timestamp * 1000).toLocaleString(
		"en-US",
		{
			timeZone: userTimeZone,
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZoneName: "short",
		},
	);

	return (
		<div className="telemetry-bar">
			<div className="telemetry-item">
				<span className="telemetry-label">LAT</span>
				<span className="telemetry-value">
					<AnimatedNumber value={latitude} format={(v) => v.toFixed(4)} />°
				</span>
			</div>
			<div className="telemetry-item">
				<span className="telemetry-label">LNG</span>
				<span className="telemetry-value">
					<AnimatedNumber value={longitude} format={(v) => v.toFixed(4)} />°
				</span>
			</div>
			<div className="telemetry-item">
				<span className="telemetry-label">ALT</span>
				<span className="telemetry-value">
					<AnimatedNumber value={altitude} format={(v) => Math.round(v)} /> KM
				</span>
			</div>
			<div className="telemetry-item">
				<span className="telemetry-label">SPD</span>
				<span className="telemetry-value">
					<AnimatedNumber value={velocity} format={(v) => Math.round(v)} /> KM/H
				</span>
			</div>
			<div className="telemetry-item">
				<span className="telemetry-label">SYS TIME</span>
				<span className="telemetry-value">{formattedTimestamp}</span>
			</div>
		</div>
	);
};

export default FooterData;
