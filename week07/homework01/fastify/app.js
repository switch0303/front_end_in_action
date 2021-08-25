const path = require("path");

const fastify = require("fastify")({
    logger: {
        level: "info",
        file: path.join(__dirname, "logs/logs.txt"),
    },
});

fastify.register(require("fastify-static"), {
    root: path.join(__dirname, "public"),
    // prefix: "/public/",
});

//setup mysql
fastify.register(require("./plugin/mysql"));
//setup mongodb
fastify.register(require("./plugin/mongo"));
//setup redis
fastify.register(require("./plugin/redis"));
//setup leveldb
fastify.register(require("./plugin/leveldb"));
// setup elasticsearch
fastify.register(require("./plugin/elasticsearch"));
//setup schedule
fastify.register(require("fastify-schedule"));

// setup router
fastify.register(require("./routers/index"));

const opts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" },
                    world: { type: "number" },
                },
            },
        },
    },
};
fastify.get("/hello", opts, async (request, reply) => {
    return { hello: "world", world: 3, hello2: "world2" }; // 不会返回 hello2
});

// create mysql table when onReady
fastify.addHook("onReady", async function () {
    console.log("ready");
    fastify.mysql.getConnection((err, connection) => {
        connection.execute(
            `CREATE TABLE IF NOT EXISTS todos (
            sortNo int,
            name varchar(50),
            date datetime,
            count int,
            id int auto_increment primary key
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
            (err, result, fields) => {
                if (err) {
                    console.log("CreateTableError", err);
                }
            }
        );
    });
});

const start = async () => {
    try {
        await fastify.listen(8100, "0.0.0.0");
        console.log("server listening on http://localhost:8100");
    } catch (err) {
        console.log(err);
        fastify.log.error(err);
    }
};
start();
