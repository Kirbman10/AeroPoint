"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = (function () {
    function Game() {
        this._maxWidth = 9;
        this._maxHeight = 6;
        this.clickable = true;
        this.comboFlag = 0;
        this.comboChain = 0;
        this.energy = 200;
        this.points = 0;
        this.scorebar = document.getElementsByTagName("points")[0];
        this.blocks = [];
        for (var i = 0; i < this._maxWidth; i++) {
            this.blocks[i] = [];
            for (var j = 0; j < this._maxHeight; j++) {
                this.blocks[i][j] = new Block(this, i, j);
                console.log(i, j);
            }
        }
        this.bullets = [];
        console.log("I am working, don't worry!");
        var energyDiv = document.getElementsByTagName("energybar")[0];
        this.energybar = document.createElement("bar");
        energyDiv.appendChild(this.energybar);
        this.update();
    }
    Object.defineProperty(Game.prototype, "maxWidth", {
        get: function () {
            return this._maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "maxHeight", {
        get: function () {
            return this._maxHeight;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.isClickable = function () {
        return this.clickable;
    };
    Game.prototype.update = function () {
        var _this = this;
        var numLanded = 0;
        for (var i = 0; i < this._maxWidth; i++) {
            for (var j = 0; j < this._maxHeight; j++) {
                this.blocks[i][j].update();
                if (!this.blocks[i][j].hasLanded()) {
                    numLanded++;
                }
            }
        }
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
        }
        if (!this.clickable && this.bullets.length == 0 && numLanded == 0) {
            if (this.comboFlag > 15) {
                this.shiftBlocks();
                this.clickable = true;
                this.bullets = [];
                this.comboFlag = 0;
                this.points += 5 + 25 * this.comboChain;
                this.energy += 10 * this.comboChain;
                if (this.energy > 200) {
                    this.energy = 200;
                }
                this.comboChain = 0;
            }
            else {
                this.comboFlag++;
            }
        }
        if (this.energy < 0) {
            this.energybar.style.width = "0px";
        }
        else {
            this.energybar.style.width = this.energy + "px";
            if (this.energy < 40) {
                this.energybar.style.backgroundColor = "red";
            }
            else {
                this.energybar.style.backgroundColor = "white";
            }
        }
        this.scorebar.innerHTML = this.points.toString();
        requestAnimationFrame(function () { return _this.update(); });
    };
    Game.prototype.makeUnclickable = function () {
        this.clickable = false;
    };
    Game.prototype.useEnergy = function () {
        this.energy -= 20;
    };
    Game.prototype.combo = function () {
        this.comboChain++;
    };
    Game.prototype.addBullets = function (b) {
        this.bullets.push(b);
    };
    Game.prototype.removeBullet = function (b) {
        var i = this.bullets.indexOf(b);
        this.bullets.splice(i, 1);
    };
    Game.prototype.getBlock = function (x, y) {
        return this.blocks[x][y];
    };
    Game.prototype.shiftBlocks = function () {
        console.log("preparing shift");
        for (var i = 0; i < this._maxWidth; i++) {
            var numShifts = 0;
            for (var j = 0; j < this._maxHeight; j++) {
                if (this.blocks[i][j].isActive()) {
                    console.log("commence shifting");
                    this.blocks[i][j].destroy();
                    numShifts++;
                    for (var k = j; k > 0; k--) {
                        this.blocks[i][k - 1].shift();
                        this.blocks[i][k] = this.blocks[i][k - 1];
                    }
                    this.blocks[i][0] = new Block(this, i, -1 - numShifts);
                    for (var k = 0; k <= numShifts; k++) {
                        this.blocks[i][0].shift();
                    }
                }
            }
        }
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Block = (function () {
    function Block(g, xPos, yPos) {
        var _this = this;
        this.active = false;
        this.landed = true;
        this.arrows = new Array();
        this._div = document.createElement("block");
        var playArea = document.getElementsByTagName("playarea")[0];
        playArea.appendChild(this._div);
        this.game = g;
        this.xPos = xPos;
        this.yPos = yPos;
        this._x = this.xPos * 100;
        this._y = this.yPos * 100;
        this._div.style.transform = "translate(" + this._x + "px, " + this._y + "px)";
        this._div.style.backgroundColor = "gray";
        var empties = 0;
        var noArrows = 0;
        for (var i = 0; i < 4; i++) {
            var rand = Math.random();
            if (empties >= 3 || noArrows >= 3) {
                this.arrows.push(new Arrow(this.game, this, i));
                console.log("arrow'd");
            }
            else {
                if (rand < 0.4) {
                    this.arrows.push(new Arrow(this.game, this, i));
                    console.log("arrow'd");
                }
                else if (rand > 0.7) {
                    console.log("receiver'd");
                    this.arrows.push(new Receiver(this.game, this, i));
                    noArrows++;
                }
                else {
                    console.log("I am empty inside");
                    this.arrows.push(new EmptyPoint(this.game, this, i));
                    empties++;
                    noArrows++;
                }
            }
        }
        this.div.addEventListener("click", function () { return _this.clickHandler(); });
    }
    Object.defineProperty(Block.prototype, "div", {
        get: function () {
            return this._div;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.isActive = function () {
        return this.active;
    };
    Block.prototype.hasLanded = function () {
        return this.landed;
    };
    Object.defineProperty(Block.prototype, "x", {
        get: function () {
            return this.xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "y", {
        get: function () {
            return this.yPos;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.update = function () {
        if (!this.landed) {
            var yValue = this.yPos * 100;
            if (yValue > this._y) {
                this._y += 5;
            }
            else {
                this._y = yValue;
                this.landed = true;
            }
        }
        this._div.style.transform = "translate(" + this._x + "px, " + this._y + "px)";
    };
    Block.prototype.clickHandler = function () {
        if (this.game.isClickable() && this.landed) {
            this.activate();
            this.game.makeUnclickable();
            this.game.useEnergy();
        }
    };
    Block.prototype.activate = function () {
        if (!this.active) {
            this.active = true;
            this._div.style.backgroundColor = "green";
            var _loop_1 = function (arrow) {
                requestAnimationFrame(function () { return arrow.fire(); });
            };
            for (var _i = 0, _a = this.arrows; _i < _a.length; _i++) {
                var arrow = _a[_i];
                _loop_1(arrow);
            }
        }
    };
    Block.prototype.receive = function (dir) {
        if (!this.active) {
            this.arrows[(dir + 2) % 4].receive();
            console.log(dir);
        }
    };
    Block.prototype.shift = function () {
        var _this = this;
        this.yPos++;
        this.landed = false;
        requestAnimationFrame(function () { return _this.update(); });
    };
    Block.prototype.destroy = function () {
        this._div.remove();
        console.log("ouchies!");
    };
    return Block;
}());
var Point = (function () {
    function Point(g, block, dir, type) {
        this.game = g;
        this.block = block;
        this.direction = dir;
        this._div = document.createElement(type);
        this.block.div.appendChild(this._div);
        this._div.style.transform = "rotate(" + this.direction * 90 + "deg)";
    }
    Object.defineProperty(Point.prototype, "div", {
        get: function () {
            return this._div;
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.fire = function () {
    };
    Point.prototype.receive = function () {
        console.log("arrow aborted");
    };
    return Point;
}());
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(g, block, dir) {
        return _super.call(this, g, block, dir, "arrow") || this;
    }
    Arrow.prototype.fire = function () {
        var _this = this;
        console.log("Arrow fired!");
        var rect = this.block.div.getBoundingClientRect();
        var blockX = this.block.x;
        var blockY = this.block.y;
        switch (this.direction) {
            case 0:
                if (this.block.y - 1 >= 0) {
                    var target = this.game.getBlock(blockX, blockY - 1);
                    var newBullet_1 = new Bullet(this.game, this.direction, rect.left, rect.top, target, 0, -5);
                    requestAnimationFrame(function () { return _this.game.addBullets(newBullet_1); });
                }
                break;
            case 1:
                if (this.block.x + 1 < this.game.maxWidth) {
                    var target = this.game.getBlock(blockX + 1, blockY);
                    var newBullet_2 = new Bullet(this.game, this.direction, rect.left, rect.top, target, 5, 0);
                    requestAnimationFrame(function () { return _this.game.addBullets(newBullet_2); });
                }
                break;
            case 2:
                if (this.block.y + 1 < this.game.maxHeight) {
                    var target = this.game.getBlock(blockX, blockY + 1);
                    var newBullet_3 = new Bullet(this.game, this.direction, rect.left, rect.top, target, 0, 5);
                    requestAnimationFrame(function () { return _this.game.addBullets(newBullet_3); });
                }
                break;
            case 3:
                if (this.block.x - 1 >= 0) {
                    var target = this.game.getBlock(blockX - 1, blockY);
                    var newBullet_4 = new Bullet(this.game, this.direction, rect.left, rect.top, target, -5, 0);
                    requestAnimationFrame(function () { return _this.game.addBullets(newBullet_4); });
                }
                break;
            default:
                console.log("wrong direction!");
                break;
        }
    };
    return Arrow;
}(Point));
var Bullet = (function () {
    function Bullet(g, dir, x, y, block, xSpeed, ySpeed) {
        this.distance = 0;
        this.active = true;
        this.game = g;
        this.direction = dir;
        this.x = x + 35;
        this.y = y + 35;
        this.block = block;
        this.ySpeed = ySpeed;
        this.xSpeed = xSpeed;
        this._div = document.createElement("bullet");
        document.body.appendChild(this._div);
        this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.direction * 90 + "deg)";
    }
    Bullet.prototype.isActive = function () {
        return this.active;
    };
    Bullet.prototype.update = function () {
        if (this.active) {
            this.distance += 5;
            if (this.distance < 80) {
                this.x += this.xSpeed;
                this.y += this.ySpeed;
                this._div.style.transform = "translate(" + this.x + "px, " + this.y + "px) rotate(" + this.direction * 90 + "deg)";
            }
            else {
                this.block.receive(this.direction);
                this._div.remove();
                this.active = false;
                this.game.removeBullet(this);
            }
        }
    };
    return Bullet;
}());
var EmptyPoint = (function (_super) {
    __extends(EmptyPoint, _super);
    function EmptyPoint(g, block, dir) {
        return _super.call(this, g, block, dir, "empty") || this;
    }
    return EmptyPoint;
}(Point));
var Receiver = (function (_super) {
    __extends(Receiver, _super);
    function Receiver(g, block, dir) {
        return _super.call(this, g, block, dir, "receiver") || this;
    }
    Receiver.prototype.receive = function () {
        console.log("Arrow received!");
        this.block.activate();
        this.game.combo();
    };
    return Receiver;
}(Point));
//# sourceMappingURL=game.js.map