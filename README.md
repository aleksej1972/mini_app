# English Learning Telegram Mini App

A comprehensive Telegram Mini App for learning English with interactive exercises and games, built with Next.js and Supabase.

## Features

### 🎯 Core Features
- **Telegram WebApp Integration**: Seamless authentication using Telegram user data
- **Progressive Learning**: CEFR-based levels (A1, A2, B1, B2, C1, C2)
- **XP System**: Gamified learning with experience points and level progression
- **Multiple Exercise Types**:
  - Quiz (multiple choice)
  - Fill in the blanks
  - Word puzzles
  - Audio quizzes
  - Sentence builder (drag & drop)
  - Reading comprehension
  - Dialog practice
  - Speech practice

### 🎮 Interactive Games
- **Quiz Game**: Multiple choice questions with instant feedback
- **Fill-in-the-Blank**: Complete sentences with correct words
- **Word Puzzle**: Find and select the correct word
- **Sentence Builder**: Drag and drop words to build sentences
- **Reading Comprehension**: Read texts and answer questions
- **Memory Match**: Timed card matching game with English-Russian word pairs

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Telegram WebApp native feel
- Haptic feedback integration
- Touch-friendly interactions

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Telegram WebApp SDK
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Database Schema

### Tables
- **users**: User profiles with Telegram ID, level, and XP
- **lessons**: Organized by CEFR levels with descriptions
- **exercises**: Various exercise types with JSON content
- **user_progress**: Track completion and scores
- **flashcards**: Vocabulary with English/Russian translations

### Storage
- **audio**: Audio files for pronunciation exercises
- **images**: Visual content for flashcards and exercises

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for production)

### 📚 Documentation
- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Database setup and configuration
- **[Admin Panel Guide](docs/ADMIN_PANEL_GUIDE.md)** - How to add content through web interface
- **[Exercise Templates](docs/EXERCISE_TEMPLATES.md)** - JSON templates for all exercise types
- **[Memory Match Game](docs/MEMORY_MATCH_GAME.md)** - New card matching game documentation

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase (Optional for development)**
   - Create a new Supabase project
   - Run the migration: `supabase/migrations/001_initial_schema.sql`
   - Set up storage buckets: `supabase/storage/setup.sql`
   - Seed sample data: `supabase/seed.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Development Mode

The app includes mock data and works without Supabase configuration for development:
- Mock user authentication
- Sample lessons and exercises
- Simulated progress tracking

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── lesson/[id]/       # Individual lesson pages
│   ├── lessons/           # Lessons list page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── exercises/         # Exercise game components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utility functions
│   ├── database.ts       # Database operations
│   ├── supabase.ts       # Supabase client
│   └── telegram.ts       # Telegram WebApp utilities
└── types/                # TypeScript definitions
```

## Exercise Types

### Quiz
```json
{
  "question": "What is the capital of the UK?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "correct": "London"
}
```

### Fill-in-the-Blank
```json
{
  "sentence": "I ___ to school every day.",
  "options": ["go", "going", "went", "gone"],
  "correct": "go"
}
```

### Sentence Builder
```json
{
  "translation": "Я люблю читать книги.",
  "correct_order": ["I", "like", "to", "read", "books"],
  "extra_words": ["play", "run", "fast"]
}
```

## Telegram Bot Setup

1. Create a bot with @BotFather
2. Set up the Mini App URL
3. Configure bot commands and description
4. Enable inline mode (optional)

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

Built with ❤️ for English learners worldwide
