import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Edit2, ArrowLeft, BookOpen, Clock, TrendingUp, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Profile: React.FC = () => {
    const [stories, setStories] = useState<any[]>([]);
    
    useEffect(() => {
        const savedStories = JSON.parse(localStorage.getItem('user_stories') || '[]');
        setStories(savedStories);
    }, []);
    
    const deleteStory = (storyId: string) => {
        const updatedStories = stories.filter(story => story.id !== storyId);
        setStories(updatedStories);
        localStorage.setItem('user_stories', JSON.stringify(updatedStories));
    };
    
    const getUserStats = () => {
        const email = localStorage.getItem('narrative_email') || '';
        const hash = email.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const storyCount = stories.length || Math.abs(hash % 20) + 1;
        const words = Math.abs(hash % 50) + 10;
        return { stories: storyCount, words: words + 'k' };
    };
    
    const stats = getUserStats();
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="card-elevated sticky top-8">
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-2xl mx-auto">
                                        <User className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                                        <div className="h-3 w-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                
                                <h1 className="text-2xl font-bold text-foreground mb-2">
                                    {localStorage.getItem('narrative_username') || 'Guest User'}
                                </h1>
                                <p className="text-primary font-medium mb-4">Creative Writer</p>
                                
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined January 2026</span>
                                </div>
                                
                                <Button variant="outline" size="sm" className="btn-secondary gap-2 w-full">
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card-elevated text-center">
                                <div className="p-3 bg-primary/20 rounded-xl w-fit mx-auto mb-3">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stats.stories}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Stories</div>
                            </div>
                            
                            <div className="card-elevated text-center">
                                <div className="p-3 bg-primary/20 rounded-xl w-fit mx-auto mb-3">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stats.words}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Words</div>
                            </div>
                            
                            <div className="card-elevated text-center">
                                <div className="p-3 bg-primary/20 rounded-xl w-fit mx-auto mb-3">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">24</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hours</div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="card-elevated">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                Account Information
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Email Address</p>
                                        <p className="text-sm text-muted-foreground">
                                            {localStorage.getItem('narrative_email') || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Member Since</p>
                                        <p className="text-sm text-muted-foreground">January 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* My Stories */}
                        <div className="card-elevated">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                </div>
                                My Stories
                            </h3>
                            
                            {stories.length > 0 ? (
                                <div className="space-y-3">
                                    {stories.map((story) => (
                                        <div key={story.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-foreground mb-1">
                                                    {story.title || 'Untitled Story'}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {story.genre} • Created {new Date(story.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-primary hover:bg-primary/20"
                                                    onClick={() => window.open(`/story/${story.id}`, '_blank')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/20"
                                                    onClick={() => deleteStory(story.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">No stories created yet</p>
                                    <Link to="/new" className="text-primary text-sm hover:underline mt-2 inline-block">
                                        Create your first story
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="card-elevated">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                Recent Activity
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Started a new fantasy story</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Generated story cover</p>
                                        <p className="text-xs text-muted-foreground">1 day ago</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Completed mystery story</p>
                                        <p className="text-xs text-muted-foreground">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
