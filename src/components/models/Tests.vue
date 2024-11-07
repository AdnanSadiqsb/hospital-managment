<template>
  <div>
    <div class="card mb-4">
      <div
        class="card-header p-3"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <h6>Tests</h6>
        <soft-button-vue @click="openCustomModal()"
          ><slot>Add Test</slot></soft-button-vue
        >
      </div>

      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Test Name
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                >
                  Price
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Type
                </th>

                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in testsData" :key="item.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">
                        {{ item?.test_name ? item?.test_name : "" }}
                      </h6>
                      <p class="text-xs text-secondary mb-0">
                        {{ item.email }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.price ? item.price : "" }}
                  </p>
                </td>
                <td class="align-middle text-center text-sm">
                  <soft-badge color="success" variant="gradient" size="sm">{{
                    item.type ? item.type.replace("_", " ") : ""
                  }}</soft-badge>
                </td>
                <td class="align-middle">
                  <a
                    href="javascript:;"
                    @click="openCustomModal(item.id)"
                    class="text-secondary font-weight-bold text-xs"
                    data-toggle="tooltip"
                    data-original-title="Edit user"
                    >Edit</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- add manager modal -->
    <custom-modal ref="customModal" :title="modalTitle">
      <!-- Custom content for the modal -->
      <form id="test-form" @submit.prevent="addUpdateTestHandler">
        <div>
          <label for="inputField">Test name</label>
          <input
            class="inputField"
            type="text"
            placeholder="Test name"
            v-model="testData.test_name"
          />
        </div>
        <div>
          <label for="testType">Type</label>
          <select
            class="form-control"
            required
            id="testType"
            v-model="testData.type"
          >
            <option value="out_source">Out Source</option>
            <option value="in_house">In House</option>
          </select>
        </div>

        <div>
          <label for="inputField">Price</label>
          <input
            class="inputField"
            v-model="testData.price"
            type="text"
            placeholder="Price"
          />
        </div>
      </form>
      <template v-slot:actions>
        <soft-button-vue :loading="loading" form="test-form" type="submit">
          {{ this.testData.id ? "Update Test" : "Add Test" }}
        </soft-button-vue>
      </template>
    </custom-modal>
  </div>
</template>

<script>
// import axios from "axios";
import CustomModal from "@/views/components/CustomModal.vue";
// import SoftAvatar from "@/components/SoftAvatar.vue";
import SoftBadge from "@/components/SoftBadge.vue";
// import img1 from "@/assets/img/team-2.jpg";
import img1 from "@/assets/img/team-1.jpg";
import img2 from "@/assets/img/team-3.jpg";
import img3 from "@/assets/img/team-4.jpg";
import img4 from "@/assets/img/team-3.jpg";
import img5 from "@/assets/img/team-2.jpg";
import img6 from "@/assets/img/team-4.jpg";
import useApi from "../../supportElements/useAPI";
import SoftButtonVue from "../SoftButton.vue";
import { convertToFormData } from "../../supportElements/common";
const api = useApi();
export default {
  name: "authors-table",
  data() {
    return {
      modalTitle: "Doctor Info",
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      inputFieldValue: "",
      loading: false,
      selectedDocId: "",
      testsData: [
        {
          id: 1,
          test_name: "",
          price: 0,
          type: "",
          created_at: "",
        },
      ],
      roles: [
        {
          id: 1,
          name: "Super Admin",
          value: "superAdmin",
        },
        {
          id: 2,
          name: "Doctor",
          value: "doctor",
        },
        {
          id: 3,
          name: "User",
          value: "user",
        },
      ],
      testData: {
        id: 2,
        test_name: "vm",
        price: 500,
        type: "out_source",
        created_at: "2024-11-01T19:20:27.113532Z",
      },
    };
  },
  components: {
    // SoftAvatar,
    SoftBadge,
    CustomModal,
    SoftButtonVue,
  },
  methods: {
    closeUserModalHandler() {
      (this.testData.test_name = ""),
        (this.testData.price = ""),
        (this.testData.created_at = ""),
        (this.testData.type = "");
    },

    openCustomModal(id = "") {
      this.getTestDetailHandler(id);
      this.closeUserModalHandler();
      this.$refs.customModal.openModal();
    },

    saveAndClose() {
      this.$refs.customModal.closeModal();
    },

    handleFileChange(event) {
      this.testData.profile_image = event.target.files[0];
    },

    async getTestDetailHandler(id = "") {
      try {
        const response = await api.get(`/api/tests/${id}/`, {});
        this.testData = response.data;
        console.log("doctors data", this.testData);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async getTestsHandler() {
      try {
        const response = await api.get("/api/tests/", {});
        this.testsData = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async addUpdateTestHandler() {
      try {
        this.loading = true;
        this.testData.role = "doctor";
        // let formData = convertToFormData(this.testData, ["profile_image"]);
        if (this.testData.id) {
          const response = await api.patch(
            `/api/tests/${this.testData.id}/`,
            this.testData
          );
          this.$notify({
            type: "success",
            title: "Test updated",
            text: "Test updated successfully",
          });
        } else {
          const response = await api.post("/api/tests/", this.testData);
          this.$notify({
            type: "success",
            title: "Test Added",
            text: "Test added successfully",
          });
        }
        this.saveAndClose();
        this.getTestsHandler();
        this.loading = false;
        console.log(response);
      } catch (err) {
        this.loading = false;
        console.log(err);
        this.$notify({
          type: "error",
          title: "Something went wrong",
          text: "Enter the information carefully and try again",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getTestsHandler();
  },
  computed: {
    filteredWorkers() {
      return this.testsData.filter((item) => item.role === "worker");
    },
  },
};
</script>
<style scoped>
.action-btn {
  background-color: #82d616;
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
  border: 1px solid #cccccc;
}
.inputField:focus {
  border: 2px solid #82d616; /* Change the border color when in focus */
  outline: none; /* Remove the default focus outline */
  box-shadow: 0 0 5px #82d61670;
}
.inputField:active {
  background-color: #f8f9fa;
}
.dropdownOptions {
  border-radius: 8px;
}
</style>
