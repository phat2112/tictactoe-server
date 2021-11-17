const detectSameDestination = (location, pointCompare, arrayMeasured) => {
  let result = [];
  result = arrayMeasured.filter((item) => {
    if (
      typeof item[pointCompare] === "number" &&
      typeof location[pointCompare] === "number"
    ) {
      return item[pointCompare] === location[pointCompare];
    }
  });
  if (result.length === 2) {
    arrayMeasured.push(location);
    return true;
  }

  if (pointCompare >= 2) {
    arrayMeasured.push(location);
    return false;
  }

  return detectSameDestination(location, pointCompare + 1, arrayMeasured);
};

const detectUserWin = (location, array) => {
  const newArray = [...array, location];
  const result1 = newArray.filter((item) => item[0] === item[1]);
  const result2 = newArray.filter((item) => item[0] + item[1] === 2);

  if (result1.length === 3 || result2.length === 3) return true;
  else {
    return detectSameDestination(location, 0, array);
  }
};

module.exports = { detectUserWin };
