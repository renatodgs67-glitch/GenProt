import { GoogleGenAI, Type } from '@google/genai';
import { Patient, SessionData, GeminiResponse } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, this should be handled more gracefully.
  // For this environment, we assume the key is always present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generatePrompt = (patient: Patient & { age: number }, sessionData: SessionData): string => {
  const tcmAnswersString = Object.entries(sessionData.tcmAnswers)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  return `
    Sei un esperto di Medicina Tradizionale Cinese (MTC) e agopuntura.
    Analizza i seguenti dati del paziente e genera un referto di agopuntura e un protocollo di trattamento dettagliato in lingua ITALIANA.

    **Dati Paziente:**
    - Nome: ${patient.name}
    - Età: ${patient.age} anni
    - Motivo Principale della Visita: ${sessionData.mainComplaint}

    **Risposte alle 10 Domande della MTC:**
    ${tcmAnswersString}
    
    **Esame Obiettivo Fornito:**
    - Lingua: ${sessionData.tongue}
    - Polso: ${sessionData.pulse}

    **Istruzioni per la Generazione:**
    1.  **Sintesi Clinica:** Riassumi in modo descrittivo e oggettivo i sintomi e i disturbi principali lamentati dal paziente, basandoti sul motivo della visita e sulle risposte alle 10 domande. **NON utilizzare terminologia diagnostica o interpretativa della MTC** (es. evita frasi come "deficit di Qi", "stasi di Fegato", "calore nel Sangue", ecc.). La sintesi deve essere puramente sintomatologica.
    2.  **Esame Obiettivo:** Utilizza ESATTAMENTE i dati forniti nella sezione "Esame Obiettivo Fornito" per descrivere lingua e polso nel referto. Non inventare o modificare queste informazioni.
    3.  **Orientamento Diagnostico MTC:** Fornisci un orientamento diagnostico secondo i principi della MTC, descrivendo sinteticamente il pattern disarmonico principale riscontrato (es. "Stasi di Qi di Fegato", "Deficit di Sangue di Milza", "Umidità-Calore nella Vescica Urinaria"). Puoi fare riferimento sintetico ai principi interpretativi della MTC. La descrizione deve essere concisa.
    4.  **Punti di Trattamento Semplificati:** Elenca solo i codici dei punti di trattamento e se sono mediali o bilaterali (es. "Yintang (Mediale)", "LR3 (Bilaterale)").
    5.  **Tempo di Ritenzione Aghi:** Suggerisci un tempo di ritenzione standard (es. "30-40 minuti").
    6.  **Ragionamento Diagnostico:** Fornisci un ragionamento diagnostico estremamente sintetico per il protocollo dettagliato.
    7.  **Protocollo Dettagliato:** Per ogni punto suggerito, fornisci: codice, nome cinese (Pinyin), localizzazione sintetica, angolo e profondità di infissione, precauzioni, se è bilaterale/monolaterale/mediale, e la modalità di stimolazione (Tonificazione, Dispersione, Armonizzazione).
    8.  **Ordine di Infissione:** Suggerisci un ordine logico per l'infissione degli aghi.
    9.  **Legenda Stimolazione:** Fornisci una breve spiegazione su come ottenere le tre modalità di stimolazione.

    Restituisci l'output ESCLUSIVAMENTE in formato JSON, seguendo lo schema fornito. Non includere testo o spiegazioni al di fuori del JSON.
  `;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    reportData: {
      type: Type.OBJECT,
      properties: {
        clinicalSynthesis: { type: Type.STRING },
        objectiveExamination: {
          type: Type.OBJECT,
          properties: {
            tongue: { type: Type.STRING },
            pulse: { type: Type.STRING },
          },
          required: ['tongue', 'pulse'],
        },
        tcmDiagnosis: { type: Type.STRING },
        treatmentPointsSimple: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        needleRetentionTime: { type: Type.STRING },
      },
      required: ['clinicalSynthesis', 'objectiveExamination', 'tcmDiagnosis', 'treatmentPointsSimple', 'needleRetentionTime'],
    },
    protocolData: {
      type: Type.OBJECT,
      properties: {
        diagnosticReasoning: { type: Type.STRING },
        treatmentPointsDetailed: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              chineseName: { type: Type.STRING },
              location: { type: Type.STRING },
              angle: { type: Type.STRING },
              depth: { type: Type.STRING },
              precautions: { type: Type.STRING },
              side: { type: Type.STRING, enum: ['Bilaterale', 'Monolaterale', 'Mediale'] },
              stimulation: { type: Type.STRING, enum: ['Tonificazione', 'Dispersione', 'Armonizzazione'] },
            },
            required: ['code', 'chineseName', 'location', 'angle', 'depth', 'precautions', 'side', 'stimulation'],
          },
        },
        needlingOrder: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        stimulationLegend: {
          type: Type.OBJECT,
          properties: {
            tonification: { type: Type.STRING },
            dispersion: { type: Type.STRING },
            harmonization: { type: Type.STRING },
          },
          required: ['tonification', 'dispersion', 'harmonization'],
        },
      },
      required: ['diagnosticReasoning', 'treatmentPointsDetailed', 'needlingOrder', 'stimulationLegend'],
    },
  },
  required: ['reportData', 'protocolData'],
};

export const generateAcupunctureReport = async (
  patient: Patient & { age: number },
  sessionData: SessionData
): Promise<GeminiResponse> => {
  const prompt = generatePrompt(patient, sessionData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    return parsedResponse as GeminiResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate report from Gemini API.');
  }
};