import { RAW_DATA } from './surveyData';
import type { RawSurveyResponse } from '../types';

const DB_KEY = 'permanent_survey_database';

/**
 * Simulates fetching all raw survey data from a persistent database.
 * On first run, it initializes the database with seed data.
 * Subsequently, it reads from localStorage.
 */
export const getRawDataFromDB = (): RawSurveyResponse[] => {
  try {
    const storedData = window.localStorage.getItem(DB_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Could not load data from simulated DB", error);
  }

  // If no data, initialize with seed data and save it.
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(RAW_DATA));
  } catch (error) {
    console.error("Could not initialize simulated DB", error);
  }
  return RAW_DATA;
};

/**
 * Simulates saving a new raw survey response to the database.
 */
export const saveRawResponseToDB = (newResponse: RawSurveyResponse): void => {
  const currentData = getRawDataFromDB();
  const updatedData = [...currentData, newResponse];
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Could not save new response to simulated DB", error);
  }
};
