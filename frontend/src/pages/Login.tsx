import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BookOpen } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            // Check if user exists
            const storedUser = localStorage.getItem('narrative_user_' + email);
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.password === password) {
                    localStorage.setItem('narrative_username', userData.fullName);
                    localStorage.setItem('narrative_email', email);
                    setIsLoading(false);
                    navigate('/');
                } else {
                    setError('Invalid password');
                    setIsLoading(false);
                }
            } else {
                setError('Account not found. Please create an account.');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="relative w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary rounded-xl mb-4">
                        <BookOpen className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to continue your writing journey
                    </p>
                </div>

                <div className="p-8 rounded-2xl bg-card border border-border shadow-xl">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="alex@gmail.com"
                                required
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Password"
                                type="password"
                                placeholder='*********'
                                required
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/50"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm text-muted-foreground">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button type="submit" className="btn-primary w-full" size="lg" isLoading={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Sign up for free
                        </Link>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;