import "./style.css"
import Experience from "./Experience/Experience.js"

/* main.js では、 html の canvas 要素を取得し、
それを Experience クラスへ引数として渡し、
( Experience クラスでデータを処理し、返り値を受け取り、)←これは Experience.js の範囲
Experience クラスのインスタンスを生成することです。
クラスをクラス式で定義します。
*/
const experience = new Experience(document.querySelector(".experience-canvas"))
