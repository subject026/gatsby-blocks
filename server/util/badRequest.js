module.exports = async req => {
  return {
    statusCode: 400,
    body: {
      errors: ["nothing like that for you here"],
    },
  };
};
