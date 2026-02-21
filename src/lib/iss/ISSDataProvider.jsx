import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

const fetchPosition = async () => {
	const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
	if (!res.ok) throw new Error("Network response was not ok");
	return res.json();
};

const fetchTles = async () => {
	const res = await fetch(
		"https://api.wheretheiss.at/v1/satellites/25544/tles",
	);
	if (!res.ok) throw new Error("Network response was not ok");
	return res.json();
};

const ISSDataProvider = ({ children }) => {
	const { data: posData, isLoading: isPosLoading } = useQuery(
		["iss", "position"],
		fetchPosition,
		{
			refetchInterval: 5000,
			refetchOnWindowFocus: false,
		},
	);

	const { data: tlesData, isLoading: isTlesLoading } = useQuery(
		["iss", "tles"],
		fetchTles,
		{
			refetchInterval: 60000,
			refetchOnWindowFocus: false,
		},
	);

	const isLoading = isPosLoading || isTlesLoading;

	const latitude = posData?.latitude ?? 0;
	const longitude = posData?.longitude ?? 0;
	const timestamp = posData?.timestamp ?? 0;
	const velocity = posData?.velocity ?? 0;
	const altitude = posData?.altitude ?? 0;

	const tleLine1 = tlesData?.line1 ?? "";
	const tleLine2 = tlesData?.line2 ?? "";

	return (
		<>
			{children({
				isLoading,
				latitude,
				longitude,
				timestamp,
				velocity,
				altitude,
				tleLine1,
				tleLine2,
			})}
		</>
	);
};

ISSDataProvider.propTypes = {
	children: PropTypes.func.isRequired,
};

export default ISSDataProvider;
