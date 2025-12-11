import React, { useState } from 'react';
import { Download, Mail, Github, Linkedin, Loader2, ArrowRight } from 'lucide-react';
import { GeneratedPortfolio, UserInput } from '../types';

interface HeroProps {
  userData: UserInput;
  aiData: GeneratedPortfolio;
  isDarkMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({ userData, aiData, isDarkMode }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const element = document.getElementById('portfolio-preview');
    if (!element) return;

    setIsDownloading(true);

    const opt = {
      margin: 0,
      filename: `${userData.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        scrollY: 0,
        windowWidth: 1440, // Force desktop width to maintain layout
        backgroundColor: isDarkMode ? '#020617' : '#f8fafc', // Adaptive background
        allowTaint: true,
      },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      if (window.html2pdf) {
        // @ts-ignore
        await window.html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF automatically. Opening print dialog instead.");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 px-6 max-w-7xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-16 items-start md:items-center">
        <div className="flex-1 space-y-10 animate-fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold text-sm tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              {userData.currentRole}
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Hello, I'm <br />
              <span className="text-gradient">
                {userData.fullName}
              </span>
            </h1>
          </div>
          
          <div className="space-y-6 max-w-2xl">
            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 font-light leading-snug">
              {aiData.personalBrand.tagline}
            </p>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-slate-300 dark:border-slate-700 pl-6">
              {aiData.personalBrand.professionalSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href={`mailto:${userData.contactEmail}`}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-brand-50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              <Mail size={20} />
              Contact Me
            </a>
            
            <button 
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              data-html2canvas-ignore="true"
              className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white px-8 py-4 rounded-full font-medium hover:bg-slate-300 dark:hover:bg-slate-800 transition-all border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Save PDF
                </>
              )}
            </button>
            
            <div className="flex gap-2 ml-auto md:ml-4">
               {userData.githubUrl && (
                <a href={userData.githubUrl} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors">
                  <Github size={20} />
                </a>
              )}
              {userData.linkedinUrl && (
                <a href={userData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Modern Abstract Visual / Initial Avatar */}
        <div className="hidden md:flex w-1/3 justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-rust-500/10 to-honey-500/10 dark:from-brand-500/20 dark:via-rust-500/20 dark:to-honey-500/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 w-64 h-64 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
             {aiData.heroImage ? (
                <img src={aiData.heroImage} alt="AI Generated Professional Avatar" className="w-full h-full object-cover" />
             ) : (
                <span className="font-display text-8xl font-bold text-slate-700 select-none">
                  {getInitials(userData.fullName)}
                </span>
             )}
             
             {/* Floating cards */}
             <div className="absolute -right-12 top-10 p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 shadow-xl animate-float">
               <span className="text-brand-600 dark:text-brand-400 font-bold">Years Exp.</span>
               <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{userData.experience.length}+</div>
             </div>
             
             <div className="absolute -left-12 bottom-10 p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 shadow-xl animate-float animation-delay-2000">
               <span className="text-rust-600 dark:text-rust-400 font-bold">Projects</span>
               <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{userData.projects.length}</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};