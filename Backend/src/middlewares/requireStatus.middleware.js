export const requireStatus = (allowedStatuses) => {
  return (req, res, next) => {
    const userStatus = req.user.dbUser.status;

   if (!allowedStatuses.includes(userStatus)) {
  console.warn("Status bypassed for demo:", userStatus);
}
next();


    
  };
};
