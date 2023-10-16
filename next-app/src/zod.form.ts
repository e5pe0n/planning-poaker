import { z } from "zod";

const errorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      switch (issue.type) {
        case "string":
          if (issue.minimum === 1) {
            return {
              message: "Required",
            };
          } else if (issue.exact) {
            return {
              message: `Enter ${issue.minimum} characters`,
            };
          } else {
            return {
              message: `Enter at least ${issue.minimum} characters`,
            };
          }
        case "number":
          if (issue.inclusive) {
            return {
              message: `Enter a number greater than or equal to ${issue.minimum}`,
            };
          } else {
            return {
              message: `Enter a number greater than ${issue.minimum}`,
            };
          }
        case "array":
          if (issue.inclusive) {
            return {
              message: `Add at least ${issue.minimum} items`,
            };
          } else {
            return {
              message: `Add more than ${issue.minimum} items`,
            };
          }
        default:
          return {
            message: "Invalid input",
          };
      }
    case z.ZodIssueCode.too_big:
      switch (issue.type) {
        case "string":
          if (issue.exact) {
            return {
              message: `Enter ${issue.maximum} characters`,
            };
          } else {
            return {
              message: `Enter at most ${issue.maximum} characters`,
            };
          }
        case "number":
          if (issue.inclusive) {
            return {
              message: `Enter a number less than or equal to ${issue.maximum}`,
            };
          } else {
            return {
              message: `Enter a number less than ${issue.maximum}`,
            };
          }
        default:
          return {
            message: "Invalid input",
          };
      }
    case z.ZodIssueCode.invalid_string:
      switch (issue.validation) {
        case "email":
          return {
            message: "Enter valid email address",
          };
        default:
          return {
            message: "Invalid input",
          };
      }
    case z.ZodIssueCode.invalid_type:
      switch (issue.received) {
        case "undefined":
          return {
            message: "Required",
          };
        default:
          switch (issue.expected) {
            case "integer":
              return {
                message: "Enter an integer",
              };
            default:
              return {
                message: "Invalid input",
              };
          }
      }
    default:
      return {
        message: "Invalid input",
      };
  }
};

z.setErrorMap(errorMap);

export { z as zf };
