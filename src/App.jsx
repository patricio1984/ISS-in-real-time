import SkipToContentLink from "./components/common/SkipToContentLink";
import Particles from "./components/common/Particles";
import FadeInUp from "./components/common/FadeInUp";
import LoadingScreen from "./components/common/LoadingScreen";
import CustomCursor from "./components/common/CustomCursor";
import FooterData from "./components/footer/FooterData";
import ISSFooterData from "./components/footer/ISSFooterData";
import Header from "./components/header/Header";
import MenuBurger from "./components/header/MenuBurger";
import ISSMap from "./components/map/Map";
import ISSDataProvider from "./lib/iss/ISSDataProvider";
import Hero from "./components/hero/Hero";
import "./App.css";

const App = () => {
	return (
		<>
			<CustomCursor />
			<Particles />
			<SkipToContentLink />

			<MenuBurger />

			<Header />

			<main id="main" className="main wrapper">
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
							<LoadingScreen isLoading={isLoading} />
							
							<div className="story-container" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}>
								<section id="hero" className="scene--edge">
									<FadeInUp delay={100}>
										<Hero latitude={latitude} longitude={longitude} />
									</FadeInUp>
								</section>

								<section id="map" className="scene--edge" style={{ width: '100%' }}>
									<FadeInUp delay={120}>
										<ISSMap
											latitude={latitude}
											longitude={longitude}
											tleLine1={tleLine1}
											tleLine2={tleLine2}
										/>
									</FadeInUp>
								</section>

								<section id="controls">
									<FadeInUp delay={300}>
										<FooterData
											latitude={latitude}
											longitude={longitude}
											timestamp={timestamp}
											velocity={velocity}
											altitude={altitude}
										/>
									</FadeInUp>
								</section>
							</div>
						</>
					)}
				</ISSDataProvider>

				<footer className="ISSFooterData">
					<FadeInUp delay={500}>
						<ISSFooterData />
					</FadeInUp>
				</footer>
			</main>
		</>
	);
};

export default App;
