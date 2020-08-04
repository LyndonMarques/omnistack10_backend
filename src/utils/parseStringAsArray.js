module.exports = function parsStringAsArray(arrayAsString) {
  return arrayAsString.split(",").map((tech) => tech.trim());
};
