const useIsLoggedIn = () => {
  const checkCookie = localStorage.getItem("authToken");
  const user = { loggedIn: checkCookie ? true : false };
  return user.loggedIn;
};

export default useIsLoggedIn;
