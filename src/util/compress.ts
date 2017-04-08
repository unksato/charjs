namespace Util {
    export class Compression {
        public static RLE(map){
            let newMap = [];
            for(let i = 0; i < map.length; i++){
                let row = [];
                let prev = null;
                let prevCount = 0;
                for(let j = 0; j < map[i].length; j++){
                    if(prev !== map[i][j]){
                        if(prev !== null){
                            row.push(prev);
                            row.push(prevCount);
                        }
                        prev = map[i][j];
                        prevCount=1;
                    }else{
                        prevCount++;
                    }
                }
                row.push(prev);
                row.push(prevCount);
                newMap.push(row);
            }
            return newMap;
        }

        public static RLD(map){
            let newMap = [];
            for(let i = 0; i < map.length; i++){
                let row = [];
                for(let j = 0; j < map[i].length; j+=2){
                    for(let k = 0; k < map[i][j+1]; k++){
                        row.push(map[i][j]);
                    }
                }
                newMap.push(row);
            }
            return newMap;
        }
    }
}