// サイト設定
export const siteConfig = {
    name: 'マーダーミステリー作成支援',
    description: 'マーダーミステリーのシナリオ、キャラクター、タイムラインを簡単に作成・管理できるツールです。',
    url: 'https://murdermystercreate.com',

    navigation: [
        { label: 'ホーム', href: '/' },
        { label: 'シナリオ一覧', href: '/mystery' },
    ],

    socialLinks: [
        { name: 'GitHub', href: 'https://github.com' },
        { name: 'X', href: 'https://x.com' },
    ],
} as const;
