<template>
  <div class="search-td">
    <div class="Typeahead">
      <input
        type="text"
        class="request-advance-inputs order-creation-location-inputs"
        placeholder="Enter name or phone number"
        autocomplete="off"
        v-model="query"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="reset"
        @input="update"
        @click="clear"
      />
      <ul v-show="hasItems" :class="[!isActive ? 'inactiveClass' : '']">
        <li
          v-for="(item, $item) in filteredItems(items)"
          :class="activeClass($item)"
          class="search-results-container"
          @mousedown="hit"
          @mousemove="setActive($item)"
          :key="item.index"
        >
        <div>
          <span class="search-result-field">Client Name: {{ item.name }}</span>
          <span class="search-result-field">Client Email: {{ item.email }}</span>
          <span class="search-result-field">Phone Number: {{ item.phone }}</span>
        </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';

export default {
  extends: VueTypeahead,
  props: ['type'],
  data() {
    return {
      limit: 10,
      minChars: 1,
      query: '',
      order: null,
      isActive: true,
    };
  },
  computed: {
    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.replace(/ /g, '');
    },
    solarBase() {
      return process.env.PEER_COP_SEARCH;
    },
    solarToken() {
      return process.env.SOLR_JWT;
    },
    src() {
      return `${this.solarBase}select?q=(phone:*${this.query_string}*+OR+name:*${this.query_string}*+OR+email:*${this.query_string}*)&wt=json&indent=true&row=10&sort=id%20desc&jwt=${this.solarToken}`;
    },
  },
  methods: {
    async onHit(item) {
      this.isActive = false;
      this.query = item.name;
      this.$store.commit('setUserId', item.type === 'peer' ? item.id : null);
      this.$store.commit('setCopId', item.type === 'cop' ? item.id : null);
    },
    prepareResponseData(data) {
      return data.response.docs;
    },
    clear() {
      this.isActive = true;
    },
    filteredItems(items) {
      const activeClients = [];
      items.forEach(row => {
        if (row.freight_status === '2') {
          activeClients.push(row);
        }
      });
      return activeClients;
    },
  },
};
</script>

<style scoped>
.Typeahead {
  position: relative;
}
.fa-times {
  cursor: pointer;
}

i {
  float: right;
  position: relative;
  top: 16px;
  right: 6px;
  opacity: 1;
}
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 90%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
li {
  padding: 6px 13px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #2c3e50;
}
.active {
  background-color: #0097cf;
  color: #fff;
}
.active span {
  color: white;
}
.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}
.inactiveClass {
  display: none;
}
</style>
