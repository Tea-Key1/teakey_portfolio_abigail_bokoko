/*
convertDivsToSpan.js では、外部ファイルから HTML の要素を引数として受け取り、そのテキスト要素を編集する関数を作成します。
element の overflow CSS プロパティを "hidden"に定義します。
element の文字列テキストに対し、 split() 関数と map() 関数を組み合わせます。
これにより、 element の文字列が「Hello world」のとき、
[`<span class="animatedis">H</span>`,
`<span class="animatedis">e</span>`,
`<span class="animatedis">l</span>`,
`<span class="animatedis">l</span>`,
`<span class="animatedis">o</span>`,
`<span>&nbsp;</span>`,
`<span class="animatedis">w</span>`,
`<span class="animatedis">o</span>`,
`<span class="animatedis">r</span>`,
`<span class="animatedis">l</span>`,
`<span class="animatedis">d</span>`,]
に変換され返り値となります。
*/

export default function(element){
    element.style.overflow = "hidden";
    element.innerHTML = element.innerText.split("").map((char)=>{
        if(char === " "){
            return `<span>&nbsp;</span>`;
        }
        return `<span class="animatedis">${char}</span>`;
    })
    .join("");
    return element;
}