/// <reference path="block.ts"/>

class Game {

    private blocks: Block[][];
    private bullets: Array<Bullet>;
    private _maxWidth = 9;
    private _maxHeight = 6;
    private clickable = true;
    private comboFlag = 0;
    private comboChain = 0;
    
    private energy = 200;
    private energybar:HTMLElement
    private points = 0;
    private scorebar = document.getElementsByTagName("points")[0];

    public get maxWidth(): number {
		return this._maxWidth;
    }
    public get maxHeight(): number {
		return this._maxHeight;
    }
    public isClickable(): boolean {
		return this.clickable;
    }

    constructor(){
        this.blocks = [];

        for(let i = 0; i < this._maxWidth; i ++){
            this.blocks[i] = [];
            for(let j = 0; j < this._maxHeight; j ++){
                this.blocks[i][j] = new Block(this, i, j);
                console.log(i, j);
            }
        }

        this.bullets = [];

        console.log("I am working, don't worry!");

        let energyDiv = document.getElementsByTagName("energybar")[0];
        this.energybar = document.createElement("bar");
        energyDiv.appendChild(this.energybar);

        this.update();
    }

    private update(){
        let numLanded = 0;
        for(let i = 0; i < this._maxWidth; i ++){
            for(let j = 0; j < this._maxHeight; j ++){
                this.blocks[i][j].update();
                if(!this.blocks[i][j].hasLanded()){
                    numLanded ++;
                }
            }
        }
        let numBullets = 0;

        for(let bullet of this.bullets){
            bullet.update();
            if(bullet.isActive()){
                numBullets ++;
            }
        }
        //console.log(this.clickable, numBullets);
        if(!this.clickable && numBullets == 0 && numLanded == 0){
            if(this.comboFlag > 15){
                this.shiftBlocks();
                this.clickable = true;
                this.bullets = [];
                this.comboFlag = 0;
                this.points += 5 + 10 * this.comboChain;
                this.energy += 5 * this.comboChain;
                if(this.energy > 200){
                    this.energy = 200;
                }
                this.comboChain = 0;
            }
            else{
                this.comboFlag ++;
            }
        }

        this.energybar.style.width = this.energy + "px";
        this.scorebar.innerHTML = this.points.toString();

        requestAnimationFrame(() => this.update());
    }

    public makeUnclickable(){
        this.clickable = false;
    }

    public useEnergy(){
        this.energy -= 20;
        if(this.energy < 0){
            this.energy = 0;
        }
    }

    public combo(){
        this.comboChain ++;
    }

    public addBullets(b:Bullet){
        this.bullets.push(b);
    }

    public getBlock(x:number, y:number): Block{
        return this.blocks[x][y];
    }

    public shiftBlocks(){
        console.log("preparing shift");
        for(let i = 0; i < this._maxWidth; i ++){
            let numShifts = 0;
            for(let j = 0; j < this._maxHeight; j ++){
                if (this.blocks[i][j].isActive()){
                    console.log("commence shifting")
                        this.blocks[i][j].destroy();
                        numShifts ++;
                    for(let k = j; k > 0; k --){
                        this.blocks[i][k - 1].shift();
                        this.blocks[i][k] = this.blocks[i][k - 1];
                    }
                    this.blocks[i][0] = new Block(this, i, -1 - numShifts);
                    for(let k = 0; k <= numShifts; k ++){
                        this.blocks[i][0].shift();
                    }
                }
            }
        }
    }
}
window.addEventListener("load", () => new Game())