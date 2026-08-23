import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { FAQ_ITEMS } from '../data/mockData';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';
import { InlineFieldError } from '../components/feedback/inline-field-error';
import { AppErrorAlert } from '../components/feedback/app-error-alert';
import { validateSupportTicket } from '../lib/errors/validation';

export const HelpPage: React.FC = () => {
  const { submitSupportTicket } = useDemo();
  const [search, setSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  // Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Trading Terminal Help');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<{ subject?: string; message?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const filteredFaqs = FAQ_ITEMS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const validation = validateSupportTicket(subject, category, message);
    if (!validation.isValid) {
      if (!subject.trim()) {
        setFieldErrors((prev) => ({ ...prev, subject: 'Subject is required.' }));
      }
      if (message.trim().length < 10) {
        setFieldErrors((prev) => ({ ...prev, message: 'Message must be at least 10 characters.' }));
      }
      setFormError(validation.errorMessage || 'Please fill in all required fields.');
      return;
    }

    const res = submitSupportTicket(subject, category, message);
    if (res && !res.success) {
      setFormError(res.error || 'Failed to submit ticket');
      return;
    }

    setSubmittedTicket({
      id: res.ticketId || `NX-SUP-${Math.floor(100000 + Math.random() * 900000)}`,
      subject: subject.trim(),
      category,
      message: message.trim(),
      time: 'Just now',
    });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 select-none">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <Badge variant="indigo">Support & FAQ</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Help Center</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Find answers regarding paper trading simulation, local data persistence, and platform capabilities.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions (e.g. limit orders, reset, KYC)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <span className="font-bold text-white text-sm">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Simulated Support Ticket Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Submit a Simulated Support Inquiry</span>
          </h3>
          <p className="text-xs text-slate-400">
            Have questions or feedback? Test our mock support dispatch simulator.
          </p>
        </div>

        {submittedTicket ? (
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">
              Inquiry Dispatched to Sandbox Engine!
            </h4>
            <div className="font-mono text-xs text-slate-300">
              Ticket ID: <strong className="text-emerald-400">{submittedTicket.id}</strong>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Our automated demo agent received your request: &ldquo;{submittedTicket.subject}&rdquo;. Since this is a browser prototype, all operations remain local.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSubmittedTicket(null)}
            >
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formError && (
              <AppErrorAlert
                error={formError}
                onDismiss={() => setFormError(null)}
              />
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs font-sans" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticket-subject" className="text-slate-400 block mb-1">Subject</label>
                  <input
                    id="ticket-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (fieldErrors.subject) setFieldErrors((p) => ({ ...p, subject: undefined }));
                    }}
                    placeholder="e.g. Order execution question"
                    className={`w-full bg-slate-950 border rounded-lg p-2.5 text-white ${
                      fieldErrors.subject ? 'border-red-500' : 'border-slate-700'
                    }`}
                    aria-invalid={!!fieldErrors.subject}
                    aria-describedby={fieldErrors.subject ? 'ticket-subj-error' : undefined}
                  />
                  <InlineFieldError id="ticket-subj-error" error={fieldErrors.subject} />
                </div>
                <div>
                  <label htmlFor="ticket-category" className="text-slate-400 block mb-1">Category</label>
                  <select
                    id="ticket-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                  >
                    <option>Trading Terminal Help</option>
                    <option>Wallet & Faucet Questions</option>
                    <option>Education & Quiz Feedback</option>
                    <option>General Platform Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="ticket-message" className="text-slate-400 block mb-1">Message Details (min. 10 chars)</label>
                <textarea
                  id="ticket-message"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) setFieldErrors((p) => ({ ...p, message: undefined }));
                  }}
                  placeholder="Explain what you need assistance with..."
                  className={`w-full bg-slate-950 border rounded-lg p-2.5 text-white ${
                    fieldErrors.message ? 'border-red-500' : 'border-slate-700'
                  }`}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'ticket-msg-error' : undefined}
                />
                <InlineFieldError id="ticket-msg-error" error={fieldErrors.message} />
              </div>

              <Button
                size="md"
                variant="primary"
                type="submit"
                leftIcon={<Send className="w-4 h-4" />}
                className="font-bold"
              >
                Send Demo Support Ticket
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};
