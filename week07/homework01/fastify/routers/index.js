const getDateTime = () => {
    const arr = new Date().toISOString().split(/[T|\.]/);
    return `${arr[0]} ${arr[1]}`;
};
async function routes(fastify, options) {
    const db = fastify.mongo.db;

    fastify.get("/animal", async (request, reply) => {
        return { hello: "animal" };
    });

    fastify.get("/api/todo/add", async (request, reply) => {
        const collection = db.collection("todos");
        await collection.insertMany([
            {
                subject: "为什么Fastify这么快？",
                datetime: Date.now(),
                state: 0,
            },
            {
                subject: "插入文档",
                datetime: Date.now(),
                state: 1,
            },
            {
                subject: "更新文档",
                datetime: Date.now(),
                state: 0,
            },
            {
                subject: "删除文档",
                datetime: Date.now(),
                state: 0,
            },
        ]);
        return { error: "", errorCode: 0, result: {} };
    });

    fastify.get("/api/todo/insert", async (req, reply) => {
        let value;
        if (req.query && req.query.value) {
            value = req.query.value;
        }
        if (typeof value !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param value must be string"));
        }
        const collection = db.collection("todos");
        await collection.insertOne({
            subject: value,
            datetime: Date.now(),
            state: 0,
        });
        return { error: "", errorCode: 0, result: {} };
    });

    fastify.get("/api/todo/query", async (request, reply) => {
        const collection = db.collection("todos");
        const result = await collection.find({}).toArray();
        return { error: "", errorCode: 0, result };
    });

    fastify.get("/api/redis/set", async (request, reply) => {
        console.log(request.query);
        if (!request.query)
            return { error: "401", errorCode: "param key is required" };
        const { redis } = fastify;
        Object.keys(request.query).forEach((key) => {
            redis.set(key, request.query[key]);
        });
        return { error: "", errorCode: 0, result: request.query };
    });

    fastify.get("/api/redis/get/:key", async (request, reply) => {
        if (!request.params.key)
            return { error: "401", errorCode: "param key is required" };
        const { redis } = fastify;
        let val = await redis.get(request.params.key);
        return { error: "", errorCode: 0, result: val };
    });

    fastify.get("/api/redis/getAllKeys", async (request, reply) => {
        const { redis } = fastify;
        let val = await redis.keys("*");
        return { error: "", errorCode: 0, result: val };
    });

    fastify.get("/api/mysql/insert", async (req, reply) => {
        let value;
        if (req.query && req.query.value) {
            value = req.query.value;
        }
        if (typeof value !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param value must be string"));
        }
        fastify.mysql.getConnection((err, connection) => {
            console.log(JSON.stringify(req.query));
            if (err)
                return reply
                    .code(500)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send(err);
            connection.execute(
                `INSERT INTO todos(sortNo, name, date) VALUES (0, '${value}', '${getDateTime()}')`,
                (err, result, fields) => {
                    if (err) {
                        console.log("InsertError", err);
                    }
                    return reply
                        .code(200)
                        .header(
                            "Content-Type",
                            "application/json; charset=utf-8"
                        )
                        .send({ result });
                }
            );
        });
    });

    fastify.get("/api/mysql/query", async (req, reply) => {
        fastify.mysql.getConnection((err, connection) => {
            if (err)
                return reply
                    .code(500)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send(err);
            connection.query("SELECT * FROM todos", (err, result, fields) => {
                if (err) {
                    console.log("QueryError", err);
                }
                return reply
                    .code(200)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send({ result });
            });
        });
    });

    fastify.get("/api/leveldb/set", async (request, reply) => {
        if (!request.query)
            return { error: "401", errorCode: "param key is required" };
        const level = fastify.level.db;
        Object.keys(request.query).forEach((key) => {
            level.put(key, request.query[key]);
        });
        return { error: "", errorCode: 0, result: request.query };
    });

    fastify.get("/api/leveldb/get/:key", async (request, reply) => {
        if (!request.params.key)
            return { error: "401", errorCode: "param key is required" };
        const level = fastify.level.db;
        let val = await level.get(request.params.key);
        return { error: "", errorCode: 0, result: val };
    });

    fastify.get("/api/es/add", async (req, reply) => {
        let title, body;
        if (req.query && req.query.title && req.query.body) {
            title = req.query.title;
            body = req.query.body;
        }
        if (typeof title !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param title must be string"));
        }
        if (typeof body !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param body must be string"));
        }
        let result = await fastify.elastic.index({
            index: "todos", //相当于database
            body: {
                //文档到内容
                title,
                body,
                datetime: Date.now(),
                state: 0,
            },
        });
        return result;
    });

    fastify.get("/api/es/get", async (req, reply) => {
        let key, text;
        if (req.query && req.query.key && req.query.text) {
            key = req.query.key;
            text = req.query.text;
        }
        if (typeof key !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param key must be string"));
        }
        if (typeof text !== "string") {
            return reply
                .code(400)
                .header("Content-Type", "application/json; charset=utf-8")
                .send(new Error("param text must be string"));
        }
        let result = await fastify.elastic.search({
            index: "todos",
            // type: "todos",
            body: {
                query: {
                    match: {
                        [key]: text,
                    },
                },
            },
        });
        return result;
    });
}

module.exports = routes;
