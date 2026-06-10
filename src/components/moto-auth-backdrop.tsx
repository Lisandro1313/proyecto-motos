"use client";

import type { ReactNode } from "react";

const nodes = [
  [6, 18],
  [14, 36],
  [24, 10],
  [28, 62],
  [38, 24],
  [48, 45],
  [58, 13],
  [66, 70],
  [76, 30],
  [86, 12],
  [92, 54],
  [12, 76],
  [34, 88],
  [72, 86],
] as const;

const lines = [
  [6, 18, 14, 36],
  [24, 10, 38, 24],
  [48, 45, 58, 13],
  [66, 70, 76, 30],
  [86, 12, 92, 54],
  [12, 76, 34, 88],
  [72, 86, 66, 70],
] as const;

export function MotoAuthBackdrop({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09111f]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#0b1324_0%,#0f2f4f_40%,#0f766e_72%,#2f8f46_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-55"
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map(([x1, y1, x2, y2], index) => (
          <line
            key={`line-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.12"
          />
        ))}
        {nodes.map(([cx, cy], index) => (
          <circle
            key={`node-${index}`}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 0.45 : 0.28}
            fill="rgba(255,255,255,0.82)"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(7,11,22,0.38),transparent)]" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
