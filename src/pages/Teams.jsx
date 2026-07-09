import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Shield, Mail, Award, Flame, Zap, Award as TrophyIcon } from 'lucide-react';

export default function Teams() {
  const { rostersState, staffState } = useContext(AdminContext);
  const [activeRoster, setActiveRoster] = useState('bgmi');

  const currentRosterInfo = {
    bgmi: {
      teamName: 'Strikers Assassins',
      game: 'BGMI (Battlegrounds Mobile India)',
      players: rostersState?.bgmi || []
    },
    valorant: {
      teamName: 'Strikers Blaze',
      game: 'Valorant',
      players: rostersState?.valorant || []
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
      {/* Title */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Teams & Staff</h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          Meet our professional competitive lineups and the dedicated management team behind Strikers Esports.
        </p>
      </div>

      {/* Roster Section */}
      <div className="space-y-8">
        <div className="flex justify-center border-b border-strikers-border text-xs font-bold uppercase tracking-widest">
          <button
            onClick={() => setActiveRoster('bgmi')}
            className={`px-8 py-4 border-b-2 font-black transition-colors ${
              activeRoster === 'bgmi' ? 'border-white text-white' : 'border-transparent text-strikers-muted'
            }`}
          >
            BGMI Lineup
          </button>
          <button
            onClick={() => setActiveRoster('valorant')}
            className={`px-8 py-4 border-b-2 font-black transition-colors ${
              activeRoster === 'valorant' ? 'border-white text-white' : 'border-transparent text-strikers-muted'
            }`}
          >
            Valorant Lineup
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">
              {currentRosterInfo[activeRoster].teamName}
            </h2>
            <p className="text-xs uppercase tracking-widest text-strikers-muted font-semibold">
              Division: {currentRosterInfo[activeRoster].game}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentRosterInfo[activeRoster].players.map((player, idx) => (
              <div
                key={idx}
                className="border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden hover:border-white transition-all duration-300 relative group flex flex-col justify-between min-h-[320px]"
              >
                {/* Photo Box */}
                <div className="h-48 bg-black/40 border-b border-strikers-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none leading-none z-10">
                    0{idx + 1}
                  </div>
                  {player.photo ? (
                    <img
                      src={player.photo}
                      alt={player.ign}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Flame className="w-6 h-6 text-white/40" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-1 bg-black/20 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black uppercase text-white tracking-tight leading-snug">{player.ign}</h3>
                    <p className="text-[10px] text-neutral-400 font-mono tracking-wider">{player.name}</p>
                  </div>
                  <p className="text-[9px] uppercase font-bold text-strikers-muted pt-2 border-t border-white/5">{player.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Section */}
      <div className="space-y-8 border-t border-strikers-border pt-16">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase text-white tracking-tight">Management & Staff</h2>
          <p className="text-xs uppercase tracking-widest text-strikers-muted font-semibold">
            The strategists driving Strikers Esports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(staffState || []).map((staff, idx) => (
            <div
              key={idx}
              className="border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col justify-between min-h-[360px]"
            >
              {/* Photo Box */}
              <div className="h-48 bg-black/40 border-b border-strikers-border flex items-center justify-center relative overflow-hidden group">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    alt={staff.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase text-white tracking-tight leading-snug">{staff.name}</h3>
                  <p className="text-xs uppercase tracking-wider font-bold text-strikers-muted">{staff.role}</p>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-semibold">{staff.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
