import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー",
  description: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  【個人情報保護の理念】
                </h2>
                <p className="mb-4">
                  株式会社メディア・ワーク（以下、当社）は、メディア制作全般およびイベント事業全般を事業の核とした事業活動を行っています。事業活動を通じてお客様から取得する個人情報及び当社従業員の個人情報（特定個人情報を含む、以下、「個人情報」という。）は、当社にとって重要な情報資産であり、その個人情報を確実に保護することは、当社の重要な社会的責務と認識しております。したがって、当社は、事業活動を通じて取得する個人情報を、以下の方針に従って取り扱い、個人情報保護に関して、お客様及び当社従業員への「安心」の提供及び社会的責務を果たしていきます。
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  【方針】
                </h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    １. 個人情報の取得、利用及び提供に関して
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>適法、かつ、公正な手段によって個人情報を取得いたします。</li>
                    <li>利用目的の達成に必要な範囲内で、個人情報を利用いたします。</li>
                    <li>個人情報を第三者に提供する場合には、事前に本人の同意を取ります。</li>
                    <li>取得した個人情報の目的外利用はいたしません。また、そのための措置を講じます。</li>
                    <li>目的外利用の必要が生じた場合は新たな利用目的の再同意を得た上で利用いたします。</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    ２. 法令、国が定める指針その他の規範（以下、「法令等」という。）に関して
                  </h3>
                  <p>
                    個人情報を取り扱う事業に関連する法令等を常に把握することに努め、当社事業に従事する従業員（以下、「従業員」という）に周知し、遵守いたします。
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    3. 個人情報の安全管理に関して
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>個人情報への不正アクセス、個人情報の漏えい、滅失、又はき損などの様々なリスクを防止すべく、個人情報の安全管理のための迅速な是正措置を講じる体制を構築し維持いたします。</li>
                    <li>点検を実施し、発見された違反や事故に対して、速やかにこれを是正するとともに、弱点に対する予防処置を実施いたします。</li>
                    <li>安全に関する教育を、従業員に徹底いたします。</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    4. 苦情・相談に関して
                  </h3>
                  <p>
                    個人情報の取扱いに関する苦情及び相談については、個人情報問合せ窓口を設け、迅速な対応が可能な体制を構築し、誠意をもって対応いたします。
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    5. 継続的改善に関して
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>当社の個人情報保護マネジメントシステムは、個人情報保護のため、内部規程遵守状況を監視及び監査し、違反、事件、事故及び弱点の発見に努め、経営者による見直しを実施いたします。これを管理策及び内部規程に反映し、個人情報保護マネジメントシステムの継続的改善に努めます。</li>
                    <li>改善においては、法令等及びJIS Q 15001 に準拠いたします。</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  制定日　2009年 10月 30日
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  改訂日　2017年 10月 1日
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  株式会社メディア・ワーク
                </p>
                <p className="text-sm text-gray-600">
                  代表取締役　白石　亨
                </p>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ＜個人情報問合せ窓口＞
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>〒136-0076　東京都江東区南砂2-36-11　オフィスニューガイア東陽町NO.64 5階</p>
                  <p>株式会社メディア・ワーク　個人情報問合せ窓口</p>
                  <p>Phone : <a href="tel:03-6660-2014" className="text-primary-600 hover:text-primary-700 underline">03-6660-2014</a>（平日10:00 〜 17:00）</p>
                  <p>e-mail : <a href="mailto:ts@media-work.jp" className="text-primary-600 hover:text-primary-700 underline">ts@media-work.jp</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
