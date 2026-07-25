import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import StorySetup from './pages/StorySetup';
import StoryEditor from './pages/StoryEditor';
import StoryLibrary from './pages/StoryLibrary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="narrative-ui-theme">
            <BrowserRouter>
                <Routes>
                    {/* Main App Routes */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="new" element={<StorySetup />} />
                        <Route path="story/current" element={<StoryEditor />} />
                        <Route path="story/:id" element={<StoryEditor />} />
                        <Route path="library" element={<StoryLibrary />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="privacy" element={<PrivacyPolicy />} />
                        <Route path="terms" element={<TermsOfService />} />
                    </Route>

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin Route */}
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
