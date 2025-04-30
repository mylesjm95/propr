import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AuthModalButton } from "@/components/auth/AuthModalButton";
import ClientHeader from "./ClientHeader";

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
  
  // We need to determine if the current page has a dark hero section
  // For now, we'll use a dynamic approach with client-side header
  return (
    <ClientHeader user={user} />
  );
}

// User dropdown component for authenticated users
function UserDropdown({ user }) {
  const userEmail = user?.email || "";
  // Get first letter of email for avatar fallback
  const initials = userEmail ? userEmail.charAt(0).toUpperCase() : "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage 
              src={`https://avatar.vercel.sh/${userEmail}`} 
              alt={userEmail} 
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action="/api/auth/signout" method="post">
            <button className="w-full text-left">
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}