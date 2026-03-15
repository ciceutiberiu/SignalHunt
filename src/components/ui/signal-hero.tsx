"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/helpers";

interface FloatingIcon {
  icon: React.ReactNode;
  label: string;
  position: { x: string; y: string };
}

interface SignalHeroProps {
  badge?: React.ReactNode;
  title: string;
  highlightedText?: string;
  subtitle: string;
  ctaButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  floatingIcons?: FloatingIcon[];
  bottomContent?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SignalHero({
  badge,
  title,
  highlightedText,
  subtitle,
  ctaButton,
  secondaryButton,
  floatingIcons = [],
  bottomContent,
  className,
  children,
}: SignalHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[90vh] flex flex-col overflow-hidden",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, #0A0500 0%, #1A0F00 50%, #2A1500 100%)",
      }}
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "600px",
            height: "600px",
            left: "20%",
            top: "30%",
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32">
          {/* Floating Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute hidden lg:flex flex-col items-center gap-2"
              style={{
                left: item.position.x,
                top: item.position.y,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -20, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + index * 0.15 },
                scale: { duration: 0.6, delay: 0.3 + index * 0.15 },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(249, 115, 22, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(249, 115, 22, 0.25)",
                  boxShadow: "0 0 40px rgba(249, 115, 22, 0.3)",
                }}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                {item.label}
              </span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-4xl gap-8"
          >
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {badge}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-semibold text-white leading-[1.15] tracking-tight"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
              {highlightedText && (
                <>
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #f97316 0%, #fbbf24 50%, #f97316 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                    }}
                  >
                    {highlightedText}
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/60 max-w-lg leading-relaxed"
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
              }}
            >
              {subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {ctaButton && (
                <motion.a
                  href={ctaButton.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={ctaButton.onClick}
                  className="px-8 py-3.5 rounded-lg text-white font-medium text-[15px] cursor-pointer text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    boxShadow:
                      "0 4px 24px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.1)",
                  }}
                >
                  {ctaButton.label}
                </motion.a>
              )}
              {secondaryButton && (
                <motion.a
                  href={secondaryButton.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={secondaryButton.onClick}
                  className="px-8 py-3.5 rounded-lg text-white font-medium text-[15px] cursor-pointer text-center transition-colors hover:bg-white/10"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {secondaryButton.label}
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Bottom content */}
      {bottomContent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 pb-16"
        >
          {bottomContent}
        </motion.div>
      )}
    </section>
  );
}
