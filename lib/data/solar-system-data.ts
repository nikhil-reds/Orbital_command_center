export interface PlanetData {
  name: string;
  idx: string;
  type: string;
  au: string;
  dia: string;
  period: string;
  temp: string;
  moons: string[];
  color: string;
  c2: string;
  seed: number;
}

export const PLANET_DATA: PlanetData[] = [
  { name:'MERCURY', idx:'PLANET 01', type:'TERRESTRIAL', au:'0.39 AU', dia:'4,879 KM',   period:'88 D',   temp:'167°C',  moons:[],                                        color:'#9a968f', c2:'#4e4b47', seed:1.1 },
  { name:'VENUS',   idx:'PLANET 02', type:'TERRESTRIAL', au:'0.72 AU', dia:'12,104 KM',  period:'225 D',  temp:'464°C',  moons:[],                                        color:'#e6c169', c2:'#8a5f1e', seed:1.9 },
  { name:'EARTH',   idx:'PLANET 03', type:'TERRESTRIAL', au:'1.00 AU', dia:'12,742 KM',  period:'365 D',  temp:'15°C',   moons:['LUNA'],                                  color:'#4f9de0', c2:'#1e4c86', seed:2.6 },
  { name:'MARS',    idx:'PLANET 04', type:'TERRESTRIAL', au:'1.52 AU', dia:'6,779 KM',   period:'687 D',  temp:'-63°C',  moons:['PHOBOS','DEIMOS'],                       color:'#d0703f', c2:'#7a2f14', seed:3.3 },
  { name:'JUPITER', idx:'PLANET 05', type:'GAS GIANT',   au:'5.20 AU', dia:'139,820 KM', period:'11.9 Y', temp:'-145°C', moons:['IO','EUROPA','GANYMEDE','CALLISTO'],     color:'#d8b48c', c2:'#8c6244', seed:4.2 },
  { name:'SATURN',  idx:'PLANET 06', type:'GAS GIANT',   au:'9.54 AU', dia:'116,460 KM', period:'29.5 Y', temp:'-178°C', moons:['ENCELADUS','RHEA','TITAN'],              color:'#e2cd96', c2:'#8a7440', seed:5.1 },
  { name:'URANUS',  idx:'PLANET 07', type:'ICE GIANT',   au:'19.2 AU', dia:'50,724 KM',  period:'84 Y',   temp:'-195°C', moons:['TITANIA','OBERON'],                      color:'#8fd7e0', c2:'#3d7f8c', seed:6.0 },
  { name:'NEPTUNE', idx:'PLANET 08', type:'ICE GIANT',   au:'30.1 AU', dia:'49,244 KM',  period:'165 Y',  temp:'-201°C', moons:['TRITON'],                                color:'#4a76d8', c2:'#1d3480', seed:6.8 }
];

export interface SystemData {
  label: string;
  value: number;
  color: string;
}

export const SYSTEMS_DATA: SystemData[] = [
  { label:'PROPULSION', value:98, color:'#0BDA51' },
  { label:'NAVIGATION', value:100, color:'#0BDA51' },
  { label:'LIFE SUPPORT', value:96, color:'#0BDA51' },
  { label:'COMMUNICATION', value:91, color:'#0BDA51' }
];
