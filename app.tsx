import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic2, 
  ShoppingBag, 
  Users, 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Music,
  Star,
  Flame,
  ChevronRight,
  Award
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import confetti from 'canvas-confetti';
import { Genre, GameState, Track, Item, Rapper } from './types';
import { RAPPERS, ITEMS, GRAMMY_DATE } from './constants';
import { cn } from './utils/cn';

// --- Components ---

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <div className="glass p-4 rounded-2xl flex items-center gap-4">
    <div className={cn("p-3 rounded-xl", color)}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-xl font-bold font-mono">{value}</p>
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerName: 'Young AI',
    money: 1000,
    fame: 0,
    skill: 10,
    charisma: 10,
    hype: 5,
    currentDate: new Date(2026, 0, 1), // Jan 1, 2026
    inventory: [],
    tracks: [],
    awards: [],
    isGameOver: false,
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'studio' | 'shop' | 'collabs' | 'awards'>('dashboard');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  // Game Loop: Advance time
  const nextDay = () => {
    setGameState(prev => {
      const nextDate = addDays(prev.currentDate, 1);
      
      // Check for Grammy
      if (nextDate.getMonth() === GRAMMY_DATE.month && nextDate.getDate() === GRAMMY_DATE.day) {
        checkGrammy(prev);
      }

      // Passive income/fame decay or growth
      const totalStreams = prev.tracks.reduce((acc, t) => acc + t.streams, 0);
      const passiveIncome = Math.floor(totalStreams * 0.001);
      
      return {
        ...prev,
        currentDate: nextDate,
        money: prev.money + passiveIncome,
        hype: Math.max(0, prev.hype - 0.5), // Hype decays slowly
      };
    });
  };

  const checkGrammy = (state: GameState) => {
    const bestTrack = [...state.tracks].sort((a, b) => b.streams - a.streams)[0];
    if (bestTrack && bestTrack.streams > 1000000 && Math.random() > 0.5) {
      const awardName = `Grammy ${state.currentDate.getFullYear()}`;
      setGameState(prev => ({
        ...prev,
        awards: [...prev.awards, awardName],
        fame: prev.fame + 5000,
        money: prev.money + 100000
      }));
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFFFFF']
      });
      showNotification(`🏆 YOU WON A GRAMMY FOR "${bestTrack.title}"!`, 'success');
    } else {
      showNotification("The Grammys were held today. Better luck next year!", 'info');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Actions ---

  const createTrack = (title: string, genre: Genre, featId?: string) => {
    const feat = RAPPERS.find(r => r.id === featId);
    const cost = 200 + (feat?.featPrice || 0);

    if (gameState.money < cost) {
      showNotification("Not enough money!", "error");
      return;
    }

    const quality = Math.floor((gameState.skill * 0.6) + (gameState.charisma * 0.2) + (Math.random() * 20));
    const initialHype = gameState.hype + (feat?.popularity || 0) * 0.5;
    const streams = Math.floor((quality * initialHype * 10) + (Math.random() * 1000));

    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      genre,
      featId,
      releaseDate: gameState.currentDate,
      streams,
      revenue: Math.floor(streams * 0.005),
      quality,
      hype: initialHype,
    };

    setGameState(prev => ({
      ...prev,
      money: prev.money - cost,
      tracks: [newTrack, ...prev.tracks],
      fame: prev.fame + Math.floor(streams / 100),
      skill: prev.skill + 2,
      hype: prev.hype + 10,
    }));

    showNotification(`Track "${title}" released!`, "success");
    setActiveTab('dashboard');
  };

  const buyItem = (item: Item) => {
    if (gameState.money < item.price) {
      showNotification("Not enough money!", "error");
      return;
    }
    if (gameState.inventory.includes(item.id)) {
      showNotification("You already own this!", "error");
      return;
    }

    setGameState(prev => ({
      ...prev,
      money: prev.money - item.price,
      inventory: [...prev.inventory, item.id],
      hype: prev.hype + (item.bonus.hype || 0),
      charisma: prev.charisma + (item.bonus.charisma || 0),
      skill: prev.skill + (item.bonus.skill || 0),
    }));

    showNotification(`Bought ${item.name}!`, "success");
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-zinc-950 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic uppercase">Rap Star</h1>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <Calendar size={12} />
            {format(gameState.currentDate, 'MMMM d, yyyy')}
          </div>
        </div>
        <button 
          onClick={nextDay}
          className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
        >
          Next Day <ChevronRight size={14} />
        </button>
      </header>

      {/* Stats Grid */}
      <div className="px-6 grid grid-cols-2 gap-3 z-10">
        <StatCard icon={DollarSign} label="Money" value={`$${gameState.money.toLocaleString()}`} color="bg-emerald-500" />
        <StatCard icon={Star} label="Fame" value={gameState.fame.toLocaleString()} color="bg-blue-500" />
        <StatCard icon={Flame} label="Hype" value={Math.floor(gameState.hype)} color="bg-orange-500" />
        <StatCard icon={Trophy} label="Awards" value={gameState.awards.length} color="bg-yellow-500" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto z-10 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Music size={18} className="text-purple-400" /> Recent Tracks
                </h2>
                {gameState.tracks.length === 0 ? (
                  <div className="glass p-8 rounded-2xl text-center text-zinc-500 italic">
                    No tracks released yet. Go to the studio!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gameState.tracks.slice(0, 5).map(track => (
                      <div key={track.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="font-bold">{track.title}</p>
                          <p className="text-xs text-zinc-500">{track.genre} • {format(track.releaseDate, 'MMM d')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-emerald-400">{(track.streams / 1000).toFixed(1)}K streams</p>
                          <p className="text-[10px] text-zinc-500">Quality: {track.quality}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-blue-400" /> Inventory
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {gameState.inventory.length === 0 ? (
                    <div className="col-span-4 glass p-4 rounded-2xl text-center text-zinc-500 text-sm">
                      Empty pockets.
                    </div>
                  ) : (
                    gameState.inventory.map(id => {
                      const item = ITEMS.find(i => i.id === id);
                      return (
                        <div key={id} className="aspect-square glass rounded-xl overflow-hidden p-1">
                          <img src={item?.image} alt={item?.name} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'studio' && <StudioView onCreate={createTrack} money={gameState.money} />}
          {activeTab === 'shop' && <ShopView onBuy={buyItem} money={gameState.money} ownedIds={gameState.inventory} />}
          {activeTab === 'collabs' && <CollabsView onFeat={(r) => showNotification(`Selected ${r.name} for next track!`, 'info')} rappers={RAPPERS} />}
          {activeTab === 'awards' && <AwardsView awards={gameState.awards} />}
        </AnimatePresence>
      </main>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-24 left-6 right-6 p-4 rounded-2xl z-50 shadow-2xl border flex items-center gap-3",
              notification.type === 'success' ? "bg-emerald-500/90 border-emerald-400 text-white" : 
              notification.type === 'error' ? "bg-red-500/90 border-red-400 text-white" : 
              "bg-blue-500/90 border-blue-400 text-white"
            )}
          >
            {notification.type === 'success' ? <Trophy size={20} /> : <Award size={20} />}
            <p className="text-sm font-bold">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-white/10 p-4 flex justify-around items-center z-40 rounded-t-3xl">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={TrendingUp} label="Stats" />
        <NavButton active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} icon={Mic2} label="Studio" />
        <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={ShoppingBag} label="Shop" />
        <NavButton active={activeTab === 'collabs'} onClick={() => setActiveTab('collabs')} icon={Users} label="Collabs" />
        <NavButton active={activeTab === 'awards'} onClick={() => setActiveTab('awards')} icon={Trophy} label="Grammy" />
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-white scale-110" : "text-zinc-500 hover:text-zinc-300"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    {active && <motion.div layoutId="nav-pill" className="w-1 h-1 bg-white rounded-full mt-1" />}
  </button>
);

// --- Sub-Views ---

const StudioView = ({ onCreate, money }: { onCreate: (t: string, g: Genre, f?: string) => void, money: number }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre>(Genre.TRAP);
  const [featId, setFeatId] = useState<string | undefined>(undefined);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-black italic uppercase">The Studio</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Track Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter banger name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Genre</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Genre).map(g => (
              <button 
                key={g}
                onClick={() => setGenre(g)}
                className={cn(
                  "p-3 rounded-xl text-sm font-bold border transition-all",
                  genre === g ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-zinc-400"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Feature (Optional)</label>
          <select 
            value={featId || ''} 
            onChange={(e) => setFeatId(e.target.value || undefined)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none"
          >
            <option value="" className="bg-zinc-900">Solo Track</option>
            {RAPPERS.map(r => (
              <option key={r.id} value={r.id} className="bg-zinc-900">
                {r.name} (${(r.featPrice / 1000).toFixed(0)}K)
              </option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => title && onCreate(title, genre, featId)}
          disabled={!title}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-purple-900/20 transition-all mt-4"
        >
          Release Track ($200)
        </button>
      </div>
    </motion.div>
  );
};

const ShopView = ({ onBuy, money, ownedIds }: { onBuy: (i: Item) => void, money: number, ownedIds: string[] }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-black italic uppercase">Luxury Shop</h2>
      <div className="space-y-4">
        {ITEMS.map(item => {
          const owned = ownedIds.includes(item.id);
          return (
            <div key={item.id} className="glass p-4 rounded-2xl flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-zinc-500">
                  {Object.entries(item.bonus).map(([k, v]) => `+${v} ${k}`).join(', ')}
                </p>
              </div>
              <button 
                onClick={() => onBuy(item)}
                disabled={owned || money < item.price}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-black uppercase transition-all",
                  owned ? "bg-zinc-800 text-zinc-500" : "bg-white text-black hover:bg-zinc-200"
                )}
              >
                {owned ? 'Owned' : `$${item.price.toLocaleString()}`}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const CollabsView = ({ rappers, onFeat }: { rappers: Rapper[], onFeat: (r: Rapper) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-black italic uppercase">Collaborations</h2>
      <p className="text-xs text-zinc-500">Connect with the industry giants. A feature can boost your streams significantly.</p>
      <div className="space-y-4">
        {rappers.map(rapper => (
          <div key={rapper.id} className="glass p-4 rounded-2xl flex gap-4 items-center">
            <img src={rapper.avatar} alt={rapper.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <p className="font-bold">{rapper.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400">{rapper.genre}</span>
                <span className="text-[10px] text-blue-400 font-bold">{rapper.popularity}% Popularity</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono font-bold">${(rapper.featPrice / 1000).toFixed(0)}K</p>
              <p className="text-[10px] text-zinc-500 uppercase">Feat Price</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AwardsView = ({ awards }: { awards: string[] }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center space-y-2 py-8">
        <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-4">
          <Trophy size={48} className="text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Grammy Awards</h2>
        <p className="text-sm text-zinc-400">The most prestigious award in the industry.</p>
        <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest mt-4">
          <Calendar size={14} /> Next Ceremony: Feb 2nd
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Your Collection</h3>
        {awards.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/5">
            <p className="text-zinc-600 italic">No awards yet. Keep grinding.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {awards.map((award, idx) => (
              <motion.div 
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="glass p-6 rounded-3xl text-center gold-glow border-yellow-500/30"
              >
                <Award size={32} className="text-yellow-500 mx-auto mb-2" />
                <p className="font-black text-sm uppercase italic">{award}</p>
                <p className="text-[10px] text-zinc-500">Artist of the Year</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
