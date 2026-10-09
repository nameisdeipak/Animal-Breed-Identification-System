// const validator = require("validator");

// const regisValidator = (data) => {
//   const mandatoryField = ["fullName", "email", "password"];

//   const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));

//   if (!IsAllowed) throw new Error("Some Field is Missing");

//   if (!validator.isEmail(data.email)) throw new Error("Email is not valid");

//   if (!validator.isStrongPassword(data.password))
//     throw new Error("Week Password ");
// };

// const loginValidator = (data) => {
//   const mandatoryField = ["email", "password"];

//   const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
//   if (!IsAllowed) throw new Error("Some Field is Missing");

//   if (!validator.isEmail(data.email)) throw new Error("Email is not valid");
// };

// module.exports = { regisValidator, loginValidator  };



const validator = require("validator");

const regisValidator = (data) => {
  const mandatoryField = [
    "fullName",
    "email",
    "password",
  ];

  const isAllowed = mandatoryField.every((k) =>
    Object.keys(data).includes(k)
  );

  if (!isAllowed) {
    throw new Error("Some fields are missing");
  }

  if (!validator.isEmail(data.email)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(data.password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  })) {
    throw new Error(
      "Password must contain at least 6 characters and 1 number"
    );
  }

  if (
    data.phoneNumber &&
    !validator.isMobilePhone(data.phoneNumber, "any")
  ) {
    throw new Error("Invalid phone number");
  }
};

const loginValidator = (data) => {
  const mandatoryField = [
    "email",
    "password",
  ];

  const isAllowed = mandatoryField.every((k) =>
    Object.keys(data).includes(k)
  );

  if (!isAllowed) {
    throw new Error("Some fields are missing");
  }

  if (!validator.isEmail(data.email)) {
    throw new Error("Email is not valid");
  }
};

module.exports = {
  regisValidator,
  loginValidator,
};