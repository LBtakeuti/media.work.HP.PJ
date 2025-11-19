export default function CompanyPage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            企業情報
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            私たちについて、より詳しくご紹介いたします。
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">会社概要</h2>
            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-semibold text-gray-500 mb-1">会社名</dt>
                  <dd className="text-lg text-gray-900">株式会社サンプル</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 mb-1">設立</dt>
                  <dd className="text-lg text-gray-900">2020年1月1日</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 mb-1">資本金</dt>
                  <dd className="text-lg text-gray-900">10,000,000円</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 mb-1">従業員数</dt>
                  <dd className="text-lg text-gray-900">50名</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-semibold text-gray-500 mb-1">所在地</dt>
                  <dd className="text-lg text-gray-900">
                    〒100-0001<br />
                    東京都千代田区千代田1-1-1
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-semibold text-gray-500 mb-1">事業内容</dt>
                  <dd className="text-lg text-gray-900">
                    ソフトウェア開発、システムインテグレーション、コンサルティングサービス
                  </dd>
                </div>
              </dl>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">ミッション</h2>
            <p className="text-lg text-gray-700 mb-8">
              私たちは、お客様のビジネスを成功に導くために、最新のテクノロジーと豊富な経験を活かした
              ソリューションを提供します。お客様のニーズに真摯に向き合い、長期的なパートナーシップを
              築くことを目指しています。
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">バリュー</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">イノベーション</h3>
                <p className="text-gray-700">
                  常に新しい技術やアイデアを取り入れ、革新的なソリューションを提供します。
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">誠実さ</h3>
                <p className="text-gray-700">
                  お客様との約束を守り、透明性のあるコミュニケーションを心がけます。
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">チームワーク</h3>
                <p className="text-gray-700">
                  社内外のパートナーと協力し、最高の結果を生み出します。
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">沿革</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-6">
                <div className="text-sm font-semibold text-primary-600 mb-1">2020年1月</div>
                <div className="text-lg text-gray-900">会社設立</div>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <div className="text-sm font-semibold text-primary-600 mb-1">2021年6月</div>
                <div className="text-lg text-gray-900">本社移転</div>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <div className="text-sm font-semibold text-primary-600 mb-1">2022年3月</div>
                <div className="text-lg text-gray-900">従業員数50名達成</div>
              </div>
              <div className="border-l-4 border-primary-600 pl-6">
                <div className="text-sm font-semibold text-primary-600 mb-1">2023年9月</div>
                <div className="text-lg text-gray-900">新サービス開始</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


