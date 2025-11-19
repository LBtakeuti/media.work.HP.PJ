import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "サービス1",
      description: "サービス1の詳細な説明がここに入ります。お客様のビジネスをサポートする包括的なソリューションを提供します。",
      features: [
        "特徴1: 高品質なサービス提供",
        "特徴2: 24時間365日のサポート",
        "特徴3: カスタマイズ可能なソリューション",
      ],
    },
    {
      id: 2,
      title: "サービス2",
      description: "サービス2の詳細な説明がここに入ります。最新のテクノロジーを活用した革新的なサービスです。",
      features: [
        "特徴1: 最新技術の活用",
        "特徴2: スケーラブルな設計",
        "特徴3: セキュアな環境",
      ],
    },
    {
      id: 3,
      title: "サービス3",
      description: "サービス3の詳細な説明がここに入ります。お客様のニーズに合わせた柔軟な対応が可能です。",
      features: [
        "特徴1: 柔軟な対応",
        "特徴2: 迅速な導入",
        "特徴3: 継続的な改善",
      ],
    },
    {
      id: 4,
      title: "サービス4",
      description: "サービス4の詳細な説明がここに入ります。業界をリードするソリューションを提供します。",
      features: [
        "特徴1: 業界標準の品質",
        "特徴2: 豊富な実績",
        "特徴3: 専門的なサポート",
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            事業案内
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            お客様のビジネスをサポートする多様なサービスを提供しています。
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600">
                      {service.title}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    お問い合わせ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ご質問がございましたら
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            サービスに関するご質問やご相談がございましたら、お気軽にお問い合わせください。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            お問い合わせフォームへ
          </Link>
        </div>
      </section>
    </div>
  );
}


