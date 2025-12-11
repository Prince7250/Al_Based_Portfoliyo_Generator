import React, { useState } from 'react';
import { Plus, Trash2, Wand2, ChevronRight, User, Briefcase, Code, ImageIcon } from 'lucide-react';
import { UserInput, ExperienceInput, ProjectInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInput>({
    fullName: '',
    currentRole: '',
    bioRaw: '',
    skillsRaw: '',
    experience: [],
    projects: [],
    contactEmail: '',
    githubUrl: '',
    linkedinUrl: '',
    imageSize: '1K'
  });

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Experience Handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }
      ]
    }));
  };

  const updateExperience = (id: string, field: keyof ExperienceInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Project Handlers
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), title: '', techStack: '', description: '' }
      ]
    }));
  };

  const updateProject = (id: string, field: keyof ProjectInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-10 px-4">
       {[
         { num: 1, label: 'Profile', icon: User },
         { num: 2, label: 'Experience', icon: Briefcase },
         { num: 3, label: 'Projects', icon: Code }
       ].map((item, idx) => {
         const isActive = step >= item.num;
         const isCurrent = step === item.num;
         return (
           <div key={item.num} className="flex flex-col items-center relative z-10">
             <div 
               className={`
                 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                 ${isActive ? 'bg-gradient-to-br from-brand-500 to-rust-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}
                 ${isCurrent ? 'scale-110 ring-2 ring-rust-500 ring-offset-2 ring-offset-slate-900' : ''}
               `}
             >
               <item.icon size={20} />
             </div>
             <span className={`mt-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600'}`}>
               {item.label}
             </span>
           </div>
         );
       })}
       
       {/* Connecting line */}
       <div className="absolute top-14 left-0 w-full px-16 h-0.5 z-0">
          <div className="relative w-full h-full bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 via-rust-500 to-honey-500 transition-all duration-500 ease-out"
               style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
             />
          </div>
       </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
          <input
            required
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleBasicChange}
            className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
            placeholder="e.g. Alex Chen"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Current Role</label>
          <input
            required
            type="text"
            name="currentRole"
            value={formData.currentRole}
            onChange={handleBasicChange}
            className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Contact Email</label>
        <input
          required
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleBasicChange}
          className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
          placeholder="alex@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleBasicChange}
            className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
            placeholder="https://github.com/alexchen"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">LinkedIn URL</label>
          <input
            type="url"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleBasicChange}
            className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
            placeholder="https://linkedin.com/in/alexchen"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Short Bio</label>
           <textarea
             required
             name="bioRaw"
             value={formData.bioRaw}
             onChange={handleBasicChange}
             rows={3}
             className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
             placeholder="Tell us a bit about yourself. Don't worry about polishing it, AI will handle that."
           />
        </div>
        <div className="flex flex-col">
           <label className="block text-xs font-bold text-brand-400 mb-2 uppercase tracking-widest flex items-center gap-2">
             <ImageIcon size={14} /> Profile Image Generation
           </label>
           <div className="flex-1 glass-input rounded-xl p-4 flex flex-col justify-center">
             <p className="text-xs text-slate-400 mb-3">
               We use <strong>gemini-3-pro-image-preview</strong> (Nano Banana Pro) to generate a custom 3D avatar for your portfolio.
             </p>
             <select
               name="imageSize"
               value={formData.imageSize}
               onChange={handleBasicChange}
               className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
             >
               <option value="1K">1K Resolution (Standard)</option>
               <option value="2K">2K Resolution (High)</option>
               <option value="4K">4K Resolution (Ultra)</option>
             </select>
           </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Skills (Comma Separated)</label>
        <textarea
          required
          name="skillsRaw"
          value={formData.skillsRaw}
          onChange={handleBasicChange}
          rows={2}
          className="w-full glass-input rounded-xl p-4 text-white placeholder-slate-500"
          placeholder="React, TypeScript, Node.js, AWS, Team Leadership, Agile"
        />
      </div>

      <div className="flex justify-end pt-4">
         <button
          type="button"
          onClick={() => setStep(2)}
          className="group flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 hover:border-rust-500/50"
        >
          Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Work History</h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rust-500/10 text-rust-400 hover:bg-rust-500/20 font-medium transition-colors border border-rust-500/20"
        >
          <Plus size={16} /> Add Position
        </button>
      </div>

      {formData.experience.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No experience added yet. Click "Add Position" to start.</p>
        </div>
      )}

      <div className="space-y-4">
        {formData.experience.map((exp, index) => (
          <div key={exp.id} className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="flex justify-between items-start">
               <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">Position {index + 1}</span>
               <button type="button" onClick={() => removeExperience(exp.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                 <Trash2 size={18} />
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="glass-input rounded-lg p-3 text-white text-sm"
              />
              <input
                placeholder="Role Title"
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                className="glass-input rounded-lg p-3 text-white text-sm"
              />
              <input
                placeholder="Duration (e.g. 2020 - Present)"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                className="glass-input rounded-lg p-3 text-white text-sm md:col-span-2"
              />
            </div>
            <textarea
              placeholder="Describe what you did..."
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              className="w-full glass-input rounded-lg p-3 text-white text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-800/50">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-slate-400 hover:text-white transition-colors font-medium"
        >
          Back
        </button>
         <button
          type="button"
          onClick={() => setStep(3)}
          className="group flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 hover:border-rust-500/50"
        >
          Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Key Projects</h3>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-honey-500/10 text-honey-400 hover:bg-honey-500/20 font-medium transition-colors border border-honey-500/20"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {formData.projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-slate-500">
           <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
           <p>No projects added yet. Showcase your best work.</p>
        </div>
      )}

      <div className="space-y-4">
        {formData.projects.map((proj, index) => (
          <div key={proj.id} className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="flex justify-between items-start">
               <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">Project {index + 1}</span>
               <button type="button" onClick={() => removeProject(proj.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                 <Trash2 size={18} />
               </button>
            </div>
            <input
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
              className="w-full glass-input rounded-lg p-3 text-white text-sm font-medium"
            />
            <input
              placeholder="Tech Stack (e.g. React, Python, AWS)"
              value={proj.techStack}
              onChange={(e) => updateProject(proj.id, 'techStack', e.target.value)}
              className="w-full glass-input rounded-lg p-3 text-white text-sm"
            />
            <textarea
              placeholder="What does this project do? What was your role?"
              value={proj.description}
              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
              className="w-full glass-input rounded-lg p-3 text-white text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-800/50">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-slate-400 hover:text-white transition-colors font-medium"
        >
          Back
        </button>
         <button
          type="submit"
          disabled={isGenerating}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-brand-600 to-rust-600 hover:from-brand-500 hover:to-rust-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transform hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 skew-x-12 -translate-x-full" />
          {isGenerating ? 'Generating...' : (
            <>
              <Wand2 size={20} /> Generate Portfolio
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="glass w-full max-w-4xl mx-auto p-8 md:p-12 rounded-3xl relative">
      {renderStepIndicator()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </form>
  );
};