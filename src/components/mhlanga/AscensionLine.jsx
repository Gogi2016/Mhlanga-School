import React from 'react';

// Thin ochre->cyan ascension line that grows with scroll progress.
export default function AscensionLine({ progress = 0 }) {
  return (
    <div
      className="ascension-line"
      style={{ height: `${progress}%` }}
      aria-hidden="true"
    />
  );
}