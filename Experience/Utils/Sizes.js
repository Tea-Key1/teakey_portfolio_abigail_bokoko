/*
Size.jsは addEventListener という WebAPI を使って、
resize 関数がブラウザサイズが変更されるたびに呼び出されるようにする Sizes クラスを作成します。

まずはコンストラクタ関数内で update 関数に必要な変数を定義しておきます。

this.width = window.innerWidth;         //window.innerWidthはウィンドウの内部横幅をピクセル単位で返すwindowのプロパティです。これには垂直スクロールバーがある場合、その幅を含みます。
this.height = window.innerHeight;       //window.innerWidthはウィンドウの内部縦幅をピクセル単位で返すwindowのプロパティです。これには水平スクロールバーがある場合、その幅を含みます。
this.aspect = this.width/this.height;   //ウィンドウのアスペクト比を定義します。
this.pixelRatio = Math.min(window.devicePixelRatio,2)//devicePixelRatio は Window インターフェイスのプロパティで、現在のディスプレイ機器における CSS 解像度と物理解像度の比を返します。
this.frustrum = 5;                      //orthographicCamra の frustum を定義します。

上記の width,height,picelRatio は Renderer クラスの setRenderer 関数で canvas の描画バッファサイズを定義する時に使います。
したがって、 css の canvas タグに定義されている表示サイズと合わせるために this.width = canvas.inner としてもよいですが、
CSSで表示サイズを「100vw100vhの100%100%、つまりフル画面」で設定しているため、
window.innerWidth,innerHeight を代入しても出力は変わりません。

devicepixelRatioは1物理ピクセルの大きさに対する1CSSピクセルの比、つまり、1CSSピクセルが実際にはいくつの物理ピクセルを表示されるかという値です。
この値が1であることは、それが伝統的な 96 DPI (プラットフォームによっては 76 DPI) であることを意味し、
2であることは、HiDPI や Retina のディスプレイであると考えられます。
それ以外の値が返されることもあり、それは一般的でない低解像度のディスプレイの場合や、
より考えられるのはスクリーンが標準的な 96 または 76 DPI の解像度の単純な 2 倍よりも高いピクセル密度を持つ場合です。
今回は2以下のdeviceに対応するため、Math.minの引数でdevicePixelRatioを使いました。

次に、 resize 関数を作り呼び出します。

this.resize();

resize(){
    window.addEventListener("resize",()=>{
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width/this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio,2)
        this.emit("resize")
    })
}

addEventListener 関数はターゲットに特定のイベントが実行されるたびに関数内処理を実行する EventTarget インターフェースのメソッドです。
特定のイベントとしてよくある対象は Element,Document,Window ですが、イベントに対応したあらゆるオブジェクトが対象になることがあります。
今回は Window オブジェクトの resize イベントを指定し、 resize(ウィンドウの大きさが変更するイベント)が実行されるたびに関数内処理を実行する仕様にしています。
関数内処理はウィンドウの大きさが変更されるたびに代入される値を更新しています。

また、Sizes クラスでウィンドウの大きさが変更されるたびに内容をアップデートさせることが実現しましたが、これを他のクラスと連動させる必要があります。
そのために Events モジュールを Node を使ってインストールし、EventEmitter クラスを親クラスとして Sizes クラスに継承します。
EventEmitter クラスで今回使用するのは emit メソッドと on メソッドです。
emit(eventName, [args]) メソッドは、メソッドが実行すると同じ eventName を持つ on を実行させてListenerを渡します。
on(eventName, Listener) メソッドは、同じ eventName を持つ emit メソッドが実行すると、同期的に実行するメソッドです。
emit から渡された引数を on メソッドの引数として横移動させます。
これらを使うことで、 Experience クラスの resize 関数がウィンドウの大きさが変更されるたびに実行されるようにします。
*/

import { EventEmitter } from "events";

export default class Sizes extends EventEmitter {
    constructor() {
        super();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.frustrum = 5;
        if (this.width < 968) {
            this.device = "mobile";
        } else {
            this.device = "desktop";
        }

        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.emit("resize");

            if (this.width < 968 && this.device !== "mobile") {
                this.device = "mobile";
                console.log("switch")
                this.emit("switchdevice", this.device);
            } else if (this.width >= 968 && this.device !== "desktop") {
                this.device = "desktop";
                console.log("switch")
                this.emit("switchdevice", this.device);
            }
        });
    }
}