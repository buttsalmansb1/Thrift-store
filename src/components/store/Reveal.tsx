'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const Reveal: React.FC<Props> = ({ children, className, delay = 0 }) => {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ margin: '-60px', once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
