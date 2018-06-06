///<reference path = "point.ts"/>
class EmptyPoint extends Point{

    constructor(g:Game, block:Block, dir:number){
        super(g, block, dir, "empty");
    }
}