class BezierTester extends Phaser.Plugin {
    private static BLANK: string = "data:image/jpeg;base64,/9j/iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg0MDMzQkZDN0VCNjExRTU4N0RDOEM3QTAwNTRFRkNCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg0MDMzQkZEN0VCNjExRTU4N0RDOEM3QTAwNTRFRkNCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODQwMzNCRkE3RUI2MTFFNTg3REM4QzdBMDA1NEVGQ0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODQwMzNCRkI3RUI2MTFFNTg3REM4QzdBMDA1NEVGQ0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5KwioFAAAALklEQVR42uzOMQEAAAgDoGn/zjOGDyRg2ubT5pmAgICAgICAgICAgICAgMAJMABAtAM94wpnSQAAAABJRU5ErkJggg==";

    private static COLORS: number[] = [0x00ff00, 0x008800, 0x880000, 0xff0000];

    private static POS: Phaser.Point[] = [
        new Phaser.Point(0, 0),
        new Phaser.Point(0, 50),
        new Phaser.Point(50, 50),
        new Phaser.Point(50, 0),
    ];

    private points: Phaser.Point[] = [];

    private object: Phaser.Image | Phaser.Sprite;

    private activeTween: Phaser.Tween = null;

    private graphics: Phaser.Graphics;

    private animationSpeed: number;

    private originalX: number = 0;
    private originalY: number = 0;

    constructor(game: Phaser.Game, parent: PIXI.DisplayObject)
    {
        super(game, parent);

        var data = new Image();
        data.src = BezierTester.BLANK;
        game.cache.addImage('blank', BezierTester.BLANK, data);

        this.graphics = this.game.add.graphics(0, 0);
    }

    public testObject(object: Phaser.Image | Phaser.Sprite, animationSpeed: number = 1500)
    {
        this.object = object;
        this.originalX = object.x;
        this.originalY = object.y;
        this.animationSpeed = animationSpeed;

        BezierTester.COLORS.forEach((color: number, index: number) => {
            let g = new Phaser.Graphics(this.game, 0, 0)
                .beginFill(color, 0.5)
                .drawCircle(0, 0 , 20);

            let draggablePoint = this.game.add.sprite(this.object.x + BezierTester.POS[index].x, this.object.y + BezierTester.POS[index].y, 'blank');
            draggablePoint.addChild(g);
            draggablePoint.inputEnabled = true;
            draggablePoint.input.enableDrag();
            draggablePoint.events.onDragStart.add(() => this.dragStart());
            draggablePoint.events.onDragStop.add(() => this.dragStop());
            draggablePoint.events.onDragUpdate.add(() => this.dragUpdate());
            this.points[index] = draggablePoint.position;
            this.game.add.existing(draggablePoint);
        });
        this.dragUpdate();
        this.dragStop()
    }

    private dragStart()
    {
        if (null !== this.activeTween) {
            console.log('stipping tween!');
            this.activeTween.stop();
            this.activeTween = null;
            this.object.x = this.originalX;
            this.object.y = this.originalY;
        }
    }

    private dragStop()
    {
        console.log('new tween!')
        this.activeTween = this.game.add.tween(this.object).to({
            x: [this.points[0].x, this.points[1].x, this.points[2].x, this.points[3].x],
            y: [this.points[0].y, this.points[1].y, this.points[2].y, this.points[3].y],
        }, this.animationSpeed,Phaser.Easing.Linear.None, true, 0, -1).interpolation(function(v: number[], k:number){
            return Phaser.Math.bezierInterpolation(v, k);
        });
    }

    private dragUpdate()
    {
        this.graphics.clear()
            .lineStyle(2, 0x008800, 0.5)
            .moveTo(this.points[1].x, this.points[1].y)
            .lineTo(this.points[0].x, this.points[0].y)
            .lineStyle(2, 0x880000, 0.5)
            .moveTo(this.points[3].x, this.points[3].y)
            .lineTo(this.points[2].x, this.points[2].y)
            .lineStyle(4, 0xffff00, 0.5)
            .moveTo(this.points[0].x, this.points[0].y);

        for (var i=0; i<1; i+=0.01){
            var p = {
                x: Phaser.Math.bezierInterpolation([this.points[0].x, this.points[1].x, this.points[2].x, this.points[3].x], i),
                y: Phaser.Math.bezierInterpolation([this.points[0].y, this.points[1].y, this.points[2].y, this.points[3].y], i)
            };

            this.graphics.lineTo(p.x, p.y);
        }
    }
}