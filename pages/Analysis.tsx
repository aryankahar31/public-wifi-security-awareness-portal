import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { getAnalysisData } from '../services/dataService';
import { motion } from 'framer-motion';
import type { ChartData } from '../types';
import useTheme from '../hooks/useTheme';
import { CustomChartTooltip } from '../components/CustomChartTooltip';
import { useData } from '../contexts/DataContext';
import AnimatedPage from '../components/AnimatedPage';

const COLORS = ['#61dca3', '#61b3dc', '#b361dc', '#dca361', '#dc6161', '#a361dc'];

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="w-full h-96 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-4 flex flex-col">
        <h4 className="text-lg font-bold text-center text-secondary mb-4">{title}</h4>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const Analysis: React.FC = () => {
    const { surveyData } = useData();
    const analysisData = useMemo(() => getAnalysisData(surveyData), [surveyData]);
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#aab2bb' : '#475569';

    const chartConfigs = [
        { title: "Risk Awareness Levels", dataKey: "awareness", type: "pie" },
        { title: "Security Measures Usage", dataKey: "vpn_usage", type: "pie" },
        { title: "Feeling of Security", dataKey: "trust_levels", type: "pie" },
        { title: "Age Group Distribution", dataKey: "age_groups", type: "pie" },
        { title: "Public Wi-Fi Usage Frequency", dataKey: "wifi_frequency", type: "pie" },
        { title: "Security Threat Encounters", dataKey: "threat_encounters", type: "pie" },
        { title: "Occupation Breakdown", dataKey: "occupations", type: "bar" },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const transformData = (chartData: ChartData) => {
        if (!chartData || !chartData.labels) return [];
        return chartData.labels.map((label, index) => ({
            name: label,
            value: chartData.data[index],
        }));
    };

    return (
        <AnimatedPage>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-text-primary-light dark:text-white">Live Survey Analysis</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-4 max-w-3xl mx-auto">
                    These charts are generated from our anonymous survey data, providing an ongoing snapshot of user habits and risk awareness.
                </p>
            </div>
            
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {chartConfigs.map(({ title, dataKey, type }) => {
                    const data = analysisData[dataKey as keyof typeof analysisData];
                    const chartData = transformData(data);
                    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

                    return (
                        <motion.div key={title} variants={itemVariants}>
                            <ChartCard title={title}>
                                {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    {type === 'pie' ? (
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fill: tickColor }}>
                                                {chartData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltip total={total} />} />
                                            <Legend wrapperStyle={{ color: tickColor }} />
                                        </PieChart>
                                    ) : (
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis type="number" stroke={tickColor} />
                                            <YAxis type="category" dataKey="name" width={120} stroke={tickColor} interval={0} tick={{ fontSize: 12 }} />
                                            <Tooltip content={<CustomChartTooltip total={total} />} cursor={{ fill: 'rgba(97, 179, 220, 0.1)' }}/>
                                            <Bar dataKey="value" fill="#61dca3" />
                                            <Brush dataKey="name" height={30} stroke="#61dca3" fill={theme === 'dark' ? '#0d1117' : '#e8edf2'} />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                                ) : (
                                  <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">No data to display.</div>
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