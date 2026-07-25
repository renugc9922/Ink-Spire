# NarrativeFlow

**NarrativeFlow** is an interactive AI story co-writer application designed to help authors craft compelling narratives. It features an adaptive AI that collaborates with you, offering real-time suggestions, scene visualizations, and stylistic coherence.

![NarrativeFlow Dashboard Placeholder](https://via.placeholder.com/800x400?text=NarrativeFlow+Preview)

## 🚀 Features

- **Adaptive Co-Writing**: A chat-like interface where you and the AI take turns writing. The AI adapts to your selected genre, tone, and style.
- **Parametric Controls**: Fine-tune your story's **Pacing**, **Detail Level**, and **Tone** in real-time using the editor's control panel.
- **Scene Visualization**: (Mockup) Visualize your current scene with AI-generated imagery.
- **Story Setup Wizard**: A comprehensive intake form to define your story's Premise, Genre (Fantasy, Sci-Fi, etc.), and POV.
- **Modern UI/UX**:
  - Fully responsive design for Mobile, Tablet, and Desktop.
  - **Dark/Light Mode** support (System synced).
  - Professional, focused writing environment.
- **User Management**:
  - Secure Login & Signup pages.
  - User Profile dashboard with writing statistics.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, CSS Variables (Theming)
- **Animations**: Framer Motion
- **Routing**: React Router DOM (v6+)
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start the development server**:

    ```bash
    npm run dev
    ```

4. **Open in Browser**:
    Visit `http://localhost:5173` to start writing.

## 📂 Project Structure

```text
src/
├── components/         # Reusable UI components (Button, Input, Slider, etc.)
├── layouts/            # Page layouts (MainLayout)
├── lib/                # Utilities (tailwind-merge, clsx)
├── pages/              # Application Pages
│   ├── Home.tsx        # Landing Page
│   ├── Login.tsx       # Sign In
│   ├── Signup.tsx      # Registration
│   ├── StorySetup.tsx  # Configuration Wizard
│   ├── StoryEditor.tsx # Main Co-Writing Interface
│   └── Profile.tsx     # User Dashboard
├── types/              # TypeScript definitions
├── App.tsx             # Main Router configuration
└── index.css           # Global Styles & Theme Variables
```

## 🎨 Theming

The application uses CSS variables for theming, allowing for accurate color mapping in both Light and Dark modes.

- **Dark Mode**: Default for a "Writer's Night Mode" feel.
- **Light Mode**: Accessible high-contrast alternative.
- **System**: Syncs with your OS settings.

Toggle the theme using the icons in the top navigation bar.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch.
5. Open a Pull Request.

---

*Built with ❤️ for Storytellers.*
