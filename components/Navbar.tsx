import Image from "next/image"
import Link from "next/link"
import { SignedIn,SignedOut, UserButton, SignInButton } from "@clerk/nextjs"
import NavItems from "./NavItems"

const Navbar = () => {
  return (
    <nav className="navbar bg-[#E1E5F9]">
        <Link href="/" >
            <div className="flex items-center gap-2.5 cursor-pointer">
                <Image 
                    src="/images/yooly.png" 
                    alt="Logo" 
                    width={80} 
                    height={80} />
            </div>
        </Link>
        <div className="flex items-center gap-8">
            <NavItems />
            <SignedOut>
              <SignInButton>
                  <button className="btn-signin">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    
    </nav>
  )
}

export default Navbar