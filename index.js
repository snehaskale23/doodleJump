document.addEventListener("DOMContentLoaded",()=>{
    const grid = document.getElementById("base");
    const doodler =document.createElement('div');

    let doodlerLeftSpace=50; 
    let startPoint=150;
    let doodlerBottomSpace=startPoint;
    let isGameOver=false;
    let platformCount=5;
    let platforms=[];
    let score=0;
    let isJumping=true;
    let isGoingLeft=false;
    let isGoingRight=false;
    let leftTimerId,rightTimerId,upTimerId,downTimerId;
  

    class Platform{
        constructor(newPlatBottom){
            this.left = Math.random()*315;
            this.bottom = newPlatBottom;
            this.visual=document.createElement("div");

            const visual =this.visual;
            visual.classList.add("platform");
            visual.style.left =this.left +"px";
            visual.style.bottom = this.bottom+'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for(let i=0;i<platformCount;i++){
            let platformGap = 600/platformCount;
            let newPlatBottom = 100 + (platformGap*i);
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }


    
    function movePlatforms(){
        if(doodlerBottomSpace>=100){
            platforms.forEach((platform)=>{
                platform.bottom-=4;
                let visual=platform.visual;
                visual.style.bottom=platform.bottom+'px';
            
                if(platform.bottom<10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift()
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            })
        }
    }


    function gameOver(){
        isGameOver=true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML=score;
        clearInterval(downTimerId);
        clearInterval(upTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);

    }

    function fall(){
        isJumping=false;
        clearTimeout(upTimerId);
        downTimerId=setInterval(()=>{
            doodlerBottomSpace-=5;
            doodler.style.bottom=doodlerBottomSpace+"px";
            if(doodlerBottomSpace<=0){
                gameOver();
            }
            platforms.forEach(platform=>{
                if(
                    (doodlerBottomSpace>=platform.bottom)&&
                    (doodlerBottomSpace<=(platform.bottom+15)) &&
                    (doodlerLeftSpace+60>=platform.left) &&
                    (doodlerLeftSpace<=(platform.left+85)) &&
                    !isJumping
                ){
                    startPoint=doodlerBottomSpace
                    jump()
                    isJumping=true;
                }
            })
        },20)
    }
    
    function jump(){
        isJumping=true;
        clearInterval(downTimerId);
        upTimerId=setInterval(()=>{
            doodlerBottomSpace+=20
            doodler.style.bottom=doodlerBottomSpace+"px";
            if(doodlerBottomSpace>=startPoint+150){
                fall();
                isJumping=false;
            }
        },30)
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight=false;
        }
        isGoingLeft=true;
        leftTimerId =setInterval(()=>{
            if(doodlerLeftSpace>=0){
                doodlerLeftSpace-=5;
                doodler.style.left=doodlerLeftSpace+"px";
            }else{
                moveRight();
            }
        },30)
    }
    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft=false;
        }
        isGoingRight=true;
        rightTimerId=setInterval(()=>{
            if(doodlerLeftSpace<=313){
                doodlerLeftSpace+=5;
                doodler.style.left=doodlerLeftSpace+"px";
            }else{
                moveLeft();
            }
        },10)
    }
    function moveStraight(){
        isGoingLeft=false;
        isGoingRight=false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function control(e){
        doodler.style.bottom=doodlerBottomSpace+"px"
        if(e.key==='ArrowLeft'){
            moveLeft();
        }else if(e.key==='ArrowRight'){
            moveRight();
        }else if(e.key==="ArrowUp"){
            moveStraight();
        }
    }


    function start(){
        if(!isGameOver){
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms,30);
            jump();
            document.addEventListener('keyup',control);
        }
    }
    
    start();

    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace=platforms[0].left;
        doodler.style.left=doodlerLeftSpace+'px';
        doodler.style.bottom=doodlerBottomSpace+'px';
    }


})