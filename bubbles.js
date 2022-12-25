var lis = [];
let alpha = 0.2;
var colors = [`rgba(153, 153, 255, ${alpha})`, `rgba(153, 51, 255, ${alpha})`, `rgba(204, 0, 204, ${alpha})`, `rgba(51, 102, 255, ${alpha})`, `rgba(0, 153, 204, ${alpha})`, `rgba(204, 153, 255, ${alpha})`]
var mouseDown = false;
var mouse = {
    x : undefined,
    y : undefined
}

function getRandomColor(li) {
    return li[Math.round(Math.random() * li.length)];
}

function start() {
    lis = [];
    for (let i = 0; i < 3; i++) {
        lis.push(new createObject(Math.random() * 1000 + 20, Math.random() * 700 + 20, Math.random() * 35 + 5, Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1), Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1), getRandomColor(colors)));
    }
    game.start();
}

var game = {
    cnv : document.createElement("canvas"),
    start : function() {
        this.cnv.width = 1600;
        this.cnv.height = 750;
        this.context = this.cnv.getContext("2d");
        document.body.insertBefore(this.cnv, document.body.childNodes[0]);
        this.interval = setInterval(upd, 15);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.cnv.width, this.cnv.height);
    }
}

function createObject(x, y, r, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.move = () => {
            var ctx = game.context;
            ctx.fillStyle = this.color;
            ctx.strokeStyle = "aqua";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            this.x += this.vx;
            this.y += Math.round(this.vy);
            this.maxX();
            this.maxY();
    }
    this.maxY = () => {
        if ((this.y >= game.cnv.height - this.r) || (this.y <= this.r)) {
            this.vy = Math.round(-this.vy);
        }
    }
    this.maxX = () => {
        if ((this.x <= this.r) || (this.x >= game.cnv.width - this.r)) {
            this.vx = Math.round(-this.vx);
        }
    }
}

function upd() {
    game.clear();
    for (let o = 0; o < lis.length; o++) {
        lis[o].move();
        if (lis[o].r > game.cnv.height * 0.2) {
            lis.splice(o, 1);
        }
        for (let j = o + 1; j < lis.length; j++) {
            if (detectDistance(lis[o], lis[j])) {
                if (lis[o].r < lis[j].r) {
                    lis[j].r = calcRadius(lis[o].r, lis[j].r);
                    lis.splice(o, 1);
                } else {
                    lis[o].r = calcRadius(lis[o].r, lis[j].r);
                    lis.splice(j, 1);
                }
            }
        }
    }
    if (mouseDown) {
        lis.push(new createObject(mouse.x, mouse.y, Math.random() * 35 + 5, Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1), Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1), getRandomColor(colors)))
    }
}

function detectDistance(ball1, ball2) {
    return ((Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2)) <= ball1.r + ball2.r);
}

function calcRadius(r1, r2) {
    return (Math.sqrt(r1 ** 2 + r2 ** 2));
}

game.cnv.addEventListener("mousedown", function(event) {
    mouseDown = true;
})

game.cnv.addEventListener("mouseup", function(event) {
    mouseDown = false;
})

game.cnv.addEventListener("mousemove", function(event) {
    mouse.x = event.x - 15;
    mouse.y = event.y - 15;
})
