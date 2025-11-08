import React, { useState } from 'react';
import { SessionData } from '../types';

interface Props {
  onSubmit: (
    data: Omit<SessionData, 'tcmAnswers'>,
    tcmAnswers: Record<string, string>
  ) => void;
}

const tcmQuestions = [
    'Caldo e Freddo',
    'Sudorazione',
    'Sintomi a Testa e Corpo (dolori o altro)',
    'Feci e Urine',
    'Appetito, Sete e Sapori',
    'Torace e Addome',
    'Sonno',
    'Orecchie e Occhi',
    'Ginecologia (se applicabile)',
    'Stato Emotivo e Stile di Vita'
];

const TcmQuestionsForm: React.FC<Props> = ({ onSubmit }) => {
  const [sessionNumber, setSessionNumber] = useState('');
  const [mainComplaint, setMainComplaint] = useState('');
  const [tongue, setTongue] = useState('');
  const [pulse, setPulse] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>(
    tcmQuestions.reduce((acc, q) => ({ ...acc, [q]: '' }), {})
  );

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionNumber && mainComplaint && tongue && pulse && Object.values(answers).some(a => typeof a === 'string' && a.trim() !== '')) {
      onSubmit({ sessionNumber, mainComplaint, tongue, pulse }, answers);
    } else {
      alert('Per favore, compila tutti i campi: numero seduta, motivo principale, lingua, polso e almeno una risposta alle domande.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dati Seduta e Anamnesi MTC</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="sessionNumber" className="block text-sm font-medium text-gray-700">Numero Seduta</label>
            <input
              type="number"
              id="sessionNumber"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="mainComplaint" className="block text-sm font-medium text-gray-700">Motivo Principale della Visita</label>
            <textarea
              id="mainComplaint"
              value={mainComplaint}
              onChange={(e) => setMainComplaint(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t border-gray-200">Le 10 Domande della MTC</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {tcmQuestions.map(question => (
            <div key={question}>
              <label htmlFor={question} className="block text-sm font-medium text-gray-700">{question}</label>
              <input
                type="text"
                id={question}
                value={answers[question]}
                onChange={(e) => handleAnswerChange(question, e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t border-gray-200">Esame Obiettivo MTC</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="tongue" className="block text-sm font-medium text-gray-700">Lingua</label>
                <textarea id="tongue" value={tongue} onChange={(e) => setTongue(e.target.value)} required rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Descrivere colore, forma, patina, umidità..."
                />
            </div>
            <div>
                <label htmlFor="pulse" className="block text-sm font-medium text-gray-700">Polso</label>
                <textarea id="pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} required rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Descrivere profondità, frequenza, forza, ritmo..."
                />
            </div>
        </div>


        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Genera Protocollo
          </button>
        </div>
      </form>
    </div>
  );
};

export default TcmQuestionsForm;