import { useState, useRef, useEffect } from "react";
import videoData from "./video1.json";
const MCQCard = ({ question, onAnswer, isDark }) => (
  <div className="animate-fadeIn">
    <h3
      className={`text-xl font-bold mb-6 ${isDark ? "text-text-inverse" : "text-text-primary"
        }`}
    >
      {question.question}
    </h3>
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 font-medium ${isDark
            ? "border-surface-dark-muted hover:border-brand-400 hover:bg-surface-dark-subtle text-text-inverse"
            : "border-border-light hover:border-brand-500 hover:bg-brand-50 text-text-secondary"
            }`}
        >
          <span
            className={`inline-block w-6 h-6 rounded-full text-center text-sm mr-3 ${isDark
              ? "bg-surface-dark-muted text-text-inverse"
              : "bg-surface-muted text-text-primary"
              }`}
          >
            {String.fromCharCode(65 + index)}
          </span>
          {option}
        </button>
      ))}
    </div>
  </div>
);
const TrueFalseCard = ({ question, onAnswer, isDark }) => (
  <div className="animate-fadeIn">
    <h3
      className={`text-xl font-bold mb-6 ${isDark ? "text-text-inverse" : "text-text-primary"
        }`}
    >
      {question.question}
    </h3>
    <div className="flex gap-4 justify-center">
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          className={`px-8 py-4 border-2 rounded-xl transition-all duration-200 font-medium min-w-[120px] ${
            index === 0
              ? isDark
                ? "border-success hover:bg-success/20 text-success"
                : "border-success-500 hover:bg-success-50 text-success-700"
              : isDark
                ? "border-danger hover:bg-danger/20 text-danger"
                : "border-danger-500 hover:bg-danger-50 text-danger-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{index === 0 ? "✓" : "✗"}</span>
            <span className="text-lg">{option}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);
const FillBlankCard = ({ question, onAnswer, isDark }) => (
  <div className="animate-fadeIn">
    <h3
      className={`text-xl font-bold mb-6 ${isDark ? "text-text-inverse" : "text-text-primary"
        }`}
    >
      Fill in the blank:
    </h3>
    <div
      className={`text-lg mb-6 p-4 rounded-lg ${isDark ? "bg-surface-dark-muted text-text-inverse" : "bg-surface-muted text-text-primary"
        }`}
    >
      {question.question}
    </div>
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 font-medium ${isDark
            ? "border-surface-dark-muted hover:border-brand-400 hover:bg-surface-dark-subtle text-text-inverse"
            : "border-border-light hover:border-brand-500 hover:bg-brand-50 text-text-secondary"
            }`}
        >
          <span
            className={`inline-block w-6 h-6 rounded-full text-center text-sm mr-3 ${isDark
              ? "bg-surface-dark-muted text-text-inverse"
              : "bg-surface-muted text-text-primary"
              }`}
          >
            {String.fromCharCode(65 + index)}
          </span>
          {option}
        </button>
      ))}
    </div>
  </div>
);
const AnswerFeedback = ({ isCorrect, userAnswer, correctAnswer, questionType, options, onContinue, isDark }) => (
  <div className="text-center animate-fadeIn">
    <div
      className={`mb-6 p-6 rounded-xl border-2 ${isCorrect
        ? isDark
          ? "bg-success/10 border-success"
          : "bg-success-50 border-success-200"
        : isDark
          ? "bg-danger/10 border-danger"
          : "bg-danger-50 border-danger-200"
        }`}
    >
      <div
        className={`text-2xl font-bold mb-4 ${isCorrect
          ? isDark
            ? "text-success"
            : "text-success-700"
          : isDark
            ? "text-danger"
            : "text-danger-700"
          }`}
      >
        {isCorrect ? "🎉 Correct!" : "❌ Incorrect"}
      </div>
      <div
        className={`text-sm space-y-2 ${isDark ? "text-text-quaternary" : "text-text-tertiary"
          }`}
      >
        <p>
          <strong>Your answer:</strong> {options[userAnswer]}
        </p>
        <p>
          <strong>Correct answer:</strong> {options[correctAnswer]}
        </p>
      </div>
    </div>
    <button
      onClick={onContinue}
      className={`px-8 py-3 rounded-xl transition-all duration-200 font-medium ${isDark
        ? "bg-brand-500 hover:bg-brand-600 text-white"
        : "bg-brand-500 hover:bg-brand-600 text-white"
        }`}
    >
      Continue Video
    </button>
  </div>
);
const QuestionOverlay = ({ videoRef, isDark }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      const time = video.currentTime;
      const question = videoData.questions.find(
        (q) =>
          Math.abs(q.timestamp - time) < 0.5 && !answeredQuestions.has(q.id)
      );
      if (question && !currentQuestion) {
        setCurrentQuestion(question);
        video.pause();
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentQuestion, answeredQuestions]);
  const handleQuestionAnswer = (answer) => {
    setUserAnswer(answer);
    setShowAnswer(true);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: { answer, correct },
    });
  };
  const continueVideo = () => {
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
    setCurrentQuestion(null);
    setShowAnswer(false);
    setUserAnswer(null);
    const video = videoRef.current;
    video.currentTime = Math.min(currentQuestion.timestamp + 1, video.duration);
    video.play();
  };
  if (!currentQuestion) return null;
  const renderQuestionCard = () => {
    switch (currentQuestion.type) {
      case "mcq":
        return (
          <MCQCard
            question={currentQuestion}
            onAnswer={handleQuestionAnswer}
            isDark={isDark}
          />
        );
      case "true_false":
        return (
          <TrueFalseCard
            question={currentQuestion}
            onAnswer={handleQuestionAnswer}
            isDark={isDark}
          />
        );
      case "fill_blank":
        return (
          <FillBlankCard
            question={currentQuestion}
            onAnswer={handleQuestionAnswer}
            isDark={isDark}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className={`rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl ${isDark ? "bg-surface-dark-subtle" : "bg-surface-light"
          }`}
      >
        {!showAnswer ? (
          renderQuestionCard()
        ) : (
          <AnswerFeedback
            isCorrect={isCorrect}
            userAnswer={userAnswer}
            correctAnswer={currentQuestion.correctAnswer}
            questionType={currentQuestion.type}
            options={currentQuestion.options}
            onContinue={continueVideo}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};
export default QuestionOverlay;