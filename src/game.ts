/// <reference path="block.ts"/>

class Game {

    private controller:GameController;

    private destroySnd:Howl;
    private shootSnd:Howl;
    private comboSnd: Array<Howl>;

    private blocks: Block[][];
    private bullets: Array<Bullet>;
    private blockFX: Array<BlockEffect>;
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

    constructor(controller: GameController){
        this.controller = controller;
        this.blocks = [];
        this.comboSnd = [];

        this.destroySnd = new Howl({
            src: ['assets/sounds/Destroy.wav']
        });
        this.shootSnd = new Howl({
            src: ['assets/sounds/Shoot.wav']
        });
        for(let i = 1; i <= 5; i++){
            let path = 'assets/sounds/Combo'+i+'.wav'
            this.comboSnd.push(
                new Howl({
                    src: [path]
                })
            );
        }

        for(let i = 0; i < this._maxWidth; i ++){
            this.blocks[i] = [];
            for(let j = 0; j < this._maxHeight; j ++){
                this.blocks[i][j] = new Block(this, i, j);
                console.log(i, j);
            }
        }

        this.bullets = [];
        this.blockFX = [];

        console.log("I am working, don't worry!");

        let energyDiv = document.getElementsByTagName("energybar")[0];
        this.energybar = document.createElement("bar");
        energyDiv.appendChild(this.energybar);
    }

    public update(){
        let numLanded = 0;
        for(let i = 0; i < this._maxWidth; i ++){
            for(let j = 0; j < this._maxHeight; j ++){
                this.blocks[i][j].update();
                if(!this.blocks[i][j].hasLanded()){
                    numLanded ++;
                }
            }
        }
        for(let b of this.bullets){
            b.update();
        }
        for(let b of this.blockFX){
            b.update();
        }
        //console.log(this.clickable, numBullets);
        if(!this.clickable && this.bullets.length == 0 && numLanded == 0){
            if(this.comboFlag > 15){
                this.shiftBlocks();
                this.clickable = true;
                this.bullets = [];
                this.comboFlag = 0;
                this.points += 5 + 25 * this.comboChain;
                this.energy += 10 * this.comboChain;
                if(this.energy > 200){
                    this.energy = 200;
                }
                this.comboChain = 0;
                if(this.energy <= 0){ 
                    this.gameOver();
                }
            }
            else{
                this.comboFlag ++;
            }
        }
        if(this.energy < 0){
            this.energybar.style.width = "0px";
        }
        else{
            this.energybar.style.width = this.energy + "px";
            if(this.energy < 40){
                this.energybar.style.backgroundColor = "red";
            }
            else{
                this.energybar.style.backgroundColor = "white";
            }
        }
        this.scorebar.innerHTML = this.points.toString();
    }

    private playComboSnd(){
        if(this.comboChain < 5){
            this.comboSnd[this.comboChain - 1].play();
        }
        else{
            this.comboSnd[4].stop();
            this.comboSnd[4].play();
        }
    }

    private gameOver(){
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.innerHTML = "";
        this.controller.gameOver();
    }

    public makeUnclickable(){
        this.clickable = false;
    }

    public useEnergy(){
        this.energy -= 20;
    }

    public combo(){
        this.comboChain ++;
        this.playComboSnd();
    }

    public addBullets(b:Bullet){
        this.bullets.push(b);
        this.shootSnd.stop();
        this.shootSnd.play();
    }

    public removeBullet(b:Bullet){
        let i = this.bullets.indexOf(b);
        this.bullets.splice(i, 1);
    }

    public addBlockFX(b:BlockEffect){
        this.blockFX.push(b);
        console.log("effect has been adddeded");
    }

    public removeBlockFX(b:BlockEffect){
        let i = this.blockFX.indexOf(b);
        this.blockFX.splice(i, 1);
    }

    public getBlock(x:number, y:number): Block{
        return this.blocks[x][y];
    }

    public shiftBlocks(){
        console.log("preparing shift");
        this.destroySnd.play();
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