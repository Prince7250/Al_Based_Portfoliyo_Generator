import React, { useState, useEffect, useRef } from 'react';
import { GeneratedPortfolio, UserInput } from '../types';
import { Hero } from './Hero';
import { Briefcase, Code, Star, ArrowUpRight, Cpu, ArrowRight, Sun, Moon, Filter } from 'lucide-react';

interface PortfolioPreviewProps {
  userData: UserInput;
  aiData: GeneratedPortfolio;
  onReset: () => void;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ userData, aiData, onReset }) => {
  // Initialize theme state - check system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark
  });

  const [isSkillsVisible, setIsSkillsVisible] = useState(false);
  const skillsRef = useRef<HTMLElement>(null);
  const [filterDuration, setFilterDuration] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSkillsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getFilteredExperience = () => {
    if (filterDuration === 'all') return aiData.experience;
    
    const limit = parseInt(filterDuration);
    const currentYear = new Date().getFullYear();
    
    return aiData.experience.filter(exp => {
      const txt = exp.duration.toLowerCase();
      // If currently working there, it's always included in "Last X Years" unless it ended in the past which 'present' implies it hasn't.
      // However, usually "Present" means active.
      if (txt.includes('present') || txt.includes('current') || txt.includes('now')) return true;
      
      // Extract 4-digit years
      const years = txt.match(/\b(19|20)\d{2}\b/g);
      if (!years) return true; // Keep if no date found to be safe
      
      // Assume the last year mentioned is the end date
      const endYear = Math.max(...years.map(y => parseInt(y)));
      
      // Check if the end year is within the limit (e.g. 2024 - 2022 <= 3)
      return (currentYear - endYear) <= limit;
    });
  };

  const filteredExperience = getFilteredExperience();

  return (
    // Outer wrapper applies the 'dark' class based on state. 
    // This allows tailwind 'dark:' modifiers to work on children.
    <div className={`${isDarkMode ? 'dark' : ''} w-full`}>
      <div 
        id="portfolio-preview" 
        className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-rust-500/30 transition-colors duration-300"
      >
        
        {/* Navigation for Preview Mode */}
        <nav data-html2canvas-ignore="true" className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
            <div 
              className="font-display font-bold text-xl tracking-tighter hover:tracking-wide transition-all duration-300 cursor-pointer text-slate-900 dark:text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {userData.fullName.split(' ')[0]}<span className="text-brand-500">.folio</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {['Skills', 'Projects', 'Experience'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={onReset}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium border border-slate-200 dark:border-slate-700"
              >
                Create New
              </button>
            </div>
          </div>
        </nav>

        <Hero userData={userData} aiData={aiData} isDarkMode={isDarkMode} />

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-24 bg-slate-100/50 dark:bg-slate-900/50 relative overflow-hidden transition-colors duration-300 scroll-mt-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-brand-100 dark:bg-brand-500/10 rounded-xl border border-brand-200 dark:border-brand-500/20">
                <Code className="text-brand-600 dark:text-brand-400" size={28} />
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Technical Arsenal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiData.skills.map((skillGroup, idx) => (
                <div key={idx} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-8 rounded-2xl hover:border-brand-300 dark:hover:border-brand-500/30 group transition-all duration-300">
                  <div className={`flex items-center gap-3 mb-6 ${isSkillsVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${idx * 150}ms` }}>
                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                       <Cpu size={16} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className={`
                          px-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 rounded-lg text-sm text-slate-600 dark:text-slate-300 
                          border border-slate-200 dark:border-slate-700/50 hover:border-brand-300 dark:hover:border-brand-500/30 
                          hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-default
                          ${isSkillsVisible ? 'animate-fade-in' : 'opacity-0'}
                        `}
                        style={{ animationDelay: `${(idx * 150) + (sIdx * 50)}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 scroll-mt-20">
          <div className="absolute left-0 top-1/2 w-96 h-96 bg-rust-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-rust-100 dark:bg-rust-500/10 rounded-xl border border-rust-200 dark:border-rust-500/20">
                <Star className="text-rust-600 dark:text-rust-500" size={28} />
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiData.projects.map((project, idx) => (
                <div key={idx} className="group relative bg-white dark:bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-rust-300 dark:hover:border-rust-500/30 hover:shadow-2xl hover:shadow-rust-500/10 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rust-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="p-8 md:p-10 h-full flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-rust-600 dark:group-hover:from-white dark:group-hover:to-rust-200 transition-all">
                        {project.title}
                      </h3>
                      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-rust-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed text-lg">
                      {project.description}
                    </p>

                    <div className="mb-8 pl-4 border-l-2 border-rust-500/50">
                      <span className="text-xs font-bold text-rust-600 dark:text-rust-400 uppercase tracking-widest mb-1 block">Impact</span>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{project.impact}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 bg-slate-100/30 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/50 transition-colors duration-300 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-honey-100 dark:bg-honey-500/10 rounded-xl border border-honey-200 dark:border-honey-500/20">
                  <Briefcase className="text-honey-600 dark:text-honey-500" size={28} />
                </div>
                <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Experience History</h2>
              </div>
              
              {/* Experience Filter */}
              <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="px-3 py-1 text-slate-400 border-r border-slate-200 dark:border-slate-700 mr-1 flex items-center gap-1">
                   <Filter size={14} /> <span className="text-xs font-semibold uppercase">Filter</span>
                </div>
                {[
                  { label: 'All', val: 'all' },
                  { label: '1Y', val: '1' },
                  { label: '3Y', val: '3' },
                  { label: '5Y', val: '5' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setFilterDuration(opt.val)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-md transition-all
                      ${filterDuration === opt.val 
                        ? 'bg-honey-500 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {filteredExperience.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p>No experience found within the last {filterDuration} years.</p>
                </div>
              ) : (
                filteredExperience.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-0 group animate-fade-in">
                    <div className="md:flex gap-12 items-start">
                      <div className="hidden md:block w-48 pt-2 text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:border-honey-500/50 group-hover:text-honey-600 dark:group-hover:text-honey-400 transition-colors">
                          {exp.duration}
                        </span>
                      </div>
                      
                      {/* Timeline line */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 md:left-[215px] group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors"></div>
                      <div className="absolute left-[-4px] top-4 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 md:left-[211px] ring-4 ring-slate-50 dark:ring-slate-950 group-hover:bg-honey-500 group-hover:scale-125 transition-all duration-300"></div>

                      <div className="flex-1 pb-12 border-b border-slate-200 dark:border-slate-800/50 last:border-0 group-hover:border-slate-300 dark:group-hover:border-slate-700/50 transition-colors">
                        <div className="md:hidden inline-block mb-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {exp.duration}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-honey-600 dark:group-hover:text-honey-300 transition-colors">{exp.role}</h3>
                        <div className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-6">{exp.company}</div>
                        
                        <ul className="space-y-4">
                          {exp.achievements.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 leading-relaxed group/item">
                              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 flex-shrink-0 group-hover/item:bg-honey-500 transition-colors" />
                              <span className="group-hover/item:text-slate-800 dark:group-hover/item:text-slate-300 transition-colors">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact / Footer */}
        <footer className="py-32 bg-slate-100 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-200/50 dark:from-brand-900/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-display text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Ready to make an <span className="text-gradient">Impact?</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              {aiData.contact.ctaMessage}
            </p>
            <a 
              href={`mailto:${userData.contactEmail}`}
              className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Get In Touch <ArrowRight size={20} />
            </a>
            
            <div className="mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-600 text-sm">
              <p>Generated by FolioGen AI • {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};