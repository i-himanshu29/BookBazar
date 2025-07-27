import { body,param} from "express-validator";

const addAddressValidator = () => {
   return [
      body("fullName").trim().notEmpty().withMessage("Full name is required"),

      body("phone")
         .trim()
         .notEmpty()
         .withMessage("Phone number is required")
         .isMobilePhone("any")
         .withMessage("Invalid phone number"),

      body("street")
         .trim()
         .notEmpty()
         .withMessage("Street address is required"),

      body("city").trim().notEmpty().withMessage("City is required"),

      body("state").trim().notEmpty().withMessage("State is required"),

      body("postalCode")
         .trim()
         .notEmpty()
         .withMessage("Postal code is required")
         .isPostalCode("IN")
         .withMessage("Invalid postal code"),

      body("country").trim().notEmpty().withMessage("Country is required"),

      body("isDefault")
         .optional()
         .isBoolean()
         .withMessage("isDefault must be true or false"),
   ];
};

// const updateAddressValidator = () => {
//    return [
//       body("fullName").optional().isString(),
//       body("phone").optional().isMobilePhone(),
//       body("street").optional().isString(),
//       body("city").optional().isString(),
//       body("state").optional().isString(),
//       body("postalCode").optional().isPostalCode("any"),
//       body("country").optional().isString(),
//       body("isDefault").optional().isBoolean(),
//    ];
// };

export {
   addAddressValidator,
   // updateAddressValidator,
};
