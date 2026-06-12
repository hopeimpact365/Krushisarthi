import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Welcome to {siteConfig.name}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        This is a minimal, performance-optimized, and SEO-ready foundation for your next modern business application.
      </p>
    </div>
  );
}
