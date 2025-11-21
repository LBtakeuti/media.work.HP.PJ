export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  category: string;
  image: string;
  imageAlt: string;
}

export async function getServices(): Promise<ServiceItem[]> {
  return [
    {
      id: '1',
      title: 'サービスタイトル1',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス1の詳細な内容がここに表示されます。</p><p>お客様のニーズに合わせた最適なソリューションを提供いたします。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス1',
    },
    {
      id: '2',
      title: 'サービスタイトル2',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス2の詳細な内容がここに表示されます。</p><p>最新のテクノロジーを活用したサービスです。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス2',
    },
    {
      id: '3',
      title: 'サービスタイトル3',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス3の詳細な内容がここに表示されます。</p><p>信頼性の高いサービスを提供いたします。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス3',
    },
    {
      id: '4',
      title: 'サービスタイトル4',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス4の詳細な内容がここに表示されます。</p><p>柔軟な対応が可能なサービスです。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス4',
    },
    {
      id: '5',
      title: 'サービスタイトル5',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス5の詳細な内容がここに表示されます。</p><p>高品質なサービスをお約束します。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス5',
    },
    {
      id: '6',
      title: 'サービスタイトル6',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービス6の詳細な内容がここに表示されます。</p><p>お客様満足度No.1のサービスです。</p>',
      date: '2025年11月17日',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
      imageAlt: 'サービス6',
    },
  ];
}

