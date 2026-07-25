import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const MainLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('narrative_username');
        setIsSignedIn(!!username);
    }, [location]);

    const handleSignOut = () => {
        localStorage.removeItem('narrative_username');
        setIsSignedIn(false);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            {/* Navigation */}
            <header className="sticky top-0 z-50 glass-card border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <Link to="/" className="text-xl font-black tracking-wider text-gradient hover:opacity-90 transition-opacity">
                                Inkspire
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle />

                            <div className="h-6 w-px bg-white/20"></div>

                            {isSignedIn ? (
                                <>
                                    <Link to="/new" className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-foreground hover:bg-white/20 transition-all">
                                        New Story
                                    </Link>

                                    <Link to="/profile" className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-foreground hover:bg-white/20 transition-all flex items-center gap-2">
                                        <span className="hidden sm:inline">
                                            {localStorage.getItem('narrative_username') || 'Profile'}
                                        </span>
                                        <div className="bg-primary/20 p-1 rounded-lg">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-red-400 transition-all hover:bg-red-500/10 rounded-xl"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="text-sm font-medium hidden sm:inline">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="btn-primary text-sm">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/10">
                            <div className="flex flex-col gap-2">
                                <ThemeToggle />
                                {isSignedIn ? (
                                    <>
                                        <Link to="/new" className="btn-secondary text-sm text-center">
                                            New Story
                                        </Link>
                                        <Link to="/profile" className="btn-secondary text-sm flex items-center gap-3">
                                            <User className="h-4 w-4" />
                                            {localStorage.getItem('narrative_username') || 'Profile'}
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-3 text-muted-foreground hover:text-red-400 transition-all hover:bg-red-500/10 rounded-xl text-left">
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-white/5">
                                            Sign In
                                        </Link>
                                        <Link to="/signup" className="btn-primary text-sm text-center">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 py-12 glass-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm font-medium">© 2026 Inkspire. All rights reserved.</span>
                        </div>
                        <div className="flex gap-6 text-muted-foreground text-sm">
                            <Link to="/privacy" className="hover:text-primary transition-colors hover:underline">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-primary transition-colors hover:underline">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;