class GameController {

    private screen:any;

    constructor() {
        this.screen = new StartScreen(this);
        this.gameLoop();
    }
    
    private gameLoop():void{
        this.screen.update();
        requestAnimationFrame(() => this.gameLoop())
    }

    public showPlayScreen():void{
        this.screen = new Game(this);
    }

    public gameOver():void{
        this.screen = new GameOverScreen(this);
    }
} 

window.addEventListener("load", () => new GameController())