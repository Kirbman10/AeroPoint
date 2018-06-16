///<reference path = "block.ts"/>
class Point{

    protected game:Game;
    protected direction:number;
    protected block:Block;
    protected _div:HTMLElement

    public get div(): HTMLElement {
		return this._div;
    }

    constructor(g:Game, block:Block, dir:number, type:string){
        this.game = g;
        this.block = block;
        this.direction = dir;

        this._div = document.createElement(type);
        this.block.div.appendChild(this._div);
        this._div.style.transform = "rotate(" + this.direction * 90 + "deg)";
    }
    public fire(){
        
    }
    public receive(){
        console.log("arrow aborted")
        this.game.playSnd(1);
    }
}