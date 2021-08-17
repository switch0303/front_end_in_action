const net = require("net");
const maxConnectCount = 10;

for (let i = 0; i < maxConnectCount; i += 1) {
    const client = net
        .createConnection(
            {
                port: 8787,
                host: "127.0.0.1",
            },
            function () {
                // console.log("client connected.");
                if (Math.random() < 0.5) {
                    console.log("Command 'EXIT' sent.");
                    client.write("EXIT"); // 发送'EXIT'时，服务端子进程会退出
                }
            }
        )
        .on("connect", (data) => {
            // console.log("connect");
        })
        .on("ready", (data) => {
            // console.log("ready");
        })
        .on("drain", (data) => {
            // console.log("drain");
        })
        .on("data", (data) => {
            console.log(data.toString());
        })
        .on("end", (data) => {
            // console.log("end");
        })
        .on("error", (error) => {
            throw error;
        })
        .on("timeout", (error) => {
            console.log("timeout");
        });
}
