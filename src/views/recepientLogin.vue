<template>
  <div class='recepientLogin'>
    <div class='recepientLogin_image'>
      <img src='https://images.sendyit.com/partner_portal/images/owners_banner.svg' alt='' />
    </div>
    <div class='recepient_loginDetails'>
      <h1 class='loginDetails_heading'>Join Umoja Transporters</h1>
      <div class='recpientDetails' v-for='(recepient, i) in recepientData' :key='i'>
        <p class='recepientLogin_subheadings'>{{ recepient.title }}</p>
        <p class='recepientLogin_content'>{{ recepient.value }}</p>
        <p></p>
      </div>
      <form class='recepient_form'>
        <div class='recepient_password'>
          <span class='recepientLogin_subheadings password'> Password</span>
          <i class='fas fa-info-circle fa-lg icon'></i>
        </div>
        <div class='password_input'>
          <input v-if='showPassword' class='recepient_form__input' type='text' placeholder='Enter Password' />
          <input v-else class='recepient_form__input' type='password' placeholder='Enter Password' />
          <div @click='showPassword = !showPassword'>
            <i v-if='showPassword' class='fas fa-eye password_icon fa-lg icon'></i>
            <i v-else class='fas fa-eye-slash password_icon fa-lg icon'></i>
          </div>
        </div>
        <button class='recepient_form__button'>Sign Up</button>
        <p class='recepient_form__link'>Already have an account? <a href='#'>Login here</a></p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
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
      passwordValue: '',
    };
  },
};
</script>
<style scoped>
.recepientLogin {
  padding: 60px 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap-reverse;
}
.recpientDetails {
  padding-bottom: 10px;
}
.recepient_loginDetails {
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-items: center;
}
.loginDetails_heading {
  font-weight: 600;
  font-size: 30px;
  padding-bottom: 20px;
}
.recepientLogin_image {
  width: 40%;
  margin: 0 auto;
}
.recepientLogin_subheadings {
  color: rgba(0, 0, 0, 0.6);
  font-size: 18px;
}
.recepientLogin_content {
  font-size: 16px;
  font-weight: 600;
  color: rgba(48, 49, 51, 1);
}
.recepient_form__input {
  width: 100%;
  margin: 10px 0px;
  padding: 10px 10px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}
.recepient_form__input::placeholder {
  font-weight: 400;
  letter-spacing: 0.4px;
}
.recepient_form__button {
  border-radius: 5px;
  padding: 12px 0px;
  border: none;
  background: rgba(234, 113, 37, 1);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}
.recepient_form__button:hover {
  background: rgba(173, 99, 1, 0.8);
  transition: ease-in-out 2s;
}

.recepient_form__link {
  text-align: center;
  font-size: 16px;
  padding: 10px 0px;
}
.recepient_form__link a {
  color: rgba(234, 113, 37, 1);
}
.password {
  padding: 0px 10px 0px 0px;
}
.icon {
  color: rgba(0, 0, 0, 0.3);
  font-size: 20px;
}
.password_input {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.password_icon {
  margin: -34px;
}
@media only screen and (max-width: 1040px) {
  .recepientLogin_image {
    display: none;
  }
}
@media only screen and (max-width: 700px) {
  .recepientLogin {
    width: 80%;
    margin: auto;
  }
  .recepient_loginDetails {
    width: 100%;
  }
}
</style>
