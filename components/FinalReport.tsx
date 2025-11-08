import React from 'react';
import { Patient, ReportData } from '../types';
import { Logo } from './icons/Logo';

interface Props {
  patient: Patient;
  sessionNumber: string;
  reportData: ReportData;
}

const FinalReport: React.FC<Props> = ({ patient, sessionNumber, reportData }) => {
  
  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="bg-white font-sans text-black">
      <div className="w-[210mm] min-h-[297mm] p-12 flex flex-col text-sm">
        <header className="flex items-start border-b-2 border-black pb-4">
            <div className="w-20 mr-6 flex-shrink-0">
                <Logo />
            </div>
            <div className="pt-2">
                <h1 className="text-base font-bold text-black">AGOPUNTURA – LA CURA DEL DETTAGLIO PER IL TUO BENESSERE</h1>
                <h2 className="text-sm mt-1 text-black">Dott. Di Gesù Renato</h2>
            </div>
        </header>

        <section className="mt-12">
            <h3 className="text-center text-xl font-bold text-red-700">Scheda Riepilogativa della Seduta di Agopuntura</h3>
            <div className="mt-8 space-y-2">
                <div className="flex justify-between">
                    <p><strong>Data della Valutazione:</strong> {today}</p>
                    <p>({sessionNumber}ª seduta)</p>
                </div>
                <p><strong>Paziente:</strong> {patient.name.toUpperCase()}</p>
                <p><strong>Età:</strong> {getAge(patient.dob)} anni</p>
                <p><strong>Contatto Telefonico:</strong> {patient.phone}</p>
            </div>
        </section>

        <section className="mt-10">
            <h4 className="font-bold border-b border-gray-400 pb-1 uppercase">SINTESI CLINICA</h4>
            <p className="mt-2 leading-relaxed">{reportData.clinicalSynthesis}</p>
        </section>
        
        <section className="mt-8">
            <h4 className="font-bold">Esame Obiettivo:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Lingua:</strong> {reportData.objectiveExamination.tongue}</li>
                <li><strong>Polso:</strong> {reportData.objectiveExamination.pulse}</li>
            </ul>
        </section>

        <section className="mt-10">
            <h4 className="font-bold border-b border-gray-400 pb-1 uppercase">Ipotesi Diagnostica secondo MTC (Rivalutabile nel tempo):</h4>
             <ul className="list-disc list-inside mt-4 space-y-1">
                <li>{reportData.tcmDiagnosis}</li>
            </ul>
            <p className="mt-4 text-xs italic">
                Si sottolinea che nella Medicina Tradizionale Cinese gli organi sono intesi come sistemi energetico-funzionali che integrano aspetti fisici ed emotivi, andando oltre la semplice definizione anatomica considerata dalla medicina convenzionale occidentale.
            </p>
        </section>
        
        <section className="mt-8">
            <p>Previa acquisizione del Consenso Informato espresso dal/lla Paziente, si è proceduto al trattamento dei seguenti agopunti:</p>
            <ul className="list-disc list-inside mt-4 text-sm space-y-2 pl-4">
                {reportData.treatmentPointsSimple.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
            <p className="mt-6"><strong>Tempo di Ritenzione degli Aghi:</strong> {reportData.needleRetentionTime}</p>
        </section>
        
        <div className="flex-grow"></div>

        <section className="mt-auto pt-10 text-right">
            <p className="font-bold">Dott. Di Gesù Renato</p>
            <p>(Medico Agopuntore in Formazione)</p>
        </section>
      </div>
    </div>
  );
};

export default FinalReport;