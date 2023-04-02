/*
全アセットのロードが完了したとき、 Environment,Floor,Room,Controls クラスがインスタント化し、 emit() 関数を実行します。
emit() 関数は EventEmitter から継承した関数で、同じエベント名を持つ on() メソッドを実行させます。


update(){
    if(this.room){
        this.room.update();
    }
        if(this.controls){
        this.controls.update();
    }
}
Room と Controls クラスがそれぞれインスタンス化されていない状態で update 関数が実行されるとエラーになってしまうため、
if 文を使いインスタンスがあるか確認する。

*/

import * as THREE from "three"
import Experience from "../Experience";

import Room from "./Room"
import Controls from "./Controls";
import Environment from "./Environment";
import Floor from "./Floor";
import { EventEmitter } from "events";

export default class World extends EventEmitter{
    constructor(){
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.resources.on("ready",()=>{
            this.environment = new Environment();
            this.floor = new Floor();
            this.room = new Room();
            this.emit("worldReady")
            this.controls = new Controls();
        });
    }

    resize(){
    }

    update(){
        if(this.room){
            this.room.update();
        }
        // if(this.controls){
        //     this.controls.update();
        // }
    }
}