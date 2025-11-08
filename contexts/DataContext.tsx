import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { ProcessedSurveyResponse } from '../types';
import { getInitialDataSet } from '../services/dataService';

interface DataContextType {
  surveyData: ProcessedSurveyResponse[];
  addSurveyResponse: (response: ProcessedSurveyResponse) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<ProcessedSurveyResponse[]>(() => getInitialDataSet());

  const addSurveyResponse = (response: ProcessedSurveyResponse) => {
    setSurveyData(prevData => [...prevData, response]);
  };

  return (
    <DataContext.Provider value={{ surveyData, addSurveyResponse }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};