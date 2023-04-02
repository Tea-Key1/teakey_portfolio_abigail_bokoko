/*[* as THREE]はモジュールの全てをインポートすること。
そしてモジュールオブジェクトの名前をTHREEとして扱うと書いています。
[three]はインポートするモジュール。今回は絶対パス。
Viteは拡張子を加えても加えなくても良いので、ただthreeとだけ書きます。
*/
import * as THREE from "three";

import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";
import Resources from "./Utils/Rescources";
import assets from "./Utils/assets";

import Camera from "./Camera"
import Theme from "./Theme";
import Renderer from "./Renderer";
import Preloader from "./Preloader";

import World from "./World/World";
import Controls from "./World/Controls";

/*他ファイルでもクラスを読み込める(importできるようにするため)にExperienceクラスをexportします。
今回はdefault exportですが、named exportでもokです。
しかし、{}でクラス名を囲んでimportさせるのは見た目が悪いため、今回はdefault exportにします。
*/

/* 
Experience.jsの役割は、
Experienceクラスを作り、受け取った引数(canvas要素のデータ)を処理し、返り値を渡すことです。
ここで言う処理とは、
1.  argument[c,a,n,v,a,s,要,素]をconstructor関数内のオブジェクトプロパティに入れ、外部から参照できるようにする。
2.  constructor関数内のオブジェクトプロパティを外部のクラスでインスタント化する。
ここでインスタンス化にあたって循環参照がおこるという問題が発生しますが、処理3で解決します。
3.  静的プロパティを使って、インスタンス化するたびにクラスに情報が溜まるようにする。(Singleton)
constructor関数内の全てのオブジェクトプロパティに対しクラスのインスタンス化が終わったら、3の処理が終わり、返り値(this)を渡します。
というものです。

まずは1を実行するプログラムはこれです。
export default class Experience{
    constructor(canvas){
        this.canvas = canvas;
    }
}

次に2を実行するプログラムです。
ここでは実例としてcameraプロパティとsizesプロパティにそれぞれcameraクラス,Sizesクラスのインスタンス化します。
export default class Experience{
    constructor(canvas){
        this.canvas = canvas;

        this.△△ = new □□();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.○○ = new ××();
    }
}


CameraクラスでもExperienceのインスタント化している。→循環参照が発生している。
export default class Camera{
    constructor(){
        this.experience = new Experience();

        this.△△ = this.experience.△△();
        this.sizes = this.experience.sizes();
        this.○○ = this.experience.○○();
    }
}

そして、Singletonを実装するプログラムです。
export default class Experience{
    static instance;
    constructor(canvas){
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;

        this.△△ = new □□();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.○○ = new ××();
    }
}

Experienceクラスに帰属する静的プロパティ[instance]を作り、コンストラクタ関数内でthisを代入する。
このthisはthisは現在関数を実行しているインスタンスに結びつけられるオブジェクトです。
ほとんどの場合、this の値はどのように関数が呼ばれたかによって決定されます (実行時結合)。
これは実行時に代入によって設定することはできず、関数が呼び出されるたびに異なる可能性があります。
クラスのコンストラクタ関数内では、thisは通常のオブジェクトです。
コンストラクタ関数内のthisには、クラス内の静的でないメソッドすべてが this のプロトタイプに追加されます。
メモ: 静的メソッド、プロパティ[instance]は this のプロパティではありません。クラス自身のプロパティです。
thisの初期値は{}ですが、プロトタイプを持つオブジェクトです。したがって、Experience.instance={}です。

this.canvas=canvas;

this.△△ = new □□();
this.sizes = new Sizes();
this.camera = new Camera();
this.○○ = new ××();

thisオブジェクトにcanvasプロパティ～○○プロパティを定義します。
ここで、Experience.instanceはthisと同じ振る舞いをするため、同じプロパティを持ちます。
それぞれのクラスのインスタント化に際して返り値が渡されますが、後にインスタント化したクラスのプロパティの値に更新されます。
Sizesクラスのインスタント化します。この時、SizesクラスでSizes.aspect=1と定義されていたとします。
その後、Cameraクラスのインスタント化します。この時、Cameraクラスで、this.sizes.aspect=5と定義し、返り値として渡します。
すると、Experienceクラス内でthis.sizes.aspectの値は、undefine→1→5の順に変化することになります。
これが、インスタンス化するたびにクラスに情報が溜まるようにする。という処理です。

constructor関数内の全てのオブジェクトプロパティに対しクラスのインスタンス化が終わったら、3の処理が終わり、返り値(this)を渡します。
*/

/*Resource.js は assets.js から今回使うモデルや画像のパブリックパスを受け取る必要があります。
したがって、 assets.jsをインポートし、 Resource クラスのインスタンス化するときの引数として渡します。
また、 Resource クラスで renderer インスタンスのプロパティを使うため、 Renderer クラスの後に Resource クラスをインスタント化します。
*/

/*
resize 関数と update 関数はそれぞれ Sizes クラスと Time クラスが継承した親クラス{EventEmitter}の on 関数により実行される関数です。
on(eventName, Listener)関数は、同じ eventName を持つ emit 関数が実行すると、同期的に実行します。
第二引数の listener は指定された種類のイベントが発生するときに通知を受け取るオブジェクトです。
これは EventListener インターフェースを実装するオブジェクト、あるいは、 JavaScript の関数でなければなりません。
今回は resize 関数、 update 関数を実行するアロー関数を第二引数とします。
*/

export default class Experience{
    static instance;
    constructor(canvas){

        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.time = new Time();
        this.sizes = new Sizes();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resources = new Resources(assets);
        this.theme = new Theme();
        this.world = new World();
        this.preloader = new Preloader();

        this.preloader.on("enablecontrols",()=>{
            document.querySelector(".page").style.overflow = "visible";
            this.controls = new Controls();
        })

        this.sizes.on("resize",()=>{
            this.resize();
        })
        this.time.on("update",()=>{
            this.update();
        })
    }

    resize(){
        this.camera.resize();
        this.world.resize();
        this.renderer.resize();
    }
    update(){
        this.camera.update();
        this.preloader.update();
        this.world.update();
        this.renderer.update();
    }
}
