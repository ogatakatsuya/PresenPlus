import password from '$lib/images/password.jpg';
import graph from '$lib/images/graph.jpg';
import comment from '$lib/images/comment.jpg';

export const features = [
    {   
        id: "PresenroomFeature",
        image: password,
        title: "プレゼンルームの作成機能",
        subtitle: "セキュアなプレゼン体験",
        content:
            "<p>このツールでは、ユーザーは簡単にパスワードによる入室制限が可能なプレゼンルームを作成できます。また、Svelteの強力なデータバインディングにより、入室管理がリアルタイムで反映されます。これらにより、プライバシーの確保と招待者の制御及び参加者の様子の確認が容易に行え、安心してプレゼンテーションを進行することができます。</p>"
    },

    {   
        id: "ResultsFeature",
        image: graph,
        title: "投票結果の表示機能",
        subtitle: "インタラクティブな投票結果表示",
        content: 
            "<p>投票結果は、Svelteの強力なデータバインディングとアニメーション機能を活用して、リアルタイムで円グラフとして視覚化されます。これにより、オーディエンスは結果を一目で理解でき、プレゼンテーションの効果が一層高まります。Svelteの再レンダリングの速さと効率性により、投票結果の表示はスムーズでシームレスな体験を提供します。</p>"
    },

    {   
        id: "CommentFeature",
        image: comment,
        title: "コメント投稿・表示機能",
        subtitle: "ダイナミックなコメント機能",
        content: 
            "<p>オーディエンスはリアルタイムでコメントを投稿でき、コメントは一定時間表示された後に消えます。Svelteの反応性の高いフレームワークにより、コメントが投稿されるたびに即座に画面に反映されます。このリアクティブ性により、時差なくオーディエンスの声を的確に拾い上げることが可能です。<p/>"
    }
];