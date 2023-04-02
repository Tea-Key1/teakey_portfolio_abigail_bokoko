/*Resources.jsは asset.js からリソースをロード、保存し、好きな時にそれらにアクセスできるようにします。
上記の役割のために、Resource クラスをインスタント化するとき、assets ファイルのリストを引数として渡されています。

constructor(assets){
    super();
    this.experience = new Experience()
    this.renderer = this.experience.renderer;

    this.assets = assets;
    this.items = {};
    this.queue = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoaders();
}

コンストラクタ関数の引数に assets とし、 assets の値が入った this.assets プロパティを定義します。
EventEmitter クラスのプロパティを継承するため、super()を書きます。
EventEmitter クラスから継承して使用する関数は emit 関数と on 関数です。

items プロパティはリスト型にし、ロードしたアイテムをここに保存します。
queue プロパティは ロードされるアセットが全部でいくつあるのかを知らせます。
loaded プロパティは いくつのアセットがすでにロードされたのか知らせます。もちろん初期化は0です。


setLoaders(){
    this.loaders ={};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.dracoLoader.setDecoderConfig({type:"js"})
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
}

setLoaders 関数はインポートしたローダをインスタント化し、その設定をする関数です。
インポートする2つのローダライブラリは GLTFLoader と DRACOLoader です。
GLTFLoader は glTF アセットを読み込み、拡張子を識別し、必要な場合にはローダそのものをを変えながら( DRACOLoader に変更するなど)ファイルを解析し、ライブラリです。
DRACOLoaderは、3D メッシュと点群を圧縮および解凍するためのオープンソースライブラリです。
GLTFLoader は glFTアセットを解析できる分、ロードの範囲が広いです。しかし、ファイルが圧縮されている3Dモデルは対応していません。
一方でDRAGOLoader はファイルが圧縮されている3Dモデルを解析できます。
glTF アセットは、メッシュ、マテリアル、テクスチャ、スキン、スケルトン、モーフ ターゲット、アニメーション、ライト、および/またはカメラを含む 1 つまたは複数のシーンのことです。
今回はファイルが圧縮された3Dモデル、画像・動画ファイルを使用します。3Dモデルのファイルには DRACOLoader が割り当てられ、 
画像・動画ファイルには GLTFLoader が割り当てられるようにします。
また、二つのローダは互いに独立して使用できるわけではありません。
DRACOLoader を使用する場合、DRACOLoader のインスタンスが GLTFLoader によって内部的に使用されます。
GLTFLoader ライブラリ内で以下のように DRACO がインスタント化されています。

setDRACOLoader( dracoLoader ) {

    this.dracoLoader = dracoLoader;
    return this;

}

loader は複数のローダを入れるオブジェクトです。
loaderオブジェクトの gltfLoader プロパティにインスタント化した GLTFLoaderを入れます。
setDecoderPath は draco_decoder.js と draco_decoder.wasm が入ったファイルのパスをセットします。
setDecoderConfig は js と wasm のどちらの decoder を使うかを決めます。
デフォルトは wasm ですが、いくつかのブラウザでサポートされていない可能性があります。(多分大丈夫ですが) type:"js" を選択します。
gltfLoader.setDRACOLoader = this.loader.dracoLoader とすると、 GLTFLoader で DRACOLoader が使えるようになります。


for(const asset of this.assets){
            if(asset.type === "glbModel" ){
                this.loaders.gltfLoader.load(asset.path,(file)=>{
                    this.singleAssetLoaded(asset, file);
                });
            }
            else if(asset.type === "videoTexture" ){・・・}
        }
    }
}

startLoading 関数はリソースの type によって、必要な場合にはローダを変えながらロードする関数です。
for of 文を使い、イテラブルな assets 連想配列の一要素ずつ asset オブジェクトに代入し、 type が "glbModel"の場合、 GLTFLoader の load 関数を実行します。
load 関数は引数にパスを渡すと、URL からの読み込みを開始し、解析された返り値( object )を使用してコールバック関数を呼び出します。
したがって、 asset オブジェクトの path プロパティを引数として渡し、
返り値( object )を file という名前にして asset オブジェクトと file オブジェクトを引数として渡した singleAssetLoaded 関数( load 関数のコールバック関数)を呼び出します。
通常、画像・動画ファイルをブラウザで表示させるには、 DOM ツリーに追加させれば済みます。
しかし、 three.js で使用するために、いくつか処理を行う必要があります。
(例えば、画像・動画を three.js で使用するためには DOM ツリーに追加する必要はありませんが、 HTML element プロパティを取得する必要があります)
したがって、type が "videoTexture"の場合、以下の処理を行います。

else if(asset.type === "videoTexture" ){
    this.video = {};//video オブジェクトを作成します。このオブジェクトは画像・動画の html 部分に関する全てを持ちます。
    this.videoTexture = {};//videoTexture オブジェクトを作成します。このオブジェクトは画像・動画の解析されたファイルデータを全て持ちます。

    this.video[asset.name] = document.createElement("video");//　asset.name に定義された値を video オブジェクトのプロパティ名とし、そのプロパティの値に HTML 要素の <video> タグを代入します。
    this.video[asset.name].src = asset.path;//画像・動画ファイルのの URL として asset の path の値を入れます
    this.video[asset.name].muted = true;//ユーザ体験を保護するためミュートにします。
    this.video[asset.name].playsInline = true;//初期値は false です。省略可能ですが、一部iPhoneでブラウザを開いたとき、動画が再生されない場合があります。したがって、true にします。
    this.video[asset.name].autoplay = true;//自動再生させます。
    this.video[asset.name].loop = true;//反復再生させます
    this.video[asset.name].play();// autoplay = true にしていますが、一部ブラウザを開いたとき、動画が再生されない場合があります。したがって、メソッドを実行します。

    this.videoTexture[asset.name] = new THREE.VideoTexture(
        this.video[asset.name]
    );
    // this.videoTexture[asset.name].flipY = false;//反転しません
    this.videoTexture[asset.name].minFilter = THREE.NearestFilter;// THREE.NearestFilter を使用します。
    this.videoTexture[asset.name].magFilter = THREE.NearestFilter;// THREE.NearestFilter を使用します。
    this.videoTexture[asset.name].generateMipmaps = false;//ミップマップは使いません。
    this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;// THREE.sRGBEncoding を使用します。

    this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
}


<video> は HTML の要素で、文書中に動画再生に対応するメディアプレイヤーを埋め込みます。
muted,playsInline,autoplay,loop は video が持つ属性です。
それぞれの属性について説明します。
・ src 属性は埋め込む動画への URL を指定します。
・ muted 属性は論理型の属性で、動画に含まれる音声の既定の設定を示します。この属性を設定すると、初期状態が消音になります。
    既定値は false であり、動画再生時に音声も再生することを表します。
・ playsInline 属性は論理属性で、動画を「インライン」で再生する、すなわち要素の再生領域内で再生するかを指定します。
・ autoplay 属性は論理属性です。この属性が指定された場合、データの読み込みが完了し、再生可能な状態になった時点で即座にコンテンツの再生が始まります。
    通常、ユーザが期待していない、あるいは望んでいないときに自動的に音声を再生すると、ユーザに不快な体験をさせることになるため、ほとんどの場合避けるべきですが、例外も存在します。
・ loop 属性は論理型の属性です。指定された場合、ブラウザーは動画の末尾に達すると、自動的に先頭に戻ります。
・ play メソッドは HTMLMediaElement から継承したメソッドで、再生を開始します。
HTMLMediaElement インターフェイスは、 HTMLElement に音声や動画で一般的なメディアに関する基本的な能力の対応に必要なプロパティやメソッドを追加します。
HTMLVideoElement および HTMLAudioElement 要素はどちらも、このインターフェイスを継承しています。

それぞれの属性を定義した video オブジェクトを引数として、 VideoTexture クラスをインスタンス化します。
VideoTexture クラスはビデオを使用するテクスチャを作成します。このビデオテクスチャは three.js で使用することができます。
VideoTexture クラスは Texture クラスを継承しています。 minFilter,magFilter,generateMipmaps,encoding プロパティは Texture クラスから継承されたプロパティです。

・flipY プロパティはブール値です。テクスチャは GPU にアップロードされるときに垂直軸に沿って反転するかどうかを入力します。デフォルトは true です。
Texture クラスの transformUv(uv) メソッドで実行されます。

transformUv( uv ) {

    if ( this.mapping !== UVMapping ) return uv;

    uv.applyMatrix3( this.matrix );
    ・・・
    if ( this.flipY ) {

        uv.y = 1 - uv.y;

    }

    return uv;

}
・ minFilter はテクセル(テクスチャを構成する画素)が1ピクセル未満をカバーする場合のテクスチャのサンプリング方法を入力します。デフォルトは THREE.LinearFilter です。
THREE.LinearFilter は最も近い4つのテクセルを取り、それらの間で線形補間する方法です。
他のオプションとして THREE.NearestFilter が上げられます。これは最も近いテクセルの値を使用する方法です。
THREE.NearestFilter の方は拡大した場合はブロックノイズは生じ、縮小時に使用するとディティールが大幅に失われるため、THREE.LinearFilter の方がより高度なフィルタです。
・ magFilter はテクセルが複数のピクセルをカバーする場合のテクスチャのサンプリング方法を入力します。デフォルトは THREE.LinearFilter です。
・ generateMipmaps プロパティはブール値です。テクスチャのミップマップを (可能な場合) 生成するかどうかを入力します。デフォルトは true です。
ミップマップを手動で作成する場合は、これを false に設定します。
・ encoding はテクスチャのエンコーデイングプロパティを入力します。色空間の符号化に対するアプローチが違います。
入力できるエンコードプロパティは以下の四つで、 THREE.LinearEncoding がデフォルトです。
THREE.LinearEncoding
THREE.sRGBEncoding
THREE.BasicDepthPacking
THREE.RGBADepthPacking

singleAssetLoaded(asset,file){
    this.items[asset.name] = file;
    this.loaded++;
    if(this.loaded === this.queue){
        this.emit("ready")
    }
}

singleAssetLoaded 関数は startLoading 関数において、1つの asset がロードされると呼び出され、
実際にロードされた数とts 連想配列の要素数が一致したら、インポートしておいた EventEmitter クラスの emit メソッド( Event 名は"Ready")を実行する関数です。
引数として渡された2つのオブジェクト asset と file はアセット名とglTFデータを結びつけ items オブジェクトに保存します。
this.items[asset.name] = file;
asset.name に定義された値を items オブジェクトのプロパティ名とし、そのプロパティの値に file オブジェクトを代入しています。
this.loaded++;で singleAssetLoaded 関数が呼ばれた回数を記録します。
loaded と queue が等しい時、 emit(eventName:"ready") 関数を実行します。
全てのアセットがロードされ、 items オブジェクトに保存された時、 emit 関数が実行されます。
*/

import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Experience from "../Experience";

export default class Resources extends EventEmitter{
    constructor(assets){
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;
        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders ={};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.dracoLoader.setDecoderConfig({type:"js"})
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }
    
    startLoading(){
        for(const asset of this.assets){
            if(asset.type === "glbModel" ){
                this.loaders.gltfLoader.load(asset.path,(file)=>{
                    this.singleAssetLoaded(asset, file);
                });
            }
            else if(asset.type === "videoTexture" ){
                this.video = {};
                this.videoTexture = {};

                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].src = asset.path;
                this.video[asset.name].muted = true;
                this.video[asset.name].playsInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                this.videoTexture[asset.name] = new THREE.VideoTexture(
                    this.video[asset.name]
                );
                // this.videoTexture[asset.name].flipY = true;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

                this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
            }
        }
    }
    singleAssetLoaded(asset,file){
        this.items[asset.name] = file;
        this.loaded++;

        if(this.loaded === this.queue){
            this.emit("ready")
        }
    }
}