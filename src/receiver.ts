///<reference path = "point.ts"/>
class Receiver extends Point{

    constructor(g:Game, block:Block, dir:number){
        super(g, block, dir, "receiver");
    }

    public receive(){
        console.log("Arrow received!");
        this.block.activate();
        this.game.combo();
    }
}