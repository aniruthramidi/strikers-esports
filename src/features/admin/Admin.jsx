import React, { useState, useContext } from 'react';
import { AdminContext } from './AdminContext';
import { Eye, EyeOff, Plus, Trash2, FolderPlus, ListFilter, ClipboardList, ShieldAlert, Lock, Compass, LogOut, LayoutGrid, Save, Users, Flame, Shield, UserPlus, Info, Settings } from 'lucide-react';

export default function Admin() {
  const { categories, orders, navLinksState, homepageSettings, rostersState, staffState, adminUsers, updateAdminUsers, isHydrated, toggleCategoryVisibility, toggleNavLinkVisibility, addCustomCategory, deleteCategory, updateHomepageSettings, updatePlayer, updateStaffMember, addStaffMember, deleteStaffMember } = useContext(AdminContext);
  
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

  // Sync hydrated settings and users into local form states
  useEffect(() => {
    if (homepageSettings) {
      if (homepageSettings.heroTitle) setHeroTitle(homepageSettings.heroTitle);
      if (homepageSettings.heroTitleHighlight) setHeroTitleHighlight(homepageSettings.heroTitleHighlight);
      if (homepageSettings.heroDesc) setHeroDesc(homepageSettings.heroDesc);
      if (homepageSettings.stats) setStats(homepageSettings.stats);
      if (homepageSettings.aboutTitle) setAboutTitle(homepageSettings.aboutTitle);
      if (homepageSettings.aboutDesc) setAboutDesc(homepageSettings.aboutDesc);
      if (homepageSettings.contactEmail) setContactEmail(homepageSettings.contactEmail);
      if (homepageSettings.businessEmail) setBusinessEmail(homepageSettings.businessEmail);
      if (homepageSettings.supportInfo) setSupportInfo(homepageSettings.supportInfo);
    }
  }, [homepageSettings]);

  useEffect(() => {
    if (adminUsers && adminUsers.length > 0) {
      setUsersList(adminUsers);
    }
  }, [adminUsers]);

  // Roster Editor State
  const [rosterTab, setRosterTab] = useState('bgmi');
  const [rosterSuccessMsg, setRosterSuccessMsg] = useState('');

  // Staff Editor State
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // Image Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [cropScale, setCropScale] = useState(1);
  const [cropRotation, setCropRotation] = useState(0); // degrees: 0, 90, 180, 270
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [onCropConfirm, setOnCropConfirm] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCropOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropSave = () => {
    const img = new Image();
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');

      // Clear with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 300, 300);

      // Translate to center to apply rotation/scaling
      ctx.translate(150, 150);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(cropScale, cropScale);

      // Apply drag offset
      ctx.translate(cropOffset.x / cropScale, cropOffset.y / cropScale);

      // Scale to cover 300x300 viewport
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.max(300 / imgWidth, 300 / imgHeight);
      const drawWidth = imgWidth * ratio;
      const drawHeight = imgHeight * ratio;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      // Compress to lightweight JPEG base64 string
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      if (onCropConfirm) {
        onCropConfirm(dataUrl);
      }
      setCropModalOpen(false);
      setCropImageSrc('');
      setCropScale(1);
      setCropRotation(0);
      setCropOffset({ x: 0, y: 0 });
    };
  };

  // Settings State
  const [contactEmail, setContactEmail] = useState(homepageSettings?.contactEmail || 'contact@strikersesports.in');
  const [businessEmail, setBusinessEmail] = useState(homepageSettings?.businessEmail || 'info@strikersesports.in');
  const [supportInfo, setSupportInfo] = useState(homepageSettings?.supportInfo || 'Support available 24/7.');
  const [usersList, setUsersList] = useState(adminUsers || []);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateHomepageSettings({
      ...homepageSettings,
      contactEmail,
      businessEmail,
      supportInfo
    });
    updateAdminUsers(usersList);
    setSettingsSuccessMsg('Credentials and Contact details updated successfully!');
    setTimeout(() => setSettingsSuccessMsg(''), 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const matchedUser = (adminUsers || []).find(
      (u) => u.username.trim() === username.trim() && u.password === password
    );
    if (matchedUser) {
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
              disabled={!isHydrated}
              className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {!isHydrated ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Development Hint Box */}
          <div className="border border-neutral-800 bg-black/40 p-4 rounded-2xl text-[10px] text-strikers-muted space-y-1 leading-relaxed">
            <p className="font-bold text-white uppercase tracking-wider text-[8px]">Authentication Credentials Note:</p>
            {(adminUsers || []).map((u, i) => (
              <p key={i}>User {i + 1}: <strong className="text-white">{u.username}</strong> / <strong className="text-white">{u.password}</strong></p>
            ))}
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
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted block">Player Picture (JPEG/PNG)</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-[10px] font-black uppercase tracking-wider text-white border border-neutral-700 rounded-xl cursor-pointer transition-colors">
                        <span>Choose File & Crop</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setCropImageSrc(event.target.result);
                                setOnCropConfirm(() => (croppedBase64) => {
                                  handlePlayerChange(idx, 'photo', croppedBase64);
                                });
                                setCropModalOpen(true);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {player.photo && (
                        <button
                          type="button"
                          onClick={() => handlePlayerChange(idx, 'photo', '')}
                          className="px-3 py-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-950 hover:border-red-500 rounded-xl text-[10px] font-bold uppercase transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
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
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-strikers-muted block">Staff Photo (JPEG/PNG)</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-[10px] font-black uppercase tracking-wider text-white border border-neutral-700 rounded-xl cursor-pointer transition-colors">
                        <span>Choose File & Crop</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setCropImageSrc(event.target.result);
                                setOnCropConfirm(() => (croppedBase64) => {
                                  handleStaffChange(idx, 'photo', croppedBase64);
                                });
                                setCropModalOpen(true);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {staff.photo && (
                        <button
                          type="button"
                          onClick={() => handleStaffChange(idx, 'photo', '')}
                          className="px-3 py-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-950 hover:border-red-500 rounded-xl text-[10px] font-bold uppercase transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
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
              <div className="flex justify-between items-center border-b border-neutral-800 pb-1">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-white">
                  Security & Portal Login Credentials
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    if (usersList.length < 5) {
                      setUsersList([...usersList, { username: '', password: '' }]);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[9px] uppercase font-bold text-white transition-colors"
                >
                  + Add Admin User
                </button>
              </div>
              
              <div className="space-y-4">
                {usersList.map((user, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-black/20 p-4 rounded-2xl border border-neutral-900">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[9px] uppercase font-bold text-strikers-muted">User {idx + 1} Username</label>
                      <input
                        type="text"
                        required
                        value={user.username}
                        onChange={(e) => {
                          const updated = [...usersList];
                          updated[idx].username = e.target.value;
                          setUsersList(updated);
                        }}
                        className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                        placeholder="Username"
                      />
                    </div>
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[9px] uppercase font-bold text-strikers-muted">User {idx + 1} Password</label>
                      <input
                        type="text"
                        required
                        value={user.password}
                        onChange={(e) => {
                          const updated = [...usersList];
                          updated[idx].password = e.target.value;
                          setUsersList(updated);
                        }}
                        className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                        placeholder="Password"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        disabled={usersList.length <= 1}
                        onClick={() => {
                          if (usersList.length > 1) {
                            setUsersList(usersList.filter((_, i) => i !== idx));
                          }
                        }}
                        className="w-full py-3 bg-red-950/20 hover:bg-red-900/40 text-red-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-red-400 font-bold uppercase text-[9px] tracking-wider border border-red-950 hover:border-red-500 rounded-xl transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
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

      {/* Crop/Modify Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-strikers-gray border border-strikers-border rounded-3xl p-6 w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase text-white">Crop & Modify Picture</h3>
              <p className="text-xs text-strikers-muted">Drag to position, use controls to zoom or rotate.</p>
            </div>

            <div className="flex justify-center py-2">
              <div 
                className="w-[260px] h-[260px] border border-dashed border-white/20 relative overflow-hidden bg-black rounded-2xl cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={cropImageSrc}
                  alt="Crop Preview"
                  style={{
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) rotate(${cropRotation}deg) scale(${cropScale})`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                  }}
                />
                {/* Crop frame overlay mask */}
                <div className="absolute inset-0 border-[30px] border-black/70 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full border border-white/40 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold text-strikers-muted">
                  <span>Zoom / Scale ({Math.round(cropScale * 100)}%)</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCropRotation((r) => (r + 90) % 360)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl border border-neutral-700 transition-colors"
                >
                  Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropScale(1);
                    setCropRotation(0);
                    setCropOffset({ x: 0, y: 0 });
                  }}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 font-bold uppercase tracking-wider text-[10px] rounded-xl border border-neutral-800 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Save/Cancel Actions */}
            <div className="flex gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setCropImageSrc('');
                }}
                className="flex-1 py-3 border border-neutral-800 text-neutral-400 hover:text-white font-black uppercase tracking-wider text-xs rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                className="flex-1 py-3 bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-wider text-xs rounded-full transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
