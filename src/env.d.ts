/// <reference types="astro/client" />

// Cloudflare Pages の環境バインディング型定義
interface Env {
    DB: D1Database;
    ASSETS: Fetcher;
}

// Astro.locals に Cloudflare の runtime を追加
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
    interface Locals extends Runtime { }
}
