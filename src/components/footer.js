export default function Footer() {
  return (
    <footer className="w-full py-6 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Propr. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
