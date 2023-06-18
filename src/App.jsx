import React, { useState } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import ISSDataProvider from './components/ISSDataProvider';
import FooterData from './components/FooterData';
import MenuBurger from './components/MenuBurger';
import ISSFooterData from './components/ISSFooterData';
import './App.css';


const App = () => {
  return (
      <>
        <MenuBurger />
        
        <Header />

        <main className="main wrapper">
          <section className="section">
            <ISSDataProvider>
              {({ isLoading, latitude, longitude, timestamp }) => (
                <>
                  {isLoading ? (
                    <div className="spinner__container">
                        <div className="lds-roller" aria-label="Iss content Map is loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>   
                  ) : (
                    <>
                      <Map latitude={latitude} longitude={longitude} />
                      <FooterData
                        latitude={latitude}
                        longitude={longitude}
                        timestamp={timestamp}
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



