import React from 'react';
import { Patient, SessionData, GeminiResponse } from '../types';
import FinalReport from './FinalReport';
import TreatmentProtocolPdf from './TreatmentProtocolPdf';

interface Props {
  patient: Patient;
  sessionData: SessionData;
  response: GeminiResponse;
  onDownloadProtocol: () => void;
  onDownloadDocx: () => void;
  onStartOver: () => void;
  protocolRef: React.RefObject<HTMLDivElement>;
}

const ResultsDisplay: React.FC<Props> = ({
  patient,
  sessionData,
  response,
  onDownloadProtocol,
  onDownloadDocx,
  onStartOver,
  protocolRef,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Risultati Generati</h2>
      <p className="mb-6 text-gray-600">
        L'analisi è completa. Puoi visualizzare un'anteprima del referto e del protocollo qui sotto.
        Utilizza i pulsanti per scaricare i documenti nei formati desiderati.
      </p>

      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center mb-8">
        <button
          onClick={onDownloadDocx}
          className="w-full md:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition duration-300 shadow-md"
        >
          Scarica Referto (DOCX)
        </button>
        <button
          onClick={onDownloadProtocol}
          className="w-full md:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition duration-300 shadow-md"
        >
          Scarica Protocollo (PDF)
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-700">Anteprima Referto</h3>
        <div className="mt-4 p-4 border rounded-lg max-h-96 overflow-y-auto bg-gray-50">
           <h4 className="font-bold">Sintesi Clinica</h4>
           <p className="text-sm text-gray-600 mb-2">{response.reportData.clinicalSynthesis}</p>
           <h4 className="font-bold">Ipotesi Diagnostica</h4>
           <p className="text-sm text-gray-600">{response.reportData.tcmDiagnosis}</p>
        </div>
      </div>
      
       <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Anteprima Protocollo Dettagliato</h3>
        <div className="mt-4 p-4 border rounded-lg max-h-[40rem] overflow-y-auto bg-gray-50 text-sm">
          <div className="mb-4">
            <h4 className="font-bold text-md mb-1">Ragionamento Diagnostico Sintetico</h4>
            <p className="italic text-gray-700">{response.protocolData.diagnosticReasoning}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-bold text-md mb-1">Ordine di Infissione suggerito</h4>
            <p className="text-gray-700">{response.protocolData.needlingOrder.join(' → ')}</p>
          </div>
          
          <div>
            <h4 className="font-bold text-md mb-2">Punti di Trattamento</h4>
            <div className="space-y-3">
              {response.protocolData.treatmentPointsDetailed.map((point, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 bg-white">
                  <p className="font-bold text-blue-700">{point.code} - {point.chineseName}</p>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <p><strong>Localizzazione:</strong> {point.location}</p>
                    <p><strong>Stimolazione:</strong> {point.stimulation} ({point.side})</p>
                    <p><strong>Angolo:</strong> {point.angle}</p>
                    <p><strong>Profondità:</strong> {point.depth}</p>
                    <p className="col-span-2"><strong>Precauzioni:</strong> {point.precautions || 'Nessuna particolare.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
              <h4 className="font-bold text-md mb-1">Legenda Modalità di Stimolazione</h4>
              <div className="text-xs space-y-1 text-gray-600">
                <p><strong>Tonificazione:</strong> {response.protocolData.stimulationLegend.tonification}</p>
                <p><strong>Dispersione:</strong> {response.protocolData.stimulationLegend.dispersion}</p>
                <p><strong>Armonizzazione:</strong> {response.protocolData.stimulationLegend.harmonization}</p>
              </div>
          </div>
        </div>
      </div>


      <div className="mt-8 flex justify-center">
        <button
          onClick={onStartOver}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Crea un nuovo referto
        </button>
      </div>

      {/* Hidden components for PDF generation */}
      <div className="absolute -left-[9999px] top-auto w-[210mm] h-auto">
        <div ref={protocolRef}>
          <TreatmentProtocolPdf
            patient={patient}
            sessionNumber={sessionData.sessionNumber}
            protocolData={response.protocolData}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;