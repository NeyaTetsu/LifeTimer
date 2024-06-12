/* 変数宣言 */

//URLのパラメータ取得
let url = new URL(window.location.href);
let params = url.searchParams;
let dateURL = params.get('date');//date("yyyy-mm-dd"形式)
let genderURL = params.get('gender');//gender(man, woman, genderless)

//平均寿命
//出典：https://www.mhlw.go.jp/toukei/saikin/hw/life/life22/dl/life22-02.pdf
const man = convLifeUnit(81.05); //男性81.05歳
const woman = convLifeUnit(87.09); //女性87.09歳
const genderless = (man + woman) / 2;
//使いやすい形に変換（年→ミリ秒）
function convLifeUnit(x){
    //計算式 平均寿命(年)*365日+4年ごとのうるう年*24時間*60分*60秒*1000
    let y = (x * 365 + x / 4) * 24 * 60 * 60 * 1000;
    return y;
}
//性別取得用
let yourLife = genderless;

//現在日時用変数
//var currentTime = new Date().getTime();
let curTime = 0;

//誕生日
//とりあえず自分の誕生日
//生まれ時間は考慮しない（00:00基準）
//var birthTime = new Date("2005-02-25").getTime();
let birthTime = 0;

//残り寿命用変数
let remainTime = 0;
//寿命オーバーした人用
let over = false;
//HTML表示向けの変数
let viewTime = [];
let counterText0 = `xx日と`;
let counterText1 = `xx時間xx分xx秒`;

//カウンター用
let gaugeValue = 0;

//HTML取得
//設定項目
const birthday = document.getElementById("birthday");
const gender = document.getElementById("gender");
const save = document.getElementById("save");
//カウンター
const gaugeUnit = document.querySelector(".gaugeUnit")
const gaugeUnit0 = document.getElementById("gaugeUnit0");
const gaugeUnit1 = document.getElementById("gaugeUnit1");
const gaugeUnit2 = document.getElementById("gaugeUnit2");
const gaugeUnit3 = document.getElementById("gaugeUnit3");
const counter0 = document.getElementById("counter0");
const counter1 = document.getElementById("counter1");
//ゲージの色
const gaugeColor0 = "rgba(0, 0, 0, 0.39)";
const gaugeColor1 = "rgba(0, 255, 0, 0.39)";
const gaugeColor2 = "rgba(255, 192, 0, 0.39)";
const gaugeColor3 = "rgba(255, 0, 0, 0.39)";
//メニュー画面表示非表示
const opnButton = document.getElementById("open");
const clsButton = document.getElementById("close");
const menuWindow = document.getElementById("menu");


/* 実行 */

//URLパラメータの情報を変数に反映
if(dateURL != null){
    birthday.value = dateURL;
    gender.value = genderURL;
}

save.addEventListener("click", function(){
    params.delete("date");
    params.delete("gender");
    params.append("date", birthday.value);
    params.append("gender", gender.value);
    location.href = url.href;
})

//繰り返し実行
ticktack();
function ticktack(){
    //現在日時取得
    curTime = new Date().getTime();
    birthTime = new Date(birthday.value).getTime();
    //性別取得
    yourLife = eval(gender.value);
    //残り寿命を計算
    formulaLife();
    //ゲージアニメーション(複雑すぎるから分ける)
    if(!over){
        gaugeAnimation();
    }
    //表示更新
    refreshView();
    //1秒ごとに繰り返す
    setTimeout(ticktack,1000);
}

//残り寿命を計算
function formulaLife(){
    //計算式 (現在日時-誕生日=生きた日数)-平均寿命
    remainTime = (curTime - birthTime) - yourLife;
    if(remainTime > 0){
        over = true;
    }else{
        over = false;
        viewTime = convViewTime(remainTime);
    }
}
//表示しやすい形式に変換
function convViewTime(x){
    let y = Math.abs(x/1000);//絶対値にしてミリ秒から秒に変換
    let z = [];
    z.push(Math.floor(y / 60 / 60 / 24));//日
    z.push(Math.floor(y / 60 / 60 % 24));//時間
    z.push(Math.floor(y / 60 % 60));//分
    z.push(Math.floor(y % 60));//秒
    return z;
}

//カウントダウンゲージ
function gaugeAnimation(){
    gaugeValue = -remainTime / yourLife;
    var unitCorner = 0.125
    var unit0_wMove = unitCorner * 7;
    var unit0_hMove = unitCorner * 6;
    var unit1_hMove = unitCorner * 5;
    var unit1_wMove = unitCorner * 4;
    var unit2_wMove = unitCorner * 3;
    var unit2_hMove = unitCorner * 2;
    var unit3_hMove = unitCorner * 1;
    //var unit3_wMove = unitCorner * 0;
    gaugeUnit0.style.width = "50%";
    gaugeUnit0.style.height = "50%";
    gaugeUnit1.style.width = "50%";
    gaugeUnit1.style.height = "50%";
    gaugeUnit2.style.width = "50%";
    gaugeUnit2.style.height = "50%";
    gaugeUnit3.style.width = "50%";
    gaugeUnit3.style.height = "50%";
    if(gaugeValue >= unit0_wMove){
        gaugeUnit0.style.width = formulaGaugeUnitMove(gaugeValue, unit0_wMove);
        gaugeUnit0.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit1.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor1);
    }else if(gaugeValue >= unit0_hMove && gaugeValue < unit0_wMove){
        gaugeUnit0.style.height = formulaGaugeUnitMove(gaugeValue, unit0_hMove);
        gaugeUnit0.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit1.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor1);
    }else if(gaugeValue >= unit1_hMove && gaugeValue < unit0_hMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.height = formulaGaugeUnitMove(gaugeValue, unit1_hMove);
        gaugeUnit1.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor1);
    }else if(gaugeValue >= unit1_wMove && gaugeValue < unit1_hMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.width = formulaGaugeUnitMove(gaugeValue, unit1_wMove);
        gaugeUnit1.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor1);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor1);
    }else if(gaugeValue >= unit2_wMove && gaugeValue < unit1_wMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.width = "0%";
        gaugeUnit2.style.width = formulaGaugeUnitMove(gaugeValue, unit2_wMove);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor2);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor2);
    }else if(gaugeValue >= unit2_hMove && gaugeValue < unit2_wMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.width = "0%";
        gaugeUnit2.style.height = formulaGaugeUnitMove(gaugeValue, unit2_hMove);
        gaugeUnit2.style.setProperty("--gaugeColor", gaugeColor2);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor2);
    }else if(gaugeValue >= unit3_hMove && gaugeValue < unit2_hMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.width = "0%";
        gaugeUnit2.style.height = "0%";
        gaugeUnit3.style.height = formulaGaugeUnitMove(gaugeValue, unit3_hMove);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor3);
    }else if(gaugeValue < unit3_hMove){
        gaugeUnit0.style.height = "0%";
        gaugeUnit1.style.width = "0%";
        gaugeUnit2.style.height = "0%";
        gaugeUnit3.style.width = formulaGaugeUnitMove(gaugeValue, 0);
        gaugeUnit3.style.setProperty("--gaugeColor", gaugeColor3);
    }
    function formulaGaugeUnitMove(x, y){
        let z = (x - y) / unitCorner * 50;
        return z + "%";
    }
}

//表示更新
function refreshView(){
    if(over){
        counterText0 = `平均寿命超え　`;
        counterText1 = `カウント不可`;
    }else{
        counterText0 = `${viewTime[0]}日と`;
        counterText1 = `${viewTime[1]}時間${viewTime[2]}分${viewTime[3]}秒`;
    }
    counter0.innerText = counterText0;
    counter1.innerText = counterText1;
}


//メニュー画面表示非表示
menuWindow.className = 'hide';//最初は非表示
opnButton.addEventListener("click",function(){
    menuWindow.className = "";
});
clsButton.addEventListener("click",function(){
    menuWindow.className = "hide";
});