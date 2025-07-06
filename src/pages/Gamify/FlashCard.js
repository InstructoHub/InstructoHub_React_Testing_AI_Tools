import React, { useState, useEffect } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, BookOpen, FlipHorizontal, BrainCog, FileText } from 'lucide-react';
const LearningModesUI = () => {
  // Define learning modes
  const learningModes = [
    { 
      id: 'simply-learn', 
      name: 'Simply Learn', 
      icon: <BookOpen size={18} />,
      description: 'Important facts / did you know / Points to Remember'
    },
    { 
      id: 'qna', 
      name: 'QnA', 
      icon: <FlipHorizontal size={18} />,
      description: 'Flash cards - Reverse methodology answer before question'
    },
          { 
      id: 'assess-me', 
      name: 'Assess Me', 
      icon: <BrainCog size={18} />,
      description: 'Test your understanding with key concepts'
    },
    { 
      id: 'summarize', 
      name: 'Summarize', 
      icon: <FileText size={18} />,
      description: 'Content summary'
    }
  ];
  // Sample content for different modes
  const sampleContent = {
    'simply-learn': [
      {
        "id": 1,
        "subject": "Biology",
        "title": "Photosynthesis",
        "fact": "Plants convert light energy into chemical energy through photosynthesis, producing glucose and oxygen as byproducts.",
        "backgroundColor": "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)"
      },
      {
        "id": 2,
        "subject": "Physics",
        "title": "Gravity",
        "fact": "The gravitational force between two objects is proportional to the product of their masses and inversely proportional to the square of the distance between them (Newton's Law).",
        "backgroundColor": "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)"
      },
      {
        "id": 3,
        "subject": "Geography",
        "title": "Capital Cities",
        "fact": "Paris is the capital of France and is known as the 'City of Light' due to its role during the Age of Enlightenment.",
        "backgroundColor": "linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)"
      },
      {
        "id": 4,
        "subject": "Chemistry",
        "title": "Water Composition",
        "fact": "Water (H₂O) consists of two hydrogen atoms and one oxygen atom, with a bent molecular geometry due to the oxygen's electron pairs.",
        "backgroundColor": "linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)"
      }
    ],
    'qna': [
      {
        "id": 1,
        "subject": "Biology",
        "answer": "Photosynthesis",
        "question": "The process by which plants make food using sunlight is called...",
        "backgroundColor": "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)"
      },
      {
        "id": 2,
        "subject": "Physics",
        "answer": "Gravity",
        "question": "The force that attracts objects toward each other is known as...",
        "backgroundColor": "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)"
      },
      {
        "id": 3,
        "subject": "Geography",
        "answer": "Paris",
        "question": "The capital city of France is...",
        "backgroundColor": "linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)"
      },
      {
        "id": 4,
        "subject": "Chemistry",
        "answer": "H₂O",
        "question": "The chemical symbol for water is...",
        "backgroundColor": "linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)"
      }
    ],
    'assess-me': [
      {
        "id": 1,
        "subject": "Biology",
        "statement": "Explain the primary function of photosynthesis in plants.",
        "answer": "Convert light energy into chemical energy",
        "backgroundColor": "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)",
        "revealed": false
      },
      {
        "id": 2,
        "subject": "Physics",
        "statement": "Explain what happens to gravitational force when distance between objects doubles.",
        "answer": "Decreases to one-fourth strength",
        "backgroundColor": "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
        "revealed": false
      },
      {
        "id": 3,
        "subject": "Geography",
        "statement": "Name the major river that flows through the center of Paris.",
        "answer": "Seine River",
        "backgroundColor": "linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)",
        "revealed": false
      },
      {
        "id": 4,
        "subject": "Chemistry",
        "statement": "Describe the molecular geometry of water (H₂O).",
        "answer": "Bent shape with 104.5° angle",
        "backgroundColor": "linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)",
        "revealed": false
      }
    ],
    'summarize': [
      {
        "id": 1,
        "subject": "Biology",
        "title": "Photosynthesis Summary",
        "content": "Photosynthesis is the process used by plants, algae and certain bacteria to convert light energy, usually from the sun, into chemical energy stored in molecules like glucose. This process takes place in the chloroplasts of plant cells, specifically using the green pigment chlorophyll. The overall reaction converts carbon dioxide and water into glucose and oxygen, which is released as a byproduct. The equation can be summarized as: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",
        "backgroundColor": "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)"
      },
      {
        "id": 2,
        "subject": "Physics",
        "title": "Gravity Summary",
        "content": "Gravity is one of the four fundamental forces in nature. Newton's Law of Universal Gravitation states that any two objects in the universe attract each other with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them. Later, Einstein's General Theory of Relativity redefined gravity not as a force but as a curvature of spacetime caused by mass and energy. Gravity is responsible for keeping planets in orbit, the tides, and the formation of stars and galaxies.",
        "backgroundColor": "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)"
      }
    ]
  };
  const [currentMode, setCurrentMode] = useState('simply-learn');
  const [cards, setCards] = useState(sampleContent[currentMode]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Update cards when mode changes
  useEffect(() => {
    // Check if data exists for the current mode
    if (sampleContent[currentMode] && sampleContent[currentMode].length > 0) {
      setCards(sampleContent[currentMode]);
    } else {
      // Set default empty array if no data for mode
      setCards([]);
    }
    setCurrentIndex(0);
    setFlipped(false);
    setSelectedAnswer(null);
  }, [currentMode]);
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setSelectedAnswer(null);
    }
  };
  
  const resetCards = () => {
    if (currentMode === 'assess-me') {
      // Reset revealed state for assess-me cards
      const resetAssessCards = cards.map(card => ({
        ...card,
        revealed: false
      }));
      setCards(resetAssessCards);
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setSelectedAnswer(null);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (currentMode === 'qna') {
        handleFlip();
      } else if (currentMode === 'assess-me' && !currentCard.revealed) {
        // Reveal answer on spacebar or enter for assess-me mode
        const updatedCards = [...cards];
        updatedCards[currentIndex].revealed = true;
        setCards(updatedCards);
      }
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, flipped, cards.length, currentMode]);
  const currentCard = cards[currentIndex];
  // Render content based on current mode
  const renderContent = () => {
    // Check if no cards available
    if (!cards || cards.length === 0) {
      return (
        <div className="w-full h-72 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg bg-white">
          <p className="text-lg text-center text-gray-600">No content available for this learning mode.</p>
        </div>
      );
    }
    
    // Check if currentIndex is valid
    if (currentIndex >= cards.length) {
      setCurrentIndex(0);
      return null;
    }
    switch(currentMode) {
      case 'simply-learn':
        return (
          <div 
            className="w-full h-72 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg"
            style={{ background: currentCard.backgroundColor || "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)" }}
          >
            <div className="bg-white bg-opacity-80 px-4 py-1 rounded-full text-indigo-800 text-sm mb-4">
              {currentCard.subject} | {currentCard.title}
            </div>
            <div className="text-xl text-center font-medium">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">💡</span>
                <span className="text-indigo-900 font-semibold">Did you know?</span>
              </div>
              <p>{currentCard.fact}</p>
            </div>
          </div>
        );
      
      case 'qna':
        return (
          <div 
            className="relative w-full h-72 cursor-pointer transition-all duration-500 preserve-3d"
            onClick={handleFlip}
            style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg backface-hidden"
              style={{ background: currentCard.backgroundColor || "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)" }}
            >
              <div className="bg-white bg-opacity-80 px-4 py-1 rounded-full text-indigo-800 text-sm mb-4">
                {currentCard.subject}
              </div>
              <p className="text-xl text-center font-medium">{currentCard.question}</p>
              <div className="mt-6 bg-white bg-opacity-70 px-4 py-2 rounded-full text-gray-600 flex items-center animate-pulse">
                <span>Click to reveal the question!</span>
              </div>
            </div>
            
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg bg-indigo-50 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <p className="text-xl text-center font-medium text-indigo-900">
                {currentCard.answer}
              </p>
              
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-full transition-colors duration-200"
                >
                  <span>Next Card</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'assess-me':
        if (!currentCard) {
          return (
            <div className="w-full h-72 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg bg-white">
              <p className="text-lg text-center text-gray-600">No assessment content available.</p>
            </div>
          );
        }
        
        return (
          <div className="w-full h-auto">
            <div 
              className="w-full min-h-72 p-8 rounded-2xl shadow-lg"
              style={{ background: currentCard.backgroundColor || "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)" }}
            >
              <div className="bg-white bg-opacity-80 px-4 py-1 rounded-full text-indigo-800 text-sm mb-4 inline-block">
                {currentCard.subject}
              </div>
              
              {!currentCard.revealed ? (
                <div className="flex flex-col items-center">
                  <p className="text-xl font-medium mb-8 text-gray-800">{currentCard.statement}</p>
                  <div className="mt-4">
                    <button 
                      onClick={() => {
                        const updatedCards = [...cards];
                        updatedCards[currentIndex].revealed = true;
                        setCards(updatedCards);
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Reveal Answer
                    </button>
                  </div>
                  <div className="mt-8 text-center text-gray-600 italic">
                    Think about your answer before revealing
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium mb-4 text-gray-800">{currentCard.statement}</p>
                  <div className="my-8 p-6 bg-white bg-opacity-90 rounded-xl shadow-md w-full">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Your answer should include:</h3>
                    <p className="text-2xl font-bold text-indigo-700">{currentCard.answer}</p>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={handleNext}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Next Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'summarize':
        return (
          <div 
            className="w-full h-auto max-h-96 overflow-y-auto p-8 rounded-2xl shadow-lg"
            style={{ background: currentCard.backgroundColor || "linear-gradient(135deg, #f6f0fd 0%, #f3e7e9 100%)" }}
          >
            <div className="bg-white bg-opacity-80 px-4 py-1 rounded-full text-indigo-800 text-sm mb-4 inline-block">
              {currentCard.subject}
            </div>
            <h3 className="text-2xl font-bold mb-4">{currentCard.title}</h3>
            <div className="text-lg">
              {currentCard.content}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full p-6 flex flex-col items-center justify-center relative">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-600 p-2 rounded-lg mr-3">
            <span className="text-white text-xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Learning Hub</h1>
        </div>
        
        {/* Mode Selection */}
        <div className="w-full max-w-xl mb-6">
          <div className="grid grid-cols-4 gap-2 bg-white rounded-xl p-1 shadow-sm">
            {learningModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                className={`py-2 px-3 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center ${
                  currentMode === mode.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {mode.icon}
                </div>
                <span className="text-xs font-medium">{mode.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-center text-gray-500">
            {learningModes.find(m => m.id === currentMode).description}
          </div>
        </div>
        
        <div className="w-full max-w-xl">
          {/* Card navigation */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrevious} 
                disabled={currentIndex === 0}
                className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className={`p-2 rounded-full ${currentIndex === cards.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Content Display based on mode */}
          {renderContent()}
        </div>
      </div>
      
      <style jsx>{`
        .preserve-3d {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
export default LearningModesUI; 