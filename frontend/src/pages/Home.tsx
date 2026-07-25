import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Feather, Zap, BookOpen, Star, Users, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

const Home: React.FC = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('narrative_username');
        setIsSignedIn(!!storedUsername);
        setUsername(storedUsername || '');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl mx-auto space-y-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-primary/20 text-primary text-sm font-semibold mb-6 hover-lift"
                >
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Next Gen AI Storytelling Platform
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-gradient mb-6"
                >
                    Inkspire
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
                >
                    Co-Write your next <br />
                    <span className="text-gradient">MasterPiece</span>
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
                >
                    Inkspire isn't just a generator—it's your collaborative partner.
                    Build immersive worlds, develop complex characters, and craft compelling
                    plots with an AI that understands your vision.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col items-center gap-6 pt-8"
                >
                    {isSignedIn ? (
                        <>
                            <p className="text-2xl text-muted-foreground font-medium">
                                Welcome back, <span className="text-gradient font-bold">{username}</span>!
                            </p>
                            <Link to="/new">
                                <Button
                                    variant="gradient"
                                    size="xl"
                                    className="group shadow-2xl hover:shadow-indigo-500/25"
                                >
                                    Create New Story
                                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button
                                size="xl"
                                className="group shadow-2xl hover:shadow-indigo-500/25"
                            >
                                Start Creating Free
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-4xl"
            >
                <StatCard icon={<Users className="w-6 h-6" />} number="10K+" label="Active Writers" />
                <StatCard icon={<BookOpen className="w-6 h-6" />} number="50K+" label="Stories Created" />
                <StatCard icon={<Star className="w-6 h-6" />} number="4.9" label="User Rating" />
            </motion.div>

            {/* Feature Grid */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl text-left"
            >
                <FeatureCard
                    icon={<Feather className="w-8 h-8 text-indigo-500" />}
                    title="Adaptive Co-Writing"
                    description="The AI adapts to your writing style, offering suggestions that blend seamlessly with your prose."
                    gradient="from-indigo-500/10 to-purple-500/10"
                />
                <FeatureCard
                    icon={<Zap className="w-8 h-8 text-yellow-500" />}
                    title="Instant Visualization"
                    description="See your story come to life with real-time image generation for every scene you write."
                    gradient="from-yellow-500/10 to-orange-500/10"
                />
                <FeatureCard
                    icon={<Palette className="w-8 h-8 text-pink-500" />}
                    title="Deep Lore Memory"
                    description="Never worry about plot holes. Inkspire recalls every character trait and plot point."
                    gradient="from-pink-500/10 to-rose-500/10"
                />
            </motion.div>

            {/* About Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mt-40 w-full max-w-6xl px-4"
            >
                <div className="glass-card rounded-3xl p-12 text-center hover-lift">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-8">
                        About <span className="text-gradient">Inkspire</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
                        Inkspire is an AI-powered storytelling platform built for writers,
                        creators, and dreamers. It enables collaborative story creation by
                        combining human imagination with advanced generative AI, helping users
                        craft immersive worlds, rich characters, and visually engaging narratives.
                    </p>
                </div>
            </motion.section>
        </div>
    );
};

const StatCard = ({ icon, number, label }: { icon: React.ReactNode, number: string, label: string }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass-card p-6 rounded-2xl text-center hover-lift"
    >
        <div className="flex justify-center mb-3 text-primary">
            {icon}
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{number}</div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
);

const FeatureCard = ({ icon, title, description, gradient }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    gradient: string
}) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-card p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
        <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${gradient} w-fit group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-300">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default Home;