"use client";
import React from 'react';

export default function AnimatedBackground() {
  return (
    <>
      <div className="liquid-bg pointer-events-none opacity-90">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>
      <div className="bg-grid pointer-events-none opacity-50"></div>
    </>
  );
}