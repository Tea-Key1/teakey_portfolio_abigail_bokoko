/* Room.js はアセットデータがすべて入った連想配列 items オブジェクトから room (プロパティ名)の値を取りだし、
3dオブジェクトを編集するクラスです。

items オブジェクトから room (プロパティ名)の値を room オブジェクトに代入します。 room オブジェクトには glb ファイル全体(scene,scenes,asset,animation・・・)が入ります。
items オブジェクトは Room クラスがインスタンス化される時には全てのアセットが連想配列として入っています。
room オブジェクトから scene (プロパティ名)の値を actualRoom オブジェクトに代入します。 actualRoom オブジェクトには glb ファイルの scene オブジェクトが入ります。
room オブジェクトから animations (プロパティ名)の値を animations オブジェクトに代入します。 animations オブジェクトには glb ファイルの animations 配列が入ります。
scene には 3Dオブジェクトのデータ(isObject3D,uvid,name,type,parent...)が入っています。
このオブジェクトを Scene クラスの add 関数の引数として渡し、関数を実行するとレンダリングされるシーンに追加されます。

setModel 関数は actualRoom オブジェクトを編集し、シーンに追加する関数です。
actualRoom の children 配列は、2種類のオブジェクトタイプが複数あります。
シングルオブジェクトの "Mesh" と複数の "Mesh" オブジェクトで構成される "Group" 配列です。
3Dオブジェクトはデフォルトでシャドウを投影しないなので、このままシーンに追加するとシャドウマップが現実と大きく乖離します。

this.actualRoom.children.forEach((child)=>{
    child.castShadow = true;
    child.receiveShadow = true;

    if(child instanceof THREE.Group){
        child.children.forEach((groupChild)=>{
            groupChild.castShadow = true;
            groupChild.receiveShadow = true;
        });
    }
    ・・・
})

actualRoom オブジェクトの children 配列に forEach 文を使いコールバック関数としてアロー関数を実行します。
アロー関数では children 配列の各要素を child オブジェクトに入れ、 Mesh オブジェクトが影を投影できるようにします。
Group は配列です。 Group に影を投影できるようにしてもその子要素が影を投影しません。
instanceif 文を使い、 child オブジェクトの名称が THREE.Group の場合、child はさらに子を持つことが分かります。
child オブジェクトの children 配列に forEach 文を使いコールバック関数としてアロー関数を実行します。
アロー関数では children 配列の各要素を groupChild オブジェクトに入れ、 Mesh オブジェクトが影を投影できるようにします。
THREE.Group クラスは "Group" タイプを返します。 THREE.Group クラスの目的は、オブジェクトのグループでの作業を構文的に明確にすることです。

いくつかのマテリアルに対し処理を行います。
アロー関数内ではactualRoomの children 配列から child オブジェクトが参照できます。また、参照するオブジェクトがグループ Mesh の場合、その子オブジェクトは、actualRoom の孫オブジェクトです。

if(child.name === "aquarium"){
    child.children[7].material = new THREE.MeshPhysicalMaterial();
    child.children[7].material.roughness = 0;
    child.children[7].material.color.set(0x549dd2);
    child.children[7].material.ior = 1.5;
    child.children[7].material.transmission = 1;
    child.children[7].material.opacity = 0.5;
}
if(child.name === "shelve"){
    child.children[11].material = new THREE.MeshPhysicalMaterial();
    child.children[11].material.roughness = 0;
    child.children[11].material.color.set(0xffffff);
    child.children[11].material.ior = 1.5;
    child.children[11].material.transmission = 1;
    child.children[11].material.opacity = 0.5;
}
if(child.name === "computer"){
    child.children[0].material = new THREE.MeshBasicMaterial()
    child.children[0].material.map = this.resources.items.screen;
}

グループ Mesh の名前が"aquarium", "shelve", "computer" の時、グループ Mesh の配列から特定のマテリアルオブジェクトに THREE.MeshPysicalMaterial,THREE.MeshBasicMaterial クラスのインスタンス化をします。
THREE.MeshPysicalMaterial クラスは MeshBasicMaterial クラスとマテリアルオブジェクトを継承していて、より高度な物理ベースのレンダリング プロパティを提供します。
主に、ガラス質のマテリアルを作るときに使います。
roughness,color.set は MeshBasicMaterial のプロパティ、 ior,transmission は MeshPysicalMaterial のプロパティ、opacity は Material オブジェクトのプロパティです。
・ roughness は素材の粗さで、デフォルトは1.0です。0.0は滑らかなミラー反射を意味し、1.0は完全に拡散することを意味します。
roughnessMap も指定されている場合は、両方の値が乗算されます。
・ color.set はマテリアルの色。デフォルトでは白 (0xffffff) に設定されています。
・ ior は1.0から2.333までの非金属の屈折率で、デフォルトは1.5です。
・ transmission は0.0から1.0までの透過率(または光透過率)で、デフォルトは0.0です。
薄い、透明または半透明のプラスチックまたはガラス マテリアルは、完全に透過性がある場合でも、大部分が反射性のままです。透過特性を使用して、これらの材料をモデル化できます。
透過率がゼロ以外の場合、opacity(不透明度)は0.0に設定する必要があります。
・ opacity は範囲内のフロート0.0~1.0マテリアルの透明度を示します。0.0の値は完全に透明であることを示し、1.0は完全に不透明です。デフォルトは1.0です。

THREE.MeshBasicMaterial クラスはシンプルなシェーディング (フラットまたはワイヤーフレーム) でジオメトリを描画するためのマテリアルを返すクラスです。
このマテリアルはライトの影響を受けません。
・ map はカラーマップ( texture )を指定します。デフォルトは null です。オプションでアルファ チャネルを含めることができ、通常は .transparentまたは.alphaTestと組み合わせます。
screen データは THREE.VideoTexture によって texture として使用できるようになっています。 

setAnimation(){
    this.mixer = new THREE.AnimationMixer(this.actualRoom)
    this.room.animations.forEach((AnimationClip)=>{
        const AnimationAction = this.mixer.clipAction(AnimationClip);
        AnimationAction.play();
    });
}

3Dモデルが全体的に大きいと感じたら actualRoom.scale.set(x,y,z) で直します。
全ての3Dオブジェクトの設定が終わったら、 actualRoom を引数としてScene クラスの add 関数に渡し、関数を実行します。

setAnimation 関数は AnimationMixer クラスを用いて、glb ファイルの Animations 配列にある AnimationClip を全て再生する関数です。
AnimationClip は再利用可能なアニメーションキーフレームトラックセットです。
この再利用可能は0フレームからはじまり、トラック内の全てのアニメーショントラックが再生終了したらまた0フレームから再生できることを指します。
AnimationMixer クラスの引数にはこのミキサーによってアニメーションが再生される actualRoom オブジェクトを渡します。
Animations 配列にあるアニメーションを全て同時に再生させるため、room オブジェクトの animations 配列に forEach 文を使いコールバック関数としてアロー関数を実行します。
アロー関数では animations 配列の要素 AnimationClip オブジェクトを引数に入れ、 clipAction メソッドを実行し、 AnimationAction を再生します。
引数として AnimationClip を渡した clipAction メソッドを実行し、返り値を AnimationAction オブジェクトに入れます。
clipAction メソッドは引数として渡されるクリップの AnimationAction を返すメソッドです。クリップは animations という名前の配列である必要があります。
また、 AnimationMixer インスタンスにもアニメーションがありますが、プロパティ名がアンダースコアで外部参照非推奨です。
したがって、room オブジェクトの animations 配列の要素が入った AnimationClip を clipAction メソッドの引数に渡す必要がありました。
AnimationAction は実際に実行するアニメーションの状態やパラメータを管理するオブジェクトです。
AnimationAction の play メソッドを実行すると、アクションをアクティブにするようにミキサーに指示します。このメソッドは連鎖できます。(同期的に実行できます)
ミキサーの update メソッドに delta タイムを渡し、アニメーションを1フレームずつ更新します。

this.lerp.current = GSAP.utils.interpolate(
    this.lerp.current,
    this.lerp.target,
    this.lerp.ease
);

lerp オブジェクトは線形補間に使用する数字を定義したオブジェクトです。GSAP(GreenSock Animation Platform)は JavaScript アニメーションライブラリです。
軽量かつパフォーマンス・機能性に優れたライブラリで、簡単にアニメーションを実装できることが特徴です。GSAP の utils は様々なユーティリティ関数を持っているオブジェクトです。
utils の interpolate(startValue, endValue, progress) は同様のタイプの2つの値の間を直線的に補完する非常に柔軟なメソッドです。返り値 progress は startValue と endValue の間の値です。

onMouseMove 関数は window の mousemove イベントが実行された時、 lerp の target プロパティにマウスポインタがブラウザの表示エリアの値(左端で-1.0、右端で1.0)を取る関数です。
取得するイベントリスナーはローカル (DOM コンテンツ) 座標における、 clientX (マウスポインターの X 座標)です。clientX は ブラウザの表示エリア左を原点とする座標です。
this.lerp.target = (( e.clientX - window.innerWidth / 2) * 2) /window.innerWidth これで、 lerp の target プロパティが目的の値を取ることができます。
update 関数でフレーム毎に this.lerp.target の値が interpolate メソッドの引数 endValue に代入され、 target と current の 間の値が返り値(current)として渡されます。

interpolate を使用することで、滑らかに値の変化をすることができます。

roomChildren 連想配列を空の状態で宣言し、3Dオブジェクトの要素 child の各名前で要素を追加します。
3Dオブジェクトでない "aquariumLight","lampLight" は "aquariumLight","lampLight" の名前で要素を追加します。


*/

import * as THREE from "three"
import Experience from "../Experience";
import GSAP from "gsap"

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {}
        
        this.lerp = {
            current:0,
            target:0,
            ease:0.1
        }

        this.setModel()
        this.setAnimation();
        this.onMouseMove();        
    }

    setModel(){
        this.actualRoom.children.forEach((child)=>{
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupChild)=>{
                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;
                });
            }
            if(child.name === "aquarium"){
                child.children[7].material = new THREE.MeshPhysicalMaterial();
                child.children[7].material.roughness = 0;
                child.children[7].material.color.set(0x549dd2);
                child.children[7].material.ior = 1.5;
                child.children[7].material.transmission = 1;
                child.children[7].material.opacity = 0.5;
            }
            if(child.name === "shelve"){
                child.children[11].material = new THREE.MeshPhysicalMaterial();
                child.children[11].material.roughness = 0;
                child.children[11].material.color.set(0xffffff);
                child.children[11].material.ior = 1.5;
                child.children[11].material.transmission = 1;
                child.children[11].material.opacity = 0.5;
            }
            if(child.name === "computer"){
                child.children[0].material = new THREE.MeshBasicMaterial()
                child.children[0].material.map = this.resources.items.screen;
            }
            if(child.name === "lamp"){
                child.children[1].material = new THREE.MeshPhysicalMaterial();
                child.children[1].material.roughness = 0;
                child.children[1].material.color.set(0xffffff);
                child.children[1].material.ior = 2;
                child.children[1].material.transparent = true;
                child.children[1].material.opacity = 0.1;
            }
            if(child.name === "mini_floor"){
                child.position.set(-1.23972,0.462171,2.34538)
            }
            if(child.name === "cube"){
                child.position.set(0,0.2,0)
            }
            
            child.scale.set(0,0,0)
            this.roomChildren[child.name.toLowerCase()] = child;
        })

        const aquariumLight = new THREE.RectAreaLight( 0xffffff, 0);
        aquariumLight.position.set( 2.5, 3, 0.5 );
        aquariumLight.rotation.x = - Math.PI / 2;
        aquariumLight.rotation.z = Math.PI / 4;    
        this.roomChildren['aquariumLight'] = aquariumLight;
        this.roomChildren['aquariumLight'].name = "aquariumLight";
        this.actualRoom.add( aquariumLight );

        const lampLight = new THREE.PointLight( 0xffffff, 0, 0.9, 2 );
        lampLight.position.set( -3.2, 4.4, -0.3 );
        this.roomChildren['lampLight'] = lampLight;
        this.roomChildren['lampLight'].name = "lampLight";
        this.actualRoom.add( lampLight );

        const floorLight = new THREE.PointLight( 0xffffff, 0, 0.9, 2 );
        floorLight.position.set( -2.88128,0.45,3.8079 );
        this.roomChildren['floorLight'] = floorLight;
        this.roomChildren['floorLight'].name = "floorLight";
        this.actualRoom.add( floorLight );

        // const helper = new THREE.PointLightHelper( floorLight , 0.1);
        // this.scene.add( helper )

        this.scene.add(this.actualRoom);
    }

    setAnimation(){
        this.mixer = new THREE.AnimationMixer(this.actualRoom)
        this.room.animations.forEach((AnimationClip)=>{
            const AnimationAction = this.mixer.clipAction(AnimationClip);
            AnimationAction.play();
        });
    }

    onMouseMove(){
        window.addEventListener("mousemove",(e)=>{
            this.lerp.target = ((( e.clientX - window.innerWidth / 2) * 2) / window.innerWidth)*0.1
        })
    }

    resize(){}

    update(){
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.actualRoom.rotation.y = this.lerp.current;
        this.mixer.update(this.time.delta*0.001);
    }
}