const generalFunctions = {
  getTimestamp: () => {
    const D = new Date();
    return `${D.getFullYear()}-${
      D.getMonth() + 1
    }-${D.getDate()} ${D.getHours()}-${D.getMinutes()}-${D.getSeconds()}`;
  },
};

export default generalFunctions;
