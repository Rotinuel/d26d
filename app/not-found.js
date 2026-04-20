import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-8xl font-bold text-gold mb-4">404</p>
      <h1 className="font-display text-4xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <button className="bg-gold text-bg font-bold px-8 py-3 rounded-xl hover:bg-gold-dark transition-colors">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
