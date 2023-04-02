/*Preloader.jsでは全てのアセットがレンダリングされた後に再生されるイントロアニメーションを制御する Preloader クラスを作成します。
Sizes クラスで device オブジェクトが定義された後、 emit(device) 関数が device 文字列を引数に実行されます。同期的に on(device) 関数が実行されます。
on() 関数では this.device に "mobile"か"desktop" の文字列が入った引数 device を定義します。

World クラスで Environment,Floor,Roomがインスタンス化された後、 emit() 関数が実行され、 同期的に on() 関数が実行されます。
on() 関数では setAssets(),playIntro 関数を実行します。

setAssets() 関数では、 3Dオブジェクトシーンが入った room オブジェクトと 3Dオブジェクトの各名前とオブジェクト本体が定義された連想配列 roomChildren を定義します。
this.room と this.roomChildren は、3Dオブジェクトが要素に入っていることは一緒ですが、this.room は Scene そのものなのに対し、 this.roomChildren は連想配列です。

playIntro() 関数では、 firstIntro() を実行し、window イベントの "Wheel" が発動したとき一度だけ実行されうる onScroll() 関数を実行します。
onScroll() 関数では、 playSecondIntro() を実行します。


*/

import { EventEmitter } from "events";
import Experience from "./Experience";
import GSAP from "gsap";
import convert from "./Utils/convertDivsToSpans"

export default class Preloader extends EventEmitter{
    constructor(){
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.device = this.sizes.device
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.world = this.experience.world;

        this.sizes.on("switchdevice", (device)=>{
            this.device = device
            console.log(this.device)
        })

        this.world.on("worldReady",()=>{
            this.setAssets();
            this.playIntro();
        })
    }

    setAssets(){
        convert(document.querySelector(".intro-text"))
        convert(document.querySelector(".hero-main-title"))
        convert(document.querySelector(".hero-main-description"))
        convert(document.querySelector(".hero-second-subheading"))
        convert(document.querySelector(".second-sub"))
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
    }

    async playIntro(){
        await this.firstIntro();
        this.moveFlag = true;
        this.scrollOnceEvent = this.onScroll.bind(this);
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);
        window.addEventListener("wheel", this.scrollOnceEvent)
        window.addEventListener("touchstart", this.touchStart)
        window.addEventListener("touchmove", this.touchMove)
    }

    firstIntro(){
        return new Promise ((resolve)=>{
            this.timeline = new GSAP.timeline();
            this.timeline.set(".animatedis", { y: 0, yPercent: 100 });
            
            this.timeline.to(".preloader",{
                onComplete: ()=>{
                    document.querySelector(".preloader").classList.add("hidden")
                },
                delay: 1,
                opacity: 0,
            })
            if(this.device === "desktop"){
                this.timeline.to(this.roomChildren.cube.scale,{
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position,{
                    x: -1,
                    ease: "power1.out",
                    duration: 0.7,
                    onComplete: resolve,
                })
            }else{
                this.timeline.to(this.roomChildren.cube.scale,{
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position,{
                    z: -1,
                    ease: "power1.out",
                    duration: 0.7,
                    onComplete: resolve,
                })
            }
            this.timeline.to(".intro-text .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
                onComplete: resolve,
            }).to(".arrow-svg-wrapper", {
                opacity: 1,
            }, "same").to(".toggle-bar", {
                opacity: 1,
                onComplete: resolve,
            }, "same")
        })
    }

    onScroll(e){
        if(e.deltaY > 0){
            this.removeEventListener();
            this.playSecondIntro();
        }
    }
    onTouch(e){
        this.initialY = e.touches[0].clientY;
    }
    onTouchMove(e){
        let currentY = e.touches[0].clientY;
        let difference = this.initialY - currentY;
        if(difference > 0){
            console.log("swipped up");
            this.removeEventListener();
            this.playSecondIntro();
        }
        this.initialY = null;
    }

    removeEventListener(){
        window.removeEventListener("wheel", this.scrollOnceEvent)
        window.removeEventListener("touchstart", this.touchStart)
        window.removeEventListener("touchmove", this.touchMove)
    }

    async playSecondIntro(){
        this.moveFlag = false;
        await this.secondIntro();
        this.emit("enablecontrols");
    }

    secondIntro(){
        return new Promise ((resolve)=>{
            this.secondTimeline = new GSAP.timeline();

            this.secondTimeline.to(".intro-text .animatedis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            }, "fadeout").to(".arrow-svg-wrapper",{
                opacity: 0,
            }, "fadeout").to( this.room.position, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
            }, "same").to(this.roomChildren.cube.rotation,{
                y: 2 * Math.PI + Math.PI / 4,
            }, "same").to(this.roomChildren.cube.scale,{
                x: 4.1,
                y: 4.1,
                z: 4.1,
            }, "same").to(this.camera.orthographicCamera.position,{
                y: 2.3,
            }, "same").to(this.roomChildren.cube.posiiton,{
                x: 0,
                y: 0,
                z: 0,
            }, "same").set(this.roomChildren.home.scale,{
                x: 1,
                y: 1,
                z: 1,
            }).to(this.roomChildren.cube.scale,{
                x: 0,
                y: 0,
                z: 0,
                duration: 0.7,
            }, "same").to(".hero-main-title .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            }, "same").to(".hero-main-description .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            }, "same").to(".hero-second-subheading .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            }, "same").to(".second-sub .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
            }, "same").to(this.roomChildren.aquarium.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.5").to(this.roomChildren.desk.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.5").to(this.roomChildren.desk_items.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.4").to(this.roomChildren.computer.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.4").to(this.roomChildren.shelve.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.3").to(this.roomChildren.lampLight,{
                intensity: 0.4,
            }, ">-0.3").to(this.roomChildren.stand.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.2").to(this.roomChildren.clock.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.2").to(this.roomChildren.aquariumLight,{
                intensity: 1.0,
            }, ">-0.1").to(this.roomChildren.floor_items.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.1").to(this.roomChildren.mouse.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },).to(this.roomChildren.chair.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, "chair").to(this.roomChildren.chair.rotation,{
                y: 4 * Math.PI - Math.PI / 4,
                ease: "back.out(2.2)",
                duration: 1,
            }, "chair").to(this.roomChildren.fish.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }).to(".arrow-svg-wrapper",{
                opacity: 1,
                onComplete: resolve,
            });
        })
    }

    move() {
        if (this.device === "desktop") {
            this.room.position.set(-1, 0, 0);
        } else {
            this.room.position.set(0, 0, -1);
        }
    }

    update(){
        if(this.moveFlag == true){
            this.move();
        }
    }
}