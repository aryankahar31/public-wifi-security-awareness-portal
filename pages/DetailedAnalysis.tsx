import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

import { CustomChartTooltip } from '../components/CustomChartTooltip';
import useTheme from '../hooks/useTheme';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, AreaChart as AreaIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AnimatedPage from '../components/AnimatedPage';

type ChartType = 'bar' | 'pie' | 'line' | 'area';

const COLORS = ['#61dca3', '#61b3dc', '#b361dc', '#dca361', '#dc6161', '#a361dc', '#dc61b3'];

// ✅ Mapping Supabase DB fields to UI labels
const DIMENSIONS = [
  { label: 'Occupation', key: 'occupation' },
  { label: 'Age Group', key: 'age_group' },
  { label: 'WiFi Usage Frequency', key: 'wifi_frequency' },
  { label: 'Connection Location', key: 'connection_location' },
  { label: 'Activities Performed', key: 'activities' },
  { label: 'Risk Awareness', key: 'awareness_risk' },
  { label: 'Security Measures (VPN)', key: 'security_measures' },
  { label: 'Threats Encountered', key: 'security_issues' },
  { label: 'Feeling of Security', key: 'security_feeling' },
  { label: 'Reads Terms & Conditions', key: 'reads_terms' },
  { label: 'Responsibility', key: 'responsibility' },
  { label: 'Willingness to Pay', key: 'pay_for_wifi' },
];

const DetailedAnalysis: React.FC = () => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#aab2bb' : '#475569';

  const { surveyData } = useData(); // ✅ Live Supabase dataset

  const [primaryDimension, setPrimaryDimension] = useState<string>(DIMENSIONS[0].key);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [filterDimension, setFilterDimension] = useState<string>('none');
  const [filterValue, setFilterValue] = useState<string>('none');

  const filterOptions = useMemo(() => {
    if (filterDimension === 'none') return [];
    const uniqueValues = new Set(surveyData.map((item) => item[filterDimension as keyof typeof item]));
    return Array.from(uniqueValues);
  }, [filterDimension, surveyData]);

  // ✅ Build dataset for chart
  const chartData = useMemo(() => {
    let filteredData = surveyData;
    if (filterDimension !== 'none' && filterValue !== 'none') {
      filteredData = surveyData.filter((item) => item[filterDimension as keyof typeof item] === filterValue);
    }

    const counts: Record<string, number> = {};
    filteredData.forEach((item) => {
      const value = item[primaryDimension as keyof typeof item] as string;
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [primaryDimension, filterDimension, filterValue, surveyData]);

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}
              label={{ fill: tickColor, fontSize: 10 }}>
              {chartData.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomChartTooltip total={total} />} />
            <Legend wrapperStyle={{ color: tickColor }} />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={tickColor} />
            <YAxis stroke={tickColor} />
            <Tooltip content={<CustomChartTooltip total={total} />} />
            <Line type="monotone" dataKey="value" stroke="#61dca3" strokeWidth={2} />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={tickColor} />
            <YAxis stroke={tickColor} />
            <Tooltip content={<CustomChartTooltip total={total} />} />
            <Area type="monotone" dataKey="value" stroke="#61dca3" fill="#61dca3" fillOpacity={0.3} />
          </AreaChart>
        );

      case 'bar':
      default:
        return (
          <BarChart layout="vertical" data={chartData}>
            <XAxis type="number" stroke={tickColor} />
            <YAxis dataKey="name" type="category" stroke={tickColor} />
            <Tooltip content={<CustomChartTooltip total={total} />} />
            <Bar dataKey="value">
              {chartData.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  const inputClasses =
    "w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md p-2 mt-1 focus:ring-2 focus:ring-primary";

  return (
    <AnimatedPage>

      {/* ✅ HEADER + GLASS BOX SECTION */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary-light dark:text-white">
          Detailed Analysis Tool
        </h1>

        {/* ✅ Glass Info Box */}
        <div className="text-center max-w-2xl mx-auto mt-6 p-8 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl">
          <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Your input is vital. This survey is <strong>100% anonymous</strong> and updates charts in real-time.
            <br /><br />
            Analyze live Supabase survey results.
          </p>
        </div>
      </div>  {/* ✅ CLOSING DIV FIXED HERE */}

      {/* ✅ Control Panel */}
      <div className="bg-card-light/80 dark:bg-card-dark/80 p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label>Primary Dimension</label>
            <select className={inputClasses} value={primaryDimension}
              onChange={(e) => setPrimaryDimension(e.target.value)}>
              {DIMENSIONS.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Filter Field</label>
            <select className={inputClasses} value={filterDimension}
              onChange={(e) => { setFilterDimension(e.target.value); setFilterValue("none"); }}>
              <option value="none">No Filter</option>
              {DIMENSIONS.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Filter Value</label>
            <select className={inputClasses} value={filterValue}
              disabled={filterDimension === "none"}
              onChange={(e) => setFilterValue(e.target.value)}>
              <option value="none">All</option>
              {filterOptions.map((v) => (
                <option key={v as string} value={v as string}>{v as string}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Chart Type</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setChartType("bar")} className="p-2 rounded bg-primary"><BarChart3 /></button>
              <button onClick={() => setChartType("pie")} className="p-2 rounded bg-primary"><PieIcon /></button>
              <button onClick={() => setChartType("line")} className="p-2 rounded bg-primary"><LineIcon /></button>
              <button onClick={() => setChartType("area")} className="p-2 rounded bg-primary"><AreaIcon /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Chart Container */}
      <div className="h-[500px] bg-card-light/80 dark:bg-card-dark/80 p-4 rounded-xl">
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>

    </AnimatedPage>
  );
};

export default DetailedAnalysis;
