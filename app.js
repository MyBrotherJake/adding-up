'use strict';
//FileSystem Module
const fs = require('fs');
//ReadLine Module
const readline = require('readline');
//ReadStream from CSV
const rs = fs.createReadStream('./popu-pref.csv');
//ReadLine from rs
const rl = readline.createInterface({input:rs, output:{}});
//DataMap key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();
//line Event
// function(lineString){}
rl.on('line', lineString=>{
    //配列として取得
    const columns = lineString.split(',');
    //年
    const year = parseInt(columns[0]);
    //都道府県
    const prefecture = columns[1];
    //人口
    const popu = parseInt(columns[3]);
    //2010年 と 2015年を抽出
    if(year === 2010 || year === 2015){
        //DataMapに都道府県が存在するかチェック
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            //存在しない場合、valueを初期化
            value ={
                //2010年人口
                popu10: 0, 
                //2015年人口
                popu15: 0,
                //変化率
                change: null
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        //DataMap に追加
        prefectureDataMap.set(prefecture, value);        
    }
})
//close Event
rl.on('close', ()=>{
    //変化率
    for(let [key, data] of prefectureDataMap){
        data.change = data.popu15 / data.popu10;
    }
    //配列をソート 比較元(pair1)と比較先(pair2)
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>{        
        //pair1[0], pair2[0]は都道府県(key)
        //pair1[1], pair2[1]は連想配列のオブジェクト
        //変化率を降順        
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, data], num) =>{
        let rank = num + 1;
        return `第 ${rank} 位: ${key} : ${data.popu10} => ${data.popu15} 変化率: ${data.change}`;        
    })
    console.log(rankingStrings);
})
