// src/utils/validateBody.js
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: `Validation error: ${error.details[0].message}`,
      });
    }
    next();
  };
};

export default validateBody;
