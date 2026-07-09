import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Calendar, Trophy, AlertTriangle, ShieldCheck, MapPin, Eye, Play, Sparkles, Star } from 'lucide-react';

const mockTournaments = [
  {
    id: 'strikers-fusion-2026',
    name: 'Strikers Fusion Cup',
    game: 'Valorant',
    status: 'Upcoming',
    prizePool: '₹2,50,000',
    startDate: 'August 01, 2026',
    teamsCount: 16,
    rules: {
      general: 'Standard VCT rulebook is applicable. Map bans to be completed 30 minutes before schedule. Players must run Riot Vanguard.',
      critical: 'Any form of external exploits or script injections will result in an immediate organization-wide ban.',
    },
    matches: [],
    standings: [],
    channels: []
  },
  {
    id: 'strikers-nade-up-2026',
    name: 'Strikers Nade Up Cup',
    game: 'BGMI',
    status: 'Upcoming',
    prizePool: '₹1,50,000',
    startDate: 'August 20, 2026',
    teamsCount: 24,
    rules: {
      general: 'Krafton Esports rules apply. All roster members must register with complete ID details.',
      critical: 'Mortars and Emergency Recall are banned from play.',
    },
    matches: [],
    standings: [],
    channels: []
  }
];

export default function Tournaments() {
  const { categories } = useContext(AdminContext);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('matches');

  // Map tournament status to Admin Context category names
  const getStatusCategory = (status) => {
    if (status === 'Ongoing') return 'Active';
    return status; // 'Upcoming' or 'Completed'
  };

  // Filter visible categories
  const activeCategories = (categories?.tournaments || []).filter(c => c.visible);
  const visibleStatuses = activeCategories.map(c => c.name);

  // Filter tournaments
  let visibleTournaments = mockTournaments.filter(t => visibleStatuses.includes(getStatusCategory(t.status)));

  // Mock a custom tournament if a custom category is visible and empty
  activeCategories.forEach(cat => {
    const hasItems = visibleTournaments.some(t => getStatusCategory(t.status) === cat.name);
    if (!hasItems) {
      visibleTournaments.push({
        id: `mock-tour-${cat.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: `Strikers ${cat.name} Invitational`,
        game: 'BGMI/Valorant',
        status: cat.name,
        prizePool: '₹5,00,000',
        startDate: 'TBD',
        teamsCount: 16,
        rules: {
          general: cat.desc || `Official tournament guidelines custom set for "${cat.name}" category.`,
          critical: 'Play fair. Anti-cheat software mandatory. Strict penalties for rule violation.',
        },
        matches: [],
        standings: [],
        channels: []
      });
    }
  });

  const filteredTournaments = selectedFilter === 'All'
    ? visibleTournaments
    : visibleTournaments.filter(t => getStatusCategory(t.status) === selectedFilter);

  if (selectedTournament) {
    const t = visibleTournaments.find(x => x.id === selectedTournament);
    if (!t) return null;
    return (
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedTournament(null)}
          className="text-xs uppercase tracking-wider font-bold text-strikers-muted hover:text-white transition-colors animate-fadeIn"
        >
          ← Back to Tournaments
        </button>


        {/* Header */}
        <div className="border border-strikers-border bg-strikers-gray rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white text-black font-bold uppercase tracking-wider text-[10px] rounded-full">
                {t.status}
              </span>
              <span className="text-xs text-strikers-muted font-bold tracking-widest uppercase">{t.game}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">{t.name}</h1>
            <div className="flex items-center gap-4 text-xs text-strikers-muted">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white" /> {t.startDate}</span>
              <span>•</span>
              <span>{t.teamsCount} Teams Registered</span>
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-strikers-border pt-6 md:pt-0 md:pl-8 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-strikers-muted font-bold">Prize Pool</p>
            <p className="text-3xl font-black text-white">{t.prizePool}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-strikers-border text-xs uppercase tracking-widest font-bold">
          {['matches', 'standings', 'rules', 'live'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 border-b-2 font-black transition-all ${
                activeTab === tab
                  ? 'border-white text-white bg-white/5'
                  : 'border-transparent text-strikers-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-4">
          {activeTab === 'matches' && (
            <div className="border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-strikers-muted border-collapse">
                  <thead>
                    <tr className="bg-black/60 border-b border-strikers-border text-[10px] font-bold uppercase tracking-widest text-white">
                      <th className="p-4">Round</th>
                      <th className="p-4">Match #</th>
                      <th className="p-4">Group</th>
                      <th className="p-4">Your Slot</th>
                      <th className="p-4">Map</th>
                      <th className="p-4">Match ID</th>
                      <th className="p-4">Password</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.matches.length > 0 ? (
                      t.matches.map((m) => (
                        <tr key={m.id} className="border-b border-strikers-border/50 hover:bg-black/20">
                          <td className="p-4 font-bold text-white">{m.round}</td>
                          <td className="p-4">Match {m.matchNumber}</td>
                          <td className="p-4">{m.group}</td>
                          <td className="p-4 text-white font-semibold">{m.slot}</td>
                          <td className="p-4">{m.map}</td>
                          <td className="p-4 font-mono text-white">{m.matchId}</td>
                          <td className="p-4 font-mono text-white">{m.password}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.status === 'Completed' ? 'bg-neutral-800 text-neutral-400' :
                              m.status === 'Ongoing' ? 'bg-white text-black' : 'bg-neutral-900 border border-strikers-border text-white'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">{m.notes}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-strikers-muted">
                          No matches scheduled yet. Check back soon!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'standings' && (
            <div className="border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-strikers-muted border-collapse">
                  <thead>
                    <tr className="bg-black/60 border-b border-strikers-border text-[10px] font-bold uppercase tracking-widest text-white">
                      <th className="p-4">Rank</th>
                      <th className="p-4">Team</th>
                      <th className="p-4">Dinners</th>
                      <th className="p-4">Position Points</th>
                      <th className="p-4">Kill Points</th>
                      <th className="p-4">Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.standings.length > 0 ? (
                      t.standings.map((team, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-strikers-border/50 hover:bg-black/20 ${
                            team.team === 'Strikers Esports' ? 'bg-white/5' : ''
                          }`}
                        >
                          <td className="p-4 font-black text-white">#{team.rank}</td>
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            {team.team}
                            {team.team === 'Strikers Esports' && (
                              <span className="text-[9px] bg-white text-black font-bold uppercase px-1.5 py-0.5 rounded-full">
                                Host
                              </span>
                            )}
                          </td>
                          <td className="p-4">{team.dinners}</td>
                          <td className="p-4">{team.positionPoints}</td>
                          <td className="p-4">{team.killPoints}</td>
                          <td className="p-4 font-bold text-white">{team.totalPoints}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-strikers-muted">
                          Standings will be compiled after matches begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-white font-bold uppercase text-sm">
                  <ShieldCheck className="w-5 h-5" /> General Regulations
                </div>
                <p className="text-xs text-strikers-muted leading-relaxed whitespace-pre-line">
                  {t.rules.general}
                </p>
              </div>

              <div className="border border-red-950/30 bg-red-950/10 border-red-900/30 p-8 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-sm">
                  <AlertTriangle className="w-5 h-5" /> Critical / Restricted Actions
                </div>
                <p className="text-xs text-red-200 leading-relaxed whitespace-pre-line font-medium">
                  {t.rules.critical}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-6 text-center py-8">
              <h2 className="text-xl font-bold uppercase text-white tracking-widest">Streaming Channels</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {t.channels.length > 0 ? (
                  t.channels.map((chan) => (
                    <a
                      key={chan.id}
                      href={chan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-strikers-border hover:border-white bg-strikers-gray px-8 py-6 rounded-3xl flex flex-col items-center gap-3 transition-colors"
                    >
                      <Play className="w-8 h-8 text-red-500 animate-pulse" />
                      <span className="text-xs font-black uppercase text-white tracking-wider">{chan.name}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-strikers-muted">No live streaming details available for this tournament yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Tournaments Portal</h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          Explore upcoming and ongoing Strikers Esports tournament schedules, standings, rules, and streaming details.
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
          All Stages
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTournaments.map((t) => (
          <div
            key={t.id}
            className="group border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col"
          >
            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-strikers-muted font-bold tracking-widest uppercase">{t.game}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    t.status === 'Ongoing' || t.status === 'Active' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase text-white tracking-tight leading-snug">{t.name}</h3>
                <p className="text-xs text-strikers-muted flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white" /> Starts {t.startDate}</p>
              </div>

              <div className="border-t border-strikers-border pt-6 flex justify-between items-center">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-strikers-muted font-bold">Prize Pool</p>
                  <p className="text-lg font-bold text-white">{t.prizePool}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTournament(t.id);
                    setActiveTab('matches');
                  }}
                  className="px-6 py-2 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider text-[9px] rounded-full transition-all duration-300"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

