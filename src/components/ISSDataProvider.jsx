import React, { useEffect, useState } from 'react';

const ISSDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [tleLine1, setTleLine1] = useState(0);
  const [tleLine2, setTleLine2] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then(response => {
          if (response.status !== 200) {
            throw new Error('Error en la solicitud');
          }
          return response.json();
        })
        .then(({ latitude, longitude, timestamp, velocity, altitude }) => {
          setLatitude(latitude);
          setLongitude(longitude);
          setTimestamp(timestamp);
          setVelocity(velocity);
          setAltitude(altitude);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false);
        });

        fetch('https://api.wheretheiss.at/v1/satellites/25544/tles')
        .then(response => {
          if (response.status !== 200) {
            throw new Error('Error en la solicitud');
          }
          return response.json();
        })
        .then(({ line1, line2 }) => {
          setTleLine1(line1);
          setTleLine2(line2);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const intervalId = setInterval(fetchData, 5000);

    // Realizar la primera solicitud al montar el componente
    fetchData();

    // Limpiar el intervalo al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>{children({ isLoading, latitude, longitude, timestamp, velocity, altitude, tleLine1, tleLine2 })}</>
  );
};

export default ISSDataProvider;