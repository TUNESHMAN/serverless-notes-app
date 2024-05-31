const getUsername = (headers) => {
  return headers.app_user_name;
};

const getUserId = (headers) => {
  return headers.app_user_id;
};

const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
  };
};

module.exports = { getResponseHeaders, getUserId, getUsername };
