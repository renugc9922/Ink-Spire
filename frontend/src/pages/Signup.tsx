import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BookOpen } from 'lucide-react';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password: string) => {
        const hasCapital = /[A-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
        const hasMinLength = password.length >= 8;
        return hasCapital && hasSpecial && hasMinLength;
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!validatePassword(password)) {
            setError('Password must have at least 8 characters, 1 capital letter, and 1 special symbol');
            return;
        }
        
        setIsLoading(true);

        const fullName = `${firstName} ${lastName}`.trim();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;

        // Store user data
        const userData = { fullName, email, password };
        localStorage.setItem('narrative_user_' + email, JSON.stringify(userData));
        localStorage.setItem('narrative_username', fullName);
        localStorage.setItem('narrative_email', email);

        setTimeout(() => {
            setIsLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="relative w-full max-w-md space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary rounded-xl mb-4">
                        <BookOpen className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Start co-writing your masterpiece today
                    </p>
                </div>

                {/* Form Card */}
                <div className="p-8 rounded-2xl bg-card border border-border shadow-xl">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First name"
                                type="text"
                                placeholder="Jane"
                                required
                                className="input-field"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                label="Last name"
                                type="text"
                                placeholder="Doe"
                                required
                                className="input-field"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                            className="input-field"
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Sign in
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

export default Signup;