import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { adminLogin } from '../../services/api';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials() {
    setEmail('admin@vadradeveloper.com');
    setPassword('VadraAdmin@2026');
    setError(null);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#112239] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Public Website</span>
        </Link>

        <div className="bg-white rounded-2xl border border-[#112239]/10 p-7 sm:p-9 space-y-6">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-xl bg-[#112239] text-[#C59B65] flex items-center justify-center">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-[#112239] tracking-tight">
              Vadra Developer Admin
            </h1>
            <p className="text-sm text-[#64748B]">
              Sign in to manage developments, publish listings, update advisors, and review
              inquiries.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="adm-email" className="block text-xs font-semibold text-[#112239] mb-1.5">
                Administrator Email
              </label>
              <input
                id="adm-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vadradeveloper.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
              />
            </div>

            <div>
              <label htmlFor="adm-pass" className="block text-xs font-semibold text-[#112239] mb-1.5">
                Password
              </label>
              <input
                id="adm-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? 'Verifying Session...' : 'Sign In to Admin Console'}
            </button>
          </form>

          {/* Portfolio Reviewer Access Helper */}
          <div className="pt-5 border-t border-[#112239]/8 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A6B43]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Portfolio Reviewer Access</span>
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs font-semibold text-[#112239] underline hover:text-[#8A6B43] cursor-pointer"
              >
                Autofill Credentials
              </button>
            </div>
            <div className="text-xs text-[#64748B] font-mono-tabular bg-[#FAF8F5] rounded-lg p-3 border border-[#112239]/6 space-y-0.5">
              <div>Email: admin@vadradeveloper.com</div>
              <div>Pass: VadraAdmin@2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
