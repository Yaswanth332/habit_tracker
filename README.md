# Routina - Habit Tracker with MySQL Integration

A beautiful, production-ready habit tracking application with MySQL database integration.

## Features

- **Task Management**: Daily, weekly, and monthly tasks with streaks
- **Goal Tracking**: Set and monitor progress on long-term goals
- **Work Sessions**: Track productive time with mood and notes
- **Daily Reflections**: Journal prompts for self-reflection
- **Calendar View**: Visual overview of your activities
- **Multiple Themes**: Minimal, Forest, and Neon themes
- **MySQL Database**: Persistent data storage

## Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE routina_db;
```

### 2. Run Schema

Execute the SQL commands in `src/database/schema.sql` to create the required tables:

```bash
mysql -u your_username -p routina_db < src/database/schema.sql
```

### 3. Configure Connection

Update the database configuration in `src/config/database.ts` or use the in-app setup form:

```typescript
const config = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'routina_db',
  port: 3306
};
```

## Database Schema

The application uses the following tables:

- **tasks**: Store daily, weekly, and monthly tasks
- **goals**: Long-term goals with progress tracking
- **work_sessions**: Productive time tracking
- **reflections**: Daily journal entries
- **user_settings**: Application settings and streak data

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your MySQL database (see Database Setup above)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: MySQL with mysql2 driver
- **Icons**: Lucide React
- **Build Tool**: Vite

## Features Overview

### Task Management
- Create daily, weekly, and monthly tasks
- Track completion streaks
- Set priorities and due dates
- Organize with categories and tags

### Goal Tracking
- Set long-term goals with deadlines
- Track progress with visual indicators
- Break down goals into subtasks
- Motivational quotes for inspiration

### Work Sessions
- Time tracking with start/stop functionality
- Mood tracking for each session
- Project categorization
- Session notes and tags

### Daily Reflections
- Random prompts for self-reflection
- Mood tracking
- Progress insights
- Motivational quotes

### Calendar View
- Visual overview of activities
- Day-by-day progress tracking
- Activity indicators and emojis
- Detailed day view with tasks and sessions

## Data Persistence

The application automatically saves all data to your MySQL database:
- Tasks and their completion status
- Goal progress updates
- Work session logs
- Daily reflections
- User preferences and streaks

If the database connection fails, the app gracefully falls back to local state management.

## Customization

### Themes
Choose from three beautiful themes:
- **Minimal**: Clean, professional design
- **Forest**: Nature-inspired green palette
- **Neon**: Dark theme with cyan accents

### Database Configuration
Easily switch between different MySQL instances or configurations using the in-app setup form.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with your MySQL setup
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.