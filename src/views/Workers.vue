<template>
  <div>
    <DayTokens></DayTokens>
  </div>
</template>
<script>
import useApi from "../supportElements/useAPI";
import DayTokens from "../components/models/DayTokens.vue";
const api = useApi();
export default {
  name: "authors-table",
  data() {
    return {
    };
  },
  components: {
    DayTokens,
  },
  methods: {},
};
</script>
<style scoped>
.action-btn {
  background-color: #82D616;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.inputField {
  width: 100%;
  padding: 4px 14px;
  border-radius: 8px;
  border: 1px solid #CCCCCC;
}
.inputField:focus {
  border: 2px solid #82D616; /* Change the border color when in focus */
  outline: none; /* Remove the default focus outline */
  box-shadow: 0 0 5px #82d61670;
}
.inputField:active {
  background-color: #F8F9FA;
}
.dropdownOptions {
  border-radius: 8px;
}
</style>