import React, { useState } from 'react';
import { HelpCircle, Star, ShieldAlert, CheckCircle, Award, RefreshCw, XCircle, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, EarningCategory, UserProfile } from '../types';
import { QUIZ_QUESTIONS } from '../data';

interface QuizzesProps {
  currentUser: UserProfile;
  addBadge: (badge: string) => void;
}

export default function Quizzes({ currentUser, addBadge }: QuizzesProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (submitted) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    if (selectedOpt === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setSubmitted(false);

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Shoot beautiful celebration confetti!
      const finalScore = score + (selectedOpt === currentQuestion.correctAnswerIndex ? 1 : 0);
      if (finalScore >= 4) {
        addBadge("QuizMaster");
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        addBadge("Scholar");
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getCategoryLabel = (cat: EarningCategory) => {
    switch (cat) {
      case 'AFFILIATE_MARKETING': return 'Affiliates';
      case 'FREELANCING': return 'Freelance';
      case 'DIGITAL_PRODUCTS': return 'Digital Goods';
      case 'FINANCIAL_EDUCATION': return 'Financial Education';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Award className="w-8 h-8 text-brand-green" />
          Earning Quizzes
        </h1>
        <p className="text-slate-400 text-sm mt-1">Audit your financial and digital business knowledge to earn official badges.</p>
      </div>

      {quizFinished ? (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
          
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Quiz Completed!</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              You scored <strong className="text-emerald-400 text-lg">{score}</strong> out of <strong className="text-slate-200 text-lg">{QUIZ_QUESTIONS.length}</strong> correct answers!
            </p>
          </div>

          {score >= 4 ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs sm:text-sm max-w-md mx-auto space-y-1">
              <p className="font-bold">🎖️ New Badge Unlocked: QuizMaster</p>
              <p className="text-emerald-400">Your understanding of scalable digital frameworks is elite.</p>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl text-xs sm:text-sm max-w-md mx-auto space-y-1">
              <p className="font-bold text-slate-300">🎖️ Badge Unlocked: Scholar</p>
              <p className="text-slate-500">Practice makes perfect. Review the blueprints and score 4+ correct to earn the elite QuizMaster badge.</p>
            </div>
          )}

          <button
            onClick={handleRestartQuiz}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg focus:outline-none transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Quiz Again
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Progress bar */}
          <div className="bg-slate-950 h-2 w-full flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" 
              style={{ width: `${((currentIdx) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-bold uppercase tracking-wider">
                Category: {getCategoryLabel(currentQuestion.category)}
              </span>
              <span className="text-slate-500 font-bold">
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                let btnStyle = "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950/80";
                
                if (submitted) {
                  if (i === currentQuestion.correctAnswerIndex) {
                    btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                  } else if (selectedOpt === i) {
                    btnStyle = "bg-rose-500/10 border-rose-500 text-rose-400";
                  } else {
                    btnStyle = "bg-slate-950/20 border-slate-900 text-slate-600 opacity-60";
                  }
                } else if (selectedOpt === i) {
                  btnStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className={`w-full p-4 border rounded-xl text-left text-sm transition-all focus:outline-none flex items-center justify-between gap-4 ${btnStyle}`}
                    disabled={submitted}
                  >
                    <span>{option}</span>
                    {submitted && i === currentQuestion.correctAnswerIndex && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {submitted && selectedOpt === i && i !== currentQuestion.correctAnswerIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  Advisor Explanation
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Bottom action bar */}
            <div className="pt-4 border-t border-slate-800/60 flex justify-end">
              {!submitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow focus:outline-none transition-all cursor-pointer"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm shadow focus:outline-none transition-all flex items-center gap-1 cursor-pointer"
                >
                  {currentIdx + 1 === QUIZ_QUESTIONS.length ? "Finish Quiz" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
