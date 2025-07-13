import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Star, Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

export const DailyReflection: React.FC = () => {
  const { getThemeClasses } = useTheme();
  const { addReflection, reflections } = useData();
  const themeClasses = getThemeClasses();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    "What's your main goal for today? 🎯",
    "What went well yesterday? ✨",
    "What are you grateful for right now? 🙏",
    "What challenge will you tackle today? 💪",
    "How are you feeling about your progress? 🌟",
    "What's one thing you learned recently? 📚",
    "What would make today amazing? 🚀",
    "Where did you lose focus today? 🤔",
    "What's one win from today? 🏆",
    "How can you improve tomorrow? 📈"
  ];

  const moodOptions = ['😊', '🤔', '😴', '🔥', '😐', '🧠', '💪', '🎉'];

  const motivationalQuotes = [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Code is poetry written in logic.", author: "Anonymous" },
    { text: "Every expert was once a beginner.", author: "Helen Hayes" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    // Set a random prompt on component mount
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  useEffect(() => {
    if (currentPrompt && !isTyping) {
      setIsTyping(true);
      setDisplayText('');
      
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < currentPrompt.length) {
          setDisplayText(currentPrompt.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [currentPrompt]);

  const handleSubmit = () => {
    if (response.trim()) {
      addReflection({
        date: new Date().toISOString().split('T')[0],
        prompt: currentPrompt,
        response: response.trim(),
        mood: selectedMood
      });
      
      setResponse('');
      
      // Get a new random prompt
      const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(newPrompt);
    }
  };

  const getNewPrompt = () => {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
  };

  const todayReflections = reflections.filter(r => r.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className={`${themeClasses.accent}`} size={28} />
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Daily Reflection</h1>
        </div>
        <button
          onClick={getNewPrompt}
          className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105`}
        >
          <Star size={18} />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Typewriter Prompt */}
      <div className={`${themeClasses.card} p-8 rounded-xl border-2 border-dashed ${themeClasses.border}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">💭</div>
          <h3 className={`text-2xl font-semibold ${themeClasses.text} mb-6 min-h-[3rem] flex items-center justify-center`}>
            {displayText}
            {isTyping && <span className="animate-pulse ml-1">|</span>}
          </h3>
        </div>
      </div>

      {/* Response Area */}
      <div className={`${themeClasses.card} p-6 rounded-xl`}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>How are you feeling?</label>
            <div className="flex space-x-2 mb-4">
              {moodOptions.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`text-2xl p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    selectedMood === mood ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Take a moment to reflect... What's on your mind?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!response.trim()}
              className={`${themeClasses.button} px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send size={18} />
              <span>Save Reflection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Reflections */}
      {todayReflections.length > 0 && (
        <div className={`${themeClasses.card} rounded-xl p-6`}>
          <h3 className={`text-lg font-bold ${themeClasses.text} mb-4`}>Today's Reflections</h3>
          <div className="space-y-4">
            {todayReflections.map(reflection => (
              <div key={reflection.id} className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{reflection.mood}</span>
                  <p className={`font-medium ${themeClasses.text}`}>{reflection.prompt}</p>
                </div>
                <p className={`${themeClasses.accent}`}>{reflection.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspiration Section */}
      <div className={`${themeClasses.card} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${themeClasses.text} mb-4 flex items-center space-x-2`}>
          <Quote size={20} />
          <span>Today's Inspiration</span>
        </h3>
        <div className="text-center py-6">
          <div className="text-4xl mb-4">🌟</div>
          <blockquote className={`text-lg italic ${themeClasses.text} mb-4`}>
            "{currentQuote.text}"
          </blockquote>
          <cite className={`text-sm ${themeClasses.accent}`}>— {currentQuote.author}</cite>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${themeClasses.card} p-6 rounded-xl text-center`}>
          <div className="text-3xl mb-2">📝</div>
          <div className={`text-2xl font-bold ${themeClasses.text}`}>{reflections.length}</div>
          <div className={`text-sm ${themeClasses.accent}`}>Total Reflections</div>
        </div>
        <div className={`${themeClasses.card} p-6 rounded-xl text-center`}>
          <div className="text-3xl mb-2">🎯</div>
          <div className={`text-2xl font-bold ${themeClasses.text}`}>{todayReflections.length}</div>
          <div className={`text-sm ${themeClasses.accent}`}>Today's Entries</div>
        </div>
        <div className={`${themeClasses.card} p-6 rounded-xl text-center`}>
          <div className="text-3xl mb-2">📈</div>
          <div className={`text-2xl font-bold ${themeClasses.text}`}>
            {reflections.length > 0 ? Math.ceil(reflections.length / 7) : 0}
          </div>
          <div className={`text-sm ${themeClasses.accent}`}>Week Streak</div>
        </div>
      </div>
    </div>
  );
};