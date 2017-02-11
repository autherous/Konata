class Konata{
    constructor(){
        this.name = "Konata";

        // private変数．外部からはアクセサを用意しない限りアクセスできない．
        // ローカル変数と区別するため this. を付ける．
        this.files = null; // 見たいファイル名とパース結果を関連付ける連想配列
        this.lastFetchedId = 0;
        this.parser_ = null;

        this.FileReader_ = require("./file_reader").FileReader;
        this.OnikiriParser_ = require("./onikiri_parser").OnikiriParser;
        this.OpCache_ = require("./op_cache").OpCache;
    }

    close(){
        this.files = null;
        this.lastFetchedId = null;
        this.parser_ = null;
    }


    openFile(path){
        if (this.files != null) {
            this.close();
        }

        let file = new this.FileReader_(path);
        let parser = new this.OnikiriParser_();
        this.parser_ = parser;
        console.log("Open :", path);

        try {
            if (parser.setFile(file)) {
                console.log("Selected parser:" , parser.getName());
                this.files = new this.OpCache_(path, parser);
                return true;
            }
        } catch (e) {
            if (e == "Wait") {
                console.log("Selected parser:" , parser.getName());
                this.files = new this.OpCache_(path, parser);
                throw e;
            }
        }
        return false;
    }

    getOp(id){
        let file = this.files;
        if (file == null) {
            throw "Not opened";
        }
        let op = file.getOp(id);
        if (op != null) {
            this.lastFetchedId = id;
        }
        return op;
    }

    get lastID(){
        return this.parser_.lastID;
    }

    get laneMap(){
        return this.parser_.laneMap;
    }

    get stageLevelMap(){
        return this.parser_.stageLevelMap;
    }

    /*
    // プリフェッチも一旦無効に

    this.prefetch = null;
    this.prefetchInterval = 1000;
    this.prefetchNum = 1000;

    // なにか時間のかかりそうな処理の前には呼び出す．
    this.CancelPrefetch = function(){
        if (this.prefetch !== null) {
            clearTimeout(this.prefetch);
            this.prefetch = null;
        }
    };

    // 時間のかかりそうな処理の終わりに呼んでおく．
    function SetPrefetch (self) {
        this.CancelPrefetch(); // 多重予約を防ぐために予約済のプリフェッチがあればキャンセルする．
        this.prefetch = setTimeout(function(){Prefetch(self);}, this.prefetchInterval);
    }

    // この関数を直接呼ぶことは禁止．
    // プリフェッチしたければSetPrefetchメソッドを利用する．
    function Prefetch(self) {
        for (let key in this.lastFetchedId) {
            let start = this.lastFetchedId[key] + 1;
            let end = start + this.prefetchNum;
            for (let id = start; id < end; id++) {
                let op = null;
                try {
                    op = self.getOp(key, id);
                } catch(e) {
                    console.log(e);
                    break;
                }
                if (op == null) {
                    break;
                }
            }
        }
        SetPrefetch(self);
    }
    */
}

module.exports.Konata = Konata;