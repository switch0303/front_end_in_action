const express = require("express");
const router = express.Router();
const path = require("path");
const webpack = require("webpack");
const config = require("../webpack/webpack.config");

router.get("/", function (req, res, next) {
    webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }
        } else {
            console.log("done");
            res.sendFile(path.resolve(__dirname, "../public/build/index.html"));
        }
    });
});

module.exports = router;
