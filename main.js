let redbox = document.getElementById('redbox')
let bluebox = document.getElementById('bluebox')
let board = {
  spawnCount:0,
  refreshRate: 25,
  npcs: [],
  score:0,
  player: {
    x:350,
    y:200,
    w:60,
    height:60,
    selector:document.querySelector('#player'),
    keysDown: {
      87: false,//w
      65:false,//a
      68:false,//d
      83:false//s
    },
    vx: 1,
    vy: 1,
    restSpeed:1,
    grow: function(w,h,much){
      this.w += w / 4;
      this.height += h /4;
      this.selector.style.width = this.w + 'px';
      this.selector.style.height = this.height + 'px';
      board.score += much /2;
      board.showScore();
      return;
    }
  },
  togglePause: function() {
    let paused = document.querySelector('.pause');
    if(paused.className === "pause overlay"){
      moveit = setInterval(move,this.refreshRate);
      spawnOne = setInterval(checkSpawns,6000);
      paused.className = "pause overlay nodisplay";
    }else{
      clearInterval(moveit);
      clearInterval(spawnOne);
      paused.setAttribute('class','pause overlay');
    }
  },
  playerDie: function() {
    clearInterval(moveit);
    clearInterval(spawnOne);
    document.getElementById('finalscore').innerHTML = this.score;
    document.querySelector('.gameover').className = "gameover overlay";
  },
  reset: function() {
    let player = board.player;
    player.w = 60;
    player.height = 60;
    player.x = 350;
    player.x = 200;
    this.score = 0;
    for(let i=0;i<this.npcs.length;i++){
      this.npcs[i].selector.remove();
    }
    player.selector.style.height = player.height + 'px';
    player.selector.style.width = player.w + 'px';
    this.showScore();
    this.npcs = [];
    this.initNPCS();
    this.refreshRate = 25;
    changePosition(board.player);
    moveit = setInterval(move,this.refreshRate);
    document.querySelector('.pause').className += " nodisplay";
    document.querySelector('.gameover').className += " nodisplay"
  },
  spawnNPC: function() {
    this.npcs.push(new Npc(-50,20,20,20));
    this.npcs[this.npcs.length-1].htmlCreate('background-color:orange');
  },
  initNPCS: function() {
    let colors = ['red','blue','purple','#000']
    let count = 0;
    for(let i=0;i<200;i+=50){
      let ran = randNum(10,50);
      this.npcs.push(new Npc(0,i,ran,ran));
      this.npcs[this.npcs.length-1].htmlCreate('background-color:'+colors[count]);
      count++;
    }
  },
  showScore: function() {
    document.getElementById('score').innerHTML = board.score;
  }
}
const randNum = function(min,max){
  return Math.floor(Math.random() * max) + min;
}
const Npc = function(x,y,width,height,selector){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.selector = selector ? selector : `npc${board.npcs.length}`;
  this.htmlCreate = function(style){
    let newNpc = document.createElement('div');
    newNpc.setAttribute('id',this.selector);
    newNpc.setAttribute('class','npc')
    newNpc.setAttribute('style',`width:${width}px;height:${height}px;left:${x}px;top:${y}px;${style}`);
    document.querySelector('#board').appendChild(newNpc);
    this.selector = document.getElementById(this.selector);
  }
  this.kill = function() {
    this.selector.remove();
    this.x = -100;
    this.y = -100;
  },
  this.area = function() {
    return this.width * this.height;
  }
}
const move = function() {
  //checkX(0,600);
  //checkX(1,600);
  for(let i=0;i<board.npcs.length;i++){
    checkX(board.npcs[i],600);
  }
  movePlayer(600,300);
}
const movePlayer = function(boundaryX,boundaryY) {
  for(item in board.player.keysDown){
    if(board.player.keysDown[item]===true){
      if(item === '65' || item === '68'){
        if(board.player.vx <= 5){
          board.player.vx +=.1;
          console.log('increasing velocity',board.player.vx)
        }
      }
      if(item === '87' || item === '83'){
        if(board.player.vy <= 5){
          board.player.vy +=.1;
          console.log('increasing velocity',board.player.vx)
        }
      }
      switch(item){
        case '87'://W
          if(board.player.y >= 0){
            board.player.y -= board.player.vy;
          }
          break;
        case '65'://A
          if(board.player.x  > 0 - board.player.w / 2){
            board.player.x -= board.player.vx;
          }else{
            board.player.x = boundaryX - board.player.w;
          }
          break;
        case '68'://D
          if(board.player.x <= boundaryX - board.player.w / 2){
            board.player.x += board.player.vx;
          }else{
            board.player.x = 0;
          }
          break;
        case '83'://S
          if(board.player.y + board.player.height <= boundaryY){
            board.player.y += board.player.vy;
          }
          break;
        default: break;
      }
    }
  }
  changePosition(board.player);
}

const changePosition = function(el) {
  //el.selector.setAttribute('style',`left:${el.x}px;top:${el.y}px;`);
  el.selector.style.left = `${el.x}px`;
  el.selector.style.top = `${el.y}px`;
  if(el === board.player){
    let player = board.player;
    for(let i=0;i<board.npcs.length;i++){
        if(board.npcs[i].x < player.x + player.w &&
           board.npcs[i].x + board.npcs[i].width > player.x &&
           board.npcs[i].y < player.y + player.height &&
           board.npcs[i].height + board.npcs[i].y > player.y)
        {
          if(player.w * player.height > board.npcs[i].area()){
            player.grow(board.npcs[i].width,board.npcs[i].height,board.npcs[i].area());
            board.npcs[i].kill();
          }else{
            board.playerDie();
          }
        }
    }
  }
}

const checkX = function(el,boundary){
  let itemToChange = el;
  if(itemToChange.movementX === 1){
    if ((itemToChange.x + itemToChange.width < boundary)) {
    itemToChange.movementX = 1;
    }else{
      itemToChange.movementX = -1;
    }
  }else{
    if(itemToChange.x >= 0 ){
      itemToChange.movementX = -1;
    }else{
      itemToChange.movementX = 1;
    }
  }
  itemToChange.x +=itemToChange.movementX;
  changePosition(itemToChange);
}

const checkY = function(el,boundary){
  let itemToChange = board.npcs[el];
  if(itemToChange.movementY > 0){
    if(!(itemToChange.y + itemToChange.height < boundary)){
      itemToChange.movementY = Math.abs(itemToChange.movementY * -1)
    }
  }else{
    if(!(itemToChange.y >= 0)){
      itemToChange.movementY = Math.abs(itemToChange.movementY);
    }
  }
  itemToChange.y +=itemToChange.movementY;
  changePosition(itemToChange);
}
const accelerateFunction = function(){
  if(Math.abs(board.player.vx) < 5){
    console.log('firing accelerateFunction',Math.abs(board.player.vx));
    accelerateInterval = setInterval(accelerate,500);
  }else{
    clearInterval(accelerateInterval);
  }
}

let moveit;
let spawnOne;
const accelerate = function(){
  console.log('firing accelerateInterval');
  if(board.player.vx > 0){
    if(board.player.vx <= 5){
      board.player.vx +=.2;
    }
  }else{
    if(board.player.vx > -5){
      board.player.vx -=.2;
    }
  }
}
document.getElementById('accelerate').addEventListener('click',function(){
  clearInterval(moveit);
  board.refreshRate += 10;
  moveit = setInterval(move,board.refreshRate)
})
document.getElementById('slow').addEventListener('click',function(){
  clearInterval(moveit);
  board.refreshRate -= 10;
  moveit = setInterval(move,board.refreshRate);
})
document.querySelector('body').addEventListener('keydown', function(e) {
  // if(e.which=== 65|| e.which === 68){
  //   accelerateFunction();
  // }
  if(e.which === 27){
    board.togglePause();
  }
  for(item in board.player.keysDown){
    if(parseInt(item) === e.which){
      board.player.keysDown[item] = true;
    }
  }
});
document.querySelector('body').addEventListener('keyup', function(e) {
  if(e.which === 65||e.which === 68){
    board.player.vx = board.player.restSpeed;
  }
  if(e.which === 87||e.which === 83){
    board.player.vy = board.player.restSpeed;
  }
  for(item in board.player.keysDown){
    if(parseInt(item) === e.which){
      board.player.keysDown[item] = false;
    }
  }
});
document.querySelector('#resume').addEventListener('click',function(){
  board.togglePause();
})
document.querySelectorAll('.newGame').forEach(function(e){
  e.addEventListener('click',function(){
    board.reset();
  });
})
board.initNPCS();
const checkSpawns = function() {
  if(board.npcs.length < 15){
    board.spawnNPC();
     console.log('spawnOne firing',board.npcs);
  }
}
// let randomize = setInterval(function() {
//   var random_boolean = Math.random() >= 0.5;
//   gol = random_boolean;
// },2000)

// let clearbtn = document.getElementById('clearbtn');
// clearbtn.addEventListener('click',function(){
//   if(clearbtn.getAttribute('data-cleared')==='o'){
//     clearInterval(moveit);
//     clearbtn.setAttribute('data-cleared','n');
//   }else{
//     moveit = setInterval(move,board.speed);
//     clearbtn.setAttribute('data-cleared','o');
//   }
// })
