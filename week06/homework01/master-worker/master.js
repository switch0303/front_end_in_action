const cp = require("child_process");
const net = require("net");
const cpuNum = require("os").cpus().length;

let workers = [];
let currentIndex = 0;

const createWorker = function (index) {
    const worker = cp.fork(__dirname + "/worker.js");

    // 有子进程退出时，新建子进程
    worker.on("exit", function () {
        console.log(`Worker -> pid: ${worker.pid} exited.`);
        createWorker(index);
    });

    workers[index] = worker;
    console.log(`Create worker -> pid: ${worker.pid}`);
};

for (let i = 0; i < cpuNum; i += 1) {
    createWorker(i);
}

const tcpServer = net.createServer();

tcpServer
    .on("connection", function (socket) {
        // 轮叫调度式负载均衡 Round-Robin
        workers[currentIndex].send("socket", socket);
        currentIndex = (currentIndex + 1) % cpuNum;
    })
    .on("error", function (error) {
        throw error;
    });

tcpServer.listen(8787, function () {
    console.log("TCP server is listening on port 8787.");
});
