/*Floor.js はシーンに PlaneGeometry,CircleGeometr を追加する Floor クラスを作成します。

setPlane 関数はシーンに Plane メッシュを追加する関数です。
Mesh( geometry : BufferGeometry, material : Material ) は三角ポリゴン メッシュベースのオブジェクトを表すクラスです。
オブジェクトの構造を定義する Geometry とオブジェクトの外観を定義する Material を引数に渡すことで3Dモデルデータを構築します。
PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer) は平面形状を生成するためのクラスです。
width は x 軸に沿った幅で、 height は Y 軸に沿った高さで、ともにデフォルトは1.0です。
MeshStandardMaterial( parameters : Object ) は Metallic-Roughness ワークフローを使用した標準的な物理ベースマテリアルを適応させるクラスです。
物理ベースのレンダリング (PBR) は、最近、 Unity、 Unreal、 3D Studio Maxなどの多くの3Dアプリケーションで標準になりました。
このアプローチは、光が表面と相互作用する方法に近似を使用する代わりに、物理的に正しいモデルが使用されるという点で、古いアプローチとは異なります。
特定の照明の下で見栄えを良くするためにマテリアルを微調整する代わりに、すべての照明シナリオの下で「正しく」反応するマテリアルを作成できるという考えです。
一方、スペキュラ(鏡面反射光)を指定する MeshLambertMaterial は反射率の計算に非物理ベースのランバート モデルを使用します。
これは一部の表面 (未処理の木材や石など) を適切にシミュレートできますが、鏡面ハイライトのある光沢のある表面 (ニスを塗った木材など) をシミュレートすることはできません。
MeshStandardMaterial はマテリアルの任意のプロパティ ( Materialから継承された任意のプロパティを含む) をここで渡すことができます。
例外はプロパティcolorです。これは 16 進文字列として渡すことができ、0xffffffデフォルトでは (白) です。Color.set ( color ) は内部的に呼び出されます。
side は Material のプロパティで、面のどちら側 (前面、背面、または両方) をレンダリングするかを定義します。デフォルトは THREE.FrontSide です。その他のオプションはTHREE.BackSideまたはTHREE.DoubleSideです。
Plane メッシュは初期値で正面を向いています。メッシュを上向きにさせたいときは、マテリアルの side プロパティと PlaneGeometry の回転の設定を間違えないようにします。


*/

import * as THREE from "three"
import Experience from "../Experience";

export default class Floor{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setPlane();
        this.setCircles();
    }

    setPlane(){
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(64,64),
            new THREE.MeshStandardMaterial({color: 0xffe6a2})
            )
        this.plane.rotation.x = - Math.PI/2
        this.plane.position.y = -0.24;
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);
    }

    setCircles(){
        const geometry = new THREE.CircleGeometry( 5, 64 );
        const material1 = new THREE.MeshStandardMaterial( { color: 0xe5a1aa } );
        const material2 = new THREE.MeshStandardMaterial( { color: 0x8395cd } );
        const material3 = new THREE.MeshStandardMaterial( { color: 0x7ad0ac } );

        this.circle1 = new THREE.Mesh( geometry, material1 );
        this.circle2 = new THREE.Mesh( geometry, material2 );
        this.circle3 = new THREE.Mesh( geometry, material3 );
        this.circle1.position.y = -0.23
        this.circle2.position.x = 2
        this.circle2.position.y = -0.22
        this.circle3.position.y = -0.21
        this.circle1.scale.set(0,0,0);
        this.circle2.scale.set(0,0,0);
        this.circle3.scale.set(0,0,0);
        this.circle1.rotation.x = this.circle2.rotation.x = this.circle3.rotation.x = - Math.PI / 2;
        this.circle1.receiveShadow = this.circle2.receiveShadow = this.circle3.receiveShadow = true;
        this.scene.add( this.circle1 );
        this.scene.add( this.circle2 );
        this.scene.add( this.circle3 );
    }

    resize(){}

    update(){}
}