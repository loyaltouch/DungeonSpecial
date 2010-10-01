function button1() {

}
function button2() {
	drawCanvas();
}
function button3() {
	$.get("DSP.php", {command: "command"}, processXml);
}
function button4() {
	$.get("DSP.php", {command: "party"}, processXml);
}
function drawCanvas() {
	var canvas = $("#canvas")[0];
	/* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
	if (!canvas || !canvas.getContext) {
		return false;
	}
	/* 2Dコンテキスト */
	var ctx = canvas.getContext('2d');
	/* 四角を描く */
	ctx.beginPath();
	ctx.moveTo(20, 20);
	ctx.lineTo(120, 20);
	ctx.lineTo(120, 120);
	ctx.lineTo(20, 120);
	ctx.closePath();
	ctx.stroke();
}
function drawLine(ary){
	var message = "";
	for(var i = 0; i < ary.length; i++){
		if(ary[i].名前){
			message += i + ". " + ary[i].名前 + "<br />";
		}
	}
	$("#mainMessage").html(message);
}
function processXml(xml){
	var message = "";
	$(xml).find("member").each(function(){
		var item_text = $(this).text();
		message += item_text + "<br />";
	});
	$("#mainMessage").html(message);
}
var root = [];
root.command = ["キャンプ", "移動", "システム"];
root.party = ["マリスター", "マサムネ", "ティアミス", "インドラ"];