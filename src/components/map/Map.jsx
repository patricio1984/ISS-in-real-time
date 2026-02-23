import React, { useEffect, useMemo, useState, useRef } from "react";
import {
	CircleMarker,
	MapContainer,
	Marker,
	Polyline,
	TileLayer,
	Tooltip,
	useMap,
	useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as satellite from "satellite.js";
import CenterMap from "./CenterMap";
import MagneticButton from "../common/MagneticButton";

// Normalize longitude to [-180, 180)
const wrapLongitude = (lon) => {
	let x = ((lon + 180) % 360);
	if (x < 0) x += 360;
	return x - 180;
};

// Clamp a lat/lon pair to the map's maxBounds (if present), normalizing longitude first
const clampToMapBounds = (mapInstance, targetLat, targetLon) => {
	try {
		const mb = mapInstance.getMaxBounds && mapInstance.getMaxBounds();
		if (mb && mb.isValid && mb.isValid()) {
			const sw = mb.getSouthWest();
			const ne = mb.getNorthEast();
			const pad = 1e-6;
			const minLat = sw.lat + pad;
			const maxLat = ne.lat - pad;
			const minLon = sw.lng + pad;
			const maxLon = ne.lng - pad;
			const clampedLat = Math.max(minLat, Math.min(maxLat, targetLat));
			const normalizedLon = wrapLongitude(targetLon);
			const clampedLon = Math.max(minLon, Math.min(maxLon, normalizedLon));
			return [clampedLat, clampedLon];
		}
	} catch (_e) {
		// ignore and fallback
	}
	return [Math.max(-90, Math.min(90, targetLat)), wrapLongitude(targetLon)];
};

// ControlsOverlay must be at module scope to avoid recreating it each render
const ControlsOverlay = ({ asideId, ignoreRef }) => {
	const map = useMap();
	useEffect(() => {
		const el = document.getElementById(asideId);
		if (!el || !map) return;

		const disable = () => {
			try {
				map.dragging?.disable();
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
				map.doubleClickZoom?.enable();
				map.boxZoom?.enable();
				map.touchZoom?.enable();
			} catch (_e) {
				// ignore
			}
		};

		const onPointerDown = (ev) => {
			try {
				if (ignoreRef) ignoreRef.current = true;
			} catch (_e) {}
			disable();
		};
		const onPointerUp = (ev) => {
			try {
				// small delay to avoid racing with map events
				if (ignoreRef) setTimeout(() => (ignoreRef.current = false), 150);
			} catch (_e) {}
			enable();
		};

		el.addEventListener("mouseenter", disable);
		el.addEventListener("mouseleave", enable);
		el.addEventListener("pointerdown", onPointerDown);
		el.addEventListener("pointerup", onPointerUp);

		return () => {
			el.removeEventListener("mouseenter", disable);
			el.removeEventListener("mouseleave", enable);
			el.removeEventListener("pointerdown", onPointerDown);
			el.removeEventListener("pointerup", onPointerUp);
		};
	}, [map, asideId]);

	return null;
};

// Button inside the map that recenters the view to given coords
const CenterOnISSButton = ({ lat, lon, isLightMode }) => {
	const map = useMap();
	if (lat == null || lon == null) return null;

	// clampToMapBounds is defined at module scope and reused

	const normalizeLonToCenter = (targetLon) => {
		const center = map.getCenter();
		let adjusted = targetLon;
		while (Math.abs(adjusted - center.lng) > 180) {
			adjusted += adjusted > center.lng ? -360 : 360;
		}
		return wrapLongitude(adjusted);
	};

	const handleClick = () => {
		try {
			let targetLon = normalizeLonToCenter(lon);
			const [clampedLat, clampedLon] = clampToMapBounds(map, lat, targetLon);
			const currentZoom = map.getZoom?.() ?? 5;
			map.flyTo([clampedLat, clampedLon], currentZoom, { duration: 0.9 });
		} catch (e) {
			try {
				const [clampedLat, clampedLon] = clampToMapBounds(map, lat, lon);
				map.setView([clampedLat, clampedLon], map.getZoom?.() ?? 5);
			} catch (_e) {
				// no-op
			}
		}
	};

	const bg = isLightMode ? "linear-gradient(180deg,#fff,#f3f3f3)" : "linear-gradient(180deg,#212121,#141414)";
	const color = isLightMode ? "#111" : "#eee";

	return (
		<MagneticButton
			onClick={handleClick}
			aria-label="Center on Station"
			title="Center on Station"
			className={`btn center-btn`}
			style={{
				minWidth: 120,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				padding: "8px 12px",
				fontSize: "0.75rem",
				letterSpacing: "0.1em",
				textTransform: "uppercase",
				marginTop: "8px",
				background: "rgba(255, 255, 255, 0.05)",
				color: "var(--text-main)",
				border: "1px solid rgba(255, 255, 255, 0.1)",
				borderRadius: "6px",
				fontWeight: "600",
				cursor: "pointer",
				transition: "all 0.2s ease"
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
				e.currentTarget.style.borderColor = "var(--accent)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
				e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
			}}
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:6}}>
				<path d="M12 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M12 18v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M4 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
				<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
			</svg>
			<span className="btn-label">RE-CENTER</span>
		</MagneticButton>
	);
};

// Controls following behavior: when `follow` is true, center on updates;
// disable follow when the user interacts with the map.
const FollowController = ({ lat, lon, follow, setFollow, ignoreRef, onUserInteraction }) => {
	const map = useMap();
	const programmatic = useRef(false);
	const reenableTimer = useRef(null);

	useEffect(() => {
		if (!map) return;
		const handleMapInteraction = () => {
			if (programmatic.current) return; // ignore programmatic moves
			if (ignoreRef?.current) return; // ignore interactions that originated in controls
			if (follow) {
				// notify parent to handle disable + optional re-enable
				if (typeof onUserInteraction === "function") {
					try {
						onUserInteraction();
					} catch (_e) {
						setFollow(false);
					}
				} else {
					setFollow(false);
				}
			}
		};

		map.on("dragstart", handleMapInteraction);
		map.on("zoomstart", handleMapInteraction);
		map.on("movestart", handleMapInteraction);
		map.on("touchstart", handleMapInteraction);

		return () => {
			map.off("dragstart", handleMapInteraction);
			map.off("zoomstart", handleMapInteraction);
			map.off("movestart", handleMapInteraction);
			map.off("touchstart", handleMapInteraction);
		};
	}, [map, follow, setFollow, ignoreRef, onUserInteraction]);

	useEffect(() => {
		if (!follow) return;
		if (lat == null || lon == null) return;
		try {
			programmatic.current = true;
			// normalize longitude to avoid wrapping jumps
			const center = map.getCenter();
			let adjustedLon = lon;
			while (Math.abs(adjustedLon - center.lng) > 180) {
				adjustedLon += adjustedLon > center.lng ? -360 : 360;
			}
			const [clampedLat, clampedLon] = clampToMapBounds(map, lat, adjustedLon);
			map.flyTo([clampedLat, clampedLon], map.getZoom?.() ?? 5, { duration: 0.8 });
			map.once("moveend", () => {
				setTimeout(() => {
					programmatic.current = false;
				}, 20);
			});
		} catch (e) {
			try {
				const [clampedLat, clampedLon] = clampToMapBounds(map, lat, lon);
				map.setView([clampedLat, clampedLon], map.getZoom?.() ?? 5);
			} catch (_e) {
				// no-op
			}
			programmatic.current = false;
		}
	}, [lat, lon, follow, map]);

	return null;
};

const ISSMarker = ({ latitude, longitude }) => {
	const map = useMap();
	const [zoom, setZoom] = useState(map.getZoom());

	useMapEvents({
		zoomend: () => setZoom(map.getZoom()),
	});

	// Adaptive scaling: base size 48, grows slightly as you zoom in
	const size = Math.max(48, zoom * 12);

	const customIcon = L.divIcon({
		className: "iss-marker-container",
		html: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<!-- Outer pulsing halo -->
			<circle cx="50" cy="50" r="45" fill="var(--accent)" opacity="0.15" class="iss-pulse" />
			<!-- Radar ring -->
			<circle cx="50" cy="50" r="25" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.5" stroke-dasharray="2 4" />
			<!-- Crosshair -->
			<path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="var(--accent)" stroke-width="1" opacity="0.3" />
			<!-- Solar Panels -->
			<rect x="28" y="42" width="18" height="16" fill="var(--accent)" rx="1" />
			<rect x="54" y="42" width="18" height="16" fill="var(--accent)" rx="1" />
			<!-- Central Module -->
			<rect x="45" y="32" width="10" height="36" fill="#ffffff" rx="2" style="filter: drop-shadow(0 0 4px rgba(255,255,255,0.8))" />
		</svg>`,
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
	});

	return <Marker position={[latitude, longitude]} icon={customIcon} />;
};

const ISSMap = ({ latitude, longitude, tleLine1, tleLine2 }) => {
	const [positions, setPositions] = useState([]);
	const [predictionMinutes, setPredictionMinutes] = useState(90);
	const [numSegments, setNumSegments] = useState(120);
	const [pastMinutes, _setPastMinutes] = useState(90);
	const [follow, setFollow] = useState(false);
	const [controlsCollapsed, setControlsCollapsed] = useState(true);
	const ignoreInteractionRef = useRef(false);
	const [autoReenable, setAutoReenable] = useState(false);
	const reenableDelayMs = 10000; // 10s
	const reenableTimerRef = useRef(null);
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

	// Called by FollowController when a user interaction on the map should disable follow.
	const handleMapUserInteraction = () => {
		// clear any existing timers
		if (reenableTimerRef.current) {
			clearTimeout(reenableTimerRef.current);
			reenableTimerRef.current = null;
		}
		setFollow(false);
		if (autoReenable) {
			reenableTimerRef.current = setTimeout(() => {
				setFollow(true);
				reenableTimerRef.current = null;
			}, reenableDelayMs);
		}
	};

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
			{(latitude != null && longitude != null) && (
				<div className="map-container--wrapper mission-control-map">
					<div className="map-vignette"></div>
					<MapContainer
						className="map-container"
						center={[latitude, longitude]}
						zoom={4}
						minZoom={3}
						worldCopyJump={false}
						maxBounds={[
							[-90, -180],
							[90, 180],
						]}
						maxBoundsViscosity={1}
						zoomSnap={0.5}
						zoomDelta={0.5}
						wheelPxPerZoomLevel={120}
						attributionControl={false}
						scrollWheelZoom={false}
					>
						<TileLayer
							url={isLightMode ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
							detectRetina={true}
							noWrap={true}
						/>
					<ISSMarker latitude={latitude} longitude={longitude} />
					{segments.map((seg, idx) => {
						if (!(seg.length > 1)) return null;

						// determine if this segment contains any future points
						const isFuture = !!segmentHasFuture[idx];
						const segColor = isFuture ? "var(--accent)" : "var(--muted)"; // accent for future, muted for past
						const pathOptions = {
							color: segColor,
							weight: 3,
							opacity: 0.95,
							className: isFuture ? "leaflet-interactive" : "", // Add glowing animation class to future path
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
												color: "transparent",
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
													<div style={{ 
														fontSize: 14, 
														fontWeight: 600, 
														background: isLightMode ? "rgba(255, 255, 255, 0.9)" : "rgba(11, 16, 32, 0.8)", 
														color: isLightMode ? "#111" : "var(--text-main)", 
														border: isLightMode ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", 
														backdropFilter: "blur(4px)", 
														padding: "4px 8px", 
														borderRadius: "4px",
														boxShadow: isLightMode ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
													}}>
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
					<FollowController
						lat={latitude}
						lon={longitude}
						follow={follow}
						setFollow={setFollow}
						ignoreRef={ignoreInteractionRef}
						onUserInteraction={handleMapUserInteraction}
					/>
					<CenterMap latitude={latitude} longitude={longitude} />
					{/* Controls / legend fixed inside map (top-right) */}
					<aside
						id="iss-controls"
						aria-label="Controles de trayectoria"
					>

						<div
							className="control-group control-group-header"
							style={{ justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 4 }}
							onClick={(e) => {
								// Don't toggle when interacting with inputs, buttons, links, or labels
								if (e.target.closest && e.target.closest('input,button,label,select,textarea,a')) return;
								setControlsCollapsed((v) => !v);
							}}
						>
							<div>ORBIT PREDICTION</div>
							<MagneticButton
								className="controls-toggle-btn"
								aria-label={controlsCollapsed ? "Expandir controles" : "Colapsar controles"}
								onClick={() => setControlsCollapsed((v) => !v)}
								style={{
									border: "none",
									background: "transparent",
									cursor: "pointer",
									fontSize: 12,
									padding: 4,
									color: "var(--muted)",
								}}
							>
								{controlsCollapsed ? "▼" : "▲"}
							</MagneticButton>
						</div>
						<div
							style={{
								overflow: "hidden",
								transition: "max-height 220ms ease, opacity 180ms ease",
								maxHeight: controlsCollapsed ? 0 : 420,
								opacity: controlsCollapsed ? 0 : 1,
								display: "flex",
								flexDirection: "column",
								gap: "12px"
							}}
						>
						<div className="control-group">
							<label htmlFor="prediction-range" style={{ minWidth: 48 }}>
								TIME:
							</label>
							<input
								id="prediction-range"
								type="range"
								min="10"
								max="360"
								value={predictionMinutes}
								onChange={(e) => setPredictionMinutes(Number(e.target.value))}
								style={{ flex: 1 }}
							/>
							<div style={{ width: 40, textAlign: "right", color: "var(--text-main)" }}>
								{predictionMinutes}m
							</div>
						</div>
						<div className="control-group" style={{ flexWrap: "wrap" }}>
							<label style={{ minWidth: 48 }}>RES:</label>
								<div style={{ display: "flex", gap: 4, flex: 1 }}>
									{[ [60, 'LOW'], [120, 'MED'], [360, 'HIGH'] ].map(([val, label]) => {
										const active = numSegments === val;
										const activeColor = 'var(--accent)';
										const inactiveColor = 'rgba(255,255,255,0.05)';
										const activeBg = 'rgba(96, 165, 250, 0.1)';
										const color = active ? 'var(--text-main)' : 'var(--muted)';
										return (
											<MagneticButton
												key={val}
												onClick={() => setNumSegments(val)}
												className="precision-btn"
												style={{
													padding: '4px 8px',
													borderRadius: 4,
													borderWidth: 1,
													borderStyle: 'solid',
													borderColor: active ? activeColor : inactiveColor,
													boxSizing: 'border-box',
													background: active ? activeBg : 'transparent',
													color,
													cursor: 'pointer',
													outline: 'none',
													transition: 'all 140ms ease',
													flex: 1,
													textAlign: 'center',
													fontSize: '0.7rem',
													letterSpacing: '0.1em'
												}}
											>
												{label}
											</MagneticButton>
										);
									})}
								</div>
							{numSegments >= 360 && (
								<div style={{ width: "100%", marginTop: 4, fontSize: "0.65rem", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
									HIGH RES MAY IMPACT PERFORMANCE
								</div>
							)}
						</div>
						<div
							className="control-group"
							style={{
								marginTop: 4,
								flexWrap: "wrap",
								gap: "10px"
							}}
						>
								<label
									style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}
									htmlFor="follow-toggle"
								>
									<input
										type="checkbox"
										id="follow-toggle"
										checked={follow}
										onChange={(e) => {
											// manual toggle: clear any pending auto-reactivate timer
											if (reenableTimerRef.current) {
												clearTimeout(reenableTimerRef.current);
												reenableTimerRef.current = null;
											}
											setFollow(e.target.checked);
										}}
									/>
									<span>TRACK ISS</span>
								</label>
								<label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }} htmlFor="auto-reenable">
									<input
										type="checkbox"
										id="auto-reenable"
										checked={autoReenable}
										onChange={(e) => setAutoReenable(e.target.checked)}
									/>
									<span>AUTO-RESUME</span>
								</label>
								<div style={{ width: "100%", marginTop: 4 }}>
									<CenterOnISSButton lat={latitude} lon={longitude} isLightMode={isLightMode} />
								</div>
								<div style={{ width: "100%", fontSize: "0.65rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginTop: "4px" }}>
									PAST TRAJECTORY: {pastMinutes} MIN
								</div>
							</div>
						</div>
					</aside>
					<ControlsOverlay asideId="iss-controls" ignoreRef={ignoreInteractionRef} />
				</MapContainer>
				</div>
			)}
		</>
	);
};

export default ISSMap;
