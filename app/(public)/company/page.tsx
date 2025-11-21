import Image from "next/image";
import { RetroGrid } from "@/components/ui/retro-grid";

export default function CompanyPage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/lighthouse-6915406_1280.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              企業情報
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              私たちについて、より詳しくご紹介いたします。
            </p>
          </div>
        </div>
      </section>

      {/* About Media Work Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Retro Grid Background */}
        <RetroGrid angle={65} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b-2 border-gray-300 pb-4">
              メディア・ワークについて
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-6">
              私たちは、1975年に印刷製版を主軸として創業して以来、半世紀近くにわたり「メディア制作」の最前線で時代の変化と向き合い続けてまいりました。長年培ってきた組版やグラフィック・デザインの確かな技術とノウハウは、今も変わらぬ私たちの強みです。
            </p>
            
            <p className="mb-6">
              そして今、私たちはその伝統的な強みに加え、「心に残る瞬間を、未来へ届ける」という新たなミッションを掲げています。最新のAI技術を活用したパーソナル動画サービス「SAVREQ」でイベントの感動を再定義し、サイバーセキュリティの領域では安心を、そして企業ブランディングを強化するホームページやパンフレット制作では想いを込めたクリエイティブを提供いたします。
            </p>
            
            <p>
              メディア・ワークは、単なる制作会社ではなく、貴社の「伝えたい」を企画から運営、そして記憶に残るアウトプットまで、ワンストップでサポートする戦略パートナーです。長年の経験で培った確かな技術と、未来を見据えた革新的なサービスで、貴社のビジネスの成長と成功に貢献してまいります。どんな「伝えたい」も、まずはお気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">会社概要</h2>
            <div>
              <dl className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <dt className="text-sm font-semibold text-gray-500 mb-2">商号</dt>
                  <dd className="text-lg text-gray-900">株式会社 メディア・ワーク</dd>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <dt className="text-sm font-semibold text-gray-500 mb-2">設立</dt>
                  <dd className="text-lg text-gray-900">1975年5月23日</dd>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <dt className="text-sm font-semibold text-gray-500 mb-2">資本金</dt>
                  <dd className="text-lg text-gray-900">10,000,000円</dd>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <dt className="text-sm font-semibold text-gray-500 mb-2">代表者</dt>
                  <dd className="text-lg text-gray-900">代表取締役　白石　亨</dd>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <dt className="text-sm font-semibold text-gray-500 mb-2">取引銀行</dt>
                  <dd className="text-lg text-gray-900">
                    みずほ銀行　浜松町支店<br />
                    東京東信用金庫　江東中央支店<br />
                    りそな銀行　芝支店
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 mb-2">所在地</dt>
                  <dd className="text-lg text-gray-900 space-y-4">
                    <div>
                      <div className="font-semibold mb-1">〈青山オフィス〉</div>
                      <div>〒107-0062　東京都港区南青山2-18-2　竹中ツインビルB館 1F</div>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">〈本社〉</div>
                      <div>〒136-0076　東京都江東区南砂2-36-11　オフィスニューガイア東陽町No.64 5F</div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


