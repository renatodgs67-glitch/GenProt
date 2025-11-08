
import React, { useState } from 'react';
import { Patient } from '../types';

interface Props {
  onSubmit: (patient: Patient) => void;
}

const PatientForm: React.FC<Props> = ({ onSubmit }) => {
  const [patient, setPatient] = useState<Patient>({
    name: '',
    dob: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patient.name && patient.dob && patient.phone) {
      onSubmit(patient);
    } else {
      alert('Per favore, compila tutti i campi.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dati Anagrafici del Paziente</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome e Cognome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patient.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Data di Nascita</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={patient.dob}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contatto Telefonico</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={patient.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Avanti
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
