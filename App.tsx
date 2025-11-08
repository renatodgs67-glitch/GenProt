import React, { useState, useRef, useCallback } from 'react';
import { Patient, SessionData, GeminiResponse } from './types';
import { generateAcupunctureReport } from './services/geminiService';
import PatientForm from './components/PatientForm';
import TcmQuestionsForm from './components/TcmQuestionsForm';
import ResultsDisplay from './components/ResultsDisplay';
import { Spinner } from './components/icons/Spinner';

// Make jspdf and html2canvas available from the window object
declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const protocolRef = useRef<HTMLDivElement>(null);

  const handlePatientSubmit = (patientData: Patient) => {
    setPatient(patientData);
    setStep(2);
  };

  const handleTcmSubmit = async (data: Omit<SessionData, 'tcmAnswers'>, tcmAnswers: Record<string, string>) => {
    const fullSessionData = { ...data, tcmAnswers };
    setSessionData(fullSessionData);
    setIsLoading(true);
    setError(null);
    setStep(3);

    try {
      if (!patient) throw new Error("Dati del paziente non disponibili.");
      
      const response = await generateAcupunctureReport({ ...patient, age: calculateAge(patient.dob) }, fullSessionData);
      setGeminiResponse(response);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Si è verificato un errore sconosciuto durante la generazione del referto.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDownloadPdf = useCallback(async (
    ref: React.RefObject<HTMLDivElement>, 
    filename: string,
    format: 'a4' | 'a4'
  ) => {
    if (!ref.current) return;
    
    const { jsPDF } = jspdf;
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: format,
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    const totalPages = Math.ceil(imgHeight / pdfHeight);

    for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, -i * pdfHeight, imgWidth, imgHeight);
    }

    pdf.save(`${filename}.pdf`);
  }, []);

  const handleDownloadDocx = useCallback(() => {
    if (!patient || !sessionData || !geminiResponse) return;

    const { reportData } = geminiResponse;
    const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>Referto ${patient.name}</title>
      </head>
      <body>
        <p>Scheda Riepilogativa della Seduta di Agopuntura</p>
        <br>
        <p>Data della Valutazione: ${today} (${sessionData.sessionNumber}ª seduta)</p>
        <p>Paziente: ${patient.name.toUpperCase()}</p>
        <p>Età: ${calculateAge(patient.dob)} anni</p>
        <p>Contatto Telefonico: ${patient.phone}</p>
        <br>
        <p>SINTESI CLINICA</p>
        <p>${reportData.clinicalSynthesis.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Esame Obiettivo secondo MTC (eseguito in I seduta):</p>
        <p>• Lingua: ${reportData.objectiveExamination.tongue}</p>
        <p>• Polso: ${reportData.objectiveExamination.pulse}</p>
        <br>
        <p>ORIENTAMENTO DIAGNOSTICO SECONDO MTC (Rivalutabile nel tempo):</p>
        <p>${reportData.tcmDiagnosis.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Si sottolinea che nella Medicina Tradizionale Cinese gli organi sono intesi come sistemi energetico-funzionali che integrano aspetti fisici ed emotivi, andando oltre la semplice definizione anatomica considerata dalla medicina convenzionale occidentale.</p>
        <br>
        <p>_______________________________________________________________________________________________________________</p>
        <br>
        <p>Previa acquisizione del Consenso Informato espresso dal/lla Paziente, si è proceduto al trattamento dei seguenti agopunti:</p>
        ${reportData.treatmentPointsSimple.map(point => `<p>• ${point}</p>`).join('')}
        <br>
        <p>Tempo di Ritenzione degli Aghi: ${reportData.needleRetentionTime}</p>
        <p>(prestazione gratuita – training su campo)</p>
        <br>
        <br>
        <p>Dott. Di Gesù Renato</p>
        <p>(Medico Agopuntore in Formazione)</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Referto_${patient.name.replace(/\s/g, '_')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [patient, sessionData, geminiResponse]);


  const startOver = () => {
    setStep(1);
    setPatient(null);
    setSessionData(null);
    setGeminiResponse(null);
    setIsLoading(false);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PatientForm onSubmit={handlePatientSubmit} />;
      case 2:
        return <TcmQuestionsForm onSubmit={handleTcmSubmit} />;
      case 3:
        if (isLoading) {
          return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl text-center">
              <Spinner />
              <p className="mt-4 text-lg font-semibold text-gray-700">Generazione del protocollo in corso...</p>
              <p className="mt-2 text-gray-500">L'intelligenza artificiale sta analizzando i dati. Potrebbe richiedere qualche istante.</p>
            </div>
          );
        }
        if (error) {
          return (
            <div className="p-8 bg-white rounded-lg shadow-xl text-center">
              <p className="text-xl font-bold text-red-600">Errore</p>
              <p className="mt-2 text-gray-600">{error}</p>
              <button onClick={startOver} className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Ricomincia</button>
            </div>
          );
        }
        if (geminiResponse && patient && sessionData) {
          return (
            <ResultsDisplay
              patient={patient}
              sessionData={sessionData}
              response={geminiResponse}
              onDownloadProtocol={() => handleDownloadPdf(protocolRef, `Protocollo_${patient.name.replace(/\s/g, '_')}`,'a4')}
              onDownloadDocx={handleDownloadDocx}
              onStartOver={startOver}
              protocolRef={protocolRef}
            />
          );
        }
        return null;
      default:
        return <PatientForm onSubmit={handlePatientSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Generatore di Protocolli per Agopuntura</h1>
        <p className="mt-2 text-md text-gray-600">Inserisci i dati per generare un protocollo di trattamento personalizzato ed un referto.</p>
      </header>
      <main className="w-full max-w-4xl">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;