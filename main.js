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
    width:60,
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
    grow: function(much){
      this.width += much /2;
      this.height += much /2;
      this.selector.style.width = this.width + 'px';
      this.selector.style.height = this.height + 'px';
      board.score += much;
      board.showScore();
      return;
    }
  },
  togglePause: function() {
    let paused = document.querySelector('.pause');
    if(paused.className === "pause"){
      moveit = setInterval(move,this.refreshRate);
      paused.className = "pause nodisplay";
    }else{
      clearInterval(moveit);
      paused.setAttribute('class','pause');
    }
  },
  reset: function() {
    let player = this.player;
    player.width = 60;
    player.height = 60;
    player.x = 350;
    player.x = 200;
    this.score = 0;
    for(let i=0;i<this.npcs.length;i++){
      this.npcs[i].selector.remove();
    }
    this.npcs = [];
    this.initNPCS();
    this.refreshRate = 25;
    changePosition(board.player);
    moveit = setInterval(move,this.refreshRate);
    document.querySelector('.pause').className = "pause nodisplay";
  },
  spawnNPC: function() {
    this.npcs.push(new Npc(-50,20,20,20));
    this.npcs[this.npcs.length-1].htmlCreate('background-color:orange');
  },
  initNPCS: function() {
    let colors = ['red','blue','purple','#000']
    let count = 0;
    for(let i=0;i<200;i+=50){
      this.npcs.push(new Npc(0,i,50,50));
      this.npcs[this.npcs.length-1].htmlCreate('background-color:'+colors[count]);
      count++;
    }
  },
  showScore: function() {
    document.getElementById('score').innerHTML = board.score;
  }
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
      switch(item){
        case '87'://W
          if(board.player.y >= 0){
            board.player.y -= board.player.vy;
          }
          break;
        case '65'://A
          if(board.player.x  > 0 - board.player.width / 2){
            board.player.x -= board.player.vx;
          }else{
            board.player.x = boundaryX - board.player.width;
          }
          break;
        case '68'://D
          if(board.player.x <= boundaryX - board.player.width / 2){
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
        if(board.npcs[i].x < player.x + player.width &&
           board.npcs[i].x + board.npcs[i].width > player.x &&
           board.npcs[i].y < player.y + player.height &&
           board.npcs[i].height + board.npcs[i].y > player.y)
        {
          board.npcs[i].selector.className += ' collided';
          if(player.width * player.height > board.npcs[i].width * board.npcs[i].height){
            board.npcs[i].kill();
            player.grow(10);
          }
        }else{
          board.npcs[i].selector.className = board.npcs[i].selector.className.replace(/[ ]collided/,'')
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
let accelerateInterval;
const accelerateFunction = function(){
  console.log('firing accelerateFunction');
  accelerateInterval = setInterval(function(){
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
  },500);
}
let moveit;
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
  if(e.which=== 65|| e.which === 68){
    accelerateFunction();
  }
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
  if(e.which === 87 ||e.which === 65||e.which === 68 ||e.which === 83){
    //if(typeof(accelerateInterval)!=="undefined"){
      console.log('clearing accelerateInterval');
      clearInterval(accelerateInterval);
   // }
    if(board.player.vx > 0){
      board.player.vx = board.player.restSpeed;
      console.log('setting vx to default;',board.player.vx);
    }else{
      board.player.vx = board.player.restSpeed * -1;
      console.log('setting vx to default;',board.player.vx);
    }
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
document.querySelector('#newGame').addEventListener('click',function(){
  board.reset();
})


board.initNPCS();
spawnOne = setInterval(function(){
  if(board.npcs.length < 15){
    board.spawnNPC();
     console.log('spawnOne firing',board.npcs);
  }
},8000)
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
