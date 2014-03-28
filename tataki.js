"use strict";

// 穴
Hole.prototype = new createjs.Container();
function Hole() {
  createjs.Container.call(this);

  this.width = 480;
  this.height = 502;
  this.holeH = 80;

  var hole = new createjs.Shape();
  this.addChild(hole);
  hole.graphics.beginFill('black').drawEllipse(0, -this.holeH/2, this.width, this.holeH);
}

// 穴にもぐらを入れる
Hole.prototype.addSakura = function() {
  var sakura = this.sakura = new Sakura();
  this.addChild(sakura);
  sakura.y = 0;

  // もぐら絵の下端を穴に沿って切り抜く
  sakura.mask = new createjs.Shape();
  sakura.mask.graphics
    .rect(0, -sakura.height, sakura.width, sakura.height)
    .drawEllipse(0, -this.holeH/2, this.width, this.holeH);

  // もぐらを叩いた
  var hole = this;
  sakura.on('click', function(e) {
    hole.poka(function() {
      setTimeout(function() {
        hole.removeSakura();
        hole.nyoki();
      }, 1000);
    });
  });
}

// もぐらを取り除く
Hole.prototype.removeSakura = function() {
  this.removeChild(this.sakura);
  delete this.sakura;
}

// ニョキ
Hole.prototype.nyoki = function() {
  if (this.sakura) return; // すでにいたらやめる

  this.addSakura();

  this.sakura.y = this.sakura.height;
  createjs.Tween.get(this.sakura)
    .to({y: 80}, 1000, createjs.Ease.backOut);
}

// ポカ
Hole.prototype.poka = function(callback) {
  if (!callback) callback = function(){}
  var s = this.sakura;
  createjs.Tween.removeTweens(s);
  createjs.Tween.get(s)
    .to({scaleX: 1.2, scaleY: 0.8}, 180, createjs.Ease.sineOut)
    .to({scaleX: 0.8, scaleY: 1.1, y: s.height*1.1}, 120, createjs.Ease.sineIn)
    .to({scaleX: 1, scaleY: 1})
    .call(callback);
}

// もぐら
function Sakura() {
  var ids = IMAGE_IDS;
  var url = 'http://125.6.169.35/idolmaster/image_sp/card/quest/'+
    ids[Math.floor(Math.random()*ids.length)] + '.png';

  var bmp = new createjs.Bitmap(url);
  bmp.width = 480;
  bmp.height = 502;

  // ピクセルを取れないので適当な当たり判定
  bmp.hitArea = new createjs.Shape();
  bmp.hitArea.graphics.beginFill('black').rect(40, 100, 400, 402);

  // まんなか下端が中心
  bmp.x = bmp.width/2;
  bmp.regX = bmp.width/2;
  bmp.regY = bmp.height;

  return bmp;
}

function Game(canvas) {
  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);

  var holes = this.holes = [];
  var positions = [
    {x: 40, y: 240},
    {x: 360, y: 240},
    {x: 200, y: 360},
    {x: 40, y: 480},
    {x: 360, y: 480},
  ];
  this.holes = positions.map(function(p) {
    var hole = new Hole();
    holes.push(hole);
    stage.addChild(hole);

    hole.x = p.x;
    hole.y = p.y;
    hole.scaleX = hole.scaleY = 0.5;

    hole.nyoki();
    return hole;
  });

  return stage;
}

function main() {
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('selectstart', function(e) {e.preventDefault()}, false);
  var game = window.game = new Game(canvas);
  createjs.Ticker.addEventListener('tick', function() {
    game.update();
  });
}

main();
