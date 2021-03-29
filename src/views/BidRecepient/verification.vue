<template>
  <div class='verification'>
    <div class='verification__backIcon'>
      <a href="/recepient/signup"><i class='far fa-arrow-alt-circle-left fa-4x light'></i> </a>
    </div>
    <div class='verificationContent'>
      <h1 class='verificationContent__heading'>{{ $t('signup.verification') }}</h1>
      <p class='verificationContent__description'>{{ $t('signup.for_security') }}{{ PhoneNumber }}</p>
      <form class='verificationForm'>
        <label class='verificationForm__label'>{{ $t('signup.enter_verification_code') }}</label>
        <input class='verificationForm__input' type='text' :placeholder="$t('signup.enter_code')" />
        <button class='verificationForm__btn'>{{ $t('signup.verify_code') }}</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.verification__backIcon {
  position: relative;
  bottom: 80px;
  cursor: pointer;
}
a{
  color: rgba(0, 0, 0, 0.8);
}
.verificationContent__heading {
  font-weight: 600;
  font-size: 40px;
  letter-spacing: 0.25px;
}
.verificationContent__description {
  font-size: 18px;
  line-height: 23px;
  color: rgba(0, 0, 0, 0.6);
  padding: 20px 0px;
}
.verificationForm {
  width: 100%;
}
.verificationForm__label {
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
}
.verificationForm__input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  margin: 6px 0px 8px 0px;
  border: 1px solid rgba(0, 0, 0, 0.6);
}
.verificationForm__btn {
  background: #ea7125;
  color: #fff;
  padding: 14px 0px;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  margin: 26px 0px 10px 0px;
}
</style>
