import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Brain, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { StoryConfig } from '../types';

const StorySetup: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<Partial<StoryConfig>>({
        genre: 'fantasy',
        tone: 'suspenseful',
        style: 'descriptive',
        pov: 'third_person',
    });

    const [customInputs, setCustomInputs] = useState({
        genre: '',
        tone: '',
        style: '',
        pov: ''
    });

    const [prompt, setPrompt] = useState('');
    const handleStart = async () => {
        setIsLoading(true);
        
        // Save story to localStorage
        const newStory = {
            id: Date.now().toString(),
            title: prompt ? prompt.substring(0, 50) + '...' : 'Untitled Story',
            genre: config.genre === 'other' ? customInputs.genre : config.genre,
            tone: config.tone === 'other' ? customInputs.tone : config.tone,
            style: config.style === 'other' ? customInputs.style : config.style,
            pov: config.pov === 'other' ? customInputs.pov : config.pov,
            prompt,
            createdAt: new Date().toISOString()
        };
        
        const existingStories = JSON.parse(localStorage.getItem('user_stories') || '[]');
        existingStories.push(newStory);
        localStorage.setItem('user_stories', JSON.stringify(existingStories));
        
        setTimeout(() => {
            setIsLoading(false);
            navigate('/story/current', { 
                state: { 
                    config: {
                        ...config,
                        genre: config.genre === 'other' ? customInputs.genre : config.genre,
                        tone: config.tone === 'other' ? customInputs.tone : config.tone,
                        style: config.style === 'other' ? customInputs.style : config.style,
                        pov: config.pov === 'other' ? customInputs.pov : config.pov,
                    }, 
                    prompt,
                } 
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Craft Your <span className="text-gradient">Story</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Configure your AI writing assistant to match your creative vision
                    </p>
                </motion.div>

                {/* Main Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-3xl p-8 border border-white/10"
                >
                    {/* Writing Style */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground">Writing Style</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Select
                                    label="Genre"
                                    options={[
                                        { label: 'Fantasy', value: 'fantasy' },
                                        { label: 'Sci-Fi', value: 'sci-fi' },
                                        { label: 'Mystery', value: 'mystery' },
                                        { label: 'Horror', value: 'horror' },
                                        { label: 'Romance', value: 'romance' },
                                        { label: 'Adventure', value: 'adventure' },
                                        { label: 'Others', value: 'other' },
                                    ]}
                                    value={config.genre}
                                    onChange={(e) => setConfig({ ...config, genre: e.target.value as any })}
                                />
                                {config.genre === 'other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom genre"
                                        className="w-full h-10 px-3 mt-2 rounded-lg border border-input/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        value={customInputs.genre}
                                        onChange={(e) => setCustomInputs({ ...customInputs, genre: e.target.value })}
                                    />
                                )}
                            </div>
                            
                            <div>
                                <Select
                                    label="Tone"
                                    options={[
                                        { label: 'Dark', value: 'dark' },
                                        { label: 'Humorous', value: 'humorous' },
                                        { label: 'Optimistic', value: 'optimistic' },
                                        { label: 'Suspenseful', value: 'suspenseful' },
                                        { label: 'Whimsical', value: 'whimsical' },
                                        { label: 'Others', value: 'other' },
                                    ]}
                                    value={config.tone}
                                    onChange={(e) => setConfig({ ...config, tone: e.target.value as any })}
                                />
                                {config.tone === 'other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom tone"
                                        className="w-full h-10 px-3 mt-2 rounded-lg border border-input/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        value={customInputs.tone}
                                        onChange={(e) => setCustomInputs({ ...customInputs, tone: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Select
                                    label="Style"
                                    options={[
                                        { label: 'Descriptive', value: 'descriptive' },
                                        { label: 'Concise', value: 'concise' },
                                        { label: 'Poetic', value: 'poetic' },
                                        { label: 'Dialogue-heavy', value: 'dialogue' },
                                        { label: 'Others', value: 'other' },
                                    ]}
                                    value={config.style}
                                    onChange={(e) => setConfig({ ...config, style: e.target.value as any })}
                                />
                                {config.style === 'other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom style"
                                        className="w-full h-10 px-3 mt-2 rounded-lg border border-input/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        value={customInputs.style}
                                        onChange={(e) => setCustomInputs({ ...customInputs, style: e.target.value })}
                                    />
                                )}
                            </div>
                            
                            <div>
                                <Select
                                    label="Point of View"
                                    options={[
                                        { label: 'First Person', value: 'first_person' },
                                        { label: 'Third Person', value: 'third_person' },
                                        { label: 'Omniscient', value: 'omniscient' },
                                        { label: 'Others', value: 'other' },
                                    ]}
                                    value={config.pov}
                                    onChange={(e) => setConfig({ ...config, pov: e.target.value as any })}
                                />
                                {config.pov === 'other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom POV"
                                        className="w-full h-10 px-3 mt-2 rounded-lg border border-input/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        value={customInputs.pov}
                                        onChange={(e) => setCustomInputs({ ...customInputs, pov: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Story Premise */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground">Story Premise</h3>
                        </div>
                        
                        <textarea
                            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                            placeholder="Describe your story idea, plot, or let the AI surprise you..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Leave empty for AI to create a story based on your settings
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-8">
                        <Button
                            variant="gradient"
                            size="lg"
                            className="px-12 shadow-2xl"
                            onClick={handleStart}
                            isLoading={isLoading}
                        >
                            {isLoading ? 'Creating Your Story...' : 'Start Writing'}
                            <Sparkles className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StorySetup;