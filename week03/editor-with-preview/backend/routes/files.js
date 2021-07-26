const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/src", function (req, res, next) {
    fs.readdir(path.resolve(__dirname, "../public/src"), (err, data) => {
        console.log(data);
        res.json(data);
    });
});

router.put("/save", function (req, res, next) {
    const { path: filePath, value } = req.body;
    const realPath = path.resolve(__dirname, "../public", filePath);
    if (path && fs.existsSync(realPath)) {
        fs.writeFile(realPath, value, (err, data) => {
            if (!err) {
                console.log("success");
                res.json({
                    success: true,
                });
            }
        });
    }
});

module.exports = router;
