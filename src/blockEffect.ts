///<reference path = "block.ts"/>
class BlockEffect{

    private game:Game;

    private counter:number = 0;
    private x:number;
    private y:number;
    private div:HTMLElement;

    constructor(g:Game, x:number, y:number){
        this.game = g;

        this.x = x;
        this.y = y;

        this.div = document.createElement("blockeffect");
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.appendChild(this.div);
        this.div.style.transform = "translate("+this.x+"px, "+this.y+"px)";
    }

    public update(){
        if(this.counter <= 10){
            this.div.style.opacity = (1 - this.counter * 0.1).toString();
            this.div.style.width = 90 + this.counter + "px";
            this.div.style.height = 90 + this.counter + "px";
            this.x -= 0.5;
            this.y -= 0.5;
            this.div.style.transform = "translate("+this.x+"px, "+this.y+"px)";
            this.div.style.filter = "blur("+this.counter+"px)";
            this.counter ++;
        }
        else{
            this.div.remove();
            this.game.removeBlockFX(this);
        }
    }
}