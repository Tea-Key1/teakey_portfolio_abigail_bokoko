/*Theme.js は外観モードを切り替えるトグルバーを編集する Theme クラスを作成します。
Event トリガーを使用するため、 Theme クラスに EventEmitter を継承させます。

theme に "light" を代入し、
toggleButton オブジェクトと toggleCircle オブジェクトにそれぞれ Document.querySelector(CSS セレクター) でCSSセレクターで指定されたエレメントを取得します。
classList はエレメントのプロパティで、 class 属性のリストが入った DOMTokenList を返します。
DOMTokenList インターフェースはスペースで区切られたトークンのセットを表します。
<p class="a b c"></p> このような HTML があったとき、pエレメントの classList は、「a b c」です。
DOMTokenList の toggle() 関数は、もしそのトークンが存在すればリストから削除し、存在しなければそのトークンをリストに追加します。
操作後にリスト内にそのトークンが存在するかどうかを論理値で返します。

.toggle-button のエレメントで "click" イベントが発生したとき以下の処理を行います。
1,  ".toggle-circle"に"slide"クラスが無ければ"slide"クラスを追加し、あれば"slide"クラスを消します。
2,  theme の文字列が"light"なら"dark"に変更させ、そうでなければ("dark"なら)、"light"に変更します。
3,  html エレメントの body に "dark-theme" クラスが無ければ"dark-theme"クラスを追加し、あれば"dark-theme"クラスを消します。
4,  html エレメントの body に "light-theme" クラスが無ければ"light-theme"クラスを追加し、あれば"light-theme"クラスを消します。
5,  "switch"というイベント名で theme 文字列を引数に emit 関数を実行する。

*/

import { EventEmitter } from "events";

export default class Theme extends EventEmitter{
    constructor(){
        super()
        this.theme = "light"
        this.toggleButton = document.querySelector(".toggle-button")
        this.toggleCircle = document.querySelector(".toggle-circle")

        this.setEventListener();
    }
    setEventListener(){
        this.toggleButton.addEventListener("click",()=>{
            this.toggleCircle.classList.toggle("slide");
            this.theme = this.theme==="light"? "dark" : "light";
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");


            this.emit("switch", this.theme)
        })
    }
}