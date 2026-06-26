let mongoEnabled = false;

const setMongoEnabled = (value) => {
  mongoEnabled = value;
};

const isMongoEnabled = () => mongoEnabled;

module.exports = {
  setMongoEnabled,
  isMongoEnabled,
};
