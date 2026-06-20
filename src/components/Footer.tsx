import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-[#0a0a0a] py-8 sm:py-12 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[2200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity mb-4 inline-block">
              Moments <span className="text-gray-500 dark:text-gray-400 font-light">Gallari</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Explore a curated collection of beautiful, high-quality AI prompts and custom design ideas. Copy premium prompts for Midjourney, Stable Diffusion, and more.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/share/1D4aFV8oYv/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:bg-[#1877F2] hover:border-[#1877F2]" 
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/moments_galleri?igsh=MTlxMW9vNXhodGtpMg==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-transparent before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-[#f09433] before:via-[#dc2743] before:to-[#bc1888] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" 
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://www.threads.com/@moments_galleri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:bg-black dark:hover:bg-white hover:border-black dark:hover:border-white" 
                aria-label="Threads"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                  <path d="M14.613 11.458c-.14-.543-.448-1.042-.878-1.464-1.258-1.229-3.353-1.254-4.852-.08-.94.735-1.396 1.782-1.462 2.671 1.621.05 3.32-.08 4.79-.379-.117-1.127-.723-2.072-1.748-2.684-1.059-.628-2.316-.628-3.375 0-1.025.612-1.631 1.557-1.748 2.684.623.13 1.25.21 1.879.24 1.155.055 2.323-.05 3.468-.316.591-.137 1.168-.344 1.716-.613.364-.179.683-.435.932-.733.266-.316.452-.693.535-1.094.137-.66-.024-1.353-.404-1.921-.363-.54-.85-1-1.441-1.36-1.576-.96-3.415-1.134-5.18-.54-1.635.55-2.936 1.74-3.755 3.38-.802 1.604-1.002 3.42-.583 5.15.394 1.634 1.196 3.054 2.375 4.148 1.196 1.112 2.723 1.815 4.354 2.015 1.742.213 3.513-.102 5.06-1.008 1.411-.825 2.502-2.075 3.123-3.626l.013-.032c.504-1.282.72-2.684.636-4.103-.046-.803-.178-1.597-.393-2.37-.23-1.006-.714-1.942-1.385-2.712A9.458 9.458 0 0 0 17.585 3.9a9.782 9.782 0 0 0-3.37-1.792 10.375 10.375 0 0 0-3.957-.597 10.093 10.093 0 0 0-3.805 1.1 9.387 9.387 0 0 0-2.973 2.324A9.13 9.13 0 0 0 1.6 7.828c-.46 1.258-.698 2.593-.698 3.943s.237 2.685.698 3.943a9.13 9.13 0 0 0 1.882 2.893 9.387 9.387 0 0 0 2.973 2.324 10.093 10.093 0 0 0 3.805 1.1 10.375 10.375 0 0 0 3.957-.597 9.782 9.782 0 0 0 3.37-1.792c.983-.814 1.782-1.802 2.316-2.906.518-1.066.866-2.221 1.01-3.415.114-.94.135-1.892.062-2.836l.011-.005a7.48 7.48 0 0 0-1.734-4.82 7.02 7.02 0 0 0-2.808-1.996c-1.127-.42-2.366-.583-3.568-.453-1.262.136-2.458.625-3.475 1.41-1.042.803-1.841 1.874-2.316 3.12-.456 1.19-.607 2.474-.45 3.743.14 1.134.506 2.22 1.06 3.193.585 1.03 1.385 1.9 2.348 2.534.98.65 2.103 1.042 3.275 1.155 1.155.112 2.336-.023 3.42-.453a7.514 7.514 0 0 0 2.695-1.637 6.643 6.643 0 0 0 1.785-2.585 6.446 6.446 0 0 0 .428-2.613c-.053-.94-.282-1.85-.668-2.695-.36-.79-1.044-1.206-1.872-1.168-.828.037-1.503.542-1.82 1.353-.298.761-.43 1.57-.384 2.385.04.664.16 1.314.35 1.933a3.57 3.57 0 0 1-.58 2.614 3.961 3.961 0 0 1-2.296 1.583 4.237 4.237 0 0 1-2.738-.28 4.636 4.636 0 0 1-1.921-1.42c-.652-.823-1.1-1.812-1.28-2.868z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center pb-[80px] sm:pb-0">
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Moments Gallari. All rights reserved.
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            Designed for AI Creators
          </div>
        </div>
      </div>
    </footer>
  );
}
