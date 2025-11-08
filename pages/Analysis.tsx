import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";

import { motion } from "framer-motion";
import { useData } from "../contexts/DataContext";
import AnimatedPage from "../components/AnimatedPage";
import useTheme from "../hooks/useTheme";
import { CustomChartTooltip } from "../components/CustomChartTooltip";

const COLORS = ["#61dca3", "#61b3dc", "#b361dc", "#dca361", "#dc6161", "#a361dc"];

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="w-full h-96 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-4 flex flex-col">
    <h4 className="text-lg font-bold text-center text-secondary mb-4">{title}</h4>
    <div className="flex-grow">{children}</div>
  </div>
);

const Analysis: React.FC = () => {
  const { surveyData, loading } = useData();
  const { theme } = useTheme();
  const tickColor = theme === "dark" ? "#aab2bb" : "#475569";

  if (loading) {
    return (
      <AnimatedPage>
        <div className="text-center pt-16 text-xl">Fetching live data… 🔄</div>
      </AnimatedPage>
    );
  }

  if (!surveyData.length) {
    return (
      <AnimatedPage>
        <div className="text-center pt-16 text-xl">
          No data available — submit a survey response ✏️
        </div>
      </AnimatedPage>
    );
  }

  // ✅ Convert Supabase rows → chart format
  const transform = (data: string[]) => {
    const map: Record<string, number> = {};
    data.forEach((v) => (map[v] = (map[v] || 0) + 1));
    return Object.entries(map).map(([label, value]) => ({ name: label, value }));
  };

  // ✅ Data mapping
  const charts = [
    { title: "Risk Awareness Levels", data: transform(surveyData.map((d) => d.awareness_risk)), type: "pie" },
    { title: "Security Measures Usage", data: transform(surveyData.map((d) => d.security_measures)), type: "pie" },
    { title: "Feeling of Security", data: transform(surveyData.map((d) => d.security_feeling)), type: "pie" },
    { title: "Age Group Distribution", data: transform(surveyData.map((d) => d.age_group)), type: "pie" },
    { title: "Public Wi-Fi Usage Frequency", data: transform(surveyData.map((d) => d.wifi_frequency)), type: "pie" },
    { title: "Security Threat Encounters", data: transform(surveyData.map((d) => d.security_issues)), type: "pie" },
    { title: "Occupation Breakdown", data: transform(surveyData.map((d) => d.occupation)), type: "bar" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedPage>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary-light dark:text-white">
          Live Survey Analysis
        </h1>

        {/* ✅ Glass Information Box */}
        <div className="text-center max-w-2xl mx-auto mt-6 p-8 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Your input is vital. This survey is <strong>100% anonymous</strong> and updates these charts in real-time.
            <br /><br />
            These charts reflect behaviour and security awareness from live submissions.
          </p>
        </div>
      </div>

      {/* ✅ Chart Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {charts.map(({ title, data, type }) => {
          const total = data.reduce((sum, entry) => sum + entry.value, 0);

          return (
            <motion.div key={title} variants={itemVariants}>
              <ChartCard title={title}>
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {type === "pie" ? (
                      <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fill: tickColor }}>
                          {data.map((_entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomChartTooltip total={total} />} />
                        <Legend wrapperStyle={{ color: tickColor }} />
                      </PieChart>
                    ) : (
                      <BarChart data={data} layout="vertical">
                        <XAxis type="number" stroke={tickColor} />
                        <YAxis type="category" dataKey="name" width={120} stroke={tickColor} />
                        <Tooltip content={<CustomChartTooltip total={total} />} />
                        <Bar dataKey="value" fill="#61dca3" />
                        <Brush dataKey="name" height={30} stroke="#61dca3" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
                    No data to display.
                  </div>
                )}
              </ChartCard>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatedPage>
  );
};

export default Analysis;
