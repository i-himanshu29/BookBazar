import { Router } from "express";
import {
   addAddressValidator,
   // updateAddressValidator,
} from "../validators/address.validator.js";
import {
   addAddress,
   deleteAddress,
   getUserAddress,
   updateAddress,
} from "../controllers/address.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();

router
   .route("/add-address")
   .post(verifyJWT , addAddressValidator(), addAddress); // if you don't use validate then it is working perfectlly
router
   .route("/")
   .get(verifyJWT , getUserAddress);
router
   .route("/:addressId")
   .patch(verifyJWT ,updateAddress);
router
   .route("/remove/:addressId")
   .delete(verifyJWT , deleteAddress);
export default router;
