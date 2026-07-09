import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

const DEFAULT_CATEGORIES = {
  merch: [
    { name: 'Official Gear', visible: true, custom: false, desc: 'Official team jerseys and kits.' },
    { name: 'Popular', visible: true, custom: false, desc: 'Hot-selling fan apparel and hoodies.' },
    { name: 'Accessory', visible: true, custom: false, desc: 'Snapbacks, stickers, and small items.' },
    { name: 'Hardware', visible: true, custom: false, desc: 'Pro-grade mousepads and peripherals.' },
  ]
};

const DEFAULT_NAV_LINKS = [
  { name: 'About', path: '/about', visible: true, desc: 'Showcase Strikers Esports mission, founder, and management staff.' },
  { name: 'Teams', path: '/team', visible: true, desc: 'Showcase grid profiles for player rosters and corporate management.' },
  { name: 'Shop', path: '/merch', visible: true, desc: 'Interactive fan gear clothing store, checkout, and cart workflows.' }
];

const DEFAULT_HOMEPAGE_SETTINGS = {
  heroTitle: 'STRIKERS',
  heroTitleHighlight: 'ESPORTS',
  heroDesc: 'Delivering professional gaming excellence through premium tournaments, top-tier esports services, content production, and official team rosters. Join the competitive revolution.',
  stats: [
    { value: '15+', label: 'Tournament Cups' },
    { value: '₹25L+', label: 'Total Prize Pools' },
    { value: '100K+', label: 'Community Members' },
    { value: '5+', label: 'Professional Rosters' },
  ],
  aboutTitle: 'About Strikers',
  aboutDesc: 'Started in 2019, Strikers Esports began as a passionate community server, serving as a hub for casual gamers to connect and play. Over time, this vibrant foundation naturally shifted focus toward competitive gaming, evolving into a structured esports organization. Driven by dedicated management and strategic execution, the organization scaled up its technical infrastructure, team logistics, and brand presence. Today, Strikers Esports stands as a professional entity that bridges community engagement with competitive excellence, particularly in mobile esports.',
  contactEmail: 'contact@strikersesports.in',
  businessEmail: 'info@strikersesports.in',
  supportInfo: 'Support available 24/7.'
};

const DEFAULT_ROSTERS = {
  bgmi: [
    { name: 'SPY', ign: 'STK・SPYOP', role: 'IGL / In-Game Leader', photo: '' },
    { name: 'SURYA', ign: 'STK・SURYA', role: 'Main Assaulter', photo: '' },
    { name: 'JSTAR', ign: 'STK・JSTAR', role: 'Support / Filter', photo: '' },
    { name: 'JUSKY', ign: 'STK・JUSKY', role: 'Entry Fragger', photo: '' }
  ],
  valorant: [
    { name: 'LEVI', ign: 'STK・LEVIOP', role: 'Duelist', photo: '' },
    { name: 'SPYDER', ign: 'STK・SPYDER', role: 'Controller / IGL', photo: '' },
    { name: 'INSANE', ign: 'STK・INSANE', role: 'Sentinel', photo: '' },
    { name: 'GODZ', ign: 'STK・GODZ', role: 'Initiator', photo: '' }
  ]
};

const DEFAULT_STAFF = [];

export function AdminProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('strikers_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('strikers_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [navLinksState, setNavLinksState] = useState(() => {
    const saved = localStorage.getItem('strikers_nav_links');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasAbout = parsed.some(link => link.path === '/about');
      if (!hasAbout) {
        parsed.unshift({ name: 'About', path: '/about', visible: true, desc: 'Showcase Strikers Esports mission, founder, and management staff.' });
      }
      return parsed;
    }
    return DEFAULT_NAV_LINKS;
  });

  const [homepageSettings, setHomepageSettings] = useState(() => {
    const saved = localStorage.getItem('strikers_homepage_settings');
    if (saved) {
      return { ...DEFAULT_HOMEPAGE_SETTINGS, ...JSON.parse(saved) };
    }
    return DEFAULT_HOMEPAGE_SETTINGS;
  });

  const [rostersState, setRostersState] = useState(() => {
    const saved = localStorage.getItem('strikers_rosters');
    return saved ? JSON.parse(saved) : DEFAULT_ROSTERS;
  });

  const [staffState, setStaffState] = useState(() => {
    const saved = localStorage.getItem('strikers_staff');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldStaff = parsed.some(s => s.name === 'Rohit Raghavendra' || s.name === 'Radhika Javvaji');
      if (hasOldStaff) {
        return [];
      }
      return parsed;
    }
    return DEFAULT_STAFF;
  });

  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem('strikers_admin_username') || 'admin';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('strikers_admin_password') || 'strikersadmin123';
  });

  useEffect(() => {
    localStorage.setItem('strikers_admin_username', adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    localStorage.setItem('strikers_admin_password', adminPassword);
  }, [adminPassword]);

  const updateAdminCredentials = (username, password) => {
    setAdminUsername(username);
    setAdminPassword(password);
  };

  useEffect(() => {
    localStorage.setItem('strikers_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('strikers_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('strikers_nav_links', JSON.stringify(navLinksState));
  }, [navLinksState]);

  useEffect(() => {
    localStorage.setItem('strikers_homepage_settings', JSON.stringify(homepageSettings));
  }, [homepageSettings]);

  useEffect(() => {
    localStorage.setItem('strikers_rosters', JSON.stringify(rostersState));
  }, [rostersState]);

  useEffect(() => {
    localStorage.setItem('strikers_staff', JSON.stringify(staffState));
  }, [staffState]);

  const toggleCategoryVisibility = (page, categoryName) => {
    setCategories((prev) => ({
      ...prev,
      [page]: prev[page].map((cat) =>
        cat.name === categoryName ? { ...cat, visible: !cat.visible } : cat
      ),
    }));
  };

  const toggleNavLinkVisibility = (name) => {
    setNavLinksState((prev) =>
      prev.map((link) => (link.name === name ? { ...link, visible: !link.visible } : link))
    );
  };

  const addCustomCategory = (page, name, desc) => {
    if (!name.trim()) return false;
    const exists = categories[page].some((cat) => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) return false;

    setCategories((prev) => ({
      ...prev,
      [page]: [
        ...prev[page],
        { name: name.trim(), visible: true, custom: true, desc: desc || 'Custom added category.' }
      ]
    }));
    return true;
  };

  const deleteCategory = (page, categoryName) => {
    setCategories((prev) => ({
      ...prev,
      [page]: prev[page].filter((cat) => cat.name !== categoryName)
    }));
  };

  const recordNewOrder = (order) => {
    setOrders((prev) => [
      { ...order, id: `ORD-${Date.now()}`, date: new Date().toLocaleDateString() },
      ...prev
    ]);
  };

  const updateHomepageSettings = (newSettings) => {
    setHomepageSettings(newSettings);
  };

  const updatePlayer = (division, index, updatedPlayer) => {
    setRostersState((prev) => {
      const updatedList = [...prev[division]];
      updatedList[index] = updatedPlayer;
      return {
        ...prev,
        [division]: updatedList
      };
    });
  };

  const updateStaffMember = (index, updatedStaff) => {
    setStaffState((prev) => {
      const updatedList = [...prev];
      updatedList[index] = updatedStaff;
      return updatedList;
    });
  };

  const addStaffMember = (name, role, bio, photo) => {
    setStaffState((prev) => [
      ...prev,
      {
        name: name || 'New Staff Name',
        role: role || 'New Staff Role',
        bio: bio || 'No biography written yet.',
        photo: photo || ''
      }
    ]);
  };

  const deleteStaffMember = (index) => {
    setStaffState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AdminContext.Provider
      value={{
        categories,
        orders,
        navLinksState,
        homepageSettings,
        rostersState,
        staffState,
        adminUsername,
        adminPassword,
        updateAdminCredentials,
        toggleCategoryVisibility,
        toggleNavLinkVisibility,
        addCustomCategory,
        deleteCategory,
        recordNewOrder,
        updateHomepageSettings,
        updatePlayer,
        updateStaffMember,
        addStaffMember,
        deleteStaffMember
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
