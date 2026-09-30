export const seedRecords = [
  {id:"MR-1042", patient:"Abebe Kebede", patientId:"PT-1001", doctor:"Dr. Sara Tesfaye", department:"Cardiology", diagnosis:"Hypertension", date:"2026-08-20", status:"Active"},
  {id:"MR-1041", patient:"Hanna Worku", patientId:"PT-1002", doctor:"Dr. Daniel Bekele", department:"General Medicine", diagnosis:"Migraine", date:"2026-08-19", status:"Completed"},
  {id:"MR-1040", patient:"Meron Tadesse", patientId:"PT-1003", doctor:"Dr. Selamawit Alemu", department:"Endocrinology", diagnosis:"Type 2 Diabetes", date:"2026-08-18", status:"Active"},
  {id:"MR-1039", patient:"Dawit Girma", patientId:"PT-1004", doctor:"Dr. Michael Solomon", department:"Orthopedics", diagnosis:"Back Pain", date:"2026-08-17", status:"Completed"},
  {id:"MR-1038", patient:"Rahel Tesfaye", patientId:"PT-1005", doctor:"Dr. Hana Mekonnen", department:"Cardiology", diagnosis:"Arrhythmia", date:"2026-08-16", status:"Active"},
  {id:"MR-1037", patient:"Samuel Bekele", patientId:"PT-1006", doctor:"Dr. Daniel Bekele", department:"Neurology", diagnosis:"Headache", date:"2026-08-15", status:"Completed"}
];

export const seedPrescriptions = [
  {id:"RX-1001", patient:"Abebe Kebede", patientId:"PT-1001", doctor:"Dr. Sara Tesfaye", medicine:"Amlodipine", dosage:"5 mg", frequency:"Once daily", duration:"30 days", date:"2026-08-20", status:"Active"},
  {id:"RX-1002", patient:"Hanna Worku", patientId:"PT-1002", doctor:"Dr. Daniel Bekele", medicine:"Paracetamol", dosage:"500 mg", frequency:"Twice daily", duration:"7 days", date:"2026-08-19", status:"Completed"},
  {id:"RX-1003", patient:"Meron Tadesse", patientId:"PT-1003", doctor:"Dr. Selamawit Alemu", medicine:"Metformin", dosage:"500 mg", frequency:"Twice daily", duration:"30 days", date:"2026-08-18", status:"Active"},
  {id:"RX-1004", patient:"Dawit Girma", patientId:"PT-1004", doctor:"Dr. Michael Solomon", medicine:"Amoxicillin", dosage:"500 mg", frequency:"Three times daily", duration:"10 days", date:"2026-08-17", status:"Completed"},
  {id:"RX-1005", patient:"Rahel Tesfaye", patientId:"PT-1005", doctor:"Dr. Hana Mekonnen", medicine:"Losartan", dosage:"50 mg", frequency:"Once daily", duration:"30 days", date:"2026-08-16", status:"Active"}
];

export const appointments = [
  {patient:"Abebe Kebede", doctor:"Dr. Sara Tesfaye", department:"Cardiology", time:"09:30 AM", status:"Confirmed"},
  {patient:"Meron Alemu", doctor:"Dr. Daniel Bekele", department:"Neurology", time:"10:15 AM", status:"Confirmed"},
  {patient:"Hana Tadesse", doctor:"Dr. Rahel Mekonnen", department:"Pediatrics", time:"11:00 AM", status:"Pending"},
  {patient:"Yonas Girma", doctor:"Dr. Michael Tesfaye", department:"Orthopedics", time:"01:30 PM", status:"Confirmed"}
];