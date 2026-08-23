import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { LEARN_ARTICLES, QUIZ_QUESTIONS } from '../data/mockData';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  Share2,
  Check,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const LearnArticlePage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug || 'what-is-bitcoin';

  const article =
    LEARN_ARTICLES.find((a) => a.slug === slug) || LEARN_ARTICLES[0];

  const [hasCopied, setHasCopied] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);

  const quiz = QUIZ_QUESTIONS[0];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-slate-400">
        Article not found.
      </div>
    );
  }

  const relatedArticles = LEARN_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Academy</span>
        </Link>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
        >
          {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{hasCopied ? 'Link Copied' : 'Share Guide'}</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Badge variant="indigo">{article.category}</Badge>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span className="text-xs text-slate-500 font-mono">• {article.difficulty}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">{article.summary}</p>
      </div>

      {/* Key Takeaways Callout Box */}
      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Core Takeaways</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          {article.keyTakeaways.map((t, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Article Body Content */}
      <article className="space-y-5 text-slate-300 text-sm leading-relaxed">
        {article.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Micro Checkpoint Question */}
      {quiz && (
        <Card className="p-6 space-y-4 bg-slate-900/90 border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Quick Knowledge Check: {quiz.question}</span>
          </h4>

          <div className="space-y-2">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === quiz.correctIndex;

              let btnStyle = 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800';
              if (hasSubmittedQuiz) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 text-emerald-300 border-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/40 text-rose-300 border-rose-500';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-600/30 text-indigo-300 border-indigo-500';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasSubmittedQuiz}
                  onClick={() => setSelectedQuizOption(idx)}
                  className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {hasSubmittedQuiz && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {!hasSubmittedQuiz ? (
            <Button
              size="sm"
              variant="primary"
              disabled={selectedQuizOption === null}
              onClick={() => setHasSubmittedQuiz(true)}
              className="font-bold"
            >
              Check Answer
            </Button>
          ) : (
            <p className="text-xs text-slate-400 pt-1 leading-relaxed">
              {quiz.explanation}
            </p>
          )}
        </Card>
      )}

      {/* Related Guides */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h4 className="text-base font-bold text-white">Related Educational Guides</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedArticles.map((rel) => (
            <Link key={rel.slug} to={`/learn/${rel.slug}`} className="block group">
              <Card className="p-4 hover:border-slate-700 transition-colors">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block mb-1">
                  {rel.category} • {rel.readTime}
                </span>
                <h5 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                  {rel.title}
                </h5>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
