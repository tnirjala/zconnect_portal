import React, { useState, useEffect } from 'react';
import { Heart, Smile, Meh, Frown, AlertCircle, X, CheckCircle } from 'lucide-react';

const MoodTracker = ({ user, onClose }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [canLogMood, setCanLogMood] = useState(true);
  const [hoursUntilNext, setHoursUntilNext] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const moodOptions = [
    {
      value: 'very_happy',
      label: 'Very Happy',
      icon: <Smile size={32} className="text-green-500" />,
      color: 'bg-green-100 border-green-300 hover:bg-green-200',
      emoji: '😄'
    },
    {
      value: 'happy',
      label: 'Happy',
      icon: <Smile size={32} className="text-green-400" />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      emoji: '😊'
    },
    {
      value: 'neutral',
      label: 'Neutral',
      icon: <Meh size={32} className="text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      emoji: '😐'
    },
    {
      value: 'sad',
      label: 'Sad',
      icon: <Frown size={32} className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      emoji: '😢'
    },
    {
      value: 'very_sad',
      label: 'Very Sad',
      icon: <Frown size={32} className="text-red-500" />,
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      emoji: '😭'
    },
    {
      value: 'anxious',
      label: 'Anxious',
      icon: <AlertCircle size={32} className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      emoji: '😰'
    },
    {
      value: 'angry',
      label: 'Angry',
      icon: <AlertCircle size={32} className="text-red-600" />,
      color: 'bg-red-100 border-red-300 hover:bg-red-200',
      emoji: '😠'
    },
    {
      value: 'peaceful',
      label: 'Peaceful',
      icon: <Heart size={32} className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      emoji: '😌'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      checkMoodStatus();
    }
  }, [user?.id]);

  const checkMoodStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/mood/check`, {
        headers: {
          'user-id': user?.id?.toString()
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCanLogMood(data.canLogMood);
          setHoursUntilNext(data.hoursUntilNext || 0);

          if (!data.canLogMood) {
            setMessage({
              type: 'info',
              text: `You've already logged your mood today. Come back in ${data.hoursUntilNext} hours!`
            });
          }
        }
      } else {
        console.error('Failed to check mood status');
      }
    } catch (error) {
      console.error('Error checking mood status:', error);
      // If there's an error checking status, allow mood logging
      setCanLogMood(true);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      setMessage({ type: 'error', text: 'Please select a mood' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/user/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString()
        },
        body: JSON.stringify({ mood: selectedMood })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Mood logged successfully! Thank you for sharing.' });
        setCanLogMood(false);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (data.canLogTomorrow) {
          setMessage({ 
            type: 'info', 
            text: `You've already logged your mood today. Come back in ${data.hoursUntilNext} hours!` 
          });
          setCanLogMood(false);
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to log mood' });
        }
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getMoodAdvice = (mood) => {
    const advice = {
      very_happy: "That's wonderful! Keep spreading those positive vibes and remember what made you feel this way.",
      happy: "Great to hear you're feeling good! Consider sharing your happiness with others around you.",
      neutral: "It's okay to have neutral days. Sometimes taking a moment to reflect can help clarify your feelings.",
      sad: "It's normal to feel sad sometimes. Remember that this feeling will pass, and consider reaching out to someone you trust.",
      very_sad: "I'm sorry you're feeling this way. Please remember that you're not alone. Consider talking to a counselor or trusted friend.",
      anxious: "Anxiety can be challenging. Try some deep breathing exercises or grounding techniques. Don't hesitate to seek support.",
      angry: "Anger is a natural emotion. Try to channel it constructively and consider what might be causing these feelings.",
      peaceful: "That's beautiful! This sense of peace is precious. Try to remember what helps you feel this way."
    };
    return advice[mood] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-95 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-pink-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-200">
          <div className="flex items-center space-x-3">
            <Heart className="text-pink-600" size={24} />
            <h2 className="text-xl font-bold" style={{ color: '#8B3A4A' }}>How are you feeling today?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-pink-100 text-pink-500 hover:text-pink-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-md flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message.type === 'success' && <CheckCircle size={18} />}
              {message.type === 'error' && <AlertCircle size={18} />}
              {message.type === 'info' && <AlertCircle size={18} />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {canLogMood ? (
            <>
              {/* Mood Selection Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedMood === mood.value
                        ? 'border-pink-500 bg-pink-50 transform scale-105'
                        : mood.color
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: '#8B3A4A' }}>{mood.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Mood Advice */}
              {selectedMood && (
                <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium mb-2" style={{ color: '#8B3A4A' }}>A gentle reminder:</h4>
                  <p className="text-sm" style={{ color: '#8B3A4A' }}>{getMoodAdvice(selectedMood)}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleMoodSubmit}
                disabled={!selectedMood || loading}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  !selectedMood || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Logging mood...</span>
                  </div>
                ) : (
                  'Log My Mood'
                )}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="mx-auto text-pink-600 mb-4" size={48} />
              <p className="mb-2" style={{ color: '#8B3A4A' }}>You've already logged your mood today!</p>
              <p className="text-sm" style={{ color: '#8B3A4A' }}>
                {hoursUntilNext > 0 
                  ? `Come back in ${hoursUntilNext} hours to log your next mood.`
                  : 'You can log your mood again tomorrow!'
                }
              </p>
            </div>
          )}

          {/* Additional Resources */}
          <div className="mt-6 pt-4 border-t border-pink-200">
            <p className="text-xs text-center" style={{ color: '#8B3A4A' }}>
              Need someone to talk to? Remember that support is always available through our community resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;