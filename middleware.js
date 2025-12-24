import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // /savreqgolflp で始まるすべてのパス（静的アセット含む）をプロキシ
  if (pathname.startsWith('/savreqgolflp')) {
    // パスから /savreqgolflp を削除
    const path = pathname.replace('/savreqgolflp', '') || '/';
    
    // プロキシ先のURLを構築
    const proxyUrl = new URL(
      path,
      'https://savreqgolflp-q4kcpda3i-media-work.vercel.app'
    );
    
    // クエリパラメータを保持
    if (request.nextUrl.search) {
      proxyUrl.search = request.nextUrl.search;
    }

    try {
      // プロキシ先からコンテンツを取得
      const response = await fetch(proxyUrl.toString(), {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          host: proxyUrl.host,
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.text() 
          : undefined,
      });

      // レスポンスを構築（バイナリファイルにも対応）
      const contentType = response.headers.get('content-type') || '';
      const isBinary = contentType.startsWith('image/') || 
                       contentType.startsWith('application/') ||
                       contentType.startsWith('font/') ||
                       contentType.startsWith('video/') ||
                       contentType.startsWith('audio/');
      
      const responseBody = isBinary 
        ? await response.arrayBuffer()
        : await response.text();
      
      const headers = new Headers(response.headers);
      
      // CORSヘッダーを設定
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      // キャッシュヘッダーを設定（静的アセット用）
      if (isBinary || contentType.includes('css') || contentType.includes('javascript')) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }

      return new NextResponse(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/savreqgolflp/:path*',
};

