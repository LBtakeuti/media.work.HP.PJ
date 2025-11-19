import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">コーポレートサイト</h3>
            <p className="text-gray-400 text-sm">
              企業紹介とサービス概要を提供しています。
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">企業</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/company" className="text-gray-400 hover:text-white transition-colors">
                  企業情報
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  事業案内
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">情報</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  ニュース
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">その他</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  管理画面
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} コーポレートサイト. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


