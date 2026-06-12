import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
