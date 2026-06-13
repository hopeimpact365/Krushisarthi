"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset bar and animate it across the top of the screen on route change
    if (barRef.current) {
      gsap.killTweensOf(barRef.current);
      gsap.fromTo(
        barRef.current,
        { width: "0%", opacity: 1 },
        {
          width: "100%",
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.to(barRef.current, { opacity: 0, duration: 0.2 });
          }
        }
      );
    }

    // Entrance fade and slide animation for the page content
    if (contentRef.current) {
      gsap.killTweensOf(contentRef.current);
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        }
      );
    }
  }, [pathname]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0 w-full">
      {/* Premium GSAP top progress/loading bar */}
      <div 
        ref={barRef} 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-600 via-amber-800 to-amber-950 z-[9999] opacity-0 pointer-events-none"
        style={{ width: "0%" }}
      />
      <div ref={contentRef} className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}
