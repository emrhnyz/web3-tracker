"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Twitter, Info, Plus, Lock, Unlock, X, Rocket, Hash, Trash2 } from "lucide-react";

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

  const handleLogin = () => {
    if (passwordInput === "apopiçtir") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput("");
    } else {
      alert("Hatalı kod!");
    }
  };

  // SİLME FONKSİYONU
  const handleDelete = async (id) => {
    if (window.confirm("Bu projeyi kalıcı olarak silmek istediğine emin misin?")) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchProjects(); // Listeyi yenile
      } else {
        alert("Silinirken hata oluştu: " + error.message);
      }
    }
  };

  const handleAddProject = async () => {
    if (!formData.name || !formData.category) return alert("İsim ve Kategori şart!");

    const { error } = await supabase.from('projects').insert([formData]);

    if (!error) {
      setShowAddModal(false);
      setFormData({ category: "", name: "", drophunt_link: "", twitter_link: "", notes: "" });
      fetchProjects();
    } else {
      alert("Hata: " + error.message);
    }
  };

  // Arka plan görsel URL'i (Gönderdiğin görselin adresi)
  const bgImageUrl = "/backg.png";

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-green-500/30 selection:text-green-200 relative overflow-x-hidden">
      
      {/* --- ARKA PLAN KATMANLARI --- */}
      
      {/* 1. Ana Görsel (En altta) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-30 scale-105 blur-sm"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* 2. Karartma Perdesi (Görselin üzerinde) */}
      <div className="fixed inset-0 bg-black/85 -z-20" />

      {/* 3. Grid ve Işık Efektleri (Perdenin üzerinde, doku katar) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#22c55e15,transparent)] pointer-events-none -z-10" />

      {/* --- Header --- */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-30 bg-black/30">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">
              WEB3 <span className="text-green-500 font-mono">//</span> TRACKER
            </h1>
          </div>
          
          <div>
            {!isAdmin ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="group flex items-center gap-2 text-xs font-bold tracking-wider bg-zinc-900/80 hover:bg-zinc-800 px-4 py-2 rounded border border-white/10 transition-all hover:border-green-500/50"
              >
                <Lock size={14} className="text-gray-500 group-hover:text-green-500 transition-colors" /> 
                GİRİŞ
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-green-500 font-mono bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1 backdrop-blur">
                  <Unlock size={10} /> ADMIN ACTIVE
                </span>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-black px-5 py-2 rounded font-bold text-sm transition flex items-center gap-2"
                >
                  <Plus size={18} strokeWidth={3} /> YENİ EKLE
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- Ana Liste --- */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-4">
          
          {/* Liste Başlığı */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-widest px-4 mb-2">
            <span>Projeler Listesi</span>
            <span>{projects.length} Kayıt</span>
          </div>

          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="group relative bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-green-500/40 hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.2)]"
            >
              {/* SİLME BUTONU */}
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(proj.id)}
                  className="absolute -top-2 -right-2 bg-red-900/90 hover:bg-red-600 text-red-200 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg border border-red-500/30 z-20 backdrop-blur"
                  title="Projeyi Sil"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Sol Taraf */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-bold text-gray-300 group-hover:text-green-400 group-hover:border-green-500/30 transition-colors font-mono tracking-wide">
                      <Hash size={10} className="mr-1 opacity-50" />
                      {proj.category}
                    </span>
                    {/* Bilgi İkonu */}
                    <div className="relative group/info">
                      <Info size={14} className="text-gray-600 hover:text-gray-300 cursor-help transition-colors" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/info:opacity-100 transition-opacity bg-black/90 border border-white/20 text-[10px] text-gray-300 px-3 py-1.5 rounded whitespace-nowrap pointer-events-none z-10 backdrop-blur">
                        {new Date(proj.created_at).toLocaleDateString("tr-TR")} tarihinde eklendi
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-50 flex items-center gap-2">
                    {proj.name}
                  </h3>
                </div>

                {/* Orta: Notlar */}
                <div className="flex-1 text-sm text-gray-300/80 font-light leading-relaxed border-l border-white/10 pl-6 md:line-clamp-2 line-clamp-3">
                  {proj.notes || "Not girilmemiş..."}
                </div>

                {/* Sağ Taraf: Butonlar */}
                <div className="flex items-center gap-3 shrink-0">
                  {proj.drophunt_link && (
                    <a 
                      href={proj.drophunt_link} 
                      target="_blank" 
                      className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/80 hover:text-white text-blue-400 border border-blue-500/20 hover:border-blue-500 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide backdrop-blur"
                    >
                      <Rocket size={14} />
                      DropHunt
                    </a>
                  )}
                  
                  {proj.twitter_link && (
                    <a 
                      href={proj.twitter_link} 
                      target="_blank" 
                      className="p-2 rounded-lg bg-zinc-800/50 text-gray-400 hover:bg-sky-500/80 hover:text-white transition-all border border-white/10 hover:border-sky-400 backdrop-blur"
                      title="Twitter'a Git"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-xl bg-black/20 backdrop-blur-sm">
              <div className="text-gray-500 font-mono text-sm">Sistemde henüz kayıtlı proje yok.</div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODALLAR --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900/90 border border-white/10 p-6 rounded-xl w-80 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Yönetici Girişi</h3>
              <button onClick={() => setShowLoginModal(false)}><X size={18} className="text-gray-500 hover:text-white" /></button>
            </div>
            <input 
              type="password" 
              placeholder="Giriş kodunu giriniz..." 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition mb-4 text-sm font-mono"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={handleLogin} className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-gray-200 transition">
              Doğrula
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900/90 border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-[0_0_50px_-20px_rgba(34,197,94,0.3)]">
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="text-green-500" /> PROJE EKLE
              </h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} className="text-gray-500 hover:text-white transition" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">Kategori</label>
                  <input 
                    placeholder="Örn: GameFi" 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm transition focus:bg-black"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">Proje İsmi</label>
                  <input 
                    placeholder="Örn: Kyuzo's Friends" 
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm transition focus:bg-black"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                 <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">Bağlantılar</label>
                 <div className="flex gap-2">
                  <input 
                    placeholder="DropHunt Linki" 
                    className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none text-sm transition focus:bg-black"
                    value={formData.drophunt_link} onChange={e => setFormData({...formData, drophunt_link: e.target.value})}
                  />
                  <input 
                    placeholder="Twitter Linki" 
                    className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none text-sm transition focus:bg-black"
                    value={formData.twitter_link} onChange={e => setFormData({...formData, twitter_link: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider ml-1">Notlar</label>
                <textarea 
                  placeholder="Proje hakkında önemli detaylar..." 
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm resize-none transition focus:bg-black"
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <button onClick={handleAddProject} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-lg mt-4 transition shadow-lg shadow-green-900/20">
                LİSTEYE KAYDET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}