/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservation_Id/status")
    .put(controller.update);

router.route("/:reservation_Id")
    .get(controller.read)
    .put(controller.edit);

router.route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;
