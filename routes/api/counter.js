const express = require("express");
const router = express.Router();
const passport = require("passport");

const Counter = require("../../models/Counter");

router.get(
    "/userid",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Counter.findOne({}).then(counter => res.json(counter));
    }
);

router.post(
    '/createid',
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const COUNTER = await new Counter({
            idType: req.params.idType,
            seq: req.params.seq
        });
        COUNTER.save().then(counter => {res.json(counter)});
    }
    
)

module.exports = router;