import React from 'react';
import { motion } from 'framer-motion';

const SpaceBackground = ({ small = false }) => {
  const shapes = small 
    ? [
        { id: 1, w: 80, h: 80, t: '15%', l: '25%', r: '30%', d: 0, dur: 45 },
        { id: 2, w: 60, h: 60, t: '70%', l: '80%', r: '50%', d: 8, dur: 50 },
        { id: 3, w: 40, h: 40, t: '80%', l: '10%', r: '30%', d: 4, dur: 40 },
      ]
    : [
        { id: 1, w: 200, h: 200, t: '10%', l: '15%', r: '30%', d: 0, dur: 25 },
        { id: 2, w: 150, h: 150, t: '60%', l: '75%', r: '50%', d: 5, dur: 30 },
        { id: 3, w: 100, h: 100, t: '70%', l: '10%', r: '30%', d: 2, dur: 20 },
        { id: 4, w: 80, h: 80, t: '30%', l: '85%', r: '40%', d: 8, dur: 35 },
        { id: 5, w: 120, h: 120, t: '80%', l: '40%', r: '60%', d: 12, dur: 28 },
      ];

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            width: shape.w,
            height: shape.h,
            top: shape.t,
            left: shape.l,
            borderRadius: shape.r,
            background: 'linear-gradient(45deg, hsla(var(--primary), 0.05), hsla(var(--secondary), 0.1))',
            boxShadow: '0 0 20px 5px hsla(var(--primary), 0.03)',
          }}
          animate={{
            y: [0, Math.random() * 40 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, Math.random() * 180 - 90, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: shape.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.d,
          }}
        />
      ))}
    </div>
  );
};

export default SpaceBackground;