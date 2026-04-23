"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatCard {
  label: string;
  target: number;
  suffix: string;
  prefix: string;
  display: (n: number) => string;
  color: string;
  icon: string;
  milestone: string;
  milestoneDelay: number;
}

const stats: StatCard[] = [
  {
    label: "Check-in Time",
    target: 90,
    suffix: "s",
    prefix: "< ",
    display: (n) => String(n),
    color: "#028090",
    icon: "⚡",
    milestone: "< 60s target by Q3",
    milestoneDelay: 1.4,
  },
  {
    label: "Error Rate",
    target: 2,
    suffix: "%",
    prefix: "< ",
    display: (n) => String(n),
    color: "#02C39A",
    icon: "🎯",
    milestone: "< 0.5% by year-end",
    milestoneDelay: 1.55,
  },
  {
    label: "Staff Satisfaction",
    target: 85,
    suffix: "%",
    prefix: "",
    display: (n) => String(n),
    color: "#028090",
    icon: "😊",
    milestone: "Industry avg: 78%",
    milestoneDelay: 1.7,
  },
  {
    label: "Badge Reprints",
    target: 0,
    suffix: "",
    prefix: "",
    display: (n) => (n === 0 ? "Zero" : String(n)),
    color: "#02C39A",
    icon: "✅",
    milestone: "Save ~€2k per event",
    milestoneDelay: 1.85,
  },
];

function useCountUp(target: number, duration: number, delay: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    if (target === 0) return;
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
  const count = useCountUp(stat.target, 1200, 0.5 + index * 0.1);
  const [milestoneVisible, setMilestoneVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setMilestoneVisible(true),
      stat.milestoneDelay * 1000
    );
    return () => clearTimeout(timer);
  }, [stat.milestoneDelay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
      className="rounded-2xl p-6 flex flex-col gap-4 bg-white"
      style={{ boxShadow: "0 2px 16px rgba(13,61,58,0.08)" }}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-3">
        <span className="text-xl">{stat.icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5a7a78" }}>
          {stat.label}
        </span>
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-1">
        {stat.prefix && (
          <span className="text-lg font-bold" style={{ color: stat.color }}>
            {stat.prefix}
          </span>
        )}
        <span className="text-5xl font-black tabular-nums" style={{ color: "#0D3D3A" }}>
          {stat.display(count)}
        </span>
        {stat.suffix && (
          <span className="text-xl font-bold" style={{ color: stat.color }}>
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Milestone tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={milestoneVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="self-start text-xs font-semibold px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: `${stat.color}15`,
          color: stat.color,
          border: `1px solid ${stat.color}35`,
        }}
      >
        🚀 {stat.milestone}
      </motion.div>
    </motion.div>
  );
}

export default function Slide6Metrics() {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F4FAFA" }}>
      {/* Header */}
      <div className="px-12 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#028090" }}
        >
          Outcomes
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-3xl font-bold"
          style={{ color: "#0D3D3A" }}
        >
          Success Metrics
        </motion.h2>
      </div>

      {/* 2×2 grid */}
      <div className="flex-1 px-12 pb-14 grid grid-cols-2 gap-5">
        {stats.map((stat, i) => (
          <StatCardItem key={i} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}
