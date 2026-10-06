import { useState, useEffect } from 'react';
import { PLANET_DATA, PlanetData } from '../data/solar-system-data';

export function useDashboardState() {
  const [activePlanetName, setActivePlanetName] = useState<string>('EARTH');
  const [focused, setFocused] = useState<boolean>(false);
  const [hoveredPlanetName, setHoveredPlanetName] = useState<string | null>(null);
  
  const [clock, setClock] = useState<string>('');
  const [missionTime, setMissionTime] = useState<string>('284D 14H 32M');
  const [orbitPos, setOrbitPos] = useState<string>('000.0');
  
  const [telemetry, setTelemetry] = useState({
    signal: '94.82',
    velocity: '38,420',
    freq: '8.402',
    amp: '0.842',
    snr: '41.2',
    phase: '128',
    lat: '18.4201',
    lng: '-77.9281'
  });

  const activePlanet = PLANET_DATA.find(p => p.name === activePlanetName) || PLANET_DATA[2];

  useEffect(() => {
    const p = (n: number) => String(n).padStart(2, '0');
    const j = (b: number, s: number, f: number) => (b + (Math.random() - 0.5) * s).toFixed(f);

    const pulseNumbers = () => {
      const now = new Date();
      setClock(`${p(now.getUTCHours())}:${p(now.getUTCMinutes())}:${p(now.getUTCSeconds())}`);
      setMissionTime(`284D 14H ${p(32 + (now.getUTCSeconds() % 3))}M`);
      
      setTelemetry({
        signal: j(94.8, 0.3, 2),
        velocity: (38420 + Math.round((Math.random() - 0.5) * 40)).toLocaleString('en-US'),
        freq: j(8.402, 0.02, 3),
        amp: j(0.84, 0.06, 3),
        snr: j(41.2, 1.4, 1),
        phase: String(Math.round(128 + (Math.random() - 0.5) * 14)),
        lat: j(18.42, 0.01, 4),
        lng: j(-77.928, 0.01, 4)
      });
    };

    pulseNumbers();
    const tick = setInterval(pulseNumbers, 1000);

    return () => clearInterval(tick);
  }, []);

  const selectPlanet = (name: string) => {
    setActivePlanetName(name);
    setFocused(true);
  };

  const resetView = () => {
    setFocused(false);
  };

  return {
    activePlanet,
    activePlanetName,
    focused,
    hoveredPlanetName,
    setHoveredPlanetName,
    clock,
    missionTime,
    orbitPos,
    setOrbitPos,
    telemetry,
    selectPlanet,
    resetView
  };
}
