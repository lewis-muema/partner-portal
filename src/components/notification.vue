<template>
  <div :class="`notification-popup pop-up-${type} ${notificationName}`">
    <div class="icon-container" v-if="type === 'sending'">
      <div class="loading-icon"></div>
    </div>
    <p class="color-white no-margin">{{ notificationMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [
        {
          notificationType: 'failed',
          icon: '',
          notificationId: 0,
        },
        {
          notificationType: 'success',
          icon: '',
          notificationId: 1,
        },
        {
          notificationType: 'sending',
          icon: '',
          notificationId: 2,
        },
      ],
      status: ['message-box', 'message-box-up', 'message-box-down', 'both'],
      notificationMessage: '',
      type: '',
      notificationName: 'message-box',
      timer: '',
    };
  },
  mounted() {
    this.rootListener();
  },
  methods: {
    rootListener() {
      this.$root.$on('Notification', (arg1, arg2, arg3) => {
        this.fetchNotificationType(arg1, this.validate(arg2) ? arg2 : '');
        this.notificationMessage = this.validate(arg3) ? arg3 : '';
      });
    },
    validate(arg) {
      if (arg !== undefined) {
        return true;
      }
      return false;
    },
    fetchNotificationType(arg1, arg2) {
      this.animatePopUp(arg1);
      this.notifications.forEach((row, i) => {
        if (row.notificationId === arg2) {
          this.type = row.notificationType;
        }
      });
    },
    animatePopUp(arg1) {
      if (arg1 === 3) {
        this.notificationName = this.status[1];
        setTimeout(() => {
          this.notificationName = this.status[2];
        }, 2000);
      } else {
        this.notificationName = this.status[arg1];
      }
    },
  },
};
</script>

<style></style>
