import SkipToContentLink from "./components/common/SkipToContentLink";
import FooterData from "./components/footer/FooterData";
import ISSFooterData from "./components/footer/ISSFooterData";
import Header from "./components/header/Header";
import MenuBurger from "./components/header/MenuBurger";
import ISSMap from "./components/map/Map";
import ISSDataProvider from "./lib/iss/ISSDataProvider";
import "./App.css";

const App = () => {
	return (
		<>
			<SkipToContentLink />

			<MenuBurger />

			<Header />

			<main id="main" className="main wrapper">
				<section className="section">
					<ISSDataProvider>
						{({
							isLoading,
							latitude,
							longitude,
							timestamp,
							velocity,
							altitude,
							tleLine1,
							tleLine2,
						}) => (
							<>
								{isLoading ? (
									<div className="spinner__container">
										<output
											className="lds-roller"
											aria-label="ISS content: Map is loading"
										>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</output>
									</div>
								) : (
									<>
										<ISSMap
											latitude={latitude}
											longitude={longitude}
											tleLine1={tleLine1}
											tleLine2={tleLine2}
										/>
										<FooterData
											latitude={latitude}
											longitude={longitude}
											timestamp={timestamp}
											velocity={velocity}
											altitude={altitude}
										/>
									</>
								)}
							</>
						)}
					</ISSDataProvider>
				</section>

				<section className="ISSFooterData">
					<ISSFooterData />
				</section>
			</main>
		</>
	);
};

export default App;
