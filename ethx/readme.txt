1. 安装mongodb、nodejs、npm等运行环境
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt update
sudo apt install -y mongodb-org
sudo apt install -y nodejs-legacy npm

2. 复制explore到任意目录，可从SVN上下载
svn export https://192.168.1.250/svn/BitcoinCore/explorer-master

3. cd explorer-master，安装依赖库
npm install

4. 修改配置文件tools/config.json其中的配置项(将IP改为mongodb/geth所在IP，blocks.start改为ETH上线时的块高度)
    "mongoUri": "mongodb://192.168.1.196/blockDB",
    "gethRpc": "http://192.168.1.196:8545",
	"blocks": [ {"start": 1000000, "end": "latest"}],

5. 安装pm2（使用pm2管理node.js进程）
sudo npm install -g pm2
	
6. 使用pm2启动app.js、tools/listenTxs.js和tools/listenBlks.js
pm2 start app.js -i 4
pm2 start tools/listenTxs.js
pm2 start tools/listenBlks.js

7. grabber异常退出时，启动patch脚本修复丢失的块
pm2 start tools/patch.js

8. pm2监看程序运行情况
pm2 monit

9. mongodb数据库建索引
db.blocks.ensureIndex({"confirmed":1},{"background":true})
db.blocks.ensureIndex({"hash":1},{"background":true})
db.blocks.ensureIndex({"number":1},{"background":true})

db.transactions.ensureIndex({"from":1},{"background":true})
db.transactions.ensureIndex({"to":1},{"background":true})
db.transactions.ensureIndex({"recv":1},{"background":true})
db.transactions.ensureIndex({"nonce":1},{"background":true})

db.transactions.ensureIndex({"blockNumber":-1},{"background":true})
db.transactions.ensureIndex({"blockHash":1},{"background":true})

db.transactions.ensureIndex({"token":1},{"background":true})
db.transactions.ensureIndex({"multiSig":1},{"background":true})
db.transactions.ensureIndex({"hash":1},{"background":true})
db.transactions.ensureIndex({"transferType":1},{"background":true})

db.pendingtransactions.ensureIndex({"from":1},{"background":true})
db.pendingtransactions.ensureIndex({"to":1},{"background":true})
db.pendingtransactions.ensureIndex({"recv":1},{"background":true})
db.pendingtransactions.ensureIndex({"nonce":1},{"background":true})

db.pendingtransactions.ensureIndex({"blockNumber":-1},{"background":true})
db.pendingtransactions.ensureIndex({"blockHash":1},{"background":true})

db.pendingtransactions.ensureIndex({"token":1},{"background":true})
db.pendingtransactions.ensureIndex({"multiSig":1},{"background":true})
db.pendingtransactions.ensureIndex({"hash":1},{"background":true})
db.pendingtransactions.ensureIndex({"transferType":1},{"background":true})

附：
区块链浏览器地址示例
http://192.168.1.196:3000/
通过地址查询交易记录示例
http://192.168.1.196:3000/api?&addr=0x42273725bfbf50518f6e935598bfdc73706a6895
