import React, { useState } from 'react';
import { LEARN_ARTICLES, GLOSSARY_TERMS, QUIZ_QUESTIONS } from '../data/mockData';
import { Link } from '../router/Router';
import {
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const LearnPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'quiz' | 'glossary'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // Quiz State
  const [, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  const categories = ['All', 'Basics', 'Security', 'Trading', 'Custody'];

  const filteredArticles = LEARN_ARTICLES.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (g) =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const handleAnswerSelect = (qId: number, optIndex: number) => {
    if (isQuizFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="indigo">NexusCrypto Academy</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Crypto Education & Risk Hub
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Master the foundational concepts of decentralized finance, cryptographic self-custody, and safe trading practices before deploying real capital.
        </p>
      </div>

      {/* Main Tab Bar */}
      <div className="flex justify-center">
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2 rounded-lg transition-colors ${
              activeTab === 'articles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Guides & Articles
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-5 py-2 rounded-lg transition-colors ${
              activeTab === 'glossary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crypto Glossary (50+)
          </button>
        </div>
      </div>

      {/* Tab Content: Articles */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/learn/${article.slug}`}
                className="block group focus:outline-none"
              >
                <Card className="p-6 h-full flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-200 group-hover:-translate-y-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="indigo">{article.category}</Badge>
                      <span className="text-slate-500 font-mono">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>Read Full Guide</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 sm:p-8 space-y-6">
            {!isQuizFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 font-bold block">
                      KNOWLEDGE CHECKPOINT
                    </span>
                    <h3 className="text-xl font-extrabold text-white">Crypto Fundamentals Quiz</h3>
                  </div>
                  <Badge variant="slate">
                    {Object.keys(selectedAnswers).length} / {QUIZ_QUESTIONS.length} Answered
                  </Badge>
                </div>

                <div className="space-y-8">
                  {QUIZ_QUESTIONS.map((q, qIndex) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {qIndex + 1}
                        </span>
                        <h4 className="font-bold text-white text-sm leading-snug">{q.question}</h4>
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedAnswers[q.id] === optIndex;
                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleAnswerSelect(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                                isSelected
                                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  variant="primary"
                  className="w-full font-bold"
                  disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                  onClick={() => setIsQuizFinished(true)}
                >
                  Submit & Score Quiz
                </Button>
              </div>
            ) : (
              /* Results Screen */
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">Quiz Completed!</h3>
                  <div className="text-4xl font-mono font-extrabold text-emerald-400 mt-2">
                    {calculateScore()} / {QUIZ_QUESTIONS.length} Correct
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {calculateScore() >= 4
                      ? 'Outstanding! You have a solid grasp of decentralized keys and risk management.'
                      : 'Good effort! Review the guides below to sharpen your self-custody principles.'}
                  </p>
                </div>

                {/* Question Review */}
                <div className="text-left space-y-4 pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-white">Detailed Review & Explanations</h4>
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="text-white">{idx + 1}. {q.question}</span>
                        </div>
                        <div className="text-slate-300">
                          <strong>Correct:</strong> {q.options[q.correctIndex]}
                        </div>
                        <p className="text-slate-400 leading-relaxed pt-1">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <Button
                  size="md"
                  variant="outline"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  onClick={handleResetQuiz}
                  className="w-full"
                >
                  Retake Quiz
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab Content: Crypto Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search terms (e.g. Halving, Slippage, MEV...)"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item) => (
              <Card key={item.term} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{item.term}</h4>
                  <Badge variant="indigo" size="sm">{item.category}</Badge>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{item.definition}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
