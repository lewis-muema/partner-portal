const userPermissionMixin = {

  methods: {
    checkUserPermission(userPermission) {
      let resp = false;
      if (localStorage.sessionData) {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;

      if (sessionInfo.role === 2) {
        resp = true;
      } else {
        if (Object.prototype.hasOwnProperty.call(sessionInfo, 'permissions') && Object.prototype.hasOwnProperty.call(sessionInfo.permissions, 'userPermission')) {
        resp = sessionInfo.permissions.userPermission;
        } else {
          resp = false;
        }
       }
      }
      return resp;
    },
  },
};

export default userPermissionMixin;
