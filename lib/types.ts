
export interface Cliente {
  id?: string;
  nombre: string;
  año: number;
  statusMigratorio: 'RESIDENTE' | 'CIUDADANO' | 'NATURALIZADO' | 'TPS' | 'PAROL' | 'PERMISO DE TRABAJO';
  ss: string;
  alien: string;
  dob: string;
  edad: number;
  direccion: string;
  ciudad: string;
  estado: string;
  zipCode: string;
  condado: string;
  telefono: string;
  email: string;
  numeroDep: string;
  lugarTrabajo: string;
  ocupacion: string;
  ingreso1: number;
  ingreso2: number;
  totalIngresos: number;
  banco: string;
  ruta: string;
  cuenta: string;
  nombreCuenta: string;
  ultimos4Tarjeta: string;
  fechaVencimiento: string;
  cvc: string;
  nombreTarjeta: string;
  compañiaSeguro: 'Florida Blue' | 'Oscar' | 'Ambetter' | 'Aetna' | 'Cigna' | 'United HealthCare' | 'AmeriHealth Caritas NEXT' | 'AvMed' | 'Molina HealthCare';
  nombrePlan: string;
  idPlan: string;
  hmo: boolean;
  ppo: boolean;
  idMercado: string;
  valorPrima: number;
  deducible: number;
  coInsurance: string;
  maxOop: number;
  drPrimario: string;
  especialista: string;
  urgencia: string;
  emergencia: string;
  medGenerica: string;
  lab: string;
  rxMrs: string;
  tps: string;
  parol: string;
  permisoTrabajo: string;
  notas: string;
  dependientes: Dependiente[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Dependiente {
  id: string;
  nombre: string;
  dob: string;
  edad: number;
  statusLegal: 'RESIDENTE' | 'CIUDADANO' | 'NATURALIZADO' | 'TPS' | 'PAROL' | 'PERMISO DE TRABAJO';
  ss: string;
  ingreso: number;
  aplicaSeguro: boolean;
  tps: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export const ESTADOS_USA = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export const CIUDADES_USA = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
  'Boston', 'El Paso', 'Detroit', 'Nashville', 'Portland', 'Memphis', 'Oklahoma City',
  'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
  'Mesa', 'Sacramento', 'Atlanta', 'Kansas City', 'Colorado Springs', 'Miami', 'Raleigh',
  'Omaha', 'Long Beach', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa', 'Tampa',
  'Arlington', 'Wichita', 'New Orleans', 'Cleveland', 'Bakersfield', 'Aurora', 'Anaheim',
  'Honolulu', 'Santa Ana', 'Riverside', 'Corpus Christi', 'Lexington', 'Stockton',
  'Henderson', 'Saint Paul', 'St. Louis', 'Cincinnati', 'Pittsburgh', 'Greensboro',
  'Anchorage', 'Plano', 'Lincoln', 'Orlando', 'Irvine', 'Newark', 'Toledo', 'Durham',
  'Chula Vista', 'Fort Wayne', 'Jersey City', 'St. Petersburg', 'Laredo', 'Madison',
  'Chandler', 'Buffalo', 'Lubbock', 'Scottsdale', 'Reno', 'Glendale', 'Gilbert',
  'Winston-Salem', 'North Las Vegas', 'Norfolk', 'Chesapeake', 'Garland', 'Irving',
  'Hialeah', 'Fremont', 'Boise', 'Richmond', 'Baton Rouge', 'Spokane', 'Des Moines',
  'Tacoma', 'San Bernardino', 'Modesto', 'Fontana', 'Santa Clarita', 'Birmingham',
  'Oxnard', 'Fayetteville', 'Moreno Valley', 'Akron', 'Huntington Beach', 'Little Rock',
  'Augusta', 'Amarillo', 'Glendale', 'Mobile', 'Grand Rapids', 'Salt Lake City',
  'Tallahassee', 'Huntsville', 'Grand Prairie', 'Knoxville', 'Worcester', 'Newport News',
  'Brownsville', 'Overland Park', 'Santa Rosa', 'Providence', 'Garden Grove', 'Chattanooga',
  'Oceanside', 'Jackson', 'Fort Lauderdale', 'Santa Clarita', 'Rancho Cucamonga',
  'Port St. Lucie', 'Tempe', 'Ontario', 'Vancouver', 'Cape Coral', 'Sioux Falls',
  'Springfield', 'Peoria', 'Pembroke Pines', 'Elk Grove', 'Salem', 'Lancaster',
  'Corona', 'Eugene', 'Palmdale', 'Salinas', 'Springfield', 'Pasadena', 'Fort Collins',
  'Hayward', 'Pomona', 'Cary', 'Rockford', 'Alexandria', 'Escondido', 'McKinney',
  'Kansas City', 'Joliet', 'Sunnyvale', 'Torrance', 'Bridgeport', 'Lakewood',
  'Hollywood', 'Paterson', 'Naperville', 'Syracuse', 'Mesquite', 'Dayton', 'Savannah',
  'Clarksville', 'Orange', 'Pasadena', 'Fullerton', 'Killeen', 'Frisco', 'Hampton',
  'McAllen', 'Warren', 'Bellevue', 'West Valley City', 'Columbia', 'Olathe', 'Sterling Heights',
  'New Haven', 'Miramar', 'Waco', 'Thousand Oaks', 'Cedar Rapids', 'Charleston',
  'Visalia', 'Topeka', 'Elizabeth', 'Gainesville', 'Thornton', 'Roseville', 'Carrollton',
  'Coral Springs', 'Stamford', 'Simi Valley', 'Concord', 'Hartford', 'Kent', 'Lafayette',
  'Midland', 'Surprise', 'Denton', 'Victorville', 'Evansville', 'Santa Clara', 'Abilene',
  'Athens', 'Vallejo', 'Allentown', 'Norman', 'Beaumont', 'Independence', 'Murfreesboro',
  'Ann Arbor', 'Fargo', 'Wilmington', 'Golden', 'Columbia', 'Westminster', 'Portsmouth',
  'Manchester', 'Elgin', 'Round Rock', 'Clearwater', 'Waterbury', 'Gresham', 'Fairfield',
  'Billings', 'Lowell', 'San Buenaventura', 'Pueblo', 'High Point', 'West Covina',
  'Richmond', 'Murrieta', 'Cambridge', 'Antioch', 'Temecula', 'Norwalk', 'Centennial',
  'Everett', 'Palm Bay', 'Wichita Falls', 'Green Bay', 'Daly City', 'Burbank', 'Richardson',
  'Pompano Beach', 'North Charleston', 'Broken Arrow', 'Boulder', 'West Palm Beach',
  'Surprise', 'Carlsbad', 'El Monte', 'Rialto', 'Las Cruces', 'Davenport', 'Miami Gardens',
  'Clovis', 'Springfield', 'Pearland', 'Downey', 'Costa Mesa', 'College Station',
  'Inglewood', 'San Mateo', 'Hillsboro', 'Green Bay', 'Lansing', 'Kalamazoo'
];

export const COMPAÑIAS_SEGURO = [
  'Florida Blue',
  'Oscar',
  'Ambetter',
  'Aetna',
  'Cigna',
  'United HealthCare',
  'AmeriHealth Caritas NEXT',
  'AvMed',
  'Molina HealthCare'
];

export const STATUS_MIGRATORIO_OPTIONS = [
  'RESIDENTE',
  'CIUDADANO',
  'NATURALIZADO',
  'TPS',
  'PAROL',
  'PERMISO DE TRABAJO'
];
