/* Controls.js は全てのコントロールをする Controls クラスを作成します。
GSAP の registerPlugin( MotionPathPlugin 、TextPlugin ); はプラグインを登録するメソッドです。
このメソッドは、プラグインをロードした後に、GSAP のコアにプラグインを認識させ、ビルドツールの使用時にツリーシェイクが発生しないようにするために使用します。
モダンな JavaScript アプリケーションの開発では、webpackやRollupのようなモジュールバンドラーが複数の JavaScript ファイルを 1 つにまとめられます。
この際に実行されないコードを削除(ツリーシェイク)されます。削除されないためにプラグイン登録する必要がありました。
ScrollTrigger は最小限のコードで驚異的なスクロールベースのアニメーションを作成する関数です。
また、アニメーションとは関係なくても、スクロール関連のモノをトリガーします。

ScrollTrigger のプロパティについての補足
・ trigger 文字列。通常のドキュメントフロー内の位置を持つ要素で、ScrollTrigger の開始位置を計算するために使用される。
・ markers オブジェクトか論理値。開発段階で役立つマーカーを追加する。デフォルトは (startColor: "green", endColor: "red", fontSize: "16px", fontWeigth: "normal", indent: 0) 。
・ start 文字列、数字、関数。ScrollTrigger の開始位置を計算する。
文字列の場合、文字列と一致するトリガー上の場所とスクローラー上の場所を記述します。"top top"とすると、「トリガーの上部がスクローラーの上部にあたったときトリガーする」になります。
数字の場合、正確なスクロール値を定義する。"200"とすると、「ビューポートから200ピクセルスクロールするとトリガーする」になります。
・ end 文字列、数字、関数。ScrollTrigger の終了位置を計算する。
文字列の場合、ScrollTriggerを終了するために満たす必要があるスクローラー上の場所を記述します。"bottom bottm"とすると、「endTrigger の下部がスクローラーの下部に当たったとき終了する」になります。
数字の場合、正確なスクロール値を定義する。"200"とすると、「ビューポートから200ピクセルスクロールすると終了する」になります。
・ scrub ブール値/数字。アニメーションの進行状況をスクロールバーに直接リンクして、再生ヘッドがスクロールバーの位置に追いつくのに少し時間がかかるように、スムージングを適用できます。
Boolean の場合、scrub: trueアニメーションの進行状況を ScrollTrigger の進行状況に直接リンクします。
数字の場合、再生ヘッドが「追いつく」のにかかる時間 (秒単位)を指定します。
・ invalidateOnRefresh ブール値。true なら ScrollTrigger に関連着けられたアニメーションは、refrech()(通常はサイズ変更時)が発生するたびに invalidate()メソッドが呼び出されます。
これにより、内部に計算された開始値と終了値がリフレッシュされます。
・ pin ブール値/文字列/要素。 ScrollTrigger がアクティブになっている間、ピン止めされる要素を指定します。
指定した要素は、残りのコンテンツがスクロールし続けていいる間、開始位置に固定されているように見えます。
・ pinSpacing 文字列/要素。デフォルトでは、ピン止め要素がピン止めを回御された時に皇族コンテンツがちゃんと追いつくように、他の要素を押し下げるための padding が下部に追加されます。これがないと、固定された要素の下をスクロールしてしまいます。
false を設定することで、 ScrollTrigger にこの padding を追加しないようにすることができます。


timeline は、Tween やその他のタイムラインコンテナとして機能する強力で連続的なツールメソッドで、全体を簡単に制御し、タイミングを正確に管理します。
delay タイムラインがなければ、アニメーションごとに使用する必要があるため、複雑なシーケンスを作成するのは遥かに面倒です。
Tween は、高性能なプロパティセッターのように全てのアニメーション作業を行ういます。
Tween を作成する一般的な方法(これらのメソッドはすべて Tween インスタンスを返します):
・ gsap.to()    要素の現在の状態から開始し、 Tween で定義された値までアニメーション化します。
・ gsap.from()  Tween で定義された値から、要素の現在の状態までアニメーション化します。
・ gsap.fromTo()Tween で定義された開始値と終了値の両方を定義します。
・ gsap.set     プロパティを即時に設定します。

setScrollTrigger 関数はブラウザ幅で特定のスクロールイベントを行います。
ブラウザ幅が986px以上の時、
GSAP.timeline に読み取り専用の scrollTrigger プロパティを渡し、インスタンス化します。　インスタンス this.firstMoveTimeline にはアニメーションを特定のスクロールタイミングで開始/終了することなどを設定します。
何をどのように動かすかを to(targets(プロパティをアニメートするオブジェクト),vars(アニメートするすべてのプロパティ/値、またはアニメーションが完了したときに呼び出す関数 onComplete 関数などの特別なプロパティを含むオブジェクト)) メソッドで実行します。
3Dオブジェクトが動くように見せるとき、カメラを固定してオブジェクトを動かすのか、オブジェクトを固定してカメラを動かすのかは状況によって判断する必要があります。
.first-margin,.second-margin ではカメラを固定してオブジェクトを移動拡大していますが、オブジェクトシーンのライト要素を連動して動かすことが難しい。 .third-margin ではオブジェクトを固定してカメラを移動させます。
, "-=0.2"

*/

import Experience from "../Experience";
import GSAP from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'

export default class Controls{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach(child=>{
            if(child.name==="aquariumLight"){ this.aquariumLight = child }
            if(child.name==="lampLight"){ this.lampLight = child }
            if(child.name==="floorLight"){ this.floorLight = child }
        })
        this.circle1 = this.experience.world.floor.circle1;
        this.circle2 = this.experience.world.floor.circle2;
        this.circle3 = this.experience.world.floor.circle3;

        GSAP.registerPlugin(ScrollTrigger);
        this.setupLenisScroll()
        this.setScrollTrigger();
    }


    setupLenisScroll(){
        const lenis = new Lenis()
        lenis.on('scroll', ScrollTrigger.update)

        GSAP.ticker.add((time)=>{
        lenis.raf(time * 1000)
        })
        function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
        }
    }

    setScrollTrigger(){
        ScrollTrigger.matchMedia({

            // Desktop
            "(min-width: 986px)": ()=> {

                this.room.scale.set(0.24,0.24,0.24);
                this.room.position.set(0,0,0);
                this.aquariumLight.width = 0.7;
                this.aquariumLight.height = 0.7;
                this.lampLight.distance = 0.9;
                this.lampLight.decay = 2;

                // First section //
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.position,{
                    x: this.sizes.width * 0.001,
                });

                // Second section//
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                })
                .to(this.room.position,{
                    x: 0,
                    z: this.sizes.height * 0.0032
                },"same")
                .to(this.room.scale,{
                    x: 0.6,
                    y: 0.6,
                    z: 0.6,
                },"same")
                .to(this.aquariumLight,{
                    width : 0.7 * 3,
                    height: 0.7 * 3,
                },"same")
                .to(this.lampLight,{
                    intensity: 0.4 * 3,
                    distance: 0.9 * 3,
                },"same");

                // Third section //
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.camera.orthographicCamera.position,{
                    y: -1,
                    x: -3,
                });
            },

            // Mobile
            "(max-width: 986px)": ()=> {

                this.room.scale.set(0.15,0.15,0.15);
                this.room.position.set(0,0,0);
                this.aquariumLight.width = 0.5;
                this.aquariumLight.height = 0.5;
                this.lampLight.distance = 0.9;
                this.lampLight.decay = 2;

                // First section //
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.scale,{
                    x: 0.2,
                    y: 0.2,
                    z: 0.2,
                })

                // Second section//
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.position,{
                    x: 1,
                }, "same").to(this.room.scale,{
                    x: 0.3,
                    y: 0.3,
                    z: 0.3,
                }, "same").to(this.lampLight,{
                    intensity: 0.9,
                    decay: 2,
                }, "same")
                    
                // Third section //
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.position,{
                    z: -4.5,
                })
            },

            all: ()=> {
                this.sections = document.querySelectorAll(".section")
                this.sections.forEach(section=>{
                    this.progressWrapper = section.querySelector(".progress-Wapper")
                    this.progressBar = section.querySelector(".progress-bar")

                    if(section.classList.contains("right")){
                        GSAP.to(section,{
                            borderTopLeftRadius: 10,
                            scrollTrigger:{
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            }
                        })
                        GSAP.to(section,{
                            borderBottomLeftRadius: 700,
                            scrollTrigger:{
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            }
                        })
                    }else if(section.classList.contains("left")){
                        GSAP.to(section,{
                            borderTopRightRadius: 10,
                            scrollTrigger:{
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            }
                        })
                        GSAP.to(section,{
                            borderBottomRightRadius: 700,
                            scrollTrigger:{
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            }
                        })
                    }
                    GSAP.from(this.progressBar,{
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        }
                    })
                })

                // First section //
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circle1.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section//
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circle2.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                }, "same").to(this.room.position, {
                    y: 0.1,
                }, "same")

                // Third section //
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circle3.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Mini Platform Animation //
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                    }
                })
                this.room.children.forEach(child=>{

                    if(child.name === "mini_floor"){
                        this.first = GSAP.to(child.position,{
                            x: -3.57134,
                            z: 4.56597,
                            y: 0.46217,
                            duration: 0.3,
                        });
                        this.first = GSAP.to(child.scale,{
                            x: 1,
                            z: 1,
                            y: 1,
                            duration: 0.3,
                        });
                    }
                    if(child.name === 'plates'){
                        this.second = GSAP.to(child.scale,{
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        })
                    }
                    if(child.name === 'lamp'){
                        this.third = GSAP.to(child.scale,{
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                   if(child.name === 'post'){
                        this.forth = GSAP.to(child.scale,{
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if(child.name === 'floorLight'){
                        this.fifth = GSAP.to(child,{
                            intensity: 0.4,
                            duration: 0.3,
                        });
                    }
                    if(child.name === 'flower1'){
                        this.sixth = GSAP.to(child.scale,{
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if(child.name === 'flower2'){
                        this.seventh = GSAP.to(child.scale,{
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                })
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.forth, "-=0.2");
                this.secondPartTimeline.add(this.fifth, "-=0.2");
                this.secondPartTimeline.add(this.sixth, "-=0.2");
                this.secondPartTimeline.add(this.seventh, "-=0.2");
            }
        }); 
    }

    resize(){
    }

    update(){
    }
}