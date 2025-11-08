import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { useData } from '../contexts/DataContext';   // ✅ Supabase context

const Survey: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const { addSurvey } = useData();  // ✅ Supabase insert function

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // ✅ Map the form to Supabase-compatible object
        const newSurveyResponse = {
            name: formData.get("name") as string,
            email_address: formData.get("email") as string,
            age_group: formData.get("age_group") as string,
            occupation: formData.get("occupation") as string,
            wifi_frequency: formData.get("wifi_frequency") as string,
            connection_location: formData.get("connection_location") as string,
            activities: formData.get("activities") as string,
            awareness_risk: formData.get("awareness_risk") as string,
            security_measures: formData.get("security_measures") as string,
            security_issues: formData.get("security_issues") as string,
            security_feeling: formData.get("security_feeling") as string,
            pay_for_wifi: formData.get("pay_fee") as string,
            reads_terms: formData.get("read_terms") as string,
            responsibility: formData.get("responsibility") as string,
            connection_factors: (formData.get("connection_factors") as string) || "Not specified",
        };

        console.log("📤 Sending to Supabase:", newSurveyResponse);

        await addSurvey(newSurveyResponse);   // ✅ save to Supabase

        setSubmitted(true);
        window.scrollTo(0, 0);
    };

    const formFields = [
        { id: 'age_group', label: 'What is your age group?', type: 'select', options: ['18-24', '25-34', '35-44', '45-54', '55+', 'Below 18'] },
        { id: 'occupation', label: 'What is your occupation?', type: 'select', options: ['Student', 'Professional/Office Worker', 'Freelancer', 'Business Owner', 'Retired', 'Other'] },
        { id: 'wifi_frequency', label: 'How often do you use public Wi-Fi?', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'] },
        { id: 'connection_location', label: 'Where do you most often connect to public Wi-Fi?', type: 'select', options: ['Cafes/Restaurants', 'Airports/Train Stations', 'Hotels', 'Libraries/Public Spaces', 'Other'] },
        { id: 'activities', label: 'What activities do you usually perform on public Wi-Fi?', type: 'select', options: ['Browsing/Social Media', 'Email/Work', 'Streaming/Video', 'Online Shopping/Banking', 'Other'] },
        { id: 'awareness_risk', label: 'Are you aware that public Wi-Fi can pose security risks?', type: 'radio', options: ['High Awareness', 'Medium Awareness', 'Low Awareness'] },
        { id: 'security_measures', label: 'Do you use security measures (e.g., VPN) on public Wi-Fi?', type: 'radio', options: ['Yes, always', 'Sometimes', 'No, never'] },
        { id: 'security_issues', label: 'Have you ever faced security issues on public Wi-Fi?', type: 'radio', options: ['Yes', 'No', 'Unsure'] },
        { id: 'security_feeling', label: 'How secure do you feel on public Wi-Fi?', type: 'radio', options: ['Very secure', 'Somewhat secure', 'Not secure'] },
        { id: 'pay_fee', label: 'Would you pay a small fee for safer public Wi-Fi?', type: 'radio', options: ['Yes', 'Maybe', 'No'] },
        { id: 'read_terms', label: 'Do you read terms and conditions before connecting?', type: 'radio', options: ['Always', 'Sometimes', 'Never'] },
        { id: 'responsibility', label: 'Who should be responsible for public Wi-Fi security?', type: 'select', options: ['Government', 'Wi-Fi Providers', 'Users Themselves', 'Tech Companies', 'Shared Responsibility'] },
    ];

    const inputClasses =
        "w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-text-primary-light dark:text-text-primary-dark";

    return (
        <AnimatedPage>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 text-text-primary-light dark:text-white">
                    Take the Survey
                </h1>

                <section className="my-16">
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8"
                            >
                                <h2 className="text-3xl font-bold text-primary mb-4">
                                    ✅ Thank You for Your Contribution!
                                </h2>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                                    Your response has been saved to our research database.
                                </p>
                                <Link
                                    to="/analysis"
                                    className="relative inline-block px-6 py-3 border border-primary text-primary font-bold uppercase tracking-wider rounded-md overflow-hidden transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_30px_5px_#61dca3]"
                                >
                                    View Live Analysis
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="text-center max-w-2xl mx-auto mb-12 p-8 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl">
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                                        Your input is vital. This survey takes less than 2 minutes and is 100% anonymous.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-8 space-y-6">

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block mb-2 font-medium">Your Name (Optional)</label>
                                            <input type="text" name="name" placeholder="Enter your name" className={inputClasses} />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">Your Email (Optional)</label>
                                            <input type="email" name="email" placeholder="Enter your email" className={inputClasses} />
                                        </div>
                                    </div>

                                    {formFields.map((field, index) => (
                                        <div key={index}>
                                            <label className="block mb-2 font-medium">
                                                {field.label} <span className="text-primary">*</span>
                                            </label>

                                            {field.type === 'select' && (
                                                <select name={field.id} required defaultValue="" className={inputClasses}>
                                                    <option value="" disabled>Select an option</option>
                                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            )}

                                            {field.type === 'radio' && (
                                                <div className="space-y-2">
                                                    {field.options.map((opt, i) => (
                                                        <div key={i}>
                                                            <input type="radio" id={`${field.id}_${i}`} name={field.id} value={opt} required className="hidden peer" />
                                                            <label htmlFor={`${field.id}_${i}`} className="block p-3 border rounded-md cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-border-light/50 dark:hover:bg-border-dark/50">
                                                                {opt}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            What factors influence your decision? (Optional)
                                        </label>
                                        <textarea name="connection_factors" placeholder="Speed, Security, Free access..." rows={3} className={inputClasses}></textarea>
                                    </div>

                                    <button type="submit" className="w-full px-6 py-4 border border-primary text-primary font-bold uppercase rounded-md hover:bg-primary hover:text-black transition-all">
                                        Submit Response
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </AnimatedPage>
    );
};

export default Survey;
