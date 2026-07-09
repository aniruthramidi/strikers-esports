import React, { useState, useContext } from 'react';
import { AdminContext } from './AdminContext';
import { Eye, EyeOff, Plus, Trash2, FolderPlus, ListFilter, ClipboardList, ShieldAlert, Lock, Compass, LogOut, LayoutGrid, Save, Users, Flame, Shield, UserPlus, Info, Settings } from 'lucide-react';

export default function Admin() {
  const { categories, orders, navLinksState, homepageSettings, rostersState, staffState, adminUsername, adminPassword, updateAdminCredentials, toggleCategoryVisibility, toggleNavLinkVisibility, addCustomCategory, deleteCategory, updateHomepageSettings, updatePlayer, updateStaffMember, addStaffMember, deleteStaffMember } = useContext(AdminContext);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('strikers_admin_logged') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Panel Tab
  const [activeTab, setActiveTab] = useState('visibility'); // 'visibility', 'navigation', 'homepage', 'roster', 'staff', 'builder', 'orders'

  // Builder Form State
  const [targetPage, setTargetPage] = useState('merch');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [builderMessage, setBuilderMessage] = useState({ text: '', type: '' });

  // Homepage Form State
  const [heroTitle, setHeroTitle] = useState(homepageSettings?.heroTitle || 'STRIKERS');
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(homepageSettings?.heroTitleHighlight || 'ESPORTS');
  const [heroDesc, setHeroDesc] = useState(homepageSettings?.heroDesc || 'Delivering professional gaming excellence through premium tournaments, top-tier esports services, content production, and official team rosters. Join the competitive revolution.');
  const [stats, setStats] = useState(homepageSettings?.stats || [
    { value: '15+', label: 'Tournament Cups' },
    { value: '₹25L+', label: 'Total Prize Pools' },
    { value: '100K+', label: 'Community Members' },
    { value: '5+', label: 'Professional Rosters' },
  ]);
  const [aboutTitle, setAboutTitle] = useState(homepageSettings?.aboutTitle || 'About Strikers');
  const [aboutDesc, setAboutDesc] = useState(homepageSettings?.aboutDesc || 'Building a legacy in competitive gaming, Strikers Esports is driven by a commitment to excellence, player development, and community.');
  const [homepageMessage, setHomepageMessage] = useState('');

  // Roster Editor State
  const [rosterTab, setRosterTab] = useState('bgmi');
  const [rosterSuccessMsg, setRosterSuccessMsg] = useState('');

  // Staff Editor State
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // Settings State
  const [contactEmail, setContactEmail] = useState(homepageSettings?.contactEmail || 'contact@strikersesports.in');
  const [businessEmail, setBusinessEmail] = useState(homepageSettings?.businessEmail || 'info@strikersesports.in');
  const [supportInfo, setSupportInfo] = useState(homepageSettings?.supportInfo || 'Support available 24/7.');
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPassword, setNewPassword] = useState(adminPassword);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateHomepageSettings({
      ...homepageSettings,
      contactEmail,
      businessEmail,
      supportInfo
    });
    updateAdminCredentials(newUsername, newPassword);
    setSettingsSuccessMsg('Credentials and Contact details updated successfully!');
    setTimeout(() => setSettingsSuccessMsg(''), 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem('strikers_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Check the credentials note below.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('strikers_admin_logged');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      setBuilderMessage({ text: 'Category name is required.', type: 'error' });
      return;
    }

    const success = addCustomCategory(targetPage, catName, catDesc);
    if (success) {
      setBuilderMessage({ text: `Successfully created "${catName}" under ${targetPage.toUpperCase()}!`, type: 'success' });
      setCatName('');
      setCatDesc('');
      setTimeout(() => setBuilderMessage({ text: '', type: '' }), 4000);
    } else {
      setBuilderMessage({ text: 'A category with that name already exists in this section.', type: 'error' });
    }
  };

  const handleHomepageSave = (e) => {
    e.preventDefault();
    updateHomepageSettings({
      heroTitle,
      heroTitleHighlight,
      heroDesc,
      stats,
      aboutTitle,
      aboutDesc
    });
    setHomepageMessage('Homepage settings saved successfully!');
    setTimeout(() => setHomepageMessage(''), 4000);
  };

  const handlePlayerChange = (index, field, value) => {
    const player = { ...rostersState[rosterTab][index] };
    player[field] = value;
    updatePlayer(rosterTab, index, player);
    setRosterSuccessMsg(`Updated player ${player.ign || 'successfully'}!`);
    setTimeout(() => setRosterSuccessMsg(''), 3000);
  };

  const handleStaffChange = (index, field, value) => {
    const member = { ...staffState[index] };
    member[field] = value;
    updateStaffMember(index, member);
    setStaffSuccessMsg(`Updated ${member.name || 'staff member'} successfully!`);
    setTimeout(() => setStaffSuccessMsg(''), 3000);
  };

  const handleAddStaff = () => {
    addStaffMember('New Staff Name', 'Operational Title', 'Write bio here.', '');
    setStaffSuccessMsg('Added a new blank staff member profile card below!');
    setTimeout(() => setStaffSuccessMsg(''), 4000);
  };

  const handleDeleteStaff = (index, name) => {
    deleteStaffMember(index);
    setStaffSuccessMsg(`Removed ${name || 'staff member'} profile.`);
    setTimeout(() => setStaffSuccessMsg(''), 4000);
  };

  // Render Login Card if not logged in
  if (!isLoggedIn) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[75vh]">
        <div className="border border-strikers-border bg-strikers-gray p-8 rounded-3xl w-full max-w-md space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-strikers-muted">Please sign in to access security and portal filters.</p>
          </div>

          {loginError && (
            <div className="p-3 border border-red-500/50 bg-red-950/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                placeholder="Enter admin username"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Development Hint Box */}
          <div className="border border-neutral-800 bg-black/40 p-4 rounded-2xl text-[10px] text-strikers-muted space-y-1 leading-relaxed">
            <p className="font-bold text-white uppercase tracking-wider text-[8px]">Authentication Credentials Note:</p>
            <p>Username: <strong className="text-white">{adminUsername}</strong></p>
            <p>Password: <strong className="text-white">{adminPassword}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-4 relative">
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 px-4 py-2 border border-neutral-800 hover:border-red-500 hover:text-red-500 rounded-full text-[10px] uppercase font-bold tracking-widest text-strikers-muted flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-3">
          <ShieldAlert className="w-10 h-10 text-white" /> Admin Control
        </h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          Manage application categories, customize header navigation link toggles, and construct custom sections.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center border-b border-strikers-border max-w-5xl mx-auto gap-2">
        <button
          onClick={() => setActiveTab('visibility')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'visibility'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <ListFilter className="w-4 h-4" /> Category Filters
        </button>
        <button
          onClick={() => setActiveTab('navigation')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'navigation'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" /> Navigation Links
        </button>
        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'homepage'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Homepage Editor
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'about'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" /> About Page Editor
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'roster'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Roster Editor
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'staff'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Staff Editor
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'builder'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" /> Custom Builder
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Shop Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-white text-white'
              : 'border-transparent text-strikers-muted hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" /> Credentials & Contacts
        </button>
      </div>

      {/* Tab Content: Category Visibility Manager */}
      {activeTab === 'visibility' && (
        <div className="space-y-12">
          {Object.entries(categories).map(([page, catList]) => (
            <div key={page} className="border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center border-b border-strikers-border pb-4">
                <h3 className="text-base font-black uppercase text-white tracking-wider">
                  {page === 'merch' ? 'Merchandise Store' : page === 'services' ? 'Studios / Services' : 'Tournament Cups'} Categories
                </h3>
                <span className="text-[10px] text-strikers-muted font-bold uppercase tracking-widest bg-black px-2.5 py-1 rounded-full">
                  {catList.length} total
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {catList.map((cat) => (
                  <div
                    key={cat.name}
                    className="border border-neutral-800 bg-black/40 p-5 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{cat.name}</h4>
                        {cat.custom && (
                          <span className="text-[8px] bg-white text-black font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-strikers-muted max-w-md">{cat.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleCategoryVisibility(page, cat.name)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-colors ${
                          cat.visible
                            ? 'bg-white text-black hover:bg-neutral-200'
                            : 'bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white'
                        }`}
                      >
                        {cat.visible ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hidden
                          </>
                        )}
                      </button>

                      {cat.custom && (
                        <button
                          onClick={() => deleteCategory(page, cat.name)}
                          className="p-2 border border-red-900/30 hover:border-red-500 text-red-500 rounded-xl transition-all"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Navigation Links Visibility Manager */}
      {activeTab === 'navigation' && (
        <div className="border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-1 pb-4 border-b border-strikers-border">
            <h3 className="text-base font-black uppercase text-white tracking-wider">Navigation Bar Settings</h3>
            <p className="text-xs text-strikers-muted">
              Toggle visibility to dynamically show or hide pages from the main header and mobile nav menu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(navLinksState || []).map((link) => (
              <div
                key={link.name}
                className="border border-neutral-800 bg-black/40 p-5 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-grow">
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{link.name}</h4>
                  <p className="text-xs text-strikers-muted max-w-sm">{link.desc}</p>
                </div>

                <button
                  onClick={() => toggleNavLinkVisibility(link.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-colors shrink-0 ${
                    link.visible
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white'
                  }`}
                >
                  {link.visible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Active Link
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hidden Link
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Homepage Editor Form */}
      {activeTab === 'homepage' && (
        <div className="max-w-3xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-2 border-b border-strikers-border pb-4">
            <h3 className="text-lg font-black uppercase text-white">Homepage Content Settings</h3>
            <p className="text-xs text-strikers-muted">
              Update Hero banner texts, titles, descriptions, and dynamic statistics values.
            </p>
          </div>

          {homepageMessage && (
            <div className="p-4 rounded-xl text-xs font-bold uppercase tracking-wider border bg-emerald-950/20 border-emerald-500/50 text-emerald-400">
              {homepageMessage}
            </div>
          )}

          <form onSubmit={handleHomepageSave} className="space-y-6 text-xs">
            {/* Hero Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-strikers-muted">Hero Title Prefix</label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-strikers-muted">Hero Title Highlight (Gradient)</label>
                <input
                  type="text"
                  required
                  value={heroTitleHighlight}
                  onChange={(e) => setHeroTitleHighlight(e.target.value)}
                  className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Hero Description Paragraph</label>
              <textarea
                required
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                rows="4"
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            {/* Stats Editor */}
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-strikers-muted block">Stats Counter Configurations</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="border border-neutral-800 bg-black/40 p-4 rounded-2xl space-y-2">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-strikers-muted">Stat Counter #{i + 1}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Value (e.g. 15+)"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[i].value = e.target.value;
                          setStats(newStats);
                        }}
                        className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Label (e.g. Cups)"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[i].label = e.target.value;
                          setStats(newStats);
                        }}
                        className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Homepage Settings
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: About Page Editor */}
      {activeTab === 'about' && (
        <div className="max-w-3xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-2 border-b border-strikers-border pb-4">
            <h3 className="text-lg font-black uppercase text-white">About Page Editor</h3>
            <p className="text-xs text-strikers-muted">
              Update Strikers Esports mission statement, titles, and introductory descriptions.
            </p>
          </div>

          {homepageMessage && (
            <div className="p-4 rounded-xl text-xs font-bold uppercase tracking-wider border bg-emerald-950/20 border-emerald-500/50 text-emerald-400">
              {homepageMessage}
            </div>
          )}

          <form onSubmit={handleHomepageSave} className="space-y-6 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">About Title</label>
              <input
                type="text"
                required
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                placeholder="e.g. About Strikers"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">About Description</label>
              <textarea
                required
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                rows="4"
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white resize-none"
                placeholder="Enter About description..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save About Settings
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Roster Players & Photos Editor */}
      {activeTab === 'roster' && (
        <div className="max-w-4xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-strikers-border pb-4">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Roster Players & Photos Editor</h3>
              <p className="text-xs text-strikers-muted">Edit names, IGN, role, and custom player picture links.</p>
            </div>
            
            {/* Toggle BGMI / Valorant */}
            <div className="flex bg-black border border-neutral-800 p-1 rounded-xl w-fit">
              <button
                onClick={() => setRosterTab('bgmi')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors ${
                  rosterTab === 'bgmi'
                    ? 'bg-white text-black'
                    : 'text-strikers-muted hover:text-white'
                }`}
              >
                BGMI Lineup
              </button>
              <button
                onClick={() => setRosterTab('valorant')}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors ${
                  rosterTab === 'valorant'
                    ? 'bg-white text-black'
                    : 'text-strikers-muted hover:text-white'
                }`}
              >
                Valorant Lineup
              </button>
            </div>
          </div>

          {rosterSuccessMsg && (
            <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/20 text-emerald-400 text-xs font-bold uppercase tracking-wider text-center">
              {rosterSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(rostersState?.[rosterTab] || []).map((player, idx) => (
              <div
                key={idx}
                className="border border-neutral-800 bg-black/40 p-6 rounded-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 border-b border-neutral-900 pb-3">
                  {/* Photo Preview */}
                  <div className="w-12 h-12 rounded-xl bg-strikers-gray border border-strikers-border overflow-hidden shrink-0 flex items-center justify-center">
                    {player.photo ? (
                      <img src={player.photo} alt={player.ign} className="w-full h-full object-cover" />
                    ) : (
                      <Flame className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{player.ign || 'NEW PLAYER'}</h4>
                    <p className="text-[10px] text-strikers-muted font-bold uppercase tracking-widest">Player Card #{idx + 1}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">IGN (In-Game Name)</label>
                    <input
                      type="text"
                      required
                      value={player.ign}
                      onChange={(e) => handlePlayerChange(idx, 'ign', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Real Name</label>
                    <input
                      type="text"
                      required
                      value={player.name}
                      onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Role / Title</label>
                    <input
                      type="text"
                      required
                      value={player.role}
                      onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Photo Image Link (URL)</label>
                    <input
                      type="text"
                      placeholder="e.g. https://domain.com/photo.jpg or /public/photo.png"
                      value={player.photo}
                      onChange={(e) => handlePlayerChange(idx, 'photo', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Management Staff Editor */}
      {activeTab === 'staff' && (
        <div className="max-w-4xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-strikers-border pb-4">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Management & Staff Editor</h3>
              <p className="text-xs text-strikers-muted">Add, remove, and edit executive profiles, operational descriptions, and avatar images.</p>
            </div>
            
            <button
              onClick={handleAddStaff}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wider text-[10px] rounded-full transition-all shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Staff Role
            </button>
          </div>

          {staffSuccessMsg && (
            <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/20 text-emerald-400 text-xs font-bold uppercase tracking-wider text-center">
              {staffSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(staffState || []).map((staff, idx) => (
              <div
                key={idx}
                className="border border-neutral-800 bg-black/40 p-6 rounded-2xl space-y-4 flex flex-col justify-between relative group"
              >
                <button
                  onClick={() => handleDeleteStaff(idx, staff.name)}
                  className="absolute top-4 right-4 p-2 border border-red-900/30 hover:border-red-500 text-red-500 rounded-xl transition-all opacity-40 group-hover:opacity-100"
                  title="Remove staff role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4 border-b border-neutral-900 pb-3">
                  {/* Photo Preview */}
                  <div className="w-12 h-12 rounded-xl bg-strikers-gray border border-strikers-border overflow-hidden shrink-0 flex items-center justify-center">
                    {staff.photo ? (
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{staff.name || 'NEW STAFF'}</h4>
                    <p className="text-[10px] text-strikers-muted font-bold uppercase tracking-widest">Executive #{idx + 1}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Full Name</label>
                    <input
                      type="text"
                      required
                      value={staff.name}
                      onChange={(e) => handleStaffChange(idx, 'name', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Role / Title</label>
                    <input
                      type="text"
                      required
                      value={staff.role}
                      onChange={(e) => handleStaffChange(idx, 'role', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Photo URL Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /public/staff-ceo.png"
                      value={staff.photo || ''}
                      onChange={(e) => handleStaffChange(idx, 'photo', e.target.value)}
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted">Operational Bio</label>
                    <textarea
                      value={staff.bio}
                      onChange={(e) => handleStaffChange(idx, 'bio', e.target.value)}
                      rows="3"
                      className="w-full bg-black border border-strikers-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Category Builder Form */}
      {activeTab === 'builder' && (
        <div className="max-w-xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase text-white">Create Custom Category</h3>
            <p className="text-xs text-strikers-muted">
              Add a brand new filter category dynamically to any section of the website.
            </p>
          </div>

          {builderMessage.text && (
            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider border ${
              builderMessage.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400'
                : 'bg-rose-950/20 border-rose-500/50 text-rose-400'
            }`}>
              {builderMessage.text}
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Target Page / Section *</label>
              <select
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="merch">Merchandise Shop (Badges)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Winter Collection, Editing Packages"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-strikers-muted">Description</label>
              <textarea
                placeholder="Brief description of items or services catalogued under this category."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                rows="3"
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Category
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Orders Logs */}
      {activeTab === 'orders' && (
        <div className="border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-1 pb-4 border-b border-strikers-border">
            <h3 className="text-lg font-black uppercase text-white">Merchandise Shop Orders</h3>
            <p className="text-xs text-strikers-muted">Review checkout form logs submitted by users.</p>
          </div>

          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="border border-neutral-800 bg-black/40 p-6 rounded-2xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-neutral-900 pb-3">
                    <div>
                      <span className="text-xs font-black text-white uppercase tracking-wider">{ord.id}</span>
                      <span className="text-[10px] text-strikers-muted ml-3 font-semibold">{ord.date}</span>
                    </div>
                    <span className="text-xs font-black text-white">Total: ₹{ord.total}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
                    <div className="space-y-1">
                      <p className="font-bold text-white uppercase text-[10px] tracking-wider text-strikers-muted">Delivery Details</p>
                      <p><span className="text-neutral-500">Name:</span> {ord.shipping.name}</p>
                      <p><span className="text-neutral-500">Phone:</span> {ord.shipping.phone}</p>
                      <p><span className="text-neutral-500">Email:</span> {ord.shipping.email}</p>
                      <p><span className="text-neutral-500">Address:</span> {ord.shipping.address}, {ord.shipping.city} - {ord.shipping.pincode}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-white uppercase text-[10px] tracking-wider text-strikers-muted">Items Ordered</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {ord.items.map((item) => (
                          <div key={item.cartId} className="flex justify-between border-b border-neutral-900 pb-1 text-[11px]">
                            <span>{item.name} ({item.selectedSize}) x{item.quantity}</span>
                            <span className="font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-strikers-muted text-center py-8">No order submissions logged yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Settings (Credentials & Contacts) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6">
          <div className="space-y-2 border-b border-strikers-border pb-4">
            <h3 className="text-lg font-black uppercase text-white">Credentials & Contacts Editor</h3>
            <p className="text-xs text-strikers-muted font-semibold">
              Manage organization contact information and update administrator credentials.
            </p>
          </div>

          {settingsSuccessMsg && (
            <div className="p-4 rounded-xl text-xs font-bold uppercase tracking-wider border bg-emerald-950/20 border-emerald-500/50 text-emerald-400">
              {settingsSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSettingsSave} className="space-y-6 text-xs">
            {/* Contact Details */}
            <div className="space-y-4">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-white border-b border-neutral-800 pb-1">
                Contact Settings
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="contact@strikersesports.in"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Business Email</label>
                  <input
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="info@strikersesports.in"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-strikers-muted">Support Details / Availability</label>
                <input
                  type="text"
                  required
                  value={supportInfo}
                  onChange={(e) => setSupportInfo(e.target.value)}
                  className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                  placeholder="Support available 24/7."
                />
              </div>
            </div>

            {/* Admin Credentials */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-white border-b border-neutral-800 pb-1">
                Security & Portal Login Credentials
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="admin"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Admin Password</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                    placeholder="strikersadmin123"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
