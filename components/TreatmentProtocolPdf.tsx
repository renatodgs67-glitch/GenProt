
import React from 'react';
import { Patient, ProtocolData } from '../types';
import { Logo } from './icons/Logo';

interface Props {
  patient: Patient;
  sessionNumber: string;
  protocolData: ProtocolData;
}

const TreatmentProtocolPdf: React.FC<Props> = ({ patient, sessionNumber, protocolData }) => {
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="bg-white font-sans text-black p-8 w-[210mm] min-h-[297mm] text-sm">
      <header className="flex items-start border-b-2 border-black pb-4 mb-8">
        <div className="w-20 mr-6 flex-shrink-0">
            <Logo />
        </div>
        <div className="pt-2">
            <h1 className="text-lg font-bold text-black uppercase">Protocollo di Trattamento di Agopuntura</h1>
            <h2 className="text-base mt-1 text-black">Dott. Di Gesù Renato</h2>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Dati Paziente e Seduta</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <p><strong>Paziente:</strong> {patient.name.toUpperCase()}</p>
            <p><strong>Data:</strong> {today}</p>
            <p><strong>Contatto:</strong> {patient.phone}</p>
            <p><strong>Seduta N°:</strong> {sessionNumber}</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Ragionamento Diagnostico Sintetico</h3>
        <p className="italic text-gray-700 leading-relaxed">{protocolData.diagnosticReasoning}</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Protocollo Terapeutico Dettagliato</h3>
        
        <p className="mb-4"><strong>Ordine di Infissione suggerito:</strong> {protocolData.needlingOrder.join(' → ')}</p>

        <div className="space-y-4">
          {protocolData.treatmentPointsDetailed.map((point, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-lg font-bold text-blue-700">{point.code} - {point.chineseName}</h4>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <p><strong>Localizzazione:</strong> {point.location}</p>
                <p><strong>Stimolazione:</strong> {point.stimulation} ({point.side})</p>
                <p><strong>Angolo:</strong> {point.angle}</p>
                <p><strong>Profondità:</strong> {point.depth}</p>
                <p className="col-span-2"><strong>Precauzioni:</strong> {point.precautions || 'Nessuna particolare.'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Legenda Modalità di Stimolazione</h3>
        <div className="text-xs space-y-1 text-gray-600">
          <p><strong>Tonificazione:</strong> {protocolData.stimulationLegend.tonification}</p>
          <p><strong>Dispersione:</strong> {protocolData.stimulationLegend.dispersion}</p>
          <p><strong>Armonizzazione:</strong> {protocolData.stimulationLegend.harmonization}</p>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>Previa acquisizione del Consenso Informato espresso dal/dalla Paziente.</p>
        <p>Questo protocollo è un suggerimento basato sull'analisi e può essere modificato dal medico agopuntore.</p>
      </footer>
    </div>
  );
};

export default TreatmentProtocolPdf;