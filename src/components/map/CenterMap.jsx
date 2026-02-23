import { useEffect } from "react";
import { useMap } from "react-leaflet";

const CenterMap = ({ latitude, longitude }) => {
	const map = useMap();

	useEffect(() => {
		if (latitude == null || longitude == null) return;
		try {
			map.setView([latitude, longitude]);
		} catch (_e) {}
	}, [latitude, longitude, map]);

	return null;
};

export default CenterMap;
