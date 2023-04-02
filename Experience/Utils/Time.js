/* Time.js は requestAnimationFrame という WebAPI を使って、
update 関数が各ブラウザフレームレートで呼び出されるようにする Time クラスを作成します。

まずはコンストラクタ関数内で update 関数に必要な変数を定義しておきます。

this.start = Date.now();    //Date.now()はUTC (協定世界時) での 1970 年 1 月 1 日 0 時 0 分 0 秒 から現在までの経過時間をミリ秒単位で返します。
this.current = this.start   //現在の時刻 current を定義します。
this.elasped = 0;           //経過時間の初期値を表すので0です。
this.delta = 16;            //ブラウザのフレームレートは 60FPS なので、1/60秒の16msにします。

次に、update 関数を作り呼び出します。

this.update();

update(){
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elasped = this.current - this.start;
    this.emit("update")

    window.requestAnimationFrame(() => this.update())
}

update 関数が呼び出されるたびに現在時刻を取得します。
currentTime と current の差は update関数が呼び出される間隔に等しいため、 delta にはブラウザのフレームレートである1/60秒が代入されます。
current に currentTime を代入します。すると、次に update 関数が呼び出されるとき、 currentTime は1フレームレート後の値を取得するため、delta の値が一定になります。
current と start の差は update 関数が実行されてから経過した時間に等しい。

requestAnimationFrame 関数は1フレーム毎に関数内処理を実行するWebインターフェースのメソッドです。
従来よく使われるsetTimeout、setIntervalなどの時間指定の関数はブラウザのフレーム（画面）を更新するタイミングでも関係なく実行されます。
その結果、フレーム更新とJavascriptの実行が重なり、フレームレートの低下をもたらします。
一方、requestAnimationFrameを利用した場合はフレーム更新の処理直後に引数に渡した処理が実行されます。
そのためフレームの更新を邪魔することがなく、フレームレイトを最適に保つことができます。
長過ぎる処理の一部をrequestAnimationFrameで処理を分割して、最適なフレームレートを保つ事ができます。

また、Time クラスで1フレーム毎に内容をアップデートさせることが実現しましたが、これを他のクラスと連動させる必要があります。
そのために Events モジュールを Node を使ってインストールし、EventEmitter クラスを親クラスとして Time クラスに継承します。
EventEmitter クラスで今回使用するのは emit メソッドと on メソッドです。
emit(eventName, [args]) メソッドは、メソッドが実行すると同じ eventName を持つ on を実行させてListenerを渡します。
on(eventName, Listener) メソッドは、同じ eventName を持つ emit メソッドが実行すると、同期的に実行するメソッドです。
emit から渡された引数を on メソッドの引数として横移動させます。
これらを使うことで、 Experience クラスの update 関数が1フレーム毎に実行されるようにします。

*/

import { EventEmitter } from "events";

export default class Time extends EventEmitter{
    constructor(){
        super();
        this.start = Date.now();
        this.current = this.start
        this.elasped = 0;
        this.delta = 16;
    
        this.update();
    }

    update(){
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elasped = this.current - this.start;
        this.emit("update")

        window.requestAnimationFrame(() => this.update())
    }
}