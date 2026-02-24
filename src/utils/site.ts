// サイト設定
export const siteConfig = {
    name: 'マーダーミステリー作成支援',
    description: 'マーダーミステリーのシナリオ、キャラクター、タイムライン、手がかりを簡単に作成・管理できるツールです。PDF出力機能も搭載。',
    url: 'https://murdermystercreate.com',

    navigation: [
        { label: 'ホーム', href: '/' },
        { label: 'シナリオ一覧', href: '/mystery' },
    ],

    socialLinks: [
        { name: 'GitHub', href: 'https://github.com/osushizm/mystery' },
        { name: 'X', href: 'https://x.com' },
    ],
} as const;

export const features = [
    {
        title: 'シナリオ管理',
        description: 'マーダーミステリーのシナリオを作成・編集・管理できます。',
        icon: '📋',
    },
    {
        title: 'キャラクター管理',
        description: '登場人物の詳細情報（役割、背景、目的）を管理できます。',
        icon: '👥',
    },
    {
        title: 'タイムライン',
        description: 'イベントの時系列を管理し、ストーリーの流れを整理できます。',
        icon: '⏱️',
    },
    {
        title: '手がかり管理',
        description: '手がかり、アイテム、情報、秘密、証拠を分類して管理できます。',
        icon: '🔍',
    },
    {
        title: 'PDF出力',
        description: 'メインストーリー、キャラクターシート、カードをPDFで出力できます。',
        icon: '📄',
    },
    {
        title: 'クラウド保存',
        description: 'Cloudflare D1で安全にデータを保存・管理できます。',
        icon: '☁️',
    },
];
