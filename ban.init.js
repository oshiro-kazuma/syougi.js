
//盤、マスの初期化と描画処理
ban.init_ban = function() {

  //もち駒盤の描画処理
  ban.init_motiKoma();

  //マス配列の初期化処理
  ban.masu = new Array(9);
  for ( var i = 0 ; i < 9 ; i++ ){
    ban.masu[i] = new Array(9);
    for (var j = 0; j < 9; j++) {
      ban.masu[i][j] = {"koma" : null, "direction" : null};
    }
  }

  //通常時
  if(ban.player == "North"){
    // 縦マスのループ
    for(var i = 0; i < 9; i++) {
      // 横マスのループ
      for(var j = 0; j < 9; j++) {
        ban.addMasu(i, j);
      }
    }

  //盤を逆転させる
  } else {
    // 縦マスのループ
    for(var i = 8; i >= 0; i--) {
      // 横マスのループ
      for(var j = 8; j >= 0; j--) {
        ban.addMasu(i, j);
      }
    }
  }
};

ban.addMasu = function(i, j) {

  // 盤にマスを追加
  var html = "<div class='masu' id='masu"+j+i+"'></div>";
  $("#ban").append(html);

  // マスのDOMを取得
  var masu = $("#masu" + j + i);

  // マウスがのっかった時のイベントの登録
  masu.hover(
    function () {
      $(this).animate({
          opacity: 0.8
        }, "fast" );
    },
    function () {
      $(this).animate({
        opacity: 1
      }, "fast" );
    }
  );

  // クリック時のイベント登録
  masu.click( function(i,j) {
    var _i = i;
    var _j = j;

        return function(e) {
          ban.onClickMasu(_i,_j);
        };

    } (j,i));

};

//もち駒盤の初期化処理
ban.init_motiKoma = function() {

  // TODO 画像サイズは-5px
  for(var i = 0; i < 20; i++) {
    // マスの追加
    var html = "<div class='motiKoma' id='motiKomaNorth"+ i +"'></div>";
    $("#motiKomaNorth").append(html);

    var koma = $("#motiKomaNorth" + i);

    // マウスがのっかった時のイベントの登録
    koma.hover(
      function () {
        $(this).animate({
            opacity: 0.8
          }, "fast" );
      },
      function () {
        $(this).animate({
          opacity: 1
        }, "fast" );
      }
    );

    // クリック時のイベント登録
    koma.click( function(i) {
      var _i = i;

      return function(e) {
        ban.onClickMotiKoma(_i, "North");
      };
    } (i));
  }



  for(var i = 0; i < 20; i++) {
    // マスの追加
    var html = "<div class='motiKoma' id='motiKomaSouth"+ i +"'></div>";
    $("#motiKomaSouth").append(html);

    var koma = $("#motiKomaSouth" + i);

    // マウスがのっかった時のイベントの登録
    koma.hover(
      function () {
        $(this).animate({
            opacity: 0.8
          }, "fast" );
      },
      function () {
        $(this).animate({
          opacity: 1
        }, "fast" );
      }
    );

    // クリック時のイベント登録
    koma.click( function(i) {
      var _i = i;

      return function(e) {
        ban.onClickMotiKoma(_i, "South");
      };
    } (i));
  }

  // TODO もち駒がクリックされた時の処理

};

// 駒の初期化配置
ban.init_koma = function () {

  //North向きの駒の設定
  ban.masu[0][8] = {"koma":"香", "direction":"North"};
  ban.masu[1][8] = {"koma":"桂", "direction":"North"};
  ban.masu[2][8] = {"koma":"銀", "direction":"North"};
  ban.masu[3][8] = {"koma":"金", "direction":"North"};
  ban.masu[4][8] = {"koma":"王", "direction":"North"};
  ban.masu[5][8] = {"koma":"金", "direction":"North"};
  ban.masu[6][8] = {"koma":"銀", "direction":"North"};
  ban.masu[7][8] = {"koma":"桂", "direction":"North"};
  ban.masu[8][8] = {"koma":"香", "direction":"North"};
  ban.masu[1][7] = {"koma":"角", "direction":"North"};
  ban.masu[7][7] = {"koma":"飛", "direction":"North"};
  ban.masu[0][6] = {"koma":"歩", "direction":"North"};
  ban.masu[1][6] = {"koma":"歩", "direction":"North"};
  ban.masu[2][6] = {"koma":"歩", "direction":"North"};
  ban.masu[3][6] = {"koma":"歩", "direction":"North"};
  ban.masu[4][6] = {"koma":"歩", "direction":"North"};
  ban.masu[5][6] = {"koma":"歩", "direction":"North"};
  ban.masu[6][6] = {"koma":"歩", "direction":"North"};
  ban.masu[7][6] = {"koma":"歩", "direction":"North"};
  ban.masu[8][6] = {"koma":"歩", "direction":"North"};

  //South向きの駒の設定
  ban.masu[0][0] = {"koma":"香", "direction":"South"};
  ban.masu[1][0] = {"koma":"桂", "direction":"South"};
  ban.masu[2][0] = {"koma":"銀", "direction":"South"};
  ban.masu[3][0] = {"koma":"金", "direction":"South"};
  ban.masu[4][0] = {"koma":"王", "direction":"South"};
  ban.masu[5][0] = {"koma":"金", "direction":"South"};
  ban.masu[6][0] = {"koma":"銀", "direction":"South"};
  ban.masu[7][0] = {"koma":"桂", "direction":"South"};
  ban.masu[8][0] = {"koma":"香", "direction":"South"};
  ban.masu[1][1] = {"koma":"飛", "direction":"South"};
  ban.masu[7][1] = {"koma":"角", "direction":"South"};
  ban.masu[0][2] = {"koma":"歩", "direction":"South"};
  ban.masu[1][2] = {"koma":"歩", "direction":"South"};
  ban.masu[2][2] = {"koma":"歩", "direction":"South"};
  ban.masu[3][2] = {"koma":"歩", "direction":"South"};
  ban.masu[4][2] = {"koma":"歩", "direction":"South"};
  ban.masu[5][2] = {"koma":"歩", "direction":"South"};
  ban.masu[6][2] = {"koma":"歩", "direction":"South"};
  ban.masu[7][2] = {"koma":"歩", "direction":"South"};
  ban.masu[8][2] = {"koma":"歩", "direction":"South"};

};
