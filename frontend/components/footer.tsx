import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zh-navy text-white mt-20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="font-poppins font-bold text-xl">Z-Homes</span>
            </div>
            <p className="text-gray-400 text-sm">
              Find your perfect home. Trusted by thousands of users across India.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-zh-pink transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-zh-pink transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-zh-pink transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-zh-pink transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/search" className="hover:text-zh-pink transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="hover:text-zh-pink transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zh-pink transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zh-pink transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-zh-pink transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-zh-pink transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-zh-pink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zh-pink transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@zhomes.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 1800-123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Z-Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

