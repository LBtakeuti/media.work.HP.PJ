// ====================================
// スムーススクロール
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ====================================
// 軽量スクロールアニメーション (Intersection Observer)
// ====================================

// 単一のIntersection Observerインスタンスを使用
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // 少し下にスクロールしてから表示
    threshold: 0.1 // 10%表示されたらトリガー
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // クラスを追加してアニメーション実行
            entry.target.classList.add('is-visible');
            // 監視を解除してパフォーマンス向上
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// ====================================
// DOMContentLoaded - 初期化処理
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('SAVREQ GOLF ランディングページが読み込まれました');

    // アニメーション対象の要素を選択
    const animatedElements = document.querySelectorAll(
        'section, .feature-card, .equipment-card, .section-title, .system-image, .flow-image-container'
    );

    // 各要素にfade-in-sectionクラスを追加して監視開始
    animatedElements.forEach(element => {
        element.classList.add('fade-in-section');
        observer.observe(element);
    });
});

// ====================================
// クリーンアップ: ページ離脱時の処理
// ====================================

window.addEventListener('beforeunload', () => {
    // Observerの解放
    if (observer) {
        observer.disconnect();
    }
});
