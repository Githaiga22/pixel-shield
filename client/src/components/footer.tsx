import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-darkSecondary py-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo />
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} PixelShield. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
