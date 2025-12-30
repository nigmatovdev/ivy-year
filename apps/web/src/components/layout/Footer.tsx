export function Footer() {
  return (
    <footer className="border-t border-ivy-200 bg-ivy-950 text-ivy-100 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ivy-300 text-center">
            © {new Date().getFullYear()} Ivyonaire. All rights reserved.
          </p>
          <p className="text-xs text-ivy-400 text-center">
            Premium Education Progress Tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
