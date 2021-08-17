process.on("message", (message, socket) => {
    if (message === "socket" && socket) {
        socket.on("data", (data) => {
            if (data.toString() === "EXIT") {
                process.exit(1); // 子进程收到'EXIT'时退出
            }
        });
        socket.end(`Request handled by worker -> pid: ${process.pid}`);
    }
});
