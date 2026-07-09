import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

const DEFAULT_CATEGORIES = {
  merch: [
    { name: 'Official Gear', visible: true, custom: false, desc: 'Official team jerseys and kits.' },
    { name: 'Popular', visible: true, custom: false, desc: 'Hot-selling fan apparel and hoodies.' },
    { name: 'Accessory', visible: true, custom: false, desc: 'Snapbacks, stickers, and small items.' },
    { name: 'Hardware', visible: true, custom: false, desc: 'Pro-grade mousepads and peripherals.' },
  ],
  services: [
    { name: 'VFX & GFX', visible: true, custom: false, desc: 'High-end gaming montage edits and stream overlays.' },
    { name: 'Production', visible: true, custom: false, desc: 'Full broadcast setup and tournament production.' },
    { name: 'Social Media', visible: true, custom: false, desc: 'Esports graphic packages and content calendars.' },
    { name: 'Esports Operations', visible: true, custom: false, desc: 'Consulting, league management, and rule drafting.' },
  ],
  tournaments: [
    { name: 'Active', visible: true, custom: false, desc: 'Tournaments currently live with matches streaming.' },
    { name: 'Upcoming', visible: true, custom: false, desc: 'Registration open or upcoming matches announced.' },
    { name: 'Completed', visible: true, custom: false, desc: 'Concluded cups with final standings and champion brackets.' },
  ]
};

const DEFAULT_NAV_LINKS = [
  { name: 'Tournaments', path: '/tournaments', visible: true, desc: 'Access to portal matches, schedule details, points brackets, and live stream streams.' },
  { name: 'Teams', path: '/team', visible: true, desc: 'Showcase grid profiles for player rosters and corporate management.' },
  { name: 'Studios', path: '/services', visible: true, desc: 'Esports creative design studio overview, packages list, and portfolio.' },
  { name: 'Shop', path: '/merch', visible: true, desc: 'Interactive fan gear clothing store, checkout, and cart workflows.' },
  { name: 'IGQ Calculator', path: '/bgis-calculator', visible: true, desc: 'BGIS campaign points calculator tool for fans.' }
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
  ]
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

const DEFAULT_STAFF = [
  {
    name: 'Rohit Raghavendra',
    role: 'Founder & CEO',
    bio: "Rohit has built Strikers Esports into a respected organization known for its skilled rosters, disciplined training, and strong community presence. Committed to excellence, innovation, and player development, Rohit continues to elevate Strikers Esports to new heights in the world of competitive gaming.",
    photo: ''
  },
  {
    name: 'Meghanath Varidireddy',
    role: 'COO',
    bio: 'Meghanath oversees organizational strategy, player management, and day-to-day execution to ensure the team\'s sustained growth and success. Under his guidance, Strikers Esports continues to strengthen its position as a dynamic and professional force in the esports ecosystem.',
    photo: ''
  },
  {
    name: 'Radhika Javvaji',
    role: 'CMO',
    bio: 'Radhika leads the marketing strategy, brand development, and community engagement initiatives to enhance Strikers\' visibility and reach. Her innovative approach to marketing helps Strikers Esports stay ahead in the competitive esports landscape.',
    photo: ''
  },
  {
    name: 'Alla Chaithenya',
    role: 'CFO',
    bio: 'Alla manages the financial strategy, budgeting, and resource allocation to ensure the organization\'s growth and sustainability. His expertise in financial planning and analysis helps Strikers Esports make informed decisions that benefit the entire team.',
    photo: ''
  },
  {
    name: 'Anil Yamannagari',
    role: 'Head of Esports',
    bio: 'Anil leads the competitive strategy, player development, and team management across all esports divisions. His leadership and vision help Strikers Esports maintain its position as a formidable force in the esports landscape.',
    photo: ''
  },
  {
    name: 'Deepu',
    role: 'Technical Head',
    bio: 'Deepu is responsible for overseeing all technological and infrastructure needs that power the organization’s competitive edge. He ensures that players have access to the best setups, smooth operations, and cutting-edge tools required to compete at the highest level.',
    photo: ''
  }
];

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
    return saved ? JSON.parse(saved) : DEFAULT_NAV_LINKS;
  });

  const [homepageSettings, setHomepageSettings] = useState(() => {
    const saved = localStorage.getItem('strikers_homepage_settings');
    return saved ? JSON.parse(saved) : DEFAULT_HOMEPAGE_SETTINGS;
  });

  const [rostersState, setRostersState] = useState(() => {
    const saved = localStorage.getItem('strikers_rosters');
    return saved ? JSON.parse(saved) : DEFAULT_ROSTERS;
  });

  const [staffState, setStaffState] = useState(() => {
    const saved = localStorage.getItem('strikers_staff');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF;
  });

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
