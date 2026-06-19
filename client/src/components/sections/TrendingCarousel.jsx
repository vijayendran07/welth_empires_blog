import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '../cards/ArticleCard';

const TrendingCarousel = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayArticles = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];
    let result = [...articles];
    // Ensure we have at least 3 items for the 3D wheel to render all slots
    while (result.length < 3) {
      result = [...result, ...articles];
    }
    return result;
  }, [articles]);

  // Auto-play functionality
  useEffect(() => {
    if (isHovered || displayArticles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isHovered, displayArticles.length]);

  if (displayArticles.length === 0) return null;

  // Render cards
  return (
    <div 
      className="w-full h-[550px] flex items-center justify-center relative overflow-hidden bg-transparent"
      style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence initial={false}>
          {displayArticles.map((article, index) => {
            // Calculate relative offset based on circular array
            let offset = index - currentIndex;
            // Adjust for wrap-around
            if (offset < -1) offset += displayArticles.length;
            if (offset > 1) offset -= displayArticles.length;
            
            // Only render visible cards (-1, 0, 1)
            if (offset < -1 || offset > 1) return null;

            // Base properties
            let translateX = 0;
            let scale = 1;
            let rotateY = 0;
            let zIndex = 0;
            let opacity = 0;
            let brightness = 1;

            if (offset === 0) {
              // Center card
              translateX = 0;
              scale = 1;
              rotateY = 0;
              zIndex = 50;
              opacity = 1;
              brightness = 1;
            } else if (offset === -1) {
              // Left card
              translateX = -140;
              scale = 0.88;
              rotateY = 18;
              zIndex = 40;
              opacity = 0.9;
              brightness = 0.7;
            } else if (offset === 1) {
              // Right card
              translateX = 140;
              scale = 0.88;
              rotateY = -18;
              zIndex = 40;
              opacity = 0.9;
              brightness = 0.7;
            }

            const isCenter = offset === 0;

            return (
              <motion.div
                key={article.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -5000 || offset.x < -50) {
                    setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
                  } else if (swipe > 5000 || offset.x > 50) {
                    setCurrentIndex((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
                  }
                }}
                initial={false}
                animate={{
                  x: translateX,
                  scale: scale,
                  rotateY: rotateY,
                  zIndex: zIndex,
                  opacity: opacity,
                  filter: `brightness(${brightness})`,
                  y: isCenter && isHovered ? -10 : 0
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="absolute cursor-pointer rounded-[20px] overflow-hidden"
                style={{
                  width: '280px',
                  height: '425px',
                  boxShadow: isCenter ? '0 30px 60px rgba(0,0,0,0.25)' : '0 10px 30px rgba(0,0,0,0.15)',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
              >
                <div className={`w-full h-full ${!isCenter ? 'pointer-events-none' : ''}`}>
                  <ArticleCard article={article} darkVariant={true} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrendingCarousel;
