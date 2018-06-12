class GameOverScreen{

    private controller:GameController

    private div:HTMLElement

    constructor(controller:GameController){
        this.controller = controller;

        let playArea = document.getElementsByTagName("playarea")[0];
        this.div = document.createElement("startbutton");
        this.div.innerHTML = "Restart";
        playArea.appendChild(this.div);
        this.div.addEventListener("click", () => this.startGame());

        let gameOver = document.createElement("gameover");
        gameOver.innerHTML = "GAME OVER";
        playArea.appendChild(gameOver);

        let gameOverText = document.createElement("gameovertext");
        gameOverText.innerHTML = "You ran out of energy.";
        playArea.appendChild(gameOverText);
    }

    public update(){

    }

    private startGame(){
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.innerHTML = ""
        this.controller.showPlayScreen()
    }
}