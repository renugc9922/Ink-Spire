import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Calendar, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL;

interface StorySummary {
    id: string;
    title: string;
    coverImageUrl?: string;
    lastUpdated: number;
    excerpt: string;
}

const StoryLibrary: React.FC = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState<StorySummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stories`);
            if (res.ok) {
                const data = await res.json();
                setStories(data);
            }
        } catch (e) {
            console.error("Failed to load library", e);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStories = stories.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Book className="text-indigo-600" />
                            My Stories
                        </h1>
                        <p className="text-slate-500 mt-1">Manage and continue your creative journeys.</p>
                    </div>

                    <Button onClick={() => navigate('/new')} className="gap-2 shadow-lg hover:shadow-indigo-500/20">
                        <Plus size={18} />
                        New Story
                    </Button>
                </div>

                {/* Search & Grid */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="w-full md:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder:text-slate-400"
                        placeholder="Search stories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/story/${story.id}`)}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group"
                            >
                                <div className="h-40 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                    {story.coverImageUrl ? (
                                        <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <Book size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg leading-tight truncate">
                                        {story.title}
                                    </h3>
                                </div>

                                <div className="p-5 space-y-4">
                                    <p className="text-slate-500 text-sm line-clamp-2 h-10">
                                        {story.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(story.lastUpdated).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-indigo-500 font-medium group-hover:translate-x-1 transition-transform">
                                            Continue
                                            <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Book className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No stories yet</h3>
                        <p className="text-slate-500 mb-6">Start your first adventure today!</p>
                        <Button onClick={() => navigate('/new')}>Create Story</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryLibrary;
