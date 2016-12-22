(function(s) {
    var actions = [];
    var reverseActions = [];
    var actIndex = 0;
    var prevAct = 0;
    var currentAction = null
    var x = 0;
    var size = s || 2;
    var jump = 23;
    var yVector = 0;
    var gravity = 4;
    var isReverse = false;
    var isJumping = false;
    
    function drawAction(){
        var doc = document.body;
        
        if(currentAction != null){
            doc.removeChild(currentAction);
            currentAction = null;
        }

        var next = 0;
        if(isJumping){
            next = 3;
        }else{
            switch(actIndex){
                case 0:
                    next = 1;
                    break;
                case 1:
                    if(0 == prevAct){
                        next = 2;
                    }else{
                        next = 0;
                    }
                    break;
                case 2:
                    next = 1;
                default:
                    next = 0;
            }
        }
        prevAct = actIndex;
        actIndex = next;
        if(!isReverse){
            currentAction = actions[next];
        }else{
            currentAction = reverseActions[next];
        }
        currentAction.style.left = x + 'px';

        if(isJumping){
            yVector -= gravity;
            var tempVec = yVector * size;
            if (tempVec <= 0){
                isJumping = false;
                yVector = 0;
            }
            currentAction.style.bottom = tempVec + 'px';
        }
        doc.appendChild(currentAction);

        if(x > window.innerWidth - size * 16 && isReverse == false){
            isReverse = true;
        }
        if(x < 0 && isReverse == true){
            isReverse = false;
        }

        if(!isReverse){
            x+=size*2;
        }else{
            x-=size*2;
        }
    }

    function createMario(){
        var colors = ['#000000','#dc2900','#fea53b','#8b7300'];
        var map = [[
                [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
                [0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],
                [0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],
                [0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],
                [0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],
                [0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],
                [0,0,3,3,3,3,1,1,3,3,0,0,0,0,0,0],
                [2,2,3,3,3,3,1,1,1,3,3,3,2,2,2,0],
                [2,2,2,0,3,3,1,2,1,1,1,3,3,2,2,0],
                [2,2,0,0,1,1,1,1,1,1,1,0,0,3,0,0],
                [0,0,0,1,1,1,1,1,1,1,1,1,3,3,0,0],
                [0,0,1,1,1,1,1,1,1,1,1,1,3,3,0,0],
                [0,3,3,1,1,1,0,0,0,1,1,1,3,3,0,0],
                [0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0]
                ],[
                [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
                [0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],
                [0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],
                [0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],
                [0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],
                [0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],
                [0,0,0,0,3,3,1,3,3,3,0,0,0,0,0,0],
                [0,0,0,3,3,3,3,1,1,3,3,0,0,0,0,0],
                [0,0,0,3,3,3,1,1,2,1,1,2,0,0,0,0],
                [0,0,0,3,3,3,3,1,1,1,1,1,0,0,0,0],
                [0,0,0,1,3,3,2,2,2,1,1,1,0,0,0,0],
                [0,0,0,0,1,3,2,2,1,1,1,0,0,0,0,0],
                [0,0,0,0,1,1,1,3,3,3,3,0,0,0,0,0],
                [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
                [0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0]
                ],[
                [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
                [0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],
                [0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],
                [0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],
                [0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],
                [0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],
                [0,0,0,0,3,3,3,3,1,3,0,2,0,0,0,0],
                [0,0,0,2,3,3,3,3,3,3,2,2,2,0,0,0],
                [0,0,2,2,1,3,3,3,3,3,2,2,0,0,0,0],
                [0,0,3,3,1,1,1,1,1,1,1,0,0,0,0,0],
                [0,0,3,1,1,1,1,1,1,1,1,0,0,0,0,0],
                [0,3,3,1,1,1,0,1,1,1,0,0,0,0,0,0],
                [0,3,0,0,0,0,3,3,3,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                ],[
                [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
                [0,0,0,0,0,0,1,1,1,1,1,0,0,2,2,2],
                [0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2],
                [0,0,0,0,0,3,3,3,2,2,3,2,0,3,3,3],
                [0,0,0,0,3,2,3,2,2,2,3,2,2,2,3,3],
                [0,0,0,0,3,2,3,3,2,2,2,3,2,2,2,0],
                [0,0,0,0,3,3,2,2,2,2,3,3,3,3,3,0],
                [0,0,0,0,0,0,2,2,2,2,2,2,2,3,0,0],
                [0,0,3,3,3,3,3,1,3,3,3,1,3,0,0,0],
                [0,3,3,3,3,3,3,3,1,3,3,3,1,0,0,3],
                [2,2,3,3,3,3,3,3,1,3,3,3,1,0,0,3],
                [2,2,2,0,1,1,3,1,1,2,1,1,2,1,3,3],
                [0,2,0,3,1,1,1,1,1,1,1,1,1,1,3,3],
                [0,3,3,3,1,1,1,1,1,1,1,1,1,1,3,3],
                [0,3,3,3,1,1,1,1,1,1,1,0,0,0,0,0],
                [0,3,0,0,0,1,1,1,0,0,0,0,0,0,0,0]
                ]];

        for(var i = 0; i < map.length; i++){
            actions.push(createAction(map[i],colors,size,false))
            reverseActions.push(createAction(map[i],colors,size,true))
        }
    }

    function createAction(map,colors,size,reverse){
        var elm = document.createElement("canvas");
        var ctx = elm.getContext("2d");
        var charSize = size * 16
        elm.setAttribute("width", charSize.toString());
        elm.setAttribute("height", charSize.toString());
        elm.style.cssText = "z-index: 999; position: fixed; bottom: 0;";

        drawCharacter(ctx, map, colors, size, reverse)

        return elm;
    }

    function drawCharacter(ctx,map,cp,size,reverse){
        for(var y = 0; y < map.length; y++){
            if(reverse)
                map[y].reverse()
            for(var x = 0; x < map[y].length; x++){
                if(map[y][x] != 0){
                    ctx.beginPath()
                    ctx.rect(x * size, y * size, size, size)
                    ctx.fillStyle = cp[map[y][x]]
                    ctx.fill()
                }
            }
            if(reverse)
                map[y].reverse()
        }
    }

    document.addEventListener('keypress',function(e){
        if(e.keyCode==32 && isJumping == false){
            isJumping = true;
            yVector = jump;
        }
    });

    document.addEventListener('touchstart',function(){
        if(isJumping == false){
            isJumping = true;
            yVector = jump;
        }
    });

    createMario();
    setInterval(function(){
        drawAction();
    },50);

})();
