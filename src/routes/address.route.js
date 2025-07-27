import { Router } from "express";
import {
   addAddressValidator,
   deleteAddressValidator,
   setDefaultAddressValidator,
   updateAddressValidator,
} from "../validators/address.validator.js";
import {
   addAddress,
   deleteAddress,
   getUserAddress,
   setDefaultAddress,
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
   .patch(verifyJWT , updateAddressValidator(), validate, updateAddress);
router
   .route("/:addressId")
   .delete(deleteAddressValidator(), validate, deleteAddress);
router
   .route("/default/:addressId")
   .patch(setDefaultAddressValidator(), validate, setDefaultAddress);

export default router;
