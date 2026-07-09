import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Paintbrush, Play, Layers, Video, ShieldCheck, ArrowRight, Image, Star, Sparkles } from 'lucide-react';

const servicesList = [
  {
    icon: Paintbrush,
    title: 'Esports GFX Design',
    category: 'VFX & GFX',
    desc: 'Visually stunning graphic designs that elevate brand identities. Specialized in team logo creation, social media content templates, event branding, and banner layouts that captivate gaming audiences.'
  },
  {
    icon: Layers,
    title: 'Stream Overlays & HUDs',
    category: 'VFX & GFX',
    desc: 'Custom-designed live streaming overlay packs, including borders, starting screens, webcam frames, chat layouts, and interactive alerts tailored for OBS, Streamlabs, or vMix.'
  },
  {
    icon: Play,
    title: 'VFX & Motion Graphics',
    category: 'VFX & GFX',
    desc: 'Advanced video editing, 3D animated intro loops, stinger transitions, and premium motion graphics that bring unique storytelling to life and enhance promotional content.'
  },
  {
    icon: Video,
    title: 'Broadcast Engineering',
    category: 'Production',
    desc: 'End-to-end visual packaging for live esports broadcasts. Includes animated lower thirds, match brackets, leaderboards, player comparison cards, and custom broadcast overlays.'
  },
  {
    icon: Sparkles,
    title: 'Social Graphic Packages',
    category: 'Social Media',
    desc: 'Bespoke high-contrast template grids, matchday posters, schedule announcements, and roster reveal layouts optimized for Twitter/X and Instagram streams.'
  },
  {
    icon: ShieldCheck,
    title: 'Tournament Rulebook Consulting',
    category: 'Esports Operations',
    desc: 'Comprehensive league operations support, custom esports rule drafts, anti-cheat policy design, and tournament hosting logistics guidance.'
  }
];

const portfolioItems = [
  { title: 'Strikers Pro Jersey 2026', category: 'Product Design', desc: 'Official monochrome jersey concept.' },
  { title: 'Rumble Cup Overlay Package', category: 'Stream GFX', desc: 'Custom overlay set for BGIS broadcast.' },
  { title: 'Blaze Valorant Stinger', category: 'VFX / Motion', desc: 'Transition animation for match streams.' },
  { title: 'Assassins BGMI Logo Rebrand', category: 'Identity', desc: 'Stylized logo re-branding.' }
];

export default function Services() {
  const { categories } = useContext(AdminContext);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter visible categories
  const activeCategories = (categories?.services || []).filter(c => c.visible);
  const visibleCategoryNames = activeCategories.map(c => c.name);

  // Filter service items
  let visibleServices = servicesList.filter(s => visibleCategoryNames.includes(s.category));

  // If a custom category is visible and has no service cards, we dynamically mock one
  activeCategories.forEach(cat => {
    const hasItems = visibleServices.some(s => s.category === cat.name);
    if (!hasItems) {
      visibleServices.push({
        icon: Star,
        title: `Dynamic ${cat.name} Solutions`,
        category: cat.name,
        desc: cat.desc || `Bespoke creative services and consulting custom tailored for our clients under the "${cat.name}" category.`
      });
    }
  });

  const filteredServices = selectedFilter === 'All'
    ? visibleServices
    : visibleServices.filter(s => s.category === selectedFilter);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-20 animate-fadeIn">
      {/* Title */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-strikers-border bg-strikers-gray/80 text-xs font-semibold tracking-wider text-strikers-muted uppercase">
          Strikers Studios
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Esports Creative Services</h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          We combine creativity, gaming culture, and cutting-edge design workflows to deliver high-quality visuals for tournaments, streams, and gaming teams.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2.5 justify-center py-2 border-b border-strikers-border max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedFilter('All')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
            selectedFilter === 'All'
              ? 'bg-white text-black border-white'
              : 'bg-black text-strikers-muted border-strikers-border hover:border-white'
          }`}
        >
          All Services
        </button>
        {activeCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedFilter(cat.name)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
              selectedFilter === cat.name
                ? 'bg-white text-black border-white'
                : 'bg-black text-strikers-muted border-strikers-border hover:border-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={idx}
              className="border border-strikers-border bg-strikers-gray rounded-3xl p-8 hover:border-white transition-all duration-300 flex gap-6"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase text-white tracking-tight">{service.title}</h3>
                  <span className="text-[8px] bg-white/10 text-white font-bold uppercase px-2 py-0.5 rounded border border-white/5">
                    {service.category}
                  </span>
                </div>
                <p className="text-xs text-strikers-muted leading-relaxed">{service.desc}</p>
              </div>
            </div>
          );
        })}
      </div>


      {/* Portfolio Showcase */}
      <div className="space-y-8 border-t border-strikers-border pt-16">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">Our Work Showcase</h2>
          <p className="text-xs uppercase tracking-widest text-strikers-muted font-semibold">
            Latest creative designs released by Strikers Studios
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item, idx) => (
            <div
              key={idx}
              className="group border border-strikers-border bg-black rounded-3xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-6 relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

              <div className="z-10 flex justify-between items-start">
                <span className="text-[9px] bg-white/10 text-white font-bold uppercase px-2 py-0.5 rounded-full border border-white/5">
                  {item.category}
                </span>
                <span className="text-[10px] font-black text-white/10">0{idx + 1}</span>
              </div>

              <div className="z-10 space-y-2">
                <h4 className="text-base font-black uppercase text-white tracking-tight leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-strikers-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="border border-strikers-border bg-gradient-to-br from-neutral-900 to-black p-8 sm:p-12 md:p-16 rounded-3xl text-center space-y-6 max-w-4xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">Need Custom Designs?</h3>
        <p className="text-xs text-strikers-muted max-w-lg mx-auto leading-relaxed">
          From full branding packages to individual motion animations or overlay setups, our designers are ready to work on your esports project. Contact our creative managers.
        </p>
        <div className="pt-4">
          <a
            href="mailto:design@strikersesports.in"
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2"
          >
            Start a project <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
