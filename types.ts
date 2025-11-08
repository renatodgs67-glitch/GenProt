
export interface Patient {
  name: string;
  dob: string;
  phone: string;
}

export interface SessionData {
  sessionNumber: string;
  mainComplaint: string;
  tcmAnswers: Record<string, string>;
  tongue: string;
  pulse: string;
}

export interface TreatmentPointDetailed {
  code: string;
  chineseName: string;
  location: string;
  angle: string;
  depth: string;
  precautions: string;
  side: 'Bilaterale' | 'Monolaterale' | 'Mediale';
  stimulation: 'Tonificazione' | 'Dispersione' | 'Armonizzazione';
}

export interface ReportData {
  clinicalSynthesis: string;
  objectiveExamination: {
    tongue: string;
    pulse: string;
  };
  tcmDiagnosis: string;
  treatmentPointsSimple: string[];
  needleRetentionTime: string;
}

export interface ProtocolData {
  diagnosticReasoning: string;
  treatmentPointsDetailed: TreatmentPointDetailed[];
  needlingOrder: string[];
  stimulationLegend: {
    tonification: string;
    dispersion: string;
    harmonization: string;
  };
}

export interface GeminiResponse {
  reportData: ReportData;
  protocolData: ProtocolData;
}