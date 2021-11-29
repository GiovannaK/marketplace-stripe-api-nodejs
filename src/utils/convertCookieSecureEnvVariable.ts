export const convertCookieSecureEnvVariable = () => {
  if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'true') {
    return true;
  }
  if (process.env.COOKIE_SECURE.toLocaleLowerCase() == 'false') {
    return false;
  }
};
