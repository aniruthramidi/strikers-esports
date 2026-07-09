import React, { useContext } from 'react';
import { AdminContext } from '../admin/AdminContext';
import { Shield, Calendar, Target, Code, Heart, Award } from 'lucide-react';

export default function About() {
  const { homepageSettings } = useContext(AdminContext);

  const milestones = [
    {
      title: '2019 Foundations',
      desc: 'Launched originally as a community-driven server to bring gamers together.',
      icon: Calendar
    },
    {
      title: 'Competitive Pivot',
      desc: 'Successfully transitioned from a casual social hub into a formal esports organization.',
      icon: Target
    },
    {
      title: 'Technical Growth',
      desc: 'Developed a robust, Python-powered infrastructure and website to streamline operations and player data.',
      icon: Code
    },
    {
      title: 'Community Leadership',
      desc: 'Established clear guidelines and automated systems to sustain a toxic-free, highly engaged fan base.',
      icon: Heart
    },
    {
      title: 'Operational Excellence',
      desc: 'Expanded into managing competitive lineups, analyzing scrim data, and securing sponsorship opportunities.',
      icon: Award
    }
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
      {/* Title */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-strikers-border bg-strikers-gray/80 text-xs font-semibold tracking-wider text-strikers-muted uppercase mx-auto">
          <Shield className="w-3.5 h-3.5 text-white" />
          Who We Are
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          {homepageSettings?.aboutTitle || 'About Strikers'}
        </h1>
        <p className="text-sm text-strikers-muted max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
          {homepageSettings?.aboutDesc || 'Started in 2019, Strikers Esports began as a passionate community server, serving as a hub for casual gamers to connect and play. Over time, this vibrant foundation naturally shifted focus toward competitive gaming, evolving into a structured esports organization. Driven by dedicated management and strategic execution, the organization scaled up its technical infrastructure, team logistics, and brand presence. Today, Strikers Esports stands as a professional entity that bridges community engagement with competitive excellence, particularly in mobile esports.'}
        </p>
      </div>

      {/* Key Milestones Section */}
      <div className="space-y-8 border-t border-strikers-border pt-16">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase text-white tracking-tight">Key Milestones & Focus Areas</h2>
          <p className="text-xs uppercase tracking-widest text-strikers-muted font-semibold">
            Our journey from a community hub to professional excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestones.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="border border-strikers-border bg-strikers-gray rounded-3xl p-8 space-y-4 hover:border-white transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-black border border-strikers-border flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase text-white tracking-wider">{item.title}</h4>
                  <p className="text-xs text-strikers-muted leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
