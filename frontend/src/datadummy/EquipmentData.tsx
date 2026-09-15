export type EquipmentStatus =
  | "Operational"
  | "Warning"
  | "Critical";

export type Criticality = "A" | "B" | "C";

export type MaintenanceHistory = {
  date: string;
  event: string;
  type: "PM" | "Corrective";
  technician: string;
  status: "Completed" | "In Progress";
  downtime: string;
  wo: string;
};

export type EquipmentData = {
  id: string;
  name: string;
  section: string;
  area: string;
  type: string;
  status: EquipmentStatus;
  criticality: Criticality;
  lastPM: string;
  manufacturer: string;
  model: string;
  capacity: string;
  installed: string;
  location: string;
  mtbf: string;
  mttr: string;
  downtimeYTD: string;
  failureCount: number;
  nextPM: string;
  maintenanceHistory: MaintenanceHistory[];
};

export const equipmentData: EquipmentData[] = [
  {
    id: "EQ-PEL-001",
    name: "Pellet Mill 01",
    section: "5",
    area: "Production Line 01",
    type: "Pellet Mill",
    status: "Operational",
    criticality: "A",
    lastPM: "26 Aug",

    manufacturer: "CPM",
    model: "7936-7",
    capacity: "6.0 ton/h",
    installed: "2024",
    location: "Production Line 01",

    mtbf: "186 h",
    mttr: "92 min",
    downtimeYTD: "38.5 h",
    failureCount: 8,
    nextPM: "04 Sep 2026",

    maintenanceHistory: [
      {
        date: "26 Aug",
        event: "Routine inspection",
        type: "PM",
        technician: "A. Rahman",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-081",
      },
      {
        date: "21 Aug",
        event: "Motor overload",
        type: "Corrective",
        technician: "D. Pratama",
        status: "Completed",
        downtime: "2.5 h",
        wo: "WO-079",
      },
      {
        date: "04 Aug",
        event: "Lubrication",
        type: "PM",
        technician: "A. Rahman",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-061",
      },
    ],
  },

  {
    id: "EQ-WHM-002",
    name: "Wet Hammer Mill 02",
    section: "2",
    area: "Production Line 02",
    type: "Hammer Mill",
    status: "Warning",
    criticality: "A",
    lastPM: "22 Aug",

    manufacturer: "FLSmidth",
    model: "WHM-220",
    capacity: "4.5 ton/h",
    installed: "2023",
    location: "Production Line 02",

    mtbf: "145 h",
    mttr: "110 min",
    downtimeYTD: "45.2 h",
    failureCount: 11,
    nextPM: "08 Sep 2026",

    maintenanceHistory: [
      {
        date: "22 Aug",
        event: "Bearing vibration",
        type: "Corrective",
        technician: "D. Pratama",
        status: "Completed",
        downtime: "3 h",
        wo: "WO-082",
      },
      {
        date: "15 Aug",
        event: "Routine inspection",
        type: "PM",
        technician: "A. Rahman",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-074",
      },
    ],
  },

  {
    id: "EQ-RDR-001",
    name: "Rotary Dryer 01",
    section: "3",
    area: "Drying Area",
    type: "Dryer",
    status: "Operational",
    criticality: "B",
    lastPM: "28 Aug",

    manufacturer: "Andritz",
    model: "RD-500",
    capacity: "8.0 ton/h",
    installed: "2022",
    location: "Drying Area",

    mtbf: "210 h",
    mttr: "75 min",
    downtimeYTD: "24.0 h",
    failureCount: 5,
    nextPM: "12 Sep 2026",

    maintenanceHistory: [
      {
        date: "28 Aug",
        event: "Temperature inspection",
        type: "PM",
        technician: "F. Hidayat",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-088",
      },
      {
        date: "10 Aug",
        event: "Fan belt replacement",
        type: "Corrective",
        technician: "D. Pratama",
        status: "Completed",
        downtime: "1.5 h",
        wo: "WO-068",
      },
    ],
  },

  {
    id: "EQ-PKG-003",
    name: "Packing Machine 03",
    section: "5",
    area: "Packing Area",
    type: "Packing",
    status: "Critical",
    criticality: "A",
    lastPM: "19 Aug",

    manufacturer: "Premier Tech",
    model: "PTK-300",
    capacity: "25 bag/min",
    installed: "2024",
    location: "Packing Area",

    mtbf: "98 h",
    mttr: "145 min",
    downtimeYTD: "64.8 h",
    failureCount: 17,
    nextPM: "01 Sep 2026",

    maintenanceHistory: [
      {
        date: "19 Aug",
        event: "Control panel failure",
        type: "Corrective",
        technician: "A. Rahman",
        status: "In Progress",
        downtime: "5 h",
        wo: "WO-091",
      },
      {
        date: "08 Aug",
        event: "Sensor inspection",
        type: "PM",
        technician: "F. Hidayat",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-065",
      },
    ],
  },

  {
    id: "EQ-LCH-001",
    name: "Log Chipper 01",
    section: "1",
    area: "Chipping Area",
    type: "Chipper",
    status: "Operational",
    criticality: "B",
    lastPM: "27 Aug",

    manufacturer: "Morbark",
    model: "MC-700",
    capacity: "10 ton/h",
    installed: "2021",
    location: "Chipping Area",

    mtbf: "230 h",
    mttr: "80 min",
    downtimeYTD: "19.5 h",
    failureCount: 4,
    nextPM: "15 Sep 2026",

    maintenanceHistory: [
      {
        date: "27 Aug",
        event: "Blade inspection",
        type: "PM",
        technician: "D. Pratama",
        status: "Completed",
        downtime: "0 h",
        wo: "WO-086",
      },
      {
        date: "02 Aug",
        event: "Hydraulic leakage",
        type: "Corrective",
        technician: "A. Rahman",
        status: "Completed",
        downtime: "2 h",
        wo: "WO-059",
      },
    ],
  },

  {
    id: "EQ-CON-004",
    name: "Belt Conveyor 04",
    section: "4",
    area: "Material Handling",
    type: "Conveyor",
    status: "Warning",
    criticality: "C",
    lastPM: "24 Aug",

    manufacturer: "Flexco",
    model: "BC-400",
    capacity: "12 ton/h",
    installed: "2022",
    location: "Material Handling",

    mtbf: "160 h",
    mttr: "60 min",
    downtimeYTD: "28.3 h",
    failureCount: 7,
    nextPM: "10 Sep 2026",

    maintenanceHistory: [
      {
        date: "24 Aug",
        event: "Belt alignment",
        type: "Corrective",
        technician: "F. Hidayat",
        status: "Completed",
        downtime: "1 h",
        wo: "WO-080",
      },
    ],
  },
];