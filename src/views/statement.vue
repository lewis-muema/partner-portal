
      }
    },
  },
};
</script>

<style>
@import '../assets/css/style.css';
</style>

        <div class="statement__row statement__add-bank-tab">
          <p class="small-margin statement__error-box-header color-white">{{ withdrawHead }}</p>
          <p class="small-margin color-white">{{ withdrawError }}</p>
          <router-link to="/banks" v-if="addAccountStatus">
            <p class="small-margin statement__bg-orange">+ Add a bank account</p>
          </router-link>
      }
    },
  },
};
</script>

<style>
@import '../assets/css/style.css';
</style>
