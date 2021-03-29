<template>
  <div class='signup'>
    <h1 class='signup__heading'>Join Umoja Transporters</h1>

    <div class='recepient' v-for='(recepient, i) in recepientData' :key='i'>
      <p class='recepient__title'>{{ recepient.title }}</p>
      <p class='recepient__details'>{{ recepient.value }}</p>
    </div>
    <form class='password'>
      <div class='password__label'>
        <label class='password__labelText'>Password</label>
        <i @mouseover.self='setInfo' class='fas fa-info-circle fa-lg password__labelIcon'></i>
        <span class='information' v-show="info">This is the password we sent to you in the invite email</span>
      </div>
      <div class='password__input' v-if='showPassword'>
        <input class='password__inputBox' type='text' placeholder='Enter Password' />
        <i @click='showPassword = !showPassword' class='fas fa-eye-slash fa-lg password__inputIcon'></i>
      </div>
      <div class='password__input' v-else>
        <input class='password__inputBox' type='password' placeholder='Enter Password' />
        <i @click='showPassword = !showPassword' class='fas fa-eye fa-lg password__inputIcon'></i>
      </div>
      <button class='password__btn'>Sign Up</button>
      <p class='password__login'>Already have an account? <a href='/login'>Login here</a></p>
    </form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      recepientData: [
        {
          title: 'Name',
          value: 'Khamisi Matende',
        },
        {
          title: 'Phone Number',
          value: '0722639059',
        },
        {
          title: 'Email Address',
          value: 'kham@gmail.com',
        },
      ],
      showPassword: false,
      passwordValue: ' ',
      info: false,
    };
  },
  methods: {
    setInfo() {
      this.info = true;
      setTimeout(() => {
        this.info = false;
      }, 3000);
    },
  },
};
</script>
<style scoped>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.signup__heading{
  font-weight: 600;
  font-size: 36px;
  padding: 0px 0px 14px 0px;
}
.recepient{
  margin: 10px 0px;
}
.recepient__title{
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
}
.recepient__details{
  font-weight: 600;
  font-size: 18px;
  color: #303133;
  padding: 4px 0px;
}
.password__label{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px 0px;
}
.password__labelText{
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  padding-right: 20px;
}
.password__labelIcon{
  color: rgba(0, 0, 0, 0.4);
  padding-right:4px;
}
.information{
  position: absolute;
  color: #EA7125;
  margin: 20px 0px 20px 122px;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0px 2px 23px rgba(0, 0, 0, 0.17);
  font-weight: 500;
}
.password__inputBox{
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  margin: 10px 0px;
  border: 1px solid rgba(0, 0, 0, 0.6);
}
.password__inputIcon{
  margin-left: -30px;
  color: #909399;
}
.password__btn{
  background: #EA7125;
  color: #fff;
  padding: 10px 0px;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  margin: 10px 0px;
}
.password__login{
  text-align: center;
  font-size: 16px;
  padding: 10px 0px;

}
.password__login a{
  color: #EA7125;
}
</style>
