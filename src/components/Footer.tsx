import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-deep-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Foundify</h3>
            <p className="text-deep-blue-100 text-sm">
              Launch faster, look professional, stay organized
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-deep-blue-100 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-deep-blue-100/20 mb-8" />

        <div className="text-center text-sm text-deep-blue-100">
          <p>© 2025 Foundify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}