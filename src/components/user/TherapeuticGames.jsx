import React, { useState, useEffect } from 'react';

const TherapeuticGames = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userProgress, setUserProgress] = useState({
    volcano: 0,
    puzzle: 0,
    thoughts: 0,
    anger: 0,
    empathy: 0,
    stress: 0
  });

  const games = [
    {
      id: 'volcano',
      icon: '🌋',
      label: 'Volcano Calm',
      description: 'Master your breathing to cool down anger',
      color: 'bg-red-500 hover:bg-red-600',
      difficulty: 'Easy'
    },
    {
      id: 'puzzle',
      icon: '🧩',
      label: 'Peace Puzzle',
      description: 'Focus your mind and find inner peace',
      color: 'bg-blue-500 hover:bg-blue-600',
      difficulty: 'Medium'
    },
    {
      id: 'thoughts',
      icon: '💭',
      label: 'Thought Reframer',
      description: 'Transform negative thoughts into positive ones',
      color: 'bg-purple-500 hover:bg-purple-600',
      difficulty: 'Medium'
    },
    {
      id: 'anger',
      icon: '🎯',
      label: 'Anger Tracker',
      description: 'Identify and manage anger triggers',
      color: 'bg-orange-500 hover:bg-orange-600',
      difficulty: 'Hard'
    },
    {
      id: 'empathy',
      icon: '❤️',
      label: 'Empathy Builder',
      description: 'Understand different perspectives',
      color: 'bg-pink-500 hover:bg-pink-600',
      difficulty: 'Medium'
    },
    {
      id: 'stress',
      icon: '🧘‍♂️',
      label: 'Stress Buster',
      description: 'Quick techniques for stressful moments',
      color: 'bg-green-500 hover:bg-green-600',
      difficulty: 'Easy'
    }
  ];

  const getTutorialForGame = (gameId) => {
    const tutorials = {
      volcano: "When you feel anger rising, this game teaches deep breathing. Click 'Begin Breathing' and watch the volcano cool down as you breathe deeply. Complete 5 breaths to master the technique!",
      puzzle: "This game helps you focus and break problems into smaller pieces. Click on the emoji pieces to arrange them correctly. Start with Easy mode (4 pieces) then try Hard mode (9 pieces)!",
      thoughts: "Challenge negative thinking patterns! Click on each negative thought bubble to transform it into a positive one. This teaches you to reframe situations in a healthier way.",
      anger: "Learn to identify what triggers your anger. Read each scenario and choose how it makes you feel. Understanding your triggers is the first step to managing them better.",
      empathy: "Walk in someone else's shoes! Read different situations and try to understand how others might feel. This builds compassion and reduces conflict.",
      stress: "Quick stress-relief techniques you can use anywhere. Follow the guided exercises to learn practical ways to calm down in stressful moments."
    };
    return tutorials[gameId] || "Follow the on-screen instructions to play this game.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mindful Games
          </h1>
          <p className="text-xl text-gray-700 mb-4">Interactive tools for emotional wellness and conflict resolution</p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-white rounded-lg px-4 py-2 shadow-md">
              <span className="text-sm text-gray-600">Games Completed: </span>
              <span className="font-bold text-purple-600">
                {Object.values(userProgress).filter(p => p > 0).length}/6
              </span>
            </div>
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              <span>❓</span> How to Play
            </button>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">How to Play</h3>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>🎯 Goal:</strong> Learn healthy ways to manage emotions and resolve conflicts</p>
                <p><strong>🎮 How:</strong> Click on any game below to start. Each game teaches different skills:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li><strong>Volcano Calm:</strong> Deep breathing for anger management</li>
                  <li><strong>Peace Puzzle:</strong> Focus and problem-solving skills</li>
                  <li><strong>Thought Reframer:</strong> Positive thinking techniques</li>
                  <li><strong>Anger Tracker:</strong> Understanding your triggers</li>
                  <li><strong>Empathy Builder:</strong> Seeing others' perspectives</li>
                  <li><strong>Stress Buster:</strong> Quick relaxation techniques</li>
                </ul>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">
                  <strong>💡 Tip:</strong> These games use proven therapy techniques to help you handle difficult situations better!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Selection */}
        {!activeGame && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.map(game => (
              <div key={game.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">{game.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{game.label}</h3>
                    <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                    <div className="flex justify-center items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {game.difficulty}
                      </span>
                      {userProgress[game.id] > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveGame(game.id)}
                    className={`w-full ${game.color} text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Game Display */}
        {activeGame && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setActiveGame(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                ← Back to Games
              </button>
              <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm text-gray-600">Playing: </span>
                <span className="font-bold text-purple-600">
                  {games.find(g => g.id === activeGame)?.label}
                </span>
              </div>
            </div>
            
            {/* Game Tutorial */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <div className="text-blue-400 mr-3 text-xl">💡</div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">How to Play:</h4>
                  <p className="text-blue-700 text-sm">{getTutorialForGame(activeGame)}</p>
                </div>
              </div>
            </div>

            {/* Render Active Game */}
            {activeGame === 'volcano' && <VolcanoGame userProgress={userProgress} setUserProgress={setUserProgress} />}
            {activeGame === 'puzzle' && <PuzzleGame userProgress={userProgress} setUserProgress={setUserProgress} />}
            {activeGame === 'thoughts' && <ThoughtsGame userProgress={userProgress} setUserProgress={setUserProgress} />}
            {activeGame === 'anger' && <AngerTracker userProgress={userProgress} setUserProgress={setUserProgress} />}
            {activeGame === 'empathy' && <EmpathyBuilder userProgress={userProgress} setUserProgress={setUserProgress} />}
            {activeGame === 'stress' && <StressBuster userProgress={userProgress} setUserProgress={setUserProgress} />}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================
// VOLCANO GAME (Enhanced)
// ======================
const VolcanoGame = ({ userProgress, setUserProgress }) => {
  const [breaths, setBreaths] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [lavaHeight, setLavaHeight] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [timer, setTimer] = useState(0);

  const startBreathing = () => {
    if (isBreathing) return;
    
    setIsBreathing(true);
    setLavaHeight(100);
    setBreathPhase('inhale');
    setTimer(4);
    
    const breathCycle = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setBreathPhase(current => current === 'inhale' ? 'exhale' : 'inhale');
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimeout(() => {
      clearInterval(breathCycle);
      setLavaHeight(0);
      setBreaths(b => b + 1);
      setIsBreathing(false);
      setTimer(0);
    }, 8000); // 4 seconds inhale + 4 seconds exhale
  };

  useEffect(() => {
    if (breaths >= 5 && userProgress.volcano === 0) {
      setUserProgress(prev => ({ ...prev, volcano: 1 }));
    }
  }, [breaths]);

  if (breaths >= 5) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Volcano Mastered!</h2>
          <p className="text-lg mb-4">You've learned to cool your anger with deep breathing!</p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Remember:</span> When you feel anger rising, take 5 deep breaths. 
              Breathe in for 4 counts, breathe out for 4 counts. This activates your body's calm response.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setBreaths(0);
                setLavaHeight(0);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Cool the Volcano</h2>
        <p className="mb-6 text-gray-600">Use deep breathing to manage intense emotions</p>
        
        <div className="relative mb-6">
          <div className="text-8xl mb-4">🌋</div>
          <div className="w-24 h-32 mx-auto relative overflow-hidden bg-gray-200 rounded-b-full">
            <div 
              className="w-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 absolute bottom-0 rounded-b-full transition-all duration-1000 ease-in-out"
              style={{ height: `${lavaHeight}%` }}
            >
              {lavaHeight > 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-30 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {isBreathing && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {breathPhase === 'inhale' ? '🫁 Breathe In' : '💨 Breathe Out'}
            </div>
            <div className="text-3xl font-mono text-blue-800">{timer}</div>
            <div className="text-sm text-blue-600 mt-2">
              {breathPhase === 'inhale' ? 'Fill your lungs slowly...' : 'Release the tension...'}
            </div>
          </div>
        )}
        
        <button
          onClick={startBreathing}
          disabled={isBreathing}
          className={`mb-4 px-8 py-3 rounded-lg font-medium text-white transition-all ${
            isBreathing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 transform hover:scale-105'
          }`}
        >
          {isBreathing ? 'Breathing...' : 'Begin Deep Breathing'}
        </button>
        
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-xl font-bold text-gray-700">
            Progress: {breaths}/5
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < breaths ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================
// ENHANCED PUZZLE GAME
// ======================
const PuzzleGame = ({ userProgress, setUserProgress }) => {
  const puzzlePieces = ['🧘', '🌿', '☀️', '🌊', '🕊️', '🌈', '🌸', '🌙', '✨'];
  const motivationalMessages = [
    "Take it one piece at a time",
    "Focus brings clarity",
    "Every small step matters",
    "You're building something beautiful"
  ];
  
  const [difficulty, setDifficulty] = useState(4);
  const [currentPuzzle, setCurrentPuzzle] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    setupPuzzle();
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % motivationalMessages.length);
    }, 3000);
    return () => clearInterval(messageInterval);
  }, [difficulty]);

  const setupPuzzle = () => {
    setCorrectCount(0);
    setCompleted(false);
    setAttempts(0);
    setCurrentPuzzle([...puzzlePieces.slice(0, difficulty)].sort(() => Math.random() - 0.5));
  };

  const isPieceCorrect = (index, piece) => {
    return piece === puzzlePieces[index];
  };

  const checkPuzzlePiece = (index, piece) => {
    setAttempts(prev => prev + 1);
    
    if (isPieceCorrect(index, piece)) {
      setCorrectCount(prev => {
        const newCount = prev + 1;
        if (newCount === currentPuzzle.length) {
          setCompleted(true);
          if (userProgress.puzzle === 0) {
            setUserProgress(prev => ({ ...prev, puzzle: 1 }));
          }
        }
        return newCount;
      });
    } else {
      const pieces = document.querySelectorAll('.puzzle-piece');
      if (pieces[index]) {
        pieces[index].classList.add('animate-shake');
        setTimeout(() => pieces[index].classList.remove('animate-shake'), 500);
      }
    }
  };

  if (completed) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Perfect Focus!</h2>
          <p className="text-lg mb-4">You completed the puzzle in {attempts} attempts!</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">What you learned:</span> Breaking big problems into smaller pieces makes them manageable. When you feel overwhelmed, focus on one small step at a time.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setDifficulty(4)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                difficulty === 4 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Easy (4 pieces)
            </button>
            <button
              onClick={() => setDifficulty(9)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                difficulty === 9 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              Hard (9 pieces)
            </button>
          </div>
          
          <button
            onClick={setupPuzzle}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            New Puzzle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Peace Puzzle</h2>
        <p className="mb-4 text-gray-600">Arrange the wellness symbols in order</p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-6">
          <p className="text-sm font-medium text-gray-700 animate-fade-in">
            💡 {motivationalMessages[currentMessage]}
          </p>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setDifficulty(4)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              difficulty === 4 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty(9)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              difficulty === 9 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            Hard
          </button>
        </div>
        
        <div 
          className={`grid gap-3 mx-auto mb-6 ${
            difficulty === 4 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
          style={{ width: 'fit-content' }}
        >
          {currentPuzzle.map((piece, index) => (
            <div
              key={index}
              className={`puzzle-piece flex items-center justify-center text-4xl p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                isPieceCorrect(index, piece) 
                  ? 'bg-green-100 border-2 border-green-400 scale-95 cursor-default' 
                  : 'bg-gray-100 hover:bg-gray-200 hover:shadow-md transform hover:scale-105'
              }`}
              onClick={() => !isPieceCorrect(index, piece) && checkPuzzlePiece(index, piece)}
            >
              {piece}
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(correctCount / currentPuzzle.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {correctCount}/{currentPuzzle.length} pieces correct • {attempts} attempts
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ======================
// ENHANCED THOUGHTS GAME
// ======================
const ThoughtsGame = ({ userProgress, setUserProgress }) => {
  const thoughts = [
    { id: 1, negative: "I always mess everything up", positive: "I'm learning from my mistakes and growing" },
    { id: 2, negative: "Everyone thinks I'm weird", positive: "I'm unique and that's my strength" },
    { id: 3, negative: "I'll never be good enough", positive: "I'm improving every day" },
    { id: 4, negative: "Nothing ever goes right for me", positive: "I've overcome challenges before" },
    { id: 5, negative: "I'm a terrible person", positive: "I'm human and I'm trying my best" },
    { id: 6, negative: "They're probably talking about me", positive: "I don't know what they're thinking" },
    { id: 7, negative: "I can't do anything right", positive: "I have many skills and talents" }
  ];
  
  const [currentThoughts, setCurrentThoughts] = useState([]);
  const [reframedCount, setReframedCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedThoughts, setSelectedThoughts] = useState([]);

  useEffect(() => {
    setupThoughts();
  }, []);

  const setupThoughts = () => {
    setReframedCount(0);
    setCompleted(false);
    const randomThoughts = [...thoughts].sort(() => Math.random() - 0.5).slice(0, 5);
    setCurrentThoughts(randomThoughts);
    setSelectedThoughts([]);
  };

  const reframeThought = (id) => {
    setCurrentThoughts(prev => 
      prev.map(t => t.id === id ? { ...t, isReframed: true } : t)
    );
    
    setReframedCount(prev => {
      const newCount = prev + 1;
      if (newCount === currentThoughts.length) {
        setCompleted(true);
        if (userProgress.thoughts === 0) {
          setUserProgress(prev => ({ ...prev, thoughts: 1 }));
        }
        setTimeout(() => {
          setCompleted(false);
          setupThoughts();
        }, 4000);
      }
      return newCount;
    });
  };

  if (completed) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center animate-bounce">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Mind Transformed!</h2>
          <p className="text-lg mb-4">You've mastered positive thinking!</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Remember:</span> Your thoughts shape your reality. When you catch yourself thinking negatively, pause and ask: "Is there another way to see this?"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">Thought Reframer</h2>
        <p className="text-gray-600">Click on negative thoughts to transform them</p>
      </div>
      
      <div className="space-y-4 mb-6">
        {currentThoughts.map(thought => (
          <div
            key={thought.id}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-500 transform ${
              thought.isReframed 
                ? 'bg-gradient-to-r from-green-100 to-blue-100 scale-105' 
                : 'bg-red-50 hover:bg-red-100 hover:shadow-md'
            }`}
            onClick={() => !thought.isReframed && reframeThought(thought.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {thought.isReframed ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">❌</span>
                      <span className="line-through text-gray-500 text-sm">{thought.negative}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <span className="font-medium text-green-700">{thought.positive}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">💭</span>
                    <span className="text-gray-800">{thought.negative}</span>
                  </div>
                )}
              </div>
              {!thought.isReframed && (
                <div className="ml-3">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    Click to reframe
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${(reframedCount / currentThoughts.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Progress: {reframedCount}/{currentThoughts.length} thoughts reframed
        </p>
      </div>
      
      {reframedCount > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg text-center">
          <p className="text-sm text-purple-700">
            🎯 Great! You're building healthier thought patterns!
          </p>
        </div>
      )}
    </div>
  );
};

// ======================
// NEW GAME: ANGER TRACKER
// ======================
const AngerTracker = ({ userProgress, setUserProgress }) => {
  const scenarios = [
    {
      id: 1,
      situation: "Your friend borrows your favorite hoodie and returns it with a stain",
      triggers: ["Disrespect", "Carelessness", "Disappointment", "Betrayal"],
      healthyResponse: "Talk to them calmly about how it made you feel"
    },
    {
      id: 2,
      situation: "A classmate keeps interrupting you during group presentations",
      triggers: ["Disrespect", "Frustration", "Embarrassment", "Powerlessness"],
      healthyResponse: "Speak up assertively: 'I'd like to finish my point first'"
    },
    {
      id: 3,
      situation: "Your parents compare you to your sibling again",
      triggers: ["Inadequacy", "Unfairness", "Hurt", "Resentment"],
      healthyResponse: "Express your feelings: 'It hurts when you compare us'"
    },
    {
      id: 4,
      situation: "Someone spreads a rumor about you at school",
      triggers: ["Betrayal", "Humiliation", "Anger", "Helplessness"],
      healthyResponse: "Address it directly with the person or seek help from a trusted adult"
    },
    {
      id: 5,
      situation: "You get blamed for something you didn't do",
      triggers: ["Injustice", "Frustration", "Anger", "Defensiveness"],
      healthyResponse: "Stay calm and present your side of the story clearly"
    }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [showResponse, setShowResponse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTriggerSelect = (trigger) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(prev => prev.filter(t => t !== trigger));
    } else {
      setSelectedTriggers(prev => [...prev, trigger]);
    }
  };

  const submitTriggers = () => {
    if (selectedTriggers.length === 0) return;
    
    setShowResponse(true);
    setProgress(prev => prev + 1);
    
    if (progress + 1 >= scenarios.length) {
      setCompleted(true);
      if (userProgress.anger === 0) {
        setUserProgress(prev => ({ ...prev, anger: 1 }));
      }
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedTriggers([]);
      setShowResponse(false);
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setSelectedTriggers([]);
    setShowResponse(false);
    setCompleted(false);
    setProgress(0);
  };

  if (completed) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Triggers Identified!</h2>
          <p className="text-lg mb-4">You've learned to recognize what makes you angry!</p>
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Key insight:</span> Knowing your triggers is the first step to managing anger. 
              When you feel anger rising, pause and identify what triggered it, then choose a healthy response.
            </p>
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Practice More Scenarios
          </button>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-2">Anger Trigger Tracker</h2>
        <p className="text-gray-600">Identify what triggers your anger</p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Situation:</h3>
          <p className="text-gray-700">{scenario.situation}</p>
        </div>

        {!showResponse ? (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">What emotions might this trigger?</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {scenario.triggers.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => handleTriggerSelect(trigger)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-orange-500 text-white transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
            <button
              onClick={submitTriggers}
              disabled={selectedTriggers.length === 0}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                selectedTriggers.length > 0
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Triggers
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Your triggers identified:</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTriggers.map(trigger => (
                  <span key={trigger} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Healthy Response:</h3>
              <p className="text-blue-700 text-sm">{scenario.healthyResponse}</p>
            </div>

            {currentScenario < scenarios.length - 1 ? (
              <button
                onClick={nextScenario}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Next Scenario
              </button>
            ) : (
              <button
                onClick={() => setCompleted(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Complete Training
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================
// NEW GAME: EMPATHY BUILDER
// ======================
const EmpathyBuilder = ({ userProgress, setUserProgress }) => {
  const situations = [
    {
      id: 1,
      context: "Maya sits alone at lunch every day and looks sad",
      perspectives: [
        { character: "Maya", feeling: "Lonely and left out", thought: "I wish someone would talk to me" },
        { character: "Classmate", feeling: "Uncertain", thought: "She seems upset, but I don't know if I should bother her" },
        { character: "Teacher", feeling: "Concerned", thought: "I notice she's isolated but I'm not sure how to help" }
      ],
      question: "How might Maya be feeling?",
      lesson: "Sometimes people who seem unfriendly are actually just shy or sad. A simple 'hello' can make a big difference."
    },
    {
      id: 2,
      context: "Alex gets angry and shouts when the team loses the game",
      perspectives: [
        { character: "Alex", feeling: "Frustrated and embarrassed", thought: "I let everyone down, I'm so mad at myself" },
        { character: "Teammate", feeling: "Uncomfortable", thought: "Why is Alex being so dramatic? It's just a game" },
        { character: "Coach", feeling: "Understanding", thought: "Alex cares deeply about the team's success" }
      ],
      question: "Why might Alex be reacting this way?",
      lesson: "Anger often comes from deeper feelings like disappointment or fear. People express emotions differently."
    },
    {
      id: 3,
      context: "Sam constantly brags about expensive clothes and gadgets",
      perspectives: [
        { character: "Sam", feeling: "Insecure", thought: "If I don't show off, people won't think I'm cool" },
        { character: "Friend", feeling: "Annoyed", thought: "Sam is so show-offy, it's getting on my nerves" },
        { character: "Observer", feeling: "Sympathetic", thought: "Sam seems to need validation from others" }
      ],
      question: "What might be behind Sam's behavior?",
      lesson: "Bragging often comes from insecurity. People who seem overconfident might actually feel uncertain about themselves."
    }
  ];

  const [currentSituation, setCurrentSituation] = useState(0);
  const [selectedPerspective, setSelectedPerspective] = useState(null);
  const [showAllPerspectives, setShowAllPerspectives] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePerspectiveSelect = (perspective) => {
    setSelectedPerspective(perspective);
    setShowAllPerspectives(true);
    setProgress(prev => prev + 1);
    
    if (progress + 1 >= situations.length) {
      setTimeout(() => {
        setCompleted(true);
        if (userProgress.empathy === 0) {
          setUserProgress(prev => ({ ...prev, empathy: 1 }));
        }
      }, 3000);
    }
  };

  const nextSituation = () => {
    if (currentSituation < situations.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setSelectedPerspective(null);
      setShowAllPerspectives(false);
    }
  };

  const resetGame = () => {
    setCurrentSituation(0);
    setSelectedPerspective(null);
    setShowAllPerspectives(false);
    setCompleted(false);
    setProgress(0);
  };

  if (completed) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Empathy Mastered!</h2>
          <p className="text-lg mb-4">You've learned to see from different perspectives!</p>
          <div className="bg-pink-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-pink-800">
              <span className="font-semibold">Remember:</span> Everyone has a story behind their behavior. 
              When someone acts in a way that upsets you, try to understand what they might be feeling or going through.
            </p>
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Practice More Situations
          </button>
        </div>
      </div>
    );
  }

  const situation = situations[currentSituation];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">Empathy Builder</h2>
        <p className="text-gray-600">Understand different perspectives</p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentSituation + 1) / situations.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Situation {currentSituation + 1} of {situations.length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Situation:</h3>
          <p className="text-gray-700">{situation.context}</p>
        </div>

        {!showAllPerspectives ? (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">{situation.question}</h3>
            <div className="space-y-3">
              {situation.perspectives.map((perspective, index) => (
                <button
                  key={index}
                  onClick={() => handlePerspectiveSelect(perspective)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-pink-50 rounded-lg transition-colors border-2 border-transparent hover:border-pink-200"
                >
                  <div className="font-medium text-gray-800 mb-1">
                    {perspective.character}'s view:
                  </div>
                  <div className="text-sm text-gray-600">
                    "{perspective.thought}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-3 mb-4">
              {situation.perspectives.map((perspective, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    selectedPerspective === perspective
                      ? 'bg-pink-100 border-pink-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-medium text-gray-800 mb-2">
                    {perspective.character} {selectedPerspective === perspective && '(Your choice)'}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Feeling:</span> {perspective.feeling}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Thinking:</span> "{perspective.thought}"
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Lesson:</h3>
              <p className="text-blue-700 text-sm">{situation.lesson}</p>
            </div>

            {currentSituation < situations.length - 1 ? (
              <button
                onClick={nextSituation}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Next Situation
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Great job exploring different perspectives!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================
// NEW GAME: STRESS BUSTER
// ======================
const StressBuster = ({ userProgress, setUserProgress }) => {
  const techniques = [
    {
      id: 1,
      name: "5-4-3-2-1 Grounding",
      description: "Use your senses to calm down",
      instruction: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      duration: 15,
      icon: "👁️"
    },
    {
      id: 2,
      name: "Progressive Muscle Relaxation",
      description: "Tense and release muscle groups",
      instruction: "Tense your shoulders for 5 seconds, then release. Feel the difference between tension and relaxation",
      duration: 20,
      icon: "💪"
    },
    {
      id: 3,
      name: "Box Breathing",
      description: "4-count breathing pattern",
      instruction: "Breathe in for 4, hold for 4, breathe out for 4, hold for 4. Repeat this cycle",
      duration: 12,
      icon: "📦"
    },
    {
      id: 4,
      name: "Positive Visualization",
      description: "Imagine a peaceful place",
      instruction: "Close your eyes and imagine your favorite calm place. What do you see, hear, and feel there?",
      duration: 18,
      icon: "🌅"
    }
  ];

  const [currentTechnique, setCurrentTechnique] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedTechniques, setCompletedTechniques] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            const technique = techniques[currentTechnique];
            if (!completedTechniques.includes(technique.id)) {
              setCompletedTechniques(prev => [...prev, technique.id]);
              if (completedTechniques.length + 1 >= techniques.length) {
                setShowCompletion(true);
                if (userProgress.stress === 0) {
                  setUserProgress(prev => ({ ...prev, stress: 1 }));
                }
              }
            }
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentTechnique, completedTechniques]);

  const startTechnique = (index) => {
    setCurrentTechnique(index);
    setTimeLeft(techniques[index].duration);
    setIsActive(true);
  };

  const resetGame = () => {
    setCompletedTechniques([]);
    setShowCompletion(false);
    setIsActive(false);
    setTimeLeft(0);
  };

  if (showCompletion) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🧘‍♂️</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Stress Mastery!</h2>
          <p className="text-lg mb-4">You've learned 4 powerful stress-busting techniques!</p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Use these anytime:</span> When you feel stressed or overwhelmed, 
              pick one of these techniques. The more you practice, the more effective they become!
            </p>
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Stress Buster</h2>
        <p className="text-gray-600">Learn quick stress-relief techniques</p>
        <div className="mt-4">
          <div className="flex justify-center gap-2">
            {techniques.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  completedTechniques.includes(techniques[index].id)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedTechniques.length}/{techniques.length} techniques learned
          </p>
        </div>
      </div>

      {isActive ? (
        <div className="text-center">
          <div className="text-8xl mb-4">{techniques[currentTechnique].icon}</div>
          <h3 className="text-xl font-bold text-green-600 mb-2">
            {techniques[currentTechnique].name}
          </h3>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-800 mb-3">
              {techniques[currentTechnique].instruction}
            </p>
            <div className="text-3xl font-mono text-green-600 mb-2">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                style={{ 
                  width: `${((techniques[currentTechnique].duration - timeLeft) / techniques[currentTechnique].duration) * 100}%` 
                }}
              />
            </div>
          </div>
          <button
            onClick={() => setIsActive(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Stop Early
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {techniques.map((technique, index) => (
            <div
              key={technique.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                completedTechniques.includes(technique.id)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{technique.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {technique.name}
                      {completedTechniques.includes(technique.id) && (
                        <span className="ml-2 text-green-500">✓</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                    <p className="text-xs text-gray-500">{technique.duration} seconds</p>
                  </div>
                </div>
                <button
                  onClick={() => startTechnique(index)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {completedTechniques.includes(technique.id) ? 'Practice' : 'Try It'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapeuticGames;