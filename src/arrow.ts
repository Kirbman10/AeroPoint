///<reference path = "point.ts"/>
class Arrow extends Point{

    constructor(g:Game, block:Block, dir:number){
        super(g, block, dir, "arrow");
    }

    public fire(){
        console.log("Arrow fired!")
        let rect:ClientRect = this.block.div.getBoundingClientRect();
        let blockX = this.block.x;
        let blockY = this.block.y;
        switch(this.direction){
            case 0:
                if(this.block.y - 1 >= 0){
                    let target = this.game.getBlock(blockX, blockY - 1);
                    let newBullet = new Bullet(this.game, this.direction, rect.left, rect.top, target, 0, -5)
                    requestAnimationFrame(() => this.game.addBullets(newBullet));
                }
                break;
            case 1:
                if(this.block.x + 1 < this.game.maxWidth){
                    let target = this.game.getBlock(blockX + 1, blockY);
                    let newBullet = new Bullet(this.game, this.direction, rect.left, rect.top, target, 5, 0)
                    requestAnimationFrame(() => this.game.addBullets(newBullet));
                }
                break;
            case 2:
                if(this.block.y + 1 < this.game.maxHeight){
                    let target = this.game.getBlock(blockX, blockY + 1);
                    let newBullet = new Bullet(this.game, this.direction, rect.left, rect.top, target, 0, 5)
                    requestAnimationFrame(() => this.game.addBullets(newBullet));
                }
                break;
            case 3:
                if(this.block.x - 1 >= 0){
                    let target = this.game.getBlock(blockX - 1, blockY);
                    let newBullet = new Bullet(this.game, this.direction, rect.left, rect.top, target, -5, 0)
                    requestAnimationFrame(() => this.game.addBullets(newBullet));
                }
                break;
            default:
                console.log("wrong direction!")
                break;
        }
    }
}