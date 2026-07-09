import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, HelpCircle, Save, RotateCcw, Flame, Swords, Medal } from 'lucide-react';

const rankPointsMap = (rank) => {
  if (rank === 1) return 10;
  if (rank === 2) return 6;
  if (rank === 3) return 5;
  if (rank === 4) return 4;
  if (rank === 5) return 3;
  if (rank === 6) return 2;
  if (rank === 7 || rank === 8) return 1;
  return 0;
};

export default function Calculator() {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState({
    p1: 'Player 1',
    p2: 'Player 2',
    p3: 'Player 3',
    p4: 'Player 4',
  });

  const [matches, setMatches] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      matchNumber: i + 1,
      rank: 0,
      p1Kills: 0,
      p2Kills: 0,
      p3Kills: 0,
      p4Kills: 0,
    }))
  );

  const [best10Summary, setBest10Summary] = useState({
    totalPoints: 0,
    totalKills: 0,
    avgKills: 0,
    dinners: 0,
    p1Total: 0,
    p2Total: 0,
    p3Total: 0,
    p4Total: 0,
    bestMatches: [],
  });

  const handleMatchChange = useCallback((index, field, value) => {
    setMatches((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }, []);

  // Compute best 10 matches whenever match inputs change
  useEffect(() => {
    // Process all matches that have a selected rank
    const validMatches = matches
      .map((m) => {
        const totalKills = m.p1Kills + m.p2Kills + m.p3Kills + m.p4Kills;
        const posPoints = m.rank > 0 ? rankPointsMap(m.rank) : 0;
        const totalPoints = totalKills + posPoints;
        const isDinner = m.rank === 1;

        return {
          ...m,
          totalKills,
          posPoints,
          totalPoints,
          isDinner,
        };
      })
      .filter((m) => m.rank > 0); // only count played matches

    // Sort by total points in descending order and select top 10
    const sorted = [...validMatches].sort((a, b) => b.totalPoints - a.totalPoints);
    const top10 = sorted.slice(0, 10);

    const totalPoints = top10.reduce((acc, m) => acc + m.totalPoints, 0);
    const totalKills = top10.reduce((acc, m) => acc + m.totalKills, 0);
    const dinners = top10.filter((m) => m.isDinner).length;

    const p1Total = top10.reduce((acc, m) => acc + m.p1Kills, 0);
    const p2Total = top10.reduce((acc, m) => acc + m.p2Kills, 0);
    const p3Total = top10.reduce((acc, m) => acc + m.p3Kills, 0);
    const p4Total = top10.reduce((acc, m) => acc + m.p4Kills, 0);

    setBest10Summary({
      totalPoints,
      totalKills,
      avgKills: top10.length > 0 ? totalKills / top10.length : 0,
      dinners,
      p1Total,
      p2Total,
      p3Total,
      p4Total,
      bestMatches: top10,
    });
  }, [matches]);

  const handleReset = () => {
    if (window.confirm('Reset all match data?')) {
      setMatches(
        Array.from({ length: 15 }, (_, i) => ({
          matchNumber: i + 1,
          rank: 0,
          p1Kills: 0,
          p2Kills: 0,
          p3Kills: 0,
          p4Kills: 0,
        }))
      );
      setTeamName('');
      setPlayers({
        p1: 'Player 1',
        p2: 'Player 2',
        p3: 'Player 3',
        p4: 'Player 4',
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem(
      'strikers_igq_calculator',
      JSON.stringify({ teamName, players, matches })
    );
    alert('Data saved successfully to Local Storage!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('strikers_igq_calculator');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamName) setTeamName(parsed.teamName);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.matches) setMatches(parsed.matches);
      } catch (e) {
        console.error('Error loading saved data', e);
      }
    }
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          BGIS 2026 IGQ Calculator
        </h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          Calculate your In-Game Qualifier points. Input up to 15 matches; the calculator automatically extracts and summarizes your top 10 games.
        </p>
      </div>

      {/* Team Details Card */}
      <div className="border border-strikers-border bg-strikers-gray rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm uppercase tracking-widest font-black text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-white" /> Team Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-strikers-muted">Team Name</label>
            <input
              type="text"
              placeholder="Strikers Esports"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          {['p1', 'p2', 'p3', 'p4'].map((pKey, idx) => (
            <div key={pKey} className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-strikers-muted">Player {idx + 1}</label>
              <input
                type="text"
                placeholder={`Player ${idx + 1} IGN`}
                value={players[pKey]}
                onChange={(e) => setPlayers({ ...players, [pKey]: e.target.value })}
                className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid for Matches and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Match Data Table */}
        <div className="lg:col-span-2 border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-strikers-border flex justify-between items-center bg-black/40">
            <h3 className="text-sm uppercase tracking-widest font-black text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-white" /> Match Input (15 Games)
            </h3>
            <span className="text-[10px] text-strikers-muted uppercase font-bold">Scroll for all matches</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-strikers-border text-[9px] font-bold uppercase tracking-widest text-white sticky top-0 z-10">
                  <th className="p-3">Match</th>
                  <th className="p-3">Rank (#1-#25)</th>
                  <th className="p-3 truncate">{players.p1 || 'P1'}</th>
                  <th className="p-3 truncate">{players.p2 || 'P2'}</th>
                  <th className="p-3 truncate">{players.p3 || 'P3'}</th>
                  <th className="p-3 truncate">{players.p4 || 'P4'}</th>
                  <th className="p-3 text-right">Kills</th>
                  <th className="p-3 text-right">Pos. Pts</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, idx) => {
                  const totalKills = m.p1Kills + m.p2Kills + m.p3Kills + m.p4Kills;
                  const posPts = m.rank > 0 ? rankPointsMap(m.rank) : 0;
                  const total = totalKills + posPts;

                  return (
                    <tr
                      key={idx}
                      className={`border-b border-strikers-border/40 hover:bg-black/20 transition-colors ${
                        m.rank === 1 ? 'bg-white/5' : ''
                      }`}
                    >
                      <td className="p-3 font-black text-white flex items-center gap-1.5">
                        M{m.matchNumber}
                        {m.rank === 1 && <Trophy className="w-3.5 h-3.5 text-white" />}
                      </td>
                      <td className="p-3">
                        <select
                          value={m.rank || ''}
                          onChange={(e) => handleMatchChange(idx, 'rank', parseInt(e.target.value) || 0)}
                          className="bg-black border border-strikers-border text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-white"
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 25 }, (_, i) => i + 1).map((r) => (
                            <option key={r} value={r}>
                              #{r}
                            </option>
                          ))}
                        </select>
                      </td>
                      {['p1Kills', 'p2Kills', 'p3Kills', 'p4Kills'].map((field) => (
                        <td key={field} className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            placeholder="0"
                            value={m[field] || ''}
                            onChange={(e) =>
                              handleMatchChange(idx, field, Math.max(0, parseInt(e.target.value) || 0))
                            }
                            className="w-12 bg-black border border-strikers-border rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-white"
                          />
                        </td>
                      ))}
                      <td className="p-3 text-right font-medium text-neutral-400">{totalKills}</td>
                      <td className="p-3 text-right font-medium text-neutral-400">{posPts}</td>
                      <td className="p-3 text-right font-black text-white">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Summary Panel */}
        <div className="space-y-6 flex flex-col">
          {/* Summary Stats */}
          <div className="border border-strikers-border bg-gradient-to-br from-neutral-900 to-black p-6 sm:p-8 rounded-3xl space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-black text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-white" /> Best 10 Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-strikers-gray border border-strikers-border rounded-2xl p-4 text-center space-y-1">
                <span className="text-3xl font-black text-white">{best10Summary.totalPoints}</span>
                <p className="text-[9px] uppercase tracking-widest text-strikers-muted font-bold">Total Points</p>
              </div>
              <div className="bg-strikers-gray border border-strikers-border rounded-2xl p-4 text-center space-y-1">
                <span className="text-3xl font-black text-white">{best10Summary.totalKills}</span>
                <p className="text-[9px] uppercase tracking-widest text-strikers-muted font-bold">Total Kills</p>
              </div>
              <div className="bg-strikers-gray border border-strikers-border rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-white">
                  {best10Summary.avgKills.toFixed(1)}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-strikers-muted font-bold">Avg Kills / Match</p>
              </div>
              <div className="bg-strikers-gray border border-strikers-border rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-white">{best10Summary.dinners}</span>
                <p className="text-[9px] uppercase tracking-widest text-strikers-muted font-bold">Total Dinners</p>
              </div>
            </div>

            {/* Individual player kills */}
            <div className="border-t border-strikers-border pt-6 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-strikers-muted font-bold">Best 10 Player Kills</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { name: players.p1, total: best10Summary.p1Total },
                  { name: players.p2, total: best10Summary.p2Total },
                  { name: players.p3, total: best10Summary.p3Total },
                  { name: players.p4, total: best10Summary.p4Total },
                ].map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center border border-strikers-border rounded-xl px-3 py-2.5 bg-black/40">
                    <span className="font-medium text-white truncate max-w-[80px]">{player.name}</span>
                    <span className="font-bold text-white shrink-0">{player.total} Kills</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Save className="w-4 h-4" /> Save Data
            </button>
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-strikers-gray text-white border border-strikers-border hover:border-white font-bold uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Best 10 Detailed List */}
      {best10Summary.bestMatches.length > 0 && (
        <div className="border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-strikers-border bg-black/40">
            <h3 className="text-sm uppercase tracking-widest font-black text-white">
              Your Best 10 Matches (Ranked by points)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-strikers-muted border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-strikers-border text-[9px] font-bold uppercase tracking-widest text-white">
                  <th className="p-4">Rank #</th>
                  <th className="p-4">Match</th>
                  <th className="p-4">Finishing Place</th>
                  <th className="p-4">Total Kills</th>
                  <th className="p-4">Pos. Points</th>
                  <th className="p-4">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {best10Summary.bestMatches.map((m, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-strikers-border/50 hover:bg-black/20 ${
                      m.isDinner ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="p-4 font-black text-white">#{idx + 1}</td>
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      Match {m.matchNumber}
                      {m.isDinner && <Trophy className="w-3.5 h-3.5 text-white" />}
                    </td>
                    <td className="p-4 font-semibold text-white">#{m.rank}</td>
                    <td className="p-4 text-red-500 font-bold">{m.totalKills}</td>
                    <td className="p-4">{m.posPoints}</td>
                    <td className="p-4 font-black text-white">{m.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
