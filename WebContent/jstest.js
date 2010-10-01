var g;
var wnd;
var floor1;
var icons = {};
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
	["名前", "最大HP", "最大MP", "攻撃力", "防御力", "素早さ"],
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
var menuTable = [
    ["名前", "実行"],
    ["キャンプ", "camp()"],
    ["移動", "direction()"],
    ["システム", "system()"],
    ["戻る", "ret()"],
];
// ----------------------------------------------------------------//
// ゲームデータ用ユーティリティ
var root = {};
function initRoot(){
	root.menu = [];
	root.args = [];
	root.members = [];
	root.party = [];
	root.enemy = [];
	root.items = [];
	root.floors = [];
	root.maze = [];
	root.enemyTable = [];
	root.selects = [];
	root.message = "";
	root.inited = true;
}
function Member(){
	this.hp = 1;
	this.mp = 0;
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
	this.inn = function(){
		this.hp = this.最大HP;
		this.mp = this.最大MP;
	};
}
function initMenu(){
	parseTable(root.menu, menuTable, Object);
}
function initArgs(){
	for(var i = 0; i < 8; i++){
		root.args[i] = "";
	}
	root.args.current = 0;
	selectList(root.menu);
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
function initFloors(){
	var floor = {};
	floor.名前 = "S1";
	floor.processField = function(){
		encounter();
	};
	floor.icon = "floor1";
	root.floors.push(floor);
	floor = {};
	floor.名前 = "S2";
	floor.processField = function(){
		encounter();
	};
	floor.icon = "floor2";
	root.floors.push(floor);
	floor = {};
	floor.名前 = "S3";
	floor.processField = function(){
		encounter();
	};
	floor.icon = "izumi";
	root.floors.push(floor);
}
function initMaze(){
	for(var i = 0; i < 7; i++){
		var mazeLine = [];
		for(var j = 0; j < 7; j++){
			mazeLine.push(0);
		}
		root.maze.push(mazeLine);
	}
	root.maze.x = 3;
	root.maze.y = 6;
}
function initSelects(){
	for(var i = 0; i < 4; i++){
		root.selects[i] = "";
	}
}
function init(){
	initRoot();
	initMenu();
	initArgs();
	initItem();
	initMember();
	initParty();
	initEncounter();
	initFloors();
	initMaze();

	//selectList(root.menu);
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
function inn(){
	for(var i = 0; i < 4; i++){
		try{
			root.party[i].inn();
		}catch(e){
		}
	}
}
function selectList(ary){
	for(var i = 0; i < 4; i++){
		var label = "";
		if(ary[i].名前){
			label = ary[i].名前;
		}else if(ary[i] != 0){
			label = ary[i];
		}

		if(label == ""){
			root.selects[i] = "";
			lines[i] = "";
		}else{
			root.selects[i] = label;
			lines[i] = (i + 1) + ": " + label;
		}
	}
}
function camp(){
	root.args[0] = "メニュー";
	selectList(root.party);
}
function status(){
	selectList(["特技1", "特技2", "戻る"]);
}
function direction(){
	if(root.arge[1] != ""){
		move();
	}
	/*
	if(root.args[1] == "北"){
		if(root.maze.y > 0){
			root.maze.y--;
		}else{
			root.args[1] = "";
		}
	}
	if(root.args[1] == "東"){
		if(root.maze.x < 6){
			root.maze.x++;
		}else{
			root.args[1] = "";
		}
	}
	if(root.args[1] == "南"){
		if(root.maze.y < 6){
			root.maze.y++;
		}else{
			root.args[1] = "";
		}
	}
	if(root.args[1] == "西"){
		if(root.maze.x > 0){
			root.maze.x--;
		}else{
			root.args[1] = "";
		}
	}
	*/
	if(root.args[1] != ""){
		var floor = root.maze[root.maze.y][root.maze.x];
		if(floor == 0){
			floor = root.floors[Math.floor(Math.random() * root.floors.length)];
			root.maze[root.maze.y][root.maze.x] = floor;
		}
		initArgs();
		draw();
	}else{
		var select = [];
		alert(select.length);
		if(root.maze.y > 0){
			select.push("北");
		}
		if(root.maze.x < 7){
			select.push("東");
		}
		if(root.maze.y < 7){
			select.push("南");
		}
		if(root.maze.x > 0){
			select.push("西");
		}
		selectList(select);
	}
}
function move(){

}
function checkFloor(){

}
// ----------------------------------------------------------------//
function draw() {
	/* canvas要素のノードオブジェクト */
	/* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
	/* 2Dコンテキスト */
	if(g == null){
		var canvas = document.getElementById('canvas');
		if(!canvas || !canvas.getContext){ return false; }
		g = canvas.getContext('2d');
		g.font = "30px sans-serif";
	}
	/* 四角を描く */
	g.fillStyle = "#000000";
	g.fillRect(0, 0, 640, 480);

	if(wnd == null){
		wnd = new Image();
		wnd.src = "window.png";
		wnd.onload = load_complete;
	}
	if(icons.floor1 == null){
		icons.floor1 = new Image();
		icons.floor1.src = "floor1.png";
		icons.floor1.onload = load_complete;
	}
	if(icons.floor2 == null){
		icons.floor2 = new Image();
		icons.floor2.src = "floor2.png";
		icons.floor2.onload = load_complete;
	}
	if(icons.izumi == null){
		icons.izumi = new Image();
		icons.izumi.src = "izumi.png";
		icons.izumi.onload = load_complete;
	}

	/* フロアを描く */
	for(var j = 0; j < 7; j++){
		for(var i = 0; i < 7; i++){
			var floor = root.maze[j][i];
			if(!floor.icon){
				g.strokeStyle = "#ffffff";
				g.strokeRect(i * 64, j * 64, 60, 60);
			}else{
				if(icons[floor.icon] && icons[floor.icon].loaded){
					g.drawImage(icons[floor.icon], i * 64, j * 64);
				}
			}
		}
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
	root.maze[root.maze.y][root.maze.x] = root.floors[0];
	draw();
}
function select(sel){
	root.args[root.args.current] = root.selects[sel - 1];
	if(root.args.current < 8){
		root.args.current++;
	}
	eval(root.menu[root.args[0]].実行);
	draw();
}
function load_complete(){
	this.loaded = true;
	draw();
	return;
}
init();
