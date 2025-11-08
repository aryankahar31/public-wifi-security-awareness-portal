import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { generatePdfReport } from "../services/pdfService";
import { generateCsv } from "../services/csvService";
import {
  Users,
  Shield,
  Wifi,
  AlertTriangle,
  Wallet,
  Newspaper,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import AnimatedPage from "../components/AnimatedPage";
import { Link } from "react-router-dom";

// ✅ Safe lowercase text formatter
const normalizeText = (value: string | null | undefined) =>
  value?.toLowerCase().trim() ?? "";

const Results: React.FC = () => {
  const { surveyData, loading } = useData();

  // ✅ Summary calculations
  const findings = useMemo(() => {
    if (!surveyData || surveyData.length === 0) {
      return {
        total_responses: 0,
        vpn_users_percentage: 0,
        high_awareness_percentage: 0,
        threat_encounter_percentage: 0,
        daily_wifi_percentage: 0,
        willing_to_pay_percentage: 0,
      };
    }

    const total = surveyData.length;
    const percent = (count: number) => Math.round((count / total) * 100);

    return {
      total_responses: total,
      vpn_users_percentage: percent(
        surveyData.filter((row) => {
          const v = normalizeText(row.security_measures);
          return v === "yes" || v.includes("always");
        }).length
      ),
      high_awareness_percentage: percent(
        surveyData.filter((row) =>
          normalizeText(row.awareness_risk).includes("yes")
        ).length
      ),
      threat_encounter_percentage: percent(
        surveyData.filter((row) => normalizeText(row.security_issues) === "yes")
          .length
      ),
      daily_wifi_percentage: percent(
        surveyData.filter((row) => normalizeText(row.wifi_frequency) === "daily")
          .length
      ),
      willing_to_pay_percentage: percent(
        surveyData.filter((row) => normalizeText(row.pay_for_wifi) === "yes")
          .length
      ),
    };
  }, [surveyData]);

  const stats = [
    { value: findings.total_responses, label: "Total Survey Responses", icon: <Users /> },
    { value: `${findings.vpn_users_percentage}%`, label: "Always Use Security Measures", icon: <Shield /> },
    { value: `${findings.high_awareness_percentage}%`, label: "Report High Risk Awareness", icon: <Newspaper /> },
    { value: `${findings.threat_encounter_percentage}%`, label: "Confirmed a Threat Encounter", icon: <AlertTriangle /> },
    { value: `${findings.daily_wifi_percentage}%`, label: "Use Public Wi-Fi Daily", icon: <Wifi /> },
    { value: `${findings.willing_to_pay_percentage}%`, label: "Willing to Pay for Secure Wi-Fi", icon: <Wallet /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="text-center pt-16 text-xl">Fetching Results… ⏳</div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="text-center">

        {/* ✅ Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-text-primary-light dark:text-white">
          Key Findings & Results
        </h1>

        {/* ✅ !!! Added the SAME UI block like your survey page !!! */}
        <div className="text-center max-w-2xl mx-auto mb-12 p-8 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            High-level, real-time insights based on live survey responses — charts and results update automatically.
          </p>
        </div>

        {findings.total_responses > 0 ? (
          <>
            {/* ✅ Stats Glass Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_5px_rgba(97,220,163,0.25)]"
                >
                  <div className="text-primary mx-auto w-fit mb-3">{stat.icon}</div>
                  <h3 className="text-4xl font-bold font-mono text-text-primary-light dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ✅ Download Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-4 text-text-primary-light dark:text-white">
                Download Full Report
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-xl mx-auto mb-6">
                Get a detailed PDF / CSV breakdown generated from the latest responses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => generatePdfReport(surveyData)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_30px_5px_#61dca3]"
                >
                  <FileText size={20} /> Download PDF Report
                </button>

                <button
                  onClick={() => generateCsv(surveyData)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-secondary text-secondary font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-secondary hover:text-black hover:shadow-[0_0_30px_5px_#61b3dc]"
                >
                  <FileSpreadsheet size={20} /> Export as CSV
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          // ✅ No Data UI
          <div className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-text-primary-light dark:text-white">
              Awaiting Data...
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              No submissions yet. Be the first to contribute!
            </p>
            <Link
              to="/survey"
              className="relative inline-block px-6 py-3 border border-primary text-primary font-bold uppercase tracking-wider rounded-md transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_30px_5px_#61dca3]"
            >
              Take Survey
            </Link>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Results;
