export type EwoStatus =
  | "Pending"
  | "On Progress"
  | "Done";

export type EwoType = "Total" | "Sebagian";

export interface EwoData {
  id: string;
  ewoCode: string;
  requestor: string;
  email: string;
  department: string;
  section: string;
  equipment: string;
  teamLeader: string;
  shift: string;
  failureType: EwoType;
  taskList: string;
  specialNote: string;
  status: EwoStatus;
  createdAt: string;
  completedAt?: string;
}

export const dummyEwoData: EwoData[] = [
  {
    id: "1",
    ewoCode: "EWO-2026-001",
    requestor: "Abim",
    email: "abim@cmms.com",
    department: "Production & QC",
    section: "K1",
    equipment: "Log Chipper 1",
    teamLeader: "Syahrul",
    shift: "SHIFT 1",
    failureType: "Total",
    taskList: "Motor log chipper tidak dapat beroperasi.",
    specialNote: "Perlu pemeriksaan motor dan panel kontrol.",
    status: "Pending",
    createdAt: "29 Aug 2026",
  },
  {
    id: "2",
    ewoCode: "EWO-2026-002",
    requestor: "Budi",
    email: "budi@cmms.com",
    department: "Production & QC",
    section: "K1",
    equipment: "Infeed Log Chipper #1",
    teamLeader: "Rizal",
    shift: "SHIFT 2",
    failureType: "Sebagian",
    taskList: "Conveyor berjalan tidak stabil.",
    specialNote: "Terdapat suara abnormal pada gearbox.",
    status: "On Progress",
    createdAt: "28 Aug 2026",
  },
  {
    id: "3",
    ewoCode: "EWO-2026-003",
    requestor: "Andi",
    email: "andi@cmms.com",
    department: "PPIC",
    section: "K2",
    equipment: "Log Shaft Debarker 1",
    teamLeader: "Dimas",
    shift: "SHIFT 3",
    failureType: "Total",
    taskList: "Unit berhenti secara mendadak.",
    specialNote: "Pastikan area kerja aman sebelum perbaikan.",
    status: "Done",
    createdAt: "27 Aug 2026",
    completedAt: "28 Aug 2026",
  },
];