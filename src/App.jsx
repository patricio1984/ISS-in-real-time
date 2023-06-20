import React, { useState } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import ISSDataProvider from './components/ISSDataProvider';
import FooterData from './components/FooterData';
import MenuBurger from './components/MenuBurger';
import ISSFooterData from './components/ISSFooterData';
import SkipToContentLink from './components/SkipToContentLink';
import './App.css';


const App = () => {
  return (
      <>
        <SkipToContentLink />

        <MenuBurger />
        
        <Header />

        <main id="main" className="main wrapper">
          <section className="section">
            <ISSDataProvider>
              {({ isLoading, latitude, longitude, timestamp, velocity, altitude, tleLine1, tleLine2 }) => (
                <>
                  {isLoading ? (
                    <div className="spinner__container">
                        <div className="lds-roller" aria-label="Iss content Map is loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>   
                  ) : (
                    <>
                      <Map latitude={latitude} longitude={longitude} tleLine1={tleLine1} tleLine2={tleLine2}/>
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



