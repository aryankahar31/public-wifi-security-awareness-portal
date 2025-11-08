import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import type { ProcessedSurveyResponse } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import { Link } from 'react-router-dom';

const Survey: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const { addSurveyResponse } = useData();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const newResponse: ProcessedSurveyResponse = {
            "What is your age group?": formData.get('age_group') as string,
            "What is your occupation?": formData.get('occupation') as string,
            "How often do you use public wifi?": formData.get('wifi_frequency') as string,
            "Where do you most often connect to public wifi?": formData.get('connection_location') as string,
            "What activities do you usually perform on public wifi?": formData.get('activities') as string,
            "awareness_level": (formData.get('awareness_risk') as string).includes('High') ? 'High' : (formData.get('awareness_risk') as string).includes('Medium') ? 'Medium' : 'Low',
            "uses_vpn": (formData.get('security_measures') as string).includes('always') ? 'Always' : (formData.get('security_measures') as string).includes('Sometimes') ? 'Sometimes' : 'Never',
            "encountered_threat": formData.get('security_issues') as "Yes" | "No" | "Unsure",
            "trusts_public_wifi": formData.get('security_feeling') as "Very secure" | "Somewhat secure" | "Not secure",
            "willing_to_pay": formData.get('pay_fee') as "Yes" | "Maybe" | "No",
            "reads_terms": formData.get('read_terms') as "Always" | "Sometimes" | "Never",
            "responsibility": formData.get('responsibility') as string,
        };
        
        addSurveyResponse(newResponse);
        setSubmitted(true);
        window.scrollTo(0, 0);
    };

    const formFields = [
        { id: 'age_group', label: 'What is your age group?', type: 'select', options: ['18-24', '25-34', '35-44', '45-54', '55+', 'Below 18'] },
        { id: 'occupation', label: 'What is your occupation?', type: 'select', options: ['Student', 'Professional/Office Worker', 'Freelancer', 'Business Owner', 'Retired', 'Other'] },
        { id: 'wifi_frequency', label: 'How often do you use public Wi-Fi?', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'] },
        { id: 'connection_location', label: 'Where do you most often connect to public Wi-Fi?', type: 'select', options: ['Cafes/Restaurants', 'Airports/Train Stations', 'Hotels', 'Libraries/Public Spaces', 'Other'] },
        { id: 'activities', label: 'What activities do you usually perform on public Wi-Fi?', type: 'select', options: ['Browsing/Social Media', 'Email/Work', 'Streaming/Video', 'Online Shopping/Banking', 'Other'] },
        { id: 'awareness_risk', label: 'Are you aware that public Wi-Fi can pose security risks?', type: 'radio', options: ['Yes (High Awareness)', 'Somewhat (Medium Awareness)', 'No (Low Awareness)'] },
        { id: 'security_measures', label: 'Do you use security measures (e.g., VPN) on public Wi-Fi?', type: 'radio', options: ['Yes, always', 'Sometimes', 'No, never'] },
        { id: 'security_issues', label: 'Have you ever faced security issues on public Wi-Fi?', type: 'radio', options: ['Yes', 'No', 'Unsure'] },
        { id: 'security_feeling', label: 'How secure do you feel on public Wi-Fi?', type: 'radio', options: ['Very secure', 'Somewhat secure', 'Not secure'] },
        { id: 'pay_fee', label: 'Would you pay a small fee for safer public Wi-Fi?', type: 'radio', options: ['Yes', 'Maybe', 'No'] },
        { id: 'read_terms', label: 'Do you read terms and conditions before connecting?', type: 'radio', options: ['Always', 'Sometimes', 'Never'] },
        { id: 'responsibility', label: 'Who should be responsible for public Wi-Fi security?', type: 'select', options: ['Government', 'Wi-Fi Providers', 'Users Themselves', 'Tech Companies', 'Shared Responsibility'] },
    ];
    
    const inputClasses = "w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-text-primary-light dark:text-text-primary-dark";

    return (
        <AnimatedPage>
            <div className="max-w-3xl mx-auto w-full">
                <div className="text-center mb-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-text-primary-light dark:text-white">Take the Survey</h1>
                </div>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl p-8 text-center">
                              <h2 className="text-3xl font-bold text-primary mb-4">Thank You for Your Contribution!</h2>
                              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                                  Your response has been recorded. Your input is invaluable to our research. You can now view the updated charts on the 'Analysis' page.
                              </p>
                              <Link to="/analysis" className="relative inline-block px-6 py-3 border border-primary text-primary font-bold uppercase tracking-wider rounded-md overflow-hidden transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_30px_5px_#61dca3]">
                                  View Live Analysis
                              </Link>
                          </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-center text-text-secondary-light dark:text-text-secondary-dark mb-8">
                                Your input is vital. This anonymous survey will take less than 2 minutes and will greatly aid our understanding of public Wi-Fi security.
                            </p>
                            <div className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark rounded-2xl">
                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark">Your Name (Optional)</label>
                                            <input type="text" id="name" name="name" placeholder="Enter your name" className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark">Your Email (Optional)</label>
                                            <input type="email" id="email" name="email" placeholder="Enter your email" className={inputClasses} />
                                        </div>
                                    </div>
                                    {formFields.map((field, index) => (
                                        <div key={index}>
                                            <label className="block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark">{field.label} <span className="text-primary">*</span></label>
                                            {field.type === 'select' && (
                                                <select defaultValue="" id={field.id} name={field.id} required className={inputClasses}>
                                                    <option value="" disabled>Select an option</option>
                                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            )}
                                            {field.type === 'radio' && (
                                                <div className="space-y-2">
                                                    {field.options.map((opt, i) => (
                                                        <div key={i}>
                                                            <input type="radio" id={`${field.id}_${i}`} name={field.id} value={opt} required className="hidden peer" />
                                                            <label htmlFor={`${field.id}_${i}`} className="block p-3 border border-border-light dark:border-border-dark rounded-md cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-border-light/50 dark:hover:bg-border-dark/50">{opt}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div>
                                        <label htmlFor="connection_factors" className="block mb-2 font-medium text-text-primary-light dark:text-text-primary-dark">What factors influence your decision to connect? (Optional)</label>
                                        <textarea id="connection_factors" name="connection_factors" placeholder="e.g., Speed, Security, Location, Free access..." rows={3} className={inputClasses}></textarea>
                                    </div>
                                    <button type="submit" className="w-full text-center relative inline-block px-6 py-4 border border-primary text-primary font-bold uppercase tracking-wider rounded-md overflow-hidden transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_30px_5px_#61dca3]">
                                        Submit Response
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default Survey;