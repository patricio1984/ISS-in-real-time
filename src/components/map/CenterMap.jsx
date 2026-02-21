import { useEffect } from "react";
import { useMap } from "react-leaflet";

const CenterMap = ({ latitude, longitude }) => {
	const map = useMap();

	useEffect(() => {
		if (latitude && longitude) {
			map.setView([latitude, longitude]);
		}
	}, [latitude, longitude, map]);

	return null;
};

export default CenterMap;
