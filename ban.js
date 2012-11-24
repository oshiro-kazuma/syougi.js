/*
 * オンライン対戦のコードを、一つのブラウザで動かす
 * 用に適当に書き換えたので、おかしなところがあるかも
 * しれませぬ・・・。
 */

//TODO 二歩チェックが未実装

//名前空間の定義
var ban = {};

//プレイヤー
ban.player = "North";
ban.partnerPlayer = "South";
ban.nextPlayer = "North";
ban.isSelectMode = false;		//駒を選択中かどうか
ban.isMoveDataRemoving = true;	//ページを離れるときに、駒移動情報を削除するかどうか
ban.isNoCheckUnload == false;	//ページを離れるときに、確認しないかどうか
ban.isChecingAway = false;		//対戦相手の離席をチェックする状態
ban.pollingInterval = 2000;		//ポーリングのインターバル設定

//選択中の駒情報
ban.selectedKoma = {
		"domObj" : null,
		"i" : null,
		"j" : null
};
//駒の移動範囲を格納
ban.movableZone;
ban.movableMasuDomObj = new Array();
//もち駒格納変数
ban.motiKoma = {"South" : new Array(), "North" : new Array() };


/* ------------- ここまで初期設定 ------------------------ */

ban.onClickMotiKoma = function(i, player) {

	//もち駒選択
	if (ban.isSelectMode == false) {

		if((ban.player == player) && (ban.motiKoma[player][i] != null)) {

			ban.selectedKoma.i = i;
			ban.selectedKoma.j = player;

			//配列初期化
			ban.movableZone.length = 0;

			//駒を移動できる範囲の算出
			for(var x = 0; x < 9; x++) {
				for(var y = 0; y < 9; y++) {
					if(ban.masu[x][y].koma == null) {
						ban.movableZone.push([y,x]);
					}
				}
			}

			//移動できる範囲に色を塗る
			ban.drawMovableZone(ban.movableZone);

			ban.isSelectMode = true;
		}

	//もう一度クリックしたときうぃー
	} else {

		//非選択状態にする
		ban.isSelectMode = false;

		//移動可能範囲の背景色を戻す
		for(var count = 0; count < ban.movableMasuDomObj.length; count++ ){
			ban.movableMasuDomObj[count].css("background-color","orange");
		}

		//配列削除処理
		ban.movableMasuDomObj.length = 0;
	}


};

//マスがクリックされた時の処理
ban.onClickMasu = function(i,j) {

	// 移動する駒を選択する処理
	if (ban.isSelectMode == false) {

		if((ban.masu[i][j].koma != null) && (ban.masu[i][j].direction == ban.player)) {
			ban.selectedKoma.i = i;
			ban.selectedKoma.j = j;
			ban.selectedKoma.domObj = $("#masu" + i + j);

			//駒を移動できる範囲の算出
			ban.movableZone = ban.getMovableZone(i, j);
			//移動できる範囲に色を塗る
			ban.drawMovableZone(ban.movableZone);

			ban.isSelectMode = true;
		}

	//選択した駒を、移動する処理
	} else {

		//非選択状態にする
		ban.isSelectMode = false;

		//移動可能範囲の背景色を戻す
		for(var count = 0; count < ban.movableMasuDomObj.length; count++ ){
			ban.movableMasuDomObj[count].css("background-color","orange");
		}

		//配列削除処理
		ban.movableMasuDomObj.length = 0;

		//移動可能であるかの判定
		var isMovable = false;
		for(var count = 0; count < ban.movableZone.length; count++ ){
			if((j == ban.movableZone[count][0]) && (i == ban.movableZone[count][1])) {
				isMovable = true;
				break;
			}
		}

		if(isMovable == true) {

			//もち駒の場合
			if(ban.selectedKoma.j == "South" || ban.selectedKoma.j == "North") {

				//マスの情報を変更する
				ban.masu[i][j] = {
						"koma"		:ban.motiKoma[ban.selectedKoma.j][ban.selectedKoma.i],
						"direction"	:ban.player
				};
				//もち駒を削除
				ban.motiKoma[ban.selectedKoma.j].splice(ban.selectedKoma.i, 1);
				ban.drawMotiKoma(ban.player);

				//駒の画像を変更する
				var komaImgSrc = "./koma/" + ban.getKomaImage(ban.masu[i][j]);
				$("#masu" + i + j).html("<img width='47px' height='54px' src='" + komaImgSrc + "' />");



			//通常時
			} else {

				//勝利判定
				if((ban.masu[i][j].koma == "王") && (ban.masu[i][j].direction != ban.player)) {
					ban.checkmate("win");
				}

				//相手の駒を取った場合、もち駒に加える
				if(ban.masu[i][j].koma != null) {

					//もち駒の描画処理
					ban.motiKoma[ban.player].push(ban.getkomaHead(ban.masu[i][j].koma));
					ban.drawMotiKoma(ban.player);
				}
				//駒移動処理
				ban.moveKoma(i, j);

			}

			//相手のターンに移る
			if(ban.player == "North") {
				ban.player = "South";
				$("#playerInfo").html("南の番です．");
				
			} else {
				ban.player = "North";
				$("#playerInfo").html("北の番です．");
			}
		}
	}

};
//駒の移動処理
ban.moveKoma = function(i, j) {

	//マスの情報を変更する
	ban.masu[i][j] = {
			"koma"		:ban.masu[ban.selectedKoma.i][ban.selectedKoma.j].koma,
			"direction"	:ban.player
	};

	ban.masu[ban.selectedKoma.i][ban.selectedKoma.j] = {
			"koma" 		: null,
			"direction" : null
	};

	//成金処理
	ban.narikin({
		"src_i" : ban.selectedKoma.i,
		"src_j" : ban.selectedKoma.j,
		"dst_i" : i,
		"dst_j" : j,
		"player" : ban.player,
		"koma" : ban.masu[i][j].koma
	});

	//マスの画像を変更する
	var komaImgSrc = "./koma/" + ban.getKomaImage(ban.masu[i][j]);
	$("#masu" + ban.selectedKoma.i + ban.selectedKoma.j).html("");
	$("#masu" + i + j).html("<img width='47px' height='54px' src='" + komaImgSrc + "' />");

};

//成金処理
ban.narikin = function(data) {

	if(data.player == "North"){
		if((data.dst_j >= 0 && data.dst_j < 3) || (data.src_j >= 0 && data.src_j < 3)) {
			ban.setNarikin(data.dst_i, data.dst_j, data.koma);
		}

	} else {
		if((data.dst_j > 5 && data.dst_j < 9) || (data.src_j > 5 && data.src_j < 9)) {
			ban.setNarikin(data.dst_i, data.dst_j, data.koma);
		}
	}

};

//駒裏返し処理
ban.setNarikin = function (i, j, koma) {

	switch(koma)	{
		case '飛':
			ban.masu[i][j].koma = '竜';
			break;
		case '角':
			ban.masu[i][j].koma = '馬';
			break;
		case '歩':
			ban.masu[i][j].koma = 'と';
			break;
		case '銀':
			ban.masu[i][j].koma = "成銀";
			break;
		case '桂':
			ban.masu[i][j].koma = '圭';
			break;
		case '香':
			ban.masu[i][j].koma = '杏';
			break;
		default:

	}

};

//駒の表を取得する
ban.getkomaHead = function (koma) {

	switch(koma)	{
		case '竜':
			return "飛";

		case '馬':
			return "角";

		case 'と':
			return "歩";

		case '成銀':
			return "銀";

		case '圭':
			return "桂";

		case '杏':
			return '香';

		default:
			return koma;

	}
};

//駒の描写処理
ban.draw = function () {

	// マス配列の走査
	for(var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			// マスにある駒の、画像に変更する
			var masuId = "#masu" + i + j;

			// マスに駒がある場合
			if(ban.masu[i][j].koma != null) {
				var komaImgSrc = "./koma/" + ban.getKomaImage(ban.masu[i][j]);
				$(masuId).html("<img class='koma_image' width='47px' height='54px' src='" + komaImgSrc + "' />");

			} else {
				$(masuId).html("");
			}
		}
	}
	
};

//もち駒の描画処理
ban.drawMotiKoma = function(player) {


	for(var count = 0; count <= 19; count++) {
		$("#motiKoma" + player + count).html("");
	}

	for(var count = 0; count < ban.motiKoma[player].length; count++ ){

		//駒情報の格納
		var koma = ban.motiKoma[player][count];
		var komaImgSrc = "./koma/" + ban.getKomaImage({"koma":koma, "direction":player});
		var motiKomaMasu = $("#motiKoma" + player + count);

		motiKomaMasu.html("<img width='42px' height='49px' src='" + komaImgSrc + "' />");
	}

};

// 駒の画像を返すメソッド
ban.getKomaImage = function(masu) {

	if(masu.direction === null) {
		alert(masu.koma);
		return ban.komaImg[masu.koma][0];
	}

	if(masu.direction == "North") {
		return ban.komaImg[masu.koma][0];

	} else if (masu.direction == "South") {
		return ban.komaImg[masu.koma][1];

	} else {
		return ban.komaImg[masu][0];

	}
	
};


//移動可能範囲を算出する
ban.getMovableZone = function (i, j){

	var koma = ban.masu[i][j].koma;

	//香の場合
	if (koma == "香") {
		return ban.getMovableZone2(i,j,koma);

	//飛車・角の場合
	} else if ((koma == "飛") || (koma == "角")) {
		return ban.getMovableZone3(i,j,koma);

	//竜・馬の場合
	} else if ((koma == "竜") || (koma == "馬")) {
		return ban.getMovableZone4(i,j,koma);

	//飛車、角、香以外の駒の場合
	} else {
		return ban.getMovableZone1(i,j,koma);
	}

};

//飛車、角、香以外の駒の場合
ban.getMovableZone1 = function(i, j, koma){

	//移動可能ゾーンを格納する
	var returnZone = new Array();

	$("#debug").html(prettyPrint(ban.komaMovableZone[koma]));

	for (var count = 0; count < ban.komaMovableZone[koma].length; count++ ) {

		//移動可能ゾーンの取得
		var zone = ban.komaMovableZone[koma][count];

		//データの確認
		$("#debug").html(prettyPrint(zone));

		//移動オフセット格納
		if(ban.masu[i][j].direction == "North"){
			var yOffset = i + ((-1) * zone[0]);
			var xOffset = j + ((-1) * zone[1]);
		} else {
			var yOffset = i + zone[0];
			var xOffset = j + zone[1];
		}

		if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

			//移動可能範囲内にあった場合
			if (ban.masu[yOffset][xOffset].direction != ban.player) {

				//移動可能ゾーンを格納
				returnZone.push([xOffset,yOffset]);
			}
		}
	}

	return returnZone;

};

//香の場合
ban.getMovableZone2 = function(i, j, koma){

	//移動可能ゾーンを格納する
	var returnZone = new Array();

	for (var count = 0; count < ban.komaMovableZone[koma].length; count++ ) {

		//移動可能ゾーンの取得
		var zone = ban.komaMovableZone[koma][count];

		//移動オフセット格納
		if(ban.masu[i][j].direction == "North"){
			var yOffset = i + ((-1) * zone[0]);
			var xOffset = j + ((-1) * zone[1]);
		} else {
			var yOffset = i + zone[0];
			var xOffset = j + zone[1];
		}

		if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

			//駒がない場合
			if (ban.masu[yOffset][xOffset].koma == null) {

				//移動可能ゾーンを格納
				returnZone.push([xOffset,yOffset]);

			//相手の駒の場合
			} else if (ban.masu[yOffset][xOffset].direction != ban.player) {

				//移動可能ゾーンを格納
				returnZone.push([xOffset,yOffset]);

				break;

			//それ以外
			} else if (ban.masu[yOffset][xOffset].direction == ban.player) {
				break;
			}

		}
	}

	return returnZone;

};

//飛車・角の場合
ban.getMovableZone3 = function(i, j, koma){

	//移動可能ゾーンを格納する
	var returnZone = new Array();

	$("#debug").html(prettyPrint(ban.komaMovableZone[koma]));

	for (var count = 0; count < ban.komaMovableZone[koma].length; count++ ) {

		//移動可能ゾーンの取得
		var zone = ban.komaMovableZone[koma][count];

		//データの確認
		$("#debug").html(prettyPrint(zone));

		//移動オフセット格納
		if(ban.masu[i][j].direction == "North"){
			var yOffset = i + ((-1) * zone[0]);
			var xOffset = j + ((-1) * zone[1]);
		} else {
			var yOffset = i + zone[0];
			var xOffset = j + zone[1];
		}

		for(var count2 = 0; count2 < 9; count2++) {

			if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

				//駒がない場合
				if (ban.masu[yOffset][xOffset].koma == null) {

					//移動可能ゾーンを格納
					returnZone.push([xOffset,yOffset]);

				//相手の駒の場合
				} else if (ban.masu[yOffset][xOffset].direction != ban.player) {

					//移動可能ゾーンを格納
					returnZone.push([xOffset,yOffset]);

					break;

				//それ以外
				} else if (ban.masu[yOffset][xOffset].direction == ban.player) {
					break;
				}

				//移動オフセット格納
				if(ban.masu[i][j].direction == "North"){
					var yOffset = yOffset + ((-1) * zone[0]);
					var xOffset = xOffset + ((-1) * zone[1]);
				} else {
					var yOffset = yOffset + zone[0];
					var xOffset = xOffset + zone[1];
				}

			}
		}
	}

	return returnZone;

};

//竜・馬の場合
ban.getMovableZone4 = function(i, j, koma){

	//移動可能ゾーンを格納する
	var returnZone = new Array();

	for (var count = 0; count < 4; count++ ) {

		//移動可能ゾーンの取得
		var zone = ban.komaMovableZone[koma][count];

		//移動オフセット格納
		if(ban.masu[i][j].direction == "North"){
			var yOffset = i + ((-1) * zone[0]);
			var xOffset = j + ((-1) * zone[1]);
		} else {
			var yOffset = i + zone[0];
			var xOffset = j + zone[1];
		}

		for(var count2 = 0; count2 < 9; count2++) {

			if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {

				//駒がない場合
				if (ban.masu[yOffset][xOffset].koma == null) {

					//移動可能ゾーンを格納
					returnZone.push([xOffset,yOffset]);

				//相手の駒の場合
				} else if (ban.masu[yOffset][xOffset].direction != ban.player) {

					//移動可能ゾーンを格納
					returnZone.push([xOffset,yOffset]);

					break;

				//それ以外
				} else if (ban.masu[yOffset][xOffset].direction == ban.player) {
					break;
				}

				//移動オフセット格納
				if(ban.masu[i][j].direction == "North"){
					var yOffset = yOffset + ((-1) * zone[0]);
					var xOffset = xOffset + ((-1) * zone[1]);
				} else {
					var yOffset = yOffset + zone[0];
					var xOffset = xOffset + zone[1];
				}

			}
		}
	}

	//1マス移動分の範囲
	for(var count = 4; count < 8; count++) {

		//移動可能ゾーンの取得
		var zone = ban.komaMovableZone[koma][count];

		//オフセット設定
		var Xoffset = 0;
		var Yoffset = 0;

		//移動オフセット格納
		if(ban.masu[i][j].direction == "North"){
			var yOffset = i + ((-1) * zone[0]);
			var xOffset = j + ((-1) * zone[1]);
		} else {
			var yOffset = i + zone[0];
			var xOffset = j + zone[1];
		}

		if(( xOffset < 0 || 8 < xOffset || yOffset < 0 || 8 < yOffset) == false ) {
			if (ban.masu[yOffset][xOffset].direction != ban.player) {

				//移動可能ゾーンを格納
				returnZone.push([xOffset,yOffset]);
			}
		}

	}

	return returnZone;

};

//移動可能範囲に色を塗る
ban.drawMovableZone = function(drawZone){

	for(var count = 0; count < drawZone.length; count++ ){

		var x = drawZone[count][0];
		var y = drawZone[count][1];

		//背景色の変更
		var domObj = $("#masu" + y + x)
				.css("background-color","#ff7373");

		//後で色を戻すために保存
		ban.movableMasuDomObj.push(domObj);

	}

};

ban.checkmate = function(battleResult) {

	if(battleResult == "win") {
		html = ban.player + " player win!!";
	
	} else {
		html = ban.player + " player lose...";
	}

	//ダイアログの表示
	$("body").append("<div id='endDialog'>"+ html +"</div>");
	$("#endDialog").dialog({
		show: "slide",
		title: "試合終了",
		modal: true,
		minWidth: 400,
		autoOpen:true,
		open:function(event, ui){$(".ui-dialog-titlebar-close").hide();},
		buttons: {
	        "終了": function(event) {
	        	$(this).dialog("close");
	        }
	    },
		close: function(event) {
        	ban.isNoCheckUnload = true;
			location.reload();
		}
	});

};
