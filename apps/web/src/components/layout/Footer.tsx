export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Ivyonaire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

