import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";  // ✅ FIXED IMPORT

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setSurveyData(data || []);
    setLoading(false);
  };

  const addSurvey = async (response) => {
    await supabase.from("survey_responses").insert(response);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("survey_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "survey_responses" },
        fetchData
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <DataContext.Provider value={{ surveyData, addSurvey, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
