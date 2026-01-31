"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Twitter, Info, Plus, Lock, Unlock, X } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  // Form verileri
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    drophunt_link: "",
    twitter_link: "",
    notes: ""
  });

  // Verileri çekme fonksiyonu
  const fetchProjects = async () => {
    let { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Giriş Yapma Logiği
  const handleLogin = () => {
    if (passwordInput === "apopiçtir") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput("");
    } else {
      alert("Hatalı kod, yetkisiz giriş!");
    }
  };

  // Proje Ekleme Logiği
  const handleAddProject = async () => {
    if (!formData.name || !formData.category) return alert("İsim ve Kategori şart!");

    const { error } = await supabase
      .from('projects')
      .insert([formData]);

    if (!error) {
      setShowAddModal(false);
      setFormData({ category: "", name: "", drophunt_link: "", twitter_link: "", notes: "" });
      fetchProjects(); // Listeyi yenile
    } else {
      alert("Hata oluştu: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-green-500 selection:text-black">
      {/* Arka Plan Efekti */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black -z-10 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            WEB3 // TRACKER
          </h1>
          
          <div>
            {!isAdmin ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-xs font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition border border-white/5"
              >
                <Lock size={14} /> GİRİŞ
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-500 font-mono flex items-center gap-1">
                  <Unlock size={14} /> DÜZENLEME MODU
                </span>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-500 text-black px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2"
                >
                  <Plus size={16} /> PROJE EKLE
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Liste Alanı */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider border-b border-white/10">
                <th className="pb-3 pl-4">Kategori</th>
                <th className="pb-3">Proje İsmi</th>
                <th className="pb-3">Bağlantılar</th>
                <th className="pb-3 w-1/3">Notlar</th>
                <th className="pb-3 text-right pr-4">Bilgi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((proj) => (
                <tr key={proj.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-4">
                    <span className="inline-block px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5 font-mono">
                      {proj.category}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-white">{proj.name}</td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      {proj.drophunt_link && (
                        <a href={proj.drophunt_link} target="_blank" className="text-gray-400 hover:text-blue-400 transition" title="DropHunt">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {proj.twitter_link && (
                        <a href={proj.twitter_link} target="_blank" className="text-gray-400 hover:text-blue-400 transition" title="Twitter">
                          <Twitter size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-400 leading-relaxed">{proj.notes}</td>
                  <td className="py-4 text-right pr-4 relative">
                    <div className="group/info inline-block">
                      <Info size={16} className="text-gray-600 group-hover/info:text-green-500 cursor-help transition" />
                      {/* Tooltip */}
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/info:opacity-100 transition-opacity bg-zinc-900 border border-white/10 text-[10px] text-gray-400 px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-xl">
                        Eklendi: {new Date(proj.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-20 text-gray-600 font-mono text-sm">
              Henüz proje eklenmemiş.
            </div>
          )}
        </div>
      </main>

      {/* Giriş Modalı */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-80 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Yönetici Girişi</h3>
              <button onClick={() => setShowLoginModal(false)}><X size={18} className="text-gray-500 hover:text-white" /></button>
            </div>
            <input 
              type="password" 
              placeholder="Giriş kodunu giriniz..." 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-green-500 transition mb-4 text-sm font-mono"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={handleLogin} className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-gray-200 transition">
              Doğrula
            </button>
          </div>
        </div>
      )}

      {/* Proje Ekleme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-green-400 tracking-wide">YENİ PROJE EKLE</h3>
              <button onClick={() => setShowAddModal(false)}><X size={18} className="text-gray-500 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <input 
                placeholder="Kategori (örn: Layer2, DeFi)" 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              />
              <input 
                placeholder="Proje İsmi" 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="flex gap-2">
                <input 
                  placeholder="DropHunt Linki" 
                  className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm"
                  value={formData.drophunt_link} onChange={e => setFormData({...formData, drophunt_link: e.target.value})}
                />
                <input 
                  placeholder="Twitter Linki" 
                  className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm"
                  value={formData.twitter_link} onChange={e => setFormData({...formData, twitter_link: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="Notlar..." 
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm resize-none"
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
              />
              <button onClick={handleAddProject} className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg mt-2 transition">
                Listeye Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}