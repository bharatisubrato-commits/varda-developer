import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Users,
  X,
} from 'lucide-react';
import { clearAdminToken, getAdminToken, verifyAdminSession } from '../../services/api';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    let active = true;
    verifyAdminSession()
      .then((res) => {
        if (active) {
          setAdminEmail(res.user.email);
          setChecking(false);
        }
      })
      .catch(() => {
        clearAdminToken();
        if (active) navigate('/admin/login', { replace: true });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleLogout() {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-sm font-medium text-[#64748B]">Verifying administrator session...</div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Properties', to: '/admin/properties', icon: Building2, end: false },
    { label: 'Advisors', to: '/admin/agents', icon: Users, end: false },
    { label: 'Property Inquiries', to: '/admin/inquiries', icon: Inbox, end: false },
    { label: 'Contact Messages', to: '/admin/contacts', icon: Mail, end: false },
  ];

  const activeNav = navItems.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#112239] text-white border-r border-[#112239]">
        <div className="h-16 px-6 flex items-center border-b border-white/10">
          <Link to="/admin" className="text-base font-bold tracking-tight whitespace-nowrap">
            Vadra Admin Console
          </Link>
        </div>

        <nav aria-label="Admin Navigation" className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C59B65] text-[#112239] font-semibold'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Signed in as</div>
            <div className="text-xs font-medium text-white truncate mt-0.5">{adminEmail}</div>
          </div>
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/8 text-xs font-medium text-slate-200 hover:bg-white/15 transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="h-16 bg-white border-b border-[#112239]/10 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle admin menu"
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#112239] hover:bg-[#112239]/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm text-[#64748B]">
              <span>Vadra Admin</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-[#112239]">
                {activeNav?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#112239]/12 text-xs font-semibold text-[#112239] hover:bg-[#FAF8F5] transition-colors whitespace-nowrap"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Admin Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#112239] text-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-[#C59B65] text-[#112239] font-semibold' : 'text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
