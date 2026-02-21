import React, { useEffect, useMemo, useState } from "react";
import {
	CircleMarker,
	MapContainer,
	Marker,
	Polyline,
	TileLayer,
	Tooltip,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as satellite from "satellite.js";
import iconUrl from "../../assets/ISS-marker.webp";
import CenterMap from "./CenterMap";

// ControlsOverlay must be at module scope to avoid recreating it each render
const ControlsOverlay = ({ asideId }) => {
	const map = useMap();
	useEffect(() => {
		const el = document.getElementById(asideId);
		if (!el || !map) return;

		const disable = () => {
			try {
				map.dragging?.disable();
				map.scrollWheelZoom?.disable();
				map.doubleClickZoom?.disable();
				map.boxZoom?.disable();
				map.touchZoom?.disable();
			} catch (_e) {
				// ignore
			}
		};

		const enable = () => {
			try {
				map.dragging?.enable();
				map.scrollWheelZoom?.enable();
				map.doubleClickZoom?.enable();
				map.boxZoom?.enable();
				map.touchZoom?.enable();
			} catch (_e) {
				// ignore
			}
		};

		el.addEventListener("mouseenter", disable);
		el.addEventListener("mouseleave", enable);
		el.addEventListener("pointerdown", disable);
		el.addEventListener("pointerup", enable);

		return () => {
			el.removeEventListener("mouseenter", disable);
			el.removeEventListener("mouseleave", enable);
			el.removeEventListener("pointerdown", disable);
			el.removeEventListener("pointerup", enable);
		};
	}, [map, asideId]);

	return null;
};

const ISSMap = ({ latitude, longitude, tleLine1, tleLine2 }) => {
	const customIcon = L.icon({
		iconUrl: iconUrl,
		iconSize: [60, 60],
		iconAnchor: [30, 60],
	});

	const [positions, setPositions] = useState([]);
	const [predictionMinutes, setPredictionMinutes] = useState(90);
	const [numSegments, setNumSegments] = useState(120);
	const [pastMinutes, _setPastMinutes] = useState(90);
	const [isLightMode, setIsLightMode] = useState(
		() =>
			typeof document !== "undefined" &&
			document.body.classList.contains("light-mode"),
	);

	useEffect(() => {
		const updatePolyline = () => {
			if (!tleLine1 || !tleLine2) return;

			const line1 = tleLine1.trim();
			const line2 = tleLine2.trim();
			const satrec = satellite.twoline2satrec(line1, line2);

			const futureSegments = Math.max(
				4,
				Math.floor(
					(numSegments * predictionMinutes) / (predictionMinutes + pastMinutes),
				),
			);
			const pastSegments = Math.max(
				4,
				Math.floor(
					(numSegments * pastMinutes) / (predictionMinutes + pastMinutes),
				),
			);

			const now = Date.now();
			const stepFutureMs = (predictionMinutes * 60 * 1000) / futureSegments;
			const stepPastMs = (pastMinutes * 60 * 1000) / pastSegments;

			const pastPts = [];
			for (let i = pastSegments; i > 0; i--) {
				const when = new Date(now - i * stepPastMs);
				const pv = satellite.propagate(satrec, when);
				const positionEci = pv.position;
				if (!positionEci) continue;
				const gmst = satellite.gstime(when);
				const positionGd = satellite.eciToGeodetic(positionEci, gmst);
				const lat = satellite.degreesLat(positionGd.latitude);
				const lon = satellite.degreesLong(positionGd.longitude);
				const normalizedLon = ((lon + 180) % 360) - 180;
				pastPts.push({ lat, lon: normalizedLon, time: when, isFuture: false });
			}

			// current point
			const currentWhen = new Date(now);
			const currPv = satellite.propagate(satrec, currentWhen);
			const currPos = currPv.position;
			const merged = [];
			if (currPos) {
				const gmst = satellite.gstime(currentWhen);
				const positionGd = satellite.eciToGeodetic(currPos, gmst);
				const lat = satellite.degreesLat(positionGd.latitude);
				const lon = satellite.degreesLong(positionGd.longitude);
				const normalizedLon = ((lon + 180) % 360) - 180;
				merged.push({
					lat,
					lon: normalizedLon,
					time: currentWhen,
					isFuture: false,
				});
			}

			const futurePts = [];
			for (let i = 1; i <= futureSegments; i++) {
				const when = new Date(now + i * stepFutureMs);
				const pv = satellite.propagate(satrec, when);
				const positionEci = pv.position;
				if (!positionEci) continue;
				const gmst = satellite.gstime(when);
				const positionGd = satellite.eciToGeodetic(positionEci, gmst);
				const lat = satellite.degreesLat(positionGd.latitude);
				const lon = satellite.degreesLong(positionGd.longitude);
				const normalizedLon = ((lon + 180) % 360) - 180;
				futurePts.push({ lat, lon: normalizedLon, time: when, isFuture: true });
			}

			// merge past + current + future
			const all = [...pastPts, ...merged, ...futurePts];
			setPositions(all);
		};

		updatePolyline();
	}, [tleLine1, tleLine2, numSegments, predictionMinutes, pastMinutes]);

	useEffect(() => {
		if (typeof document === "undefined") return;
		const obs = new MutationObserver(() => {
			setIsLightMode(document.body.classList.contains("light-mode"));
		});
		obs.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => obs.disconnect();
	}, []);

	const parsedPositions = positions.map((p) => [
		parseFloat(p.lat),
		parseFloat(p.lon),
	]);

	const splitSegments = (pts) => {
		if (!pts || pts.length === 0) return [];
		const segments = [];
		let current = [pts[0]];

		for (let i = 1; i < pts.length; i++) {
			const [_latPrev, lonPrev] = pts[i - 1];
			const [lat, lon] = pts[i];
			const diff = Math.abs(lon - lonPrev);
			if (diff > 180) {
				// discontinuity across antimeridian: start new segment
				segments.push(current);
				current = [[lat, lon]];
			} else {
				current.push([lat, lon]);
			}
		}

		if (current.length) segments.push(current);
		return segments;
	};

	const segments = splitSegments(parsedPositions);
	const { segmentTimes, segmentHasFuture } = useMemo(() => {
		const timesArr = [];
		const hasFutureArr = [];
		let idx = 0;
		for (const seg of segments) {
			const times = [];
			let anyFuture = false;
			for (let i = 0; i < seg.length; i++) {
				const p = positions[idx++];
				times.push(p?.time ?? null);
				if (p?.isFuture) anyFuture = true;
			}
			timesArr.push(times);
			hasFutureArr.push(anyFuture);
		}
		return { segmentTimes: timesArr, segmentHasFuture: hasFutureArr };
	}, [segments, positions]);

	return (
		<>
			{latitude && longitude && (
				<MapContainer
					className="map-container"
					center={[latitude, longitude]}
					zoom={3}
					worldCopyJump={false}
					maxBounds={[
						[-90, -180],
						[90, 180],
					]}
					maxBoundsViscosity={1}
				>
					<TileLayer
						url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
						detectRetina={true}
						noWrap={true}
					/>
					<Marker position={[latitude, longitude]} icon={customIcon} />
					{segments.map((seg, idx) => {
						if (!(seg.length > 1)) return null;

						// determine if this segment contains any future points
						const isFuture = !!segmentHasFuture[idx];
						const segColor = isFuture ? "#ff8c00" : "#7c3aed"; // orange for future, violet for past
						const pathOptions = {
							color: segColor,
							weight: 3,
							opacity: 0.95,
							...(isFuture ? { dashArray: "6 6" } : {}),
						};

						return (
							<React.Fragment key={`${seg[0][0]}_${seg[0][1]}_${idx}`}>
								<Polyline positions={seg} pathOptions={pathOptions} />
								{seg.map((pt, j) => {
									if (seg.length < 6) return null;
									const step = Math.max(1, Math.floor(seg.length / 6));
									const show = j % step === 0;
									if (!show) return null;
									const time = segmentTimes[idx]?.[j];
									const key = `m-${seg[0][0]}_${seg[0][1]}_${j}_${idx}`;
									return (
										<CircleMarker
											key={key}
											center={pt}
											radius={4}
											pathOptions={{
												color: "#ffffff",
												fillColor: segColor,
												fillOpacity: 0.9,
											}}
										>
											{time && (
												<Tooltip
													direction="top"
													offset={[0, -6]}
													opacity={1}
													permanent={false}
												>
													<div style={{ fontSize: 14, fontWeight: 600 }}>
														{new Date(time).toLocaleString()}
													</div>
												</Tooltip>
											)}
										</CircleMarker>
									);
								})}
							</React.Fragment>
						);
					})}
					<CenterMap />
					{/* Controls / legend fixed inside map (top-right) */}
					<aside
						className={
							isLightMode
								? "iss-legend iss-legend--light"
								: "iss-legend iss-legend--dark"
						}
						id="iss-controls"
						aria-label="Controles de trayectoria"
						style={{
							position: "absolute",
							right: 12,
							top: 12,
							zIndex: 1000,
							padding: 8,
							borderRadius: 6,
							fontSize: 12,
							background: isLightMode
								? "rgba(255,255,255,0.95)"
								: "rgba(18,18,18,0.85)",
							color: isLightMode ? "#111" : "#eee",
							width: 320,
						}}
					>
						<div style={{ marginBottom: 6, fontWeight: "600" }}>
							Trayectoria ISS
						</div>
						<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
							<label htmlFor="prediction-range" style={{ fontSize: 11 }}>
								Minutos:
							</label>
							<input
								id="prediction-range"
								type="range"
								min="10"
								max="360"
								value={predictionMinutes}
								onChange={(e) => setPredictionMinutes(Number(e.target.value))}
							/>
							<div style={{ width: 36, textAlign: "right" }}>
								{predictionMinutes}
							</div>
						</div>
						<div
							style={{
								display: "flex",
								gap: 8,
								alignItems: "center",
								marginTop: 6,
							}}
						>
							<label htmlFor="precision-range" style={{ fontSize: 11 }}>
								Precisión:
							</label>
							<input
								id="precision-range"
								type="range"
								min="8"
								max="720"
								value={numSegments}
								onChange={(e) => setNumSegments(Number(e.target.value))}
							/>
							<div style={{ width: 36, textAlign: "right" }}>{numSegments}</div>
						</div>
						<div style={{ marginTop: 6, fontSize: 11 }}>
							Puntos pasados: {pastMinutes} min
						</div>
					</aside>
					<ControlsOverlay asideId="iss-controls" />
				</MapContainer>
			)}
		</>
	);
};

export default ISSMap;
