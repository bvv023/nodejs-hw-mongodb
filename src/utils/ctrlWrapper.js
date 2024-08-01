// src/utils/ctrlWrapper.js
const ctrlWrapper = (ctrl) => {
  return (req, res, next) => {
    ctrl(req, res, next).catch(next);
  };
};

export default ctrlWrapper;
