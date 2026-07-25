import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft size={16} /> Back
                </Button>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
                    <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, such as when you create an account, create stories, or communicate with us. This may include your name, email address, and the content of your stories.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">2. How We Use Your Information</h2>
                            <p>We use the information we collect to provide, maintain, and improve our services, including generating stories and artwork based on your inputs.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3. Data Storage</h2>
                            <p>Your stories are stored locally on your device or on our secure servers if you choose to sync them. We do not use your story content to train our public models without your explicit consent.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">4. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at support@inkspire.ai.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
