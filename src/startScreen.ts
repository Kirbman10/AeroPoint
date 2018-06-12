class StartScreen{

    private controller:GameController

    private div:HTMLElement

    constructor(controller:GameController){
        this.controller = controller;
        this.div = document.createElement("startbutton");
        this.div.innerHTML = "Start Game";
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.appendChild(this.div);
        this.div.addEventListener("click", () => this.startGame());
    }

    public update(){

    }

    private startGame(){
        this.div.remove();
        this.controller.showPlayScreen()
    }
}