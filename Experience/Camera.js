/*camera.jsではcameraクラスでcameraの設定をします。
cameraの種類は様々ありますが、代表的なcameraはPerspectiveCameraとOrthographicCameraの2種類です。
PerspectiveCameraは透視投影カメラ。実際に目で見たように遠いものは小さく、近いものは大きく表示されます。
OrthographicCameraは平行投影カメラ。遠くにあるモデルも、近くにあるモデルも同じ大きさで表示されます。
今回扱うメッシュは立方体です。PerspectiveCameraを使い立方体を写すと奥行知覚(Depth perception)より長方形に見える場合があります。
それを防ぐためOrthographicCameraを使います。

３次元グラフィックスの基礎として、透視投影の場合、視体積(視野)は錘台(frustum)です。視体積は、その外側にあるオブジェクトのクリッピング（切り取り）に使用します。
逆に内側がPerspectiveCameraにより表示できてレンダリングされる領域として使用します。
したがって、PerspectiveCameraの引数は、fov(画角),aspect(カメラのアスペクト比),near(frustumの近い平面の位置),far(frustumの遠い平面の位置)です。
nearとfarを0.1,1000にするのは分かる。カメラにいっぱい収まるようにしたいからね。
でも、なぜ画角を35mmにするのか。というのは、画角には焦点距離基準というものがあり、それが「35mm基準」というものらしいです。詳しくは分かりませんが、
とりあえず35が基準ということだけおさえましょう。
また、視点(原点）は必ずfrustumの頂点のところに位置し、Z軸は必ず頂上部（あるいは底面）と垂直します。

平行投影の場合、視体積は直方体です。表示されたオブジェクトの大きさとカメラからの距離と関係がありません。
したがって、OrthographicCameraの引数は直方体の面に合わせてleft,right,top,bottom,near,farです。
この時、投影されるシーンが上下や左右に引き伸ばされて表示されたら没入感が低くなります。
top,bottomは変数として Sizes クラスで定義した frustum=5(適当な値、3でも10でもいいが、小さすぎるとオブジェクトが大きく見え、大きすぎるとオブジェクトが小さく見えてしまう)とし、その1/2を正負で入力し、
left,rightはアスペクト比*frustumの1/2を正負で入力することで、引き伸ばしがない平行投影ができます。
あとはnearとfarに適当な値を入力します。 Plane メッシュを下に引くため、 far の値が小さければメッシュの途中で切れてしまうように見えます。大きな数字を入力します。

Z軸は両端の平面と垂直します。両端の平面が視点の前方にある場合、負のｚ値、後方にあれば正のｚ値を使用します。

*/
/*今回はsingletonを意識していますが、さすがにPerspectiveCameraとOrthographicCameraのインスタンス化はCameraクラスでしか行わないため、モジュールのインスタンス化にExperience.jsを経由しません。

export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
    }
    ・・・
}

コンストラクタ関数内の処理を説明します。ExperineceクラスでCameraクラスをインスタント化したとき、Cameraクラスのコンストラクタ関数の処理が開始されます。
まず、空のthisオブジェクトに対し、Experienceクラスのインスタント化experienceプロパティを定義します。
ここで、Experienceクラスのコンストラクタ関数の処理に移ります。

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

Experienceクラスのコンストラクタ関数の処理では、はじめにExperience.instanceが定義されているかif文で確認しています。
Experience.instance=thisで定義されているため、Experience.insatnceが返されます。また、Experience.instanceのプロパティについてはCameraクラスのインスタント化までに定義された
canvas~sizesまでのプロパティが定義されています。
その後、Cameraクラスのコンストラクタ関数の処理の続きに移ります。
CameraのthisプロパティにExperience.instanceのプロパティの値を代入し、
処理をして、返り値を返します。

カメラをシーンに追加していますが、three.js ではカメラは他のオブジェクトとは異なり、 Camera として機能するには Scene に追加される必要がありません。
ではいつ Scene にカメラオブジェクトを追加(add)するのかというと、他のオブジェクト同様に、カメラと他オブジェクトを parent 化して相対移動させたいときに追加します。
*/
import * as THREE from "three"
import Experience from "./Experience";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        this.setOrbitControls();
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            1000
        );
        this.scene.add(this.perspectiveCamera);
        // this.perspectiveCamera.position.x = 29
        // this.perspectiveCamera.position.y = 14
        // this.perspectiveCamera.position.z = 12
    }

    createOrthographicCamera(){
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum)/2,
            (this.sizes.aspect * this.sizes.frustrum)/2,
            this.sizes.frustrum/2,
            -this.sizes.frustrum/2,
            -100,
            100
        );
        this.orthographicCamera.position.y = 2.1;
        this.orthographicCamera.position.z = 4.5;
        this.orthographicCamera.rotation.x = -Math.PI/8

        this.scene.add(this.orthographicCamera); 

        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        // const size = 20;
        // const divisions = 20;

        // const gridHelper = new THREE.GridHelper(size, divisions);
        // this.scene.add(gridHelper);

        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
    }

    resize(){
        // Updating Perspective Camera Resize
        this.perspectiveCamera.aspect = this.sizes.aspect
        this.perspectiveCamera.updateProjectionMatrix();

        // Updating Orthographic Camera Resize
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum)/2
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum)/2
        this.orthographicCamera.top = this.sizes.frustrum/2
        this.orthographicCamera.bottom = -this.sizes.frustrum/2
        this.orthographicCamera.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
        // console.log(this.perspectiveCamera.position)
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.rotation.copy(this.orthographicCamera.rotation);

    }
}