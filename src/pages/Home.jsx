import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { Trophy, Shield, Cpu, ShoppingBag, Eye, ArrowRight, Star, Users, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { homepageSettings, rostersState } = useContext(AdminContext);
  const [lineupTab, setLineupTab] = useState('bgmi');

  const heroTitle = homepageSettings?.heroTitle || 'STRIKERS';
  const heroTitleHighlight = homepageSettings?.heroTitleHighlight || 'ESPORTS';
  const heroDesc = homepageSettings?.heroDesc || 'Delivering professional gaming excellence through premium tournaments, top-tier esports services, content production, and official team rosters. Join the competitive revolution.';
  const statsList = homepageSettings?.stats || [];

  const activeRosterList = rostersState?.[lineupTab] || [];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black py-20 px-6">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-strikers-border bg-strikers-gray/80 text-xs font-semibold tracking-wider text-strikers-muted uppercase"
          >
            <Star className="w-3.5 h-3.5 text-white" />
            Competitive Gaming Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight"
          >
            {heroTitle} <span className="text-gradient">{heroTitleHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-lg text-strikers-muted max-w-2xl mx-auto leading-relaxed"
          >
            {heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link
              to="/tournaments"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)]"
            >
              Explore Cups
            </Link>
            <Link
              to="/bgis-calculator"
              className="w-full sm:w-auto px-8 py-4 bg-strikers-gray text-white border border-strikers-border font-bold uppercase tracking-wider text-xs rounded-full hover:bg-black hover:border-white transition-all duration-300"
            >
              BGIS IGQ Calculator
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black py-16 border-y border-strikers-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsList.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stat.value}</h3>
              <p className="text-xs uppercase tracking-widest text-strikers-muted font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lineup Showcase Section */}
      <section className="py-24 bg-[#080808] px-6 border-t border-strikers-border">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-strikers-border bg-strikers-gray/80 text-xs font-semibold tracking-wider text-strikers-muted uppercase">
                <Users className="w-3.5 h-3.5 text-white" />
                Active Rosters
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Lineup Showcase</h2>
              <p className="text-sm text-strikers-muted max-w-xl">
                Meet the elite gaming competitors representing Strikers Esports across major titles.
              </p>
            </div>
            
            {/* Tab Toggles */}
            <div className="flex gap-2.5 bg-black p-1 border border-strikers-border rounded-xl w-fit">
              <button
                onClick={() => setLineupTab('bgmi')}
                className={`px-5 py-2.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${
                  lineupTab === 'bgmi'
                    ? 'bg-white text-black'
                    : 'text-strikers-muted hover:text-white'
                }`}
              >
                BGMI
              </button>
              <button
                onClick={() => setLineupTab('valorant')}
                className={`px-5 py-2.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${
                  lineupTab === 'valorant'
                    ? 'bg-white text-black'
                    : 'text-strikers-muted hover:text-white'
                }`}
              >
                Valorant
              </button>
            </div>
          </div>

          {/* Lineup Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeRosterList.map((p, idx) => (
              <div
                key={idx}
                className="group border border-strikers-border bg-black rounded-3xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Avatar Card Box */}
                <div className="h-64 bg-strikers-gray border-b border-strikers-border flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-[40px] font-black text-white/5 select-none leading-none z-10">
                    0{idx + 1}
                  </div>
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.ign}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white/20 group-hover:scale-110 transition-transform duration-300">
                      <Flame className="w-10 h-10 text-white/40" />
                    </div>
                  )}
                  {!p.photo && (
                    <span className="text-[10px] text-white/30 font-black tracking-[0.3em] uppercase mt-6 z-10">
                      PRO PLAYER
                    </span>
                  )}
                </div>

                {/* Info Detail */}
                <div className="p-6 space-y-2 text-center bg-strikers-gray/40">
                  <h4 className="text-base font-black text-white uppercase tracking-tight truncate leading-snug">
                    {p.ign}
                  </h4>
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{p.name}</p>
                  <div className="pt-2 border-t border-white/5">
                    <span className="inline-block text-[9px] uppercase tracking-wider font-bold text-white bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full">
                      {p.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)]"
            >
              Explore Full Organization <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Merch Banner */}
      <section className="py-24 bg-black px-6 border-t border-strikers-border">
        <div className="max-w-7xl mx-auto rounded-3xl border border-strikers-border bg-gradient-to-r from-neutral-950 to-neutral-900 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 z-10 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Represent Strikers</h2>
            <p className="text-sm text-strikers-muted leading-relaxed">
              Support the organization and wear your loyalty. Check out our high-quality monochrome jerseys, caps, hoodies, and gaming accessories.
            </p>
          </div>
          <div className="z-10 shrink-0">
            <Link
              to="/merch"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Shop Official Gear
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
