import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);
    })();
  }, []);

  return { coords, errorMsg };
}