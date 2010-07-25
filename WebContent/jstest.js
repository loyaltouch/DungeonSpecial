var g;
var wnd;
var lines = [];
var pages = [];
// ----------------------------------------------------------------//
function popArray(data){
	var poped = 0;
	if(data.length > 0){
		var index = Math.floor(Math.random() * data.length);
		poped = data[index];
		data.splice(index, 1);
	}
	return poped;
}
function peekArray(data){
	var poped = 0;
	if(data.length > 0){
		var index = Math.floor(Math.random() * data.length);
		poped = data[index];
	}
	return poped;
}
function parseTable(ary, tbl, Klass){
	var label = tbl[0];
	for(var i = 1; i < tbl.length; i++){
		var member = new Klass();
		for(var j = 0; j < label.length; j++){
			member[label[j]] = tbl[i][j];
		}
	ary.push(member);
	if(member.名前 != undefined){
		ary[member.名前] = member;
	}else if(member.name != undefined){
		ary[member.name] = member;
		}
	}
}
function aryIndexOf(ary, name){
	for(var i = 0; i < ary.length; i++){
		if(ary[i].名前 == name){
			return ary[i];
		}else if(ary[i].name == name){
			return ary[i];
		}
	}
	return undefined;
}
// ----------------------------------------------------------------//
// ゲームデータ
var memberTable = [
	["名前", "HP", "MP", "攻撃力", "防御力", "素早さ"],
	["マリスター", 20, 12, 10, 10, 10],
	["マサムネ", 18, 5, 12, 6, 13],
	["ティアミス", 15, 15, 14, 14, 13],
	["コーリー", 13, 5, 10, 8, 16],
	["ピット", 10, 5, 15, 8, 10],
	["インドラ", 9, 20, 5, 5, 6],
];
var itemTable = [
	["名前", "属性", "値", "価格"],
	["素手", "武器", 0, 0],
	["無装備", "防具", 0, 0],
	["銅の剣", "武器", 5, 20],
	["ナイフ", "武器", 1, 10],
	["銅の鎧", "防具", 12, 20],
	["布のローブ", "防具", 8, 10],
];
var encounterTable = [
    ["名前", "遭遇数"],
    ["スライム", 10],
    ["ゴブリン", 8],
    ["ドラゴン", 4],
    ["ヴァンパイア", 7],
];
// ----------------------------------------------------------------//
// ゲームデータ用ユーティリティ
var root = {};
function initRoot(){
	root.members = [];
	root.party = [];
	root.enemy = [];
	root.items = [];
	root.floors = [];
	root.enemyTable = [];
	root.message = "";
	root.inited = true;

	var field = {};
	field.名前 = "S1";
	field.processField = function(){

	};
}
function Member(){
	this.装備 = {
		武器: root.items.素手,
		防具: root.items.無装備
	};
	this.getAtk = function(){
		return this.攻撃力 + this.装備.武器.値;
	};
	this.getDfn = function(){
		return this.防御力 + this.装備.防具.値;
	};
}
function initItem(){
	parseTable(root.items, itemTable, Object);
}
function initMember(){
	parseTable(root.members, memberTable, Member);
}
function initParty(){
	while(root.party.length < 4){
		root.party.push(popArray(root.members));
	}
}
function initEncounter(){
	parseTable(root.enemyTable, encounterTable, Object);
}
function init(){
	initRoot();
	initItem();
	initMember();
	initParty();
	initEncounter();
	lines[0] = root.party[0].名前;
	lines[1] = root.party[1].名前;
	lines[2] = root.party[2].名前;
	lines[3] = root.party[3].名前;
}
// ----------------------------------------------------------------//
// ゲームシステム
function damage(df, point){
	if(point < 0){
		point = 0;
	}
	df.HP -= point;
	return point;
}
function atack(of, df){
	var point = of.getAtk() - df.getDfn() + roledd();
	damage(df, point);
	return point;
}
function roledd(){
	return Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
}
function encounter(){
	var enemy = peekArray(root.enemyTable);
	var maxLen = enemy.遭遇数;
	var enemyLen = Math.floor(Math.random() * maxLen) + 1;
	lines[3] = enemy.名前 + " が現れた！ ×" + enemyLen;
}
// ----------------------------------------------------------------//
function draw() {
	/* canvas要素のノードオブジェクト */
	/* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
	/* 2Dコンテキスト */
	if(g == undefined){
		var canvas = document.getElementById('canvas');
		if(!canvas || !canvas.getContext){ return false; }
		g = canvas.getContext('2d');
		g.font = "30px sans-serif";
	}
	/* 四角を描く */
	g.fillStyle = "#000000";
	g.fillRect(0, 0, 640, 480);

	if(wnd == undefined){
		wnd = new Image();
		wnd.src = "window.png";
		wnd.onload = function(){
			this.loaded = true;
			draw();
		};
	}

	if(wnd.loaded){
		g.drawImage(wnd, 0, 320);
	}

	// 文字列の描画
	for(var i = 0; i < 4; i++){
		g.strokeStyle = "#000000";
		g.lineWidth = 3;
		g.strokeText(lines[i], 40, 320+40+30*i);
		g.fillStyle = "#FFFFFF";
		g.fillText(lines[i], 40, 320+40+30*i);
	}

	g.fillStyle = "#000000";
	g.lineWidth = 1;
}
//----------------------------------------------------------------//
function test(){
	draw();
	encounter();
}
init();
