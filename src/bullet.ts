///<reference path = "game.ts"/>
class Bullet{
    private game:Game;
    private block:Block

    private direction:number;
    private _div:HTMLElement;
    private x:number;
    private y:number;
    private xSpeed:number;
    private ySpeed:number;
    private distance:number = 0;
    private active:boolean = true;

    public isActive():boolean{
        return this.active;
    }

    constructor(g:Game, dir:number, x:number, y:number, block:Block, xSpeed:number, ySpeed:number){
        this.game = g;
        this.direction = dir;
        this.x = x + 35;
        this.y = y + 35;
        this.block = block;
        this.ySpeed = ySpeed;
        this.xSpeed = xSpeed;

        this._div = document.createElement("bullet");
        document.body.appendChild(this._div);
        this._div.style.transform = "translate("+this.x+"px, "+this.y+"px) rotate(" + this.direction * 90 + "deg)";
    }

    public update(){
        if(this.active){
            this.distance += 5;
            if (this.distance < 80){
                this.x += this.xSpeed;
                this.y += this.ySpeed;
                this._div.style.transform = "translate("+this.x+"px, "+this.y+"px) rotate(" + this.direction * 90 + "deg)";
            }
            else{
                this.block.receive(this.direction);
                this._div.remove();
                this.active = false;
                this.game.removeBullet(this);
            }
        }
    }
}