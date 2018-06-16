///<reference path = "game.ts"/>
class Block{
    private game:Game
    private _x:number
    private _y:number
    private xPos:number
    private yPos:number
    private _div:HTMLElement
    private active:boolean = false
    private landed:boolean = true

    private arrows:Array<Point>;

    public get div(): HTMLElement {
		return this._div;
    }

    public isActive(): boolean{
        return this.active;
    }

    public hasLanded(): boolean{
        return this.landed;
    }
    
    public get x(): number {
		return this.xPos;
    }
    public get y(): number {
		return this.yPos;
    }
    

    constructor(g:Game, xPos:number, yPos:number){
        this.arrows = new Array<Point>();
        this._div = document.createElement("block");
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.appendChild(this._div);

        this.game = g;
        this.xPos = xPos;
        this.yPos = yPos;
        this._x = this.xPos * 100;
        this._y = this.yPos * 100;
        this._div.style.transform = "translate("+this._x+"px, "+this._y+"px)";
        this._div.style.backgroundColor = "gray";

        let empties = 0;
        let noArrows = 0;
        for(let i = 0; i < 4; i ++){
            let rand = Math.random();
            if (empties >= 3 || noArrows >= 3){
                this.arrows.push(new Arrow(this.game, this, i));
                console.log("arrow'd")
            }
            else{
                if(rand < 0.4){
                    this.arrows.push(new Arrow(this.game, this, i));
                    console.log("arrow'd")
                }
                else if (rand > 0.7){
                    console.log("receiver'd")
                    this.arrows.push(new Receiver(this.game, this, i));
                    noArrows ++;
                }
                else{
                    console.log("I am empty inside")
                    this.arrows.push(new EmptyPoint(this.game, this, i));
                    empties ++;
                    noArrows ++;
                }
            }
        }

        this.div.addEventListener("click", () => this.clickHandler());
    }

    public update(){
        if(!this.landed){
            let yValue = this.yPos * 100;
            if(yValue > this._y){
                this._y += 5;
            }
            else{
                this._y = yValue;
                this.landed = true;
                this.game.playSnd(0);
            }
        }
        this._div.style.transform = "translate("+this._x+"px, "+this._y+"px)";
    }

    private clickHandler(){
        if(this.game.isClickable() && this.landed){
            this.activate();
            this.game.makeUnclickable();
            this.game.useEnergy();
        }
    }

    public activate(){
        if(!this.active){
            this.active = true;
            this._div.style.backgroundColor = "green";
            for(let arrow of this.arrows){
                requestAnimationFrame(() => arrow.fire());
            }
        }
    }

    public receive(dir:number){
        if(!this.active){
            this.arrows[(dir + 2) % 4].receive();
            console.log(dir);
        }
    }

    public shift(){
        this.yPos ++;
        this.landed = false;
        requestAnimationFrame(() => this.update());
    }

    public destroy(){
        //let rect:ClientRect = this._div.getBoundingClientRect();
        let blockFX = new BlockEffect(this.game, this._x, this._y);
        this.game.addBlockFX(blockFX);
        this._div.remove();
        console.log("ouchies!")
    }
}