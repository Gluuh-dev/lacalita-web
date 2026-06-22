'use client';

import {motion, useReducedMotion} from 'framer-motion';

export default function Reveal({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : {opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.6, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  );
}
