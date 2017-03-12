(function(start, pixSize, reverse) {
    var actions = [];
    var reverseActions = [];
    var actIndex = 0;
    var prevAct = 0;
    var currentAction = null
    var x = start || 0;
    var size = pixSize || 2;
    var isReverse = reverse || false;
    var step = 2;
    var currentStep = step;
    
    function drawAction(){
        var doc = document.body;
        
        if(currentAction != null){
            doc.removeChild(currentAction);
            currentAction = null;
        }

        if(currentStep < step){
            currentStep++;
        }else{
            currentStep = 0;
            switch(actIndex){
                case 0:
                    next = 1;
                    break;
                case 1:
                    next = 0;
                    break;
                default:
                    next = 0;
            }

            prevAct = actIndex;
            actIndex = next;
        }

        if(!isReverse){
            currentAction = actions[next];
        }else{
            currentAction = reverseActions[next];
        }
        currentAction.style.left = x + 'px';

        doc.appendChild(currentAction);

        if(x > window.innerWidth - size * 16 && isReverse == false){
            isReverse = true;
        }
        if(x < 0 && isReverse == true){
            isReverse = false;
        }

        if(!isReverse){
            x+=size;
        }else{
            x-=size;
        }
    }

    function createGoomba(){
        var colors = ['','#000000','#ffffff','#b82800','#f88800','#f87800','#f8c000','#f8f800'];
        // 01：黒
        // 02: 白
        // 03: 濃茶
        // 04: 薄い茶
        // 05: 足の縁のオレンジ
        // 06: 足の濃い黄色
        // 07: 足の黄色
        var map = [[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0],
            [0,0,0,1,4,1,1,1,1,3,3,3,1,1,1,1],
            [0,0,1,4,2,4,3,1,1,1,3,1,1,1,0,0],
            [0,1,3,3,4,3,3,3,2,1,1,1,2,3,1,0],
            [0,1,3,3,3,3,3,2,2,2,3,2,2,2,3,1],
            [1,3,3,3,3,3,3,2,2,1,3,1,2,2,3,1],
            [1,3,3,3,3,3,3,3,2,2,3,2,2,3,3,1],
            [1,3,3,3,3,3,3,4,4,4,4,4,4,3,3,1],
            [0,1,3,3,3,4,4,2,1,1,1,1,2,3,1,0],
            [0,5,5,5,4,4,1,1,4,4,4,4,1,4,4,0],
            [5,6,6,7,5,5,4,4,4,4,4,4,4,1,4,0],
            [1,6,6,7,7,2,5,0,0,0,0,1,1,7,2,1],
            [0,1,1,6,7,7,5,1,1,1,1,6,6,1,1,0],
            [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0]
        ],[
            [0.0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,3,3,3,3,1,1,0,0,0,0],
            [0,0,0,1,4,3,3,3,1,1,1,3,1,1,1,0],
            [0,0,1,4,2,4,3,3,3,3,1,1,3,1,1,0],
            [0,1,3,3,4,3,3,3,3,3,2,1,1,1,2,0],
            [0,1,3,3,3,3,3,3,3,2,2,2,1,2,2,0],
            [1,3,3,3,3,3,3,3,3,2,2,1,3,1,2,1],
            [1,3,3,3,3,3,3,3,3,3,2,2,3,2,2,1],
            [1,3,3,3,3,3,3,3,3,4,4,4,4,4,4,1],
            [0,1,3,3,3,3,3,4,4,2,1,1,1,1,1,0],
            [0,1,3,3,3,3,4,4,1,1,4,4,4,4,1,0],
            [0,0,1,3,3,4,4,4,4,4,4,4,4,1,0,0],
            [0,0,0,1,1,5,5,5,5,5,4,1,1,0,0,0],
            [0,0,0,0,0,5,6,6,7,7,5,0,0,0,0,0],
            [0,0,0,0,0,5,6,6,6,6,2,5,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0]
        ]];

        for(var i = 0; i < map.length; i++){
            actions.push(createAction(map[i],colors,size,false))
            reverseActions.push(createAction(map[i],colors,size,true))
        }
    }

    function createAction(map,colors,size,reverse){
        var elm = document.createElement("canvas");
        var ctx = elm.getContext("2d");
        var charWidthSize = size * 16
        var charHeightSize = size * 16
        elm.setAttribute("width", charWidthSize.toString());
        elm.setAttribute("height", charHeightSize.toString());
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

    createGoomba();

    setInterval(function(){
        drawAction();
    },50);

})(0);
