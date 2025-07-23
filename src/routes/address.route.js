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

const router = Router();

router.route("/").post(addAddressValidator(), validate, addAddress);
router.route("/").get(getUserAddress);
router
   .route("/:addressId")
   .patch(updateAddressValidator(), validate, updateAddress);
router
   .route("/:addressId")
   .delete(deleteAddressValidator(), validate, deleteAddress);
router
   .route("/default/:addressId")
   .patch(setDefaultAddressValidator(), validate, setDefaultAddress);

export default router;
