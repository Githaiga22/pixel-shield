import { Logo } from "./Logo";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="bg-darkSecondary border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <Logo />
              </a>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <a className="bg-primary/10 text-primary px-3 py-2 rounded-md text-sm font-medium">Upload</a>
                </Link>
                <Link href="/verifications">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Verifications</a>
                </Link>
                <Link href="/integration">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Integration</a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="relative p-1 text-gray-400 hover:text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            
            <div className="relative">
              <div className="flex items-center">
                <button type="button" className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" 
                    alt="User avatar" 
                  />
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
