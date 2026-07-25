import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Download, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';

const AITools: React.FC = () => {
    const [textPrompt, setTextPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [uploadedImage, setUploadedImage] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const generateImage = async () => {
        if (!textPrompt.trim()) return;
        setIsGenerating(true);
        
        // Simulate API call
        setTimeout(() => {
            setGeneratedImage(`https://picsum.photos/512/512?random=${Date.now()}`);
            setIsGenerating(false);
        }, 2000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const extractText = async () => {
        if (!uploadedImage) return;
        setIsExtracting(true);
        
        // Simulate OCR
        setTimeout(() => {
            setExtractedText("This is sample extracted text from the uploaded image. In a real implementation, this would use OCR technology to read text from images.");
            setIsExtracting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Tools
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                            Creative AI Studio
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Transform your ideas with cutting-edge AI technology
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Text to Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-primary to-purple-500 rounded-xl">
                                    <Wand2 className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                    Text to Image
                                </h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <Input
                                        label="Describe your vision"
                                        placeholder="A mystical dragon soaring through aurora-filled skies..."
                                        value={textPrompt}
                                        onChange={(e) => setTextPrompt(e.target.value)}
                                        className="bg-background/50 border-white/20"
                                    />
                                </div>
                                
                                <Button 
                                    onClick={generateImage} 
                                    isLoading={isGenerating}
                                    disabled={!textPrompt.trim()}
                                    className="w-full h-12 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {isGenerating ? 'Creating Magic...' : 'Generate Image'}
                                    <Sparkles className="w-5 h-5 ml-2" />
                                </Button>
                                
                                {generatedImage && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group/image">
                                            <img 
                                                src={generatedImage} 
                                                alt="Generated" 
                                                className="w-full rounded-xl border border-white/20 shadow-lg group-hover/image:shadow-2xl transition-all duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity" />
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="w-full gap-2 border-white/20 hover:bg-white/5"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = generatedImage;
                                                link.download = 'ai-generated-image.jpg';
                                                link.click();
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Masterpiece
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Image to Text */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                                    Image to Text
                                </h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-foreground">Upload Your Image</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label 
                                            htmlFor="image-upload" 
                                            className="block border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group/upload"
                                        >
                                            <div className="space-y-3">
                                                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-foreground font-medium">Drop your image here</p>
                                                    <p className="text-sm text-muted-foreground">or click to browse</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                {uploadedImage && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group/image">
                                            <img 
                                                src={uploadedImage} 
                                                alt="Uploaded" 
                                                className="w-full max-h-48 object-contain rounded-xl border border-white/20 shadow-lg"
                                            />
                                        </div>
                                        <Button 
                                            onClick={extractText} 
                                            isLoading={isExtracting}
                                            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-500/90 hover:to-blue-500/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            {isExtracting ? 'Reading Image...' : 'Extract Text'}
                                            <FileText className="w-5 h-5 ml-2" />
                                        </Button>
                                    </motion.div>
                                )}
                                
                                {extractedText && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <label className="block text-sm font-medium text-foreground">Extracted Text</label>
                                        <div className="relative">
                                            <textarea
                                                value={extractedText}
                                                readOnly
                                                className="w-full h-32 p-4 rounded-xl border border-white/20 bg-background/50 backdrop-blur-sm resize-none text-foreground placeholder-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigator.clipboard.writeText(extractedText)}
                                                    className="border-white/20 hover:bg-white/5"
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AITools;