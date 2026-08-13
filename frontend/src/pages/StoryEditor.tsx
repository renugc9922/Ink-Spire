import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Book, Sparkles, Image as ImageIcon, Type, User, Download, X } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface StorySegment {
    id: string;
    author: 'user' | 'ai' | 'system';
    content: string;
    imageUrl?: string | null;
}

const StoryEditor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [segments, setSegments] = useState<StorySegment[]>([]);
    const [inputText, setInputText] = useState('');
    const [storyConfig, setStoryConfig] = useState<any>(null);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Feature States
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [storyTitle, setStoryTitle] = useState<string>('');
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    // Export State
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const hasInitialized = useRef(false);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [segments, isGeneratingAI]);

    // Load Story (ID or New)
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const loadStory = async () => {
            // 1. If ID exists, fetch from backend
            if (id && id !== 'current') {
                try {
                    const res = await fetch(`${API_URL}/api/stories/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setStoryTitle(data.title);
                        setSegments(data.segments);
                        setCoverImageUrl(data.coverImageUrl);
                        setStoryConfig(data.config);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to load story", e);
                }
            }

            // 2. If new story (passed via state)
            const state = location.state as { config: any, prompt: string } | null;
            if (state?.config) {
                setStoryConfig(state.config);
                // Don't save to localStorage anymore, use State/Backend
                if (segments.length === 0) {
                    handleStartStory(state.config, state.prompt);
                }
            } else {
                // Fallback config
                setStoryConfig({ genre: 'fantasy', tone: 'adventurous' });
            }
        };
        loadStory();
    }, [id, location.state]);

    // Auto-Save Logic (Debounced or on key events)
    const saveStory = useCallback(async () => {
        if (segments.length === 0) return;
        setIsSaving(true);
        try {
            const storyId = id && id !== 'current' ? id : (segments[0]?.id || Date.now().toString());

            const payload = {
                id: storyId,
                title: storyTitle,
                segments,
                coverImageUrl,
                config: storyConfig
            };

            const res = await fetch(`${API_URL}/api/stories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                // If we were on 'current' or 'new', replace URL with ID
                if (!id || id === 'current') {
                    // silently replace URL
                    window.history.replaceState(null, '', `/story/${data.id}`);
                }
            }
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setIsSaving(false);
        }
    }, [id, segments, storyTitle, coverImageUrl, storyConfig]);

    // Save periodically or after AI generation
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (segments.length > 0) saveStory();
        }, 2000); // 2s debounce
        return () => clearTimeout(timeout);
    }, [segments, storyTitle, coverImageUrl, saveStory]);


    // --- Handlers ---

    const handleStartStory = async (config: any, prompt: string) => {
        const premiseSegment: StorySegment = {
            id: 'premise-' + Date.now(),
            author: 'user',
            content: prompt || "Start the story...",
            imageUrl: null
        };
        // Optimistic update
        setSegments([premiseSegment]);

        setIsGeneratingAI(true);
        try {
            const res = await fetch(`${API_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: prompt,
                    context: "",
                    config
                })
            });
            const data = await res.json();
            setSegments(prev => [...prev, {
                id: Date.now().toString(),
                author: 'ai',
                content: data.text,
                imageUrl: null
            }]);
        } catch (e) {
            setSegments(prev => [...prev, {
                id: 'err-start',
                author: 'system',
                content: '⚠️ Failed to start story.'
            }]);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleUpdateSegment = (id: string, newContent: string) => {
        setSegments(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
    };

    const handleSend = async () => {
        if ((!inputText.trim() && !selectedImage) || isGeneratingAI) return;

        const currentInput = inputText;
        const currentImage = selectedImage;

        const newSegment: StorySegment = {
            id: Date.now().toString(),
            author: 'user',
            content: currentInput,
            imageUrl: currentImage
        };

        setSegments(prev => [...prev, newSegment]);
        setInputText('');
        setSelectedImage(null);
        setIsGeneratingAI(true);

        try {
            // Context: Last 10 segments for better continuity
            const contextText = segments.slice(-10).map(s => `${s.author === 'user' ? 'Next Event' : 'Story'}: ${s.content} `).join('\n');
            const res = await fetch(`${API_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: currentInput,
                    image: currentImage,
                    context: contextText,
                    config: storyConfig
                })
            });

            const data = await res.json();
            setSegments(prev => [...prev, {
                id: 'ai-' + Date.now(),
                author: 'ai',
                content: data.text
            }]);

        } catch (error) {
            setSegments(prev => [...prev, {
                id: 'err-' + Date.now(),
                author: 'system',
                content: '⚠️ Connection failed.'
            }]);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateCover = async () => {
        setIsGeneratingCover(true);
        setCoverImageUrl(null);
        try {
            const storyText = segments.slice(0, 5).map(s => s.content).join('\n'); // Use early context for cover
            const res = await fetch(`${API_URL}/api/generate-cover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyText, config: storyConfig })
            });
            const data = await res.json();
            if (data.imageUrl) {
                const isDataUri = data.imageUrl.startsWith('data:');
                setCoverImageUrl(data.imageUrl + (isDataUri ? '' : `&t=${Date.now()}`));
            }
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const generateTitle = async () => {
        setIsGeneratingTitle(true);
        try {
            const storyText = segments.map(s => s.content).join('\n');
            const res = await fetch(`${API_URL}/api/generate-title`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyText, config: storyConfig })
            });
            const data = await res.json();
            if (data.title) setStoryTitle(data.title);
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const startPdfExport = () => {
        setIsExportingPdf(true);
        setShowExportMenu(false);
    };

    // CLEAN EXPORT: AI Text Only
    const exportTXT = () => {
        // Filter: Keep only 'ai' segments
        const textContent = segments
            .filter(s => s.author === 'ai')
            .map(s => s.content)
            .join('\n\n');

        const header = `Title: ${storyTitle || 'Untitled Story'} \n\n`;
        const blob = new Blob([header + textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = storyTitle ? `${storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt` : 'my_story.txt';
        a.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* PDF Generation Overlay */}
            {isExportingPdf && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-start overflow-auto p-8">
                    <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm z-50">
                        Generating PDF (AI Text Only)...
                    </div>
                    <div ref={printRef} className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl">
                        <div style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>{storyTitle || 'Untitled Story'}</h1>
                                {coverImageUrl && <img src={coverImageUrl} style={{ width: '100%', maxWidth: '300px', margin: '20px auto', display: 'block' }} />}
                            </div>
                            <div style={{ textAlign: 'justify' }}>
                                {/* FILTERED for PDF as well */}
                                {segments.filter(s => s.author === 'ai').map((seg, idx) => (
                                    <div key={idx} style={{ marginBottom: '1.5em', whiteSpace: 'pre-wrap', color: '#2d2d2d', fontSize: '14px' }}>
                                        {seg.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
                        <Book className="w-4 h-4 mr-2" />
                        Library
                    </Button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    {coverImageUrl && (
                        <img
                            src={coverImageUrl}
                            alt="Cover"
                            className="w-8 h-12 object-cover rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-150 transition-transform origin-top-left"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        />
                    )}
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[200px]">
                            {storyTitle || 'Untitled Story'}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            {isSaving ? 'Saving...' : 'Saved'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 relative">
                    <div className="relative">
                        <Button onClick={() => setShowExportMenu(!showExportMenu)} variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" /> Export
                        </Button>
                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                                    <button onClick={startPdfExport} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm">
                                        Save as PDF (Clean)
                                    </button>
                                    <button onClick={exportTXT} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm border-t border-slate-100 dark:border-slate-700">
                                        Save as Text (Clean)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Button onClick={generateCover} disabled={isGeneratingCover} variant="outline" size="sm">
                        {isGeneratingCover ? '...' : <ImageIcon className="w-4 h-4" />}
                    </Button>
                    <Button onClick={generateTitle} disabled={isGeneratingTitle} variant="outline" size="sm">
                        {isGeneratingTitle ? '...' : <Type className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Chat Stream */}
                    {segments.map((seg) => (
                        <EditableSegment key={seg.id} segment={seg} onUpdate={(txt) => handleUpdateSegment(seg.id, txt)} />
                    ))}
                    {isGeneratingAI && (
                        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm text-slate-500">Writing next chapter...</span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto">
                    {/* Thumbnail Preview Area */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 relative inline-block"
                            >
                                <img src={selectedImage} alt="Upload preview" className="h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full hover:bg-red-500 shadow-sm transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-3 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isGeneratingAI}
                            className="rounded-xl w-12 h-12 p-0 flex items-center justify-center flex-shrink-0"
                            title="Upload an image for visual context"
                        >
                            <ImageIcon size={20} className="text-slate-500" />
                        </Button>
                        <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="What happens next?"
                            className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                            disabled={isGeneratingAI}
                        />
                        <Button onClick={handleSend} disabled={(!inputText.trim() && !selectedImage) || isGeneratingAI} className="rounded-xl w-12 h-12 p-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0">
                            <Send size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... EditableSegment component remains the same ...
const EditableSegment = ({ segment, onUpdate }: { segment: StorySegment, onUpdate: (txt: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(segment.content);

    const handleSave = () => {
        onUpdate(editContent);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${segment.author === 'user' ? 'justify-end' : 'justify-start'} `}
        >
            <div className={`flex gap - 4 max - w - [85 %] ${segment.author === 'user' ? 'flex-row-reverse' : 'flex-row'} `}>
                <div className={`w - 8 h - 8 rounded - full flex items - center justify - center flex - shrink - 0 ${segment.author === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'} `}>
                    {segment.author === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className="space-y-2 w-full">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-4 rounded-xl border border-indigo-300 min-h-[150px] bg-white text-slate-900" />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSave}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setIsEditing(true)} className={`p - 5 rounded - 2xl leading - relaxed text - sm shadow - sm cursor - pointer hover: ring - 2 ${segment.author === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-100 dark:border-slate-700'} `}>
                            <div dangerouslySetInnerHTML={{ __html: segment.content.replace(/\n/g, '<br/>') }} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StoryEditor;

const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL =", API_URL);