class StartScreen{

    private controller:GameController

    private div:HTMLElement
    private logo:HTMLElement

    constructor(controller:GameController){
        this.controller = controller;
        this.div = document.createElement("startbutton");
        this.div.innerHTML = "Start Game";
        let playArea = document.getElementsByTagName("playarea")[0];
        playArea.appendChild(this.div);
        this.div.addEventListener("click", () => this.startGame());
        this.logo = document.createElement("logo");
        this.logo.innerHTML = "<img src='assets/Aeropoint.png'>";
        playArea.appendChild(this.logo);
    }

    public update(){

    }

    private startGame(){
        this.div.remove();
        this.logo.remove();
        this.controller.showPlayScreen()
    }
}