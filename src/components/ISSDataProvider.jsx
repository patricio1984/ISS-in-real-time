import React, { useEffect, useState } from 'react';

const ISSDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json')
        .then(response => {
          if (response.status !== 200) {
            throw new Error('Error en la solicitud');
          }
          return response.json();
        })
        .then(data => {
          const newLatitude = parseFloat(data.iss_position.latitude);
          const newLongitude = parseFloat(data.iss_position.longitude);
          const newTimeStamp = parseFloat(data.timestamp);
          setLatitude(newLatitude);
          setLongitude(newLongitude);
          setTimestamp(newTimeStamp);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false);
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
    <>{children({ isLoading, latitude, longitude, timestamp })}</>
  );
};

export default ISSDataProvider;