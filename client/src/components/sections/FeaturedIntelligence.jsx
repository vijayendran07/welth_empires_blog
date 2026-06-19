import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const getCategoryStyles = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('tax')) return { text: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/30', shadow: 'group-hover:shadow-[0_8px_30px_-5px_rgba(139,92,246,0.2)]' };
  if (name.includes('trademark')) return { text: 'text-[#6EA8FE]', bg: 'bg-[#6EA8FE]/10', border: 'border-[#6EA8FE]/30', shadow: 'group-hover:shadow-[0_8px_30px_-5px_rgba(110,168,254,0.2)]' };
  if (name.includes('compliance')) return { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', shadow: 'group-hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.2)]' };
  if (name.includes('growth')) return { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', shadow: 'group-hover:shadow-[0_8px_30px_-5px_rgba(245,158,11,0.2)]' };
  if (name.includes('market')) return { text: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', shadow: 'group-hover:shadow-[0_8px_30px_-5px_rgba(59,130,246,0.2)]' };
  
  return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', shadow: 'hover:shadow-primary-glow' };
};

const FeaturedIntelligence = ({ articles = [] }) => {
  // We need at least 7 articles for the full bento grid. If not enough, duplicate to fill.
  let displayArticles = [...articles];
  while (displayArticles.length > 0 && displayArticles.length < 8) {
    displayArticles = [...displayArticles, ...articles];
  }
  
  if (displayArticles.length === 0) return null;

  const primary = displayArticles[0];
  const secondary = displayArticles.slice(1, 3);
  const supporting = displayArticles.slice(3, 7);
  const feed = displayArticles.slice(7, 12);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="max-w-[1600px] mx-auto px-gutter py-24 editorial-divider border-outline-variant/30">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block">Premium Editorial</span>
          <h2 className="font-display-xl text-[42px] font-bold text-on-surface tracking-tight leading-none">Featured Intelligence</h2>
        </div>
        <Link to="/articles" className="text-on-surface-variant font-bold text-[13px] uppercase tracking-[0.15em] hover:text-primary transition-colors flex items-center gap-2 group pb-1 border-b border-transparent hover:border-primary">
          Explore Archives <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* LEFT COLUMN: Primary (top) + Supporting (bottom) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* PRIMARY FEATURED REPORT */}
          <motion.div variants={itemVariants} className="h-[480px]">
            <Link to={`/article/${primary.slug}`} className={`block relative rounded-2xl overflow-hidden w-full h-full border border-outline-variant/30 bg-surface-container-low group transition-all duration-500 hover:-translate-y-1 ${getCategoryStyles(primary.category?.name).shadow}`}>
              <img 
                src={primary.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"} 
                alt={primary.title} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>
              
              <div className="absolute top-6 left-6 z-10">
                <span className={`backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${getCategoryStyles(primary.category?.name).bg} ${getCategoryStyles(primary.category?.name).text} ${getCategoryStyles(primary.category?.name).border}`}>
                  {primary.category?.name || 'Strategy'} • Featured Report
                </span>
              </div>

              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <h3 className="font-display-xl text-[44px] font-bold text-white leading-[1.1] mb-4 group-hover:text-primary transition-colors max-w-3xl">
                  {primary.title}
                </h3>
                <p className="text-white/70 text-[16px] max-w-2xl line-clamp-2 mb-6 hidden sm:block">
                  {primary.excerpt || 'Explore this comprehensive analysis providing strategic foresight into shifting regulatory landscapes and institutional capital frameworks.'}
                </p>
                
                <div className="flex items-center gap-6 text-white/60 text-[12px] font-medium border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                    </div>
                    <span>{primary.author?.name || 'Editorial Desk'}</span>
                  </div>
                  <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(primary.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                  <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {Math.ceil((primary.content?.split(' ').length || 1000) / 200)} min read</div>
                  <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">visibility</span> {primary.views || 1024} Readers</div>
                  
                  <div className="flex-1"></div>
                  <button className="hover:text-primary transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                  </button>
                  <button className="hover:text-primary transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined text-[16px]">share</span>
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* SUPPORTING CARDS (2x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {supporting.map((article, idx) => {
              const styles = getCategoryStyles(article.category?.name);
              return (
                <motion.div variants={itemVariants} key={idx} className="h-full">
                  <Link to={`/article/${article.slug}`} className={`group flex flex-col h-full bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 hover:bg-surface-container-low transition-all duration-300 ${styles.shadow}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`${styles.text} ${styles.bg} border ${styles.border} px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest`}>
                        {article.category?.name || 'Intelligence'}
                      </span>
                      <button className="text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-all -mt-1" onClick={(e) => e.preventDefault()}>
                        <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                      </button>
                    </div>
                    <h4 className="font-bold text-[18px] text-on-surface leading-tight mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-secondary text-[13px] line-clamp-2 mb-4 flex-1">
                      {article.excerpt || 'Deep-dive insights covering the latest shifts in global asset structuring and compliance mandates.'}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-outline font-medium pt-4 border-t border-outline-variant/30 mt-auto">
                      <span>{Math.ceil((article.content?.split(' ').length || 1000) / 200)} min read</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Secondary Featured (Vertical Stack) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {secondary.map((article, idx) => {
            const styles = getCategoryStyles(article.category?.name);
            return (
              <motion.div variants={itemVariants} key={idx} className="flex-1">
                <Link to={`/article/${article.slug}`} className={`block relative rounded-2xl overflow-hidden w-full h-full min-h-[350px] border border-outline-variant/30 bg-black group transition-all duration-500 hover:-translate-y-1 ${styles.shadow}`}>
                  <img 
                    src={article.coverImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600"} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] opacity-60 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent"></div>
                  
                  <div className="absolute top-5 left-5 z-10 flex gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1 ${styles.text}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      Editor's Pick
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <span className={`${styles.text} text-[10px] font-bold uppercase tracking-widest mb-3 block`}>
                      {article.category?.name || 'Markets'}
                    </span>
                    <h3 className="font-display-xl text-[26px] font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-white/50 text-[11px] font-medium mt-4">
                      <span>{Math.ceil((article.content?.split(' ').length || 1000) / 200)} min read</span>
                      <span>{article.views || 850} Readers</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>



      </motion.div>
    </section>
  );
};

export default FeaturedIntelligence;
