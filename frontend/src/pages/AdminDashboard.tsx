import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Calendar, Eye } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [allStories, setAllStories] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalStories: 0, totalUsers: 0 });

    useEffect(() => {
        const stories = JSON.parse(localStorage.getItem('user_stories') || '[]');
        setAllStories(stories);
        
        const uniqueUsers = new Set(stories.map((s: any) => s.userEmail)).size;
        setStats({ totalStories: stories.length, totalUsers: uniqueUsers });
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-6">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-primary" />
                        <div>
                            <h3 className="text-2xl font-bold">{stats.totalStories}</h3>
                            <p className="text-muted-foreground">Total Stories</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                            <p className="text-muted-foreground">Active Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stories List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">All Stories</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 font-medium">Title</th>
                                <th className="text-left p-4 font-medium">User</th>
                                <th className="text-left p-4 font-medium">Genre</th>
                                <th className="text-left p-4 font-medium">Date</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStories.map((story, index) => (
                                <tr key={index} className="border-b border-border hover:bg-muted/30">
                                    <td className="p-4">
                                        <div className="font-medium">{story.title}</div>
                                        {story.prompt && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {story.prompt.substring(0, 100)}...
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-muted-foreground">{story.userEmail}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                            {story.genre}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {story.date}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button className="flex items-center gap-2 text-primary hover:underline">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allStories.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No stories created yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;