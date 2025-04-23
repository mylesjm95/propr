import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

// Navigation items
const navItems = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Contact", link: "#contact" },
];

export default async function Header() {
  // Get user session from server-side
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if user is logged in
  const isLoggedIn = !!user;

  return (
    <header className="fixed top-0 left-0 right-0 w-full border-b bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Skyscrapr</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, idx) => (
            <Link 
              key={`nav-item-${idx}`} 
              href={item.link}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}