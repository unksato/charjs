(function(s) {
    var actions = [];
    var reverseActions = [];
    var actIndex = 0;
    var prevAct = 0;
    var currentAction = null
    var x = 0;
    var size = s || 2;
    var isReverse = false;
    var isJumping = false;
    var step = 1;
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
            x+=size*2;
        }else{
            x-=size*2;
        }
    }

    function createMario(){
        var colors = ['','#000000','#ffffff','#520000','#8c5a18','#21318c','#ff4273','#b52963','#ffde73','#dea539','#ffd6c6','#ff736b','#84dece','#42849c'];
        // 01：黒
        // 02: 白
        // 03: 縁の濃い茶
        // 04: 縁の薄い茶
        // 05: 縁の濃い青
        // 06: ベースの赤
        // 07: 影の赤
        // 08: ベースの黄色
        // 09: 影の黄色
        // 10: ベースの肌色
        // 11: 影の肌色
        // 12: ベースの青
        // 13: 影の青
        var map = [[
                    [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00],
                    [00,00,00,00,00,00,00,03,03,03,03,03,00,00,00,00],
                    [00,00,00,00,00,03,03,06,06,06,08,06,03,00,00,00],
                    [00,00,00,00,03,06,06,07,07,09,08,02,03,00,00,00],
                    [00,00,00,03,07,06,07,07,01,01,01,01,01,01,00,00],
                    [00,00,03,07,07,07,01,01,01,01,01,01,01,01,01,00],
                    [00,00,03,10,01,01,01,11,01,11,01,11,00,00,00,00],
                    [00,03,10,04,10,01,11,10,01,10,01,10,04,04,00,00],
                    [00,03,11,04,10,01,01,10,10,10,10,10,10,10,04,00],
                    [00,03,01,11,10,01,10,10,01,11,11,11,11,11,04,00],
                    [00,00,01,01,11,11,10,01,01,01,01,01,01,01,00,00],
                    [00,00,00,01,04,04,11,11,11,01,01,01,01,00,00,00],
                    [00,00,00,00,03,07,04,04,04,04,05,00,00,00,00,00],
                    [00,00,00,03,07,07,06,13,13,12,12,05,00,00,00,00],
                    [00,00,00,03,04,04,04,13,02,02,12,02,05,00,00,00],
                    [00,00,00,04,02,02,02,04,02,02,12,02,05,00,00,00],
                    [00,00,00,04,02,02,04,13,13,13,12,12,05,00,00,00],
                    [00,00,00,04,02,02,04,13,13,05,13,05,00,00,00,00],
                    [00,00,00,00,04,04,04,04,01,04,01,00,00,00,00,00],
                    [00,00,00,00,01,04,04,04,08,01,08,01,00,00,00,00]
                ],[
                    [00,00,00,00,00,00,00,03,03,03,03,03,00,00,00,00],
                    [00,00,00,00,00,03,03,06,06,06,08,06,03,00,00,00],
                    [00,00,00,00,03,06,06,07,07,09,08,02,03,00,00,00],
                    [00,00,00,03,07,06,07,07,01,01,01,01,01,01,00,00],
                    [00,00,03,07,07,07,01,01,01,01,01,01,01,01,01,00],
                    [00,00,03,10,01,01,01,11,01,11,01,11,00,00,00,00],
                    [00,03,10,04,10,01,11,10,01,10,01,10,04,04,00,00],
                    [00,03,11,04,10,01,01,10,10,10,10,10,10,10,04,00],
                    [00,03,01,11,10,01,10,10,01,11,11,11,11,11,04,00],
                    [00,00,01,01,11,11,10,01,01,01,01,01,01,01,00,00],
                    [00,00,00,01,04,04,11,11,11,01,01,01,01,00,00,00],
                    [00,00,00,04,07,07,07,04,04,04,05,00,00,00,00,00],
                    [00,00,00,04,04,04,04,13,13,12,12,05,00,00,00,00],
                    [00,00,01,04,02,02,02,04,02,02,12,02,05,01,01,00],
                    [00,01,03,04,02,02,04,04,02,02,12,02,01,08,01,01],
                    [00,01,03,04,02,02,04,13,13,13,12,05,01,04,01,01],
                    [00,01,03,01,04,04,13,13,13,13,05,01,04,01,01,00],
                    [00,01,03,08,01,00,05,05,05,05,00,01,04,01,01,00],
                    [00,00,01,01,00,00,00,00,00,00,00,00,01,01,00,00]
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
        var charHeightSize = size * 20
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
