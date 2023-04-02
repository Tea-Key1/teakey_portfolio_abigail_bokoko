/* Environment.js はライトをシーンに追加する Environment クラスを作成します。

setSunlight 関数は DirectionalLight クラスと AmbientLight クラスをインスタンス化し、それをシーンに追加する関数です。
DirectionalLight は指向性(特定の方向に放出される)ライトです。
あたかも無限に遠くにあり、そこから生成される光線はすべて平行であるかのように振る舞います。
DirectionalLight クラスに第一引数に色(RGB コンポーネントの数値。デフォルトは 0xffffff)、
第二引数にintensity(ライトの強度/強度の数値。デフォルトは 1)を渡します。
castShadow,shadow,position プロパティは DirectionalLight クラスのプロパティです。(shadow は DirectionalLight によって内部的に使用される DirectionalShadow によって計算されます)
・ castShadow はブール値で入力します。デフォルトは false です。trueにすると動的な影が投射されます。これは負荷が高いため注意が必要です。
・ shadow.camera.far はシーン内ライトのについて、シーンの深度マップを生成するために使用されます。ライトの視点から他のオブジェクトの背後にあるオブジェクトは影になります。
デフォルトはOrthographicCameraで、左と 下が -5 に設定され、 右 と上が5 に設定され、ニア クリッピング プレーンが 0.5、ファークリッピング プレーンが 500 に設定されています。
・ shadow.mapSize.set はシャドウ マップの幅と高さを定義するVector2の数値です。
値が大きいほど、計算時間はかかりますが、シャドウの品質が向上します。
値は、特定のデバイスのWebGLRenderer.capabilities .maxTextureSizeまでの 2 のべき乗である必要がありますが、幅と高さが同じである必要はありません (たとえば、(512, 1024) は有効です)。デフォルトは(512, 512)です。
・ shadow.normalBias はシャドウ マップのクエリに使用される位置が、オブジェクトの法線に沿ってオフセットされる量を定義します。デフォルトは 0 です。
シャドウフィルタリングやシャドウマップに低解像度画像を使用した場合、実際には照らされるべきピクセルが影になって模様を作る、「シャドウアクネ」と言われる現象が発生します。
また、[シャドウアクネ] を回避するための Bias の値を大きくしすぎるとオブジェクトと影が離れて表示される「ピーターパディング」と言われる現象が発生します。
・ position.set はライトの位置を指定します。通常、ライトは上に配置しますよね。
そのとき、Object3D.DEFAULT_UP (0, 1, 0)// LookAt メソッドによって(0,1,0)向くように等しく設定されているため、ライトは上から下に照射されます。

AmbientLight はシーン内の全ての3Dオブジェクトを全体的かつ均等に照らすライトです。
このライトには指向性がないため、シャドウを投影するために使用することはできません。
AmbientLight クラスは第一引数に色(RGB コンポーネントの数値。デフォルトは 0xffffff)、
第二引数にintensity(ライトの強度/強度の数値。デフォルトは 1)を渡します。

Theme クラスのインスタンス theme は eventEmitter を継承しています。
"switch"というイベント名をもつ emit 関数が実行された時 on 関数が実行されます。
on 関数では文字列が定義された theme を引数に switchTheme() 関数を実行します。 

*/
import * as THREE from "three"
import Experience from "../Experience";
import GSAP from "gsap";

export default class Environment{
    constructor(){
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;
        this.scene = this.experience.scene;

        this.setSunlight()


        this.theme.on("switch", (theme)=>{
            this.switchTheme(theme);
        });

    }


    setSunlight(){
        this.sunLight = new THREE.DirectionalLight("#fff",3)
        this.sunLight.castShadow = true;//動的に影を使います。
        this.sunLight.shadow.camera.far = 20;//OrthographicCamera の範囲は far が500はやりすぎなので、20にします
        this.sunLight.shadow.mapSize.set(2048,2048);//オブジェクトの位置が近いため、影の品質が低いとユーザ体験を損ないます。なので、デフォルトの4倍の値を入力します。
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(-1.5,7,3);
        this.scene.add(this.sunLight)

        this.ambientLight = new THREE.AmbientLight("#fff",0.5)
        this.scene.add(this.ambientLight)
    }


    switchTheme(theme){
        if(theme === "dark"){
            GSAP.to(this.sunLight.color,{
                r: 0.01,
                g: 0.02,
                b: 0.06,
            });
            GSAP.to(this.ambientLight.color,{
                r: 0.01,
                g: 0.02,
                b: 0.06,
            });
            GSAP.to(this.sunLight,{
                intensity: 0.78,
            })
            GSAP.to(this.ambientLight,{
                intensity: 0.78,
            })
        }else{
            GSAP.to(this.sunLight.color,{
                r: 255  /255,
                g: 255  /255,
                b: 255  /255,
            });
            GSAP.to(this.ambientLight.color,{
                r: 255  /255,
                g: 255  /255,
                b: 255  /255,
            });
            GSAP.to(this.sunLight,{
                intensity: 1,
            })
            GSAP.to(this.ambientLight,{
                intensity: 1,
            })
        }
    }

    resize(){
    }

    update(){
    }
}