<?php
	header('Content-type: application/xml; encoding="UTF-8"');

	$list = array("なし");
	if ($_GET["command"] == "party"){
		$list = explode(",", "マリスター,レイピア,マサムネ,ピット");
	} elseif ($_GET["command"] == "command") {
		$list = explode(",", "キャンプ,移動,システム");
	}
 ?>
<party>
<?php
foreach($list as $item){
	echo("<member>{$item}</member>");
}
?>
</party>
