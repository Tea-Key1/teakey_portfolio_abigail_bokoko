import * as THREE from "three"
import Experience from "./Experience";

/*Renderer.jsでは
HTMLdocumentのcanvasやシーンの全データをWebGLRendererのインスタンス化に渡すことで
実際にキャンバスへレンダリングするRendererクラスを作成します。

このファイルでしか使わないWebGLRenderer使用するためにthree.jsライブラリをインポートします。
constructor関数内でExperienceクラスからSizes～Cameraクラスまでのデータを取得した後、setRendererメソッドを実行します。
setRendererメソッドでは、rendererプロパティでWebGLRendererクラスのインスタンス化をします。
WebGLRenderer はデータをパラメータとして受け取り、キャンバスにレンダリングする関数です。
WebGLRenderer のパラメータとして受け取るのは canvas 要素と antialias ＝ true です。
ここで canvas について注意することがあります。キャンバスを WebGLRenderer に渡さない場合は、

// three.js/src/renderers/WebGLRenderer.js

function createCanvasElement() {

	const canvas = createElementNS( 'canvas' );
	canvas.style.display = 'block';
	return canvas;

}

function WebGLRenderer( parameters = {} ) {

	this.isWebGLRenderer = true;

	const _canvas = parameters.canvas !== undefined ? parameters.canvas : createCanvasElement(),
    ・・・
}

上記のコードの通り、createCanvasElement メソッドが機能し、canvas タグを作って返します。
そうなると次のような問題が発生します。

<body>
<div class="experience">
    <canvas class="experience-canvas"></canvas>
</div>
<script type="module" src="/main.js"></script>
</body>

index.html body の canvas タグ内で3D描画をしてほしかったのに、
script タグ内で canvas タグが作られ、描画されてしまうという問題です。もちろんCSSの設定をやり直す必要が出てきますね。

<body>
<div class="experience">
    <canvas class="experience-canvas"></canvas>
</div>
<script type="module" src="/main.js"></script>
</body>

antialias とは物体の輪郭がギザギザになることを抑える処理のことです。初期値はfalseです。
もちろんアンチエイリアスを有効にすると計算量が増え、動作が重くなる場合があります。

実際にレンダリングするのは WebGLRenderer の Render メソッドです。パラメータは Scene と Camera です。
Render に Scene と Camera オブジェクトを渡すと、カメラの錐台( frustum )の内側にある3Dシーンのオブジェクトが 2D イメージとしてキャンバスにレンダリングされます。
また、 Camera について疑問がありますね。 Camera クラス内で
this.scene.add(this.perspectiveCamera); 
this.scene.add(this.orthographicCamera); 
としたのになぜまた Render メソッドにシーンとカメラに分けてパラメータに渡したのでしょうか。
これは、 canvas レンダリングするメインカメラを決定するためです。シーン内には複数のカメラを用意することができます。
この Render メソッドは連鎖できるため、もし複数のカメラをレンダリングする場合、基本的には後のカメラがメインカメラになります。
また、一つの Render メソッドに複数のシーンとカメラを渡すこともできます。
これは、一つのキャンバス内で View を setScissor メソッドで分割し、複数画面を同時に見たいときに使用します。


*/


export default class Renderer{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
    }

    setRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.renderer.useLegacyLights = true; //PhysicallyCorrectLightよりuseLegacuLightsが推奨されます。

        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.75;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
    resize(){
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
    update(){
        this.renderer.render(this.scene, this.camera.orthographicCamera)
    }
}