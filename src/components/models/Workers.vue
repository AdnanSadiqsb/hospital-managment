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
        <h6>Doctors</h6>
        <soft-button-vue @click="openCustomModal()"
          ><slot>Add Doctor</slot></soft-button-vue
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
                  Doc Name
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                >
                  Specialization
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Room No
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Fee
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Lab share
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  OPD share
                </th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in managersData" :key="item.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <!-- <div>
                      <soft-avatar
                        :img="item.avatar ? item.avatar : img2"
                        size="sm"
                        border-radius="lg"
                        class="me-3"
                        alt="user1"
                      />
                    </div> -->
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">
                        {{ item?.first_name ? item?.first_name : "" }}
                        {{ item.last_name ? item.last_name : "" }}
                      </h6>
                      <p class="text-xs text-secondary mb-0">
                        {{ item.email }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.specialization }}
                  </p>
                  <p class="text-xs text-secondary mb-0">Specialization</p>
                </td>
                <td class="align-middle text-center text-sm">
                  <soft-badge color="success" variant="gradient" size="sm">{{
                    item.room_no ? item.room_no : ""
                  }}</soft-badge>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{
                    item.consultation_fee ? item.consultation_fee : ""
                  }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{
                    item.lab_share ? item.lab_share : ""
                  }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{
                    item.opd_share ? item.opd_share : ""
                  }}</span>
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
      <form id="worker-form" @submit.prevent="addDoctorManger">
        <div class="d-flex gap-3">
          <div>
            <label for="inputField">First name</label>
            <input
              class="inputField"
              type="text"
              placeholder="First name"
              v-model="doctorDetails.first_name"
            />
          </div>
          <div>
            <label for="inputField">Last name</label>
            <input
              class="inputField"
              type="text"
              placeholder="Last name"
              v-model="doctorDetails.last_name"
            />
          </div>
        </div>
        <!-- <div>
          <label for="inputField">Image</label>
          <input
            class="inputField"
            type="file"
            placeholder="Start date"
            @change="handleFileChange"
            size="md"
          />
        </div> -->
        <div>
          <label for="inputField">Email</label>
          <input
            class="inputField"
            v-model="doctorDetails.email"
            type="email"
            placeholder="Email"
          />
        </div>
        <div>
          <label for="inputField">Phone</label>
          <input
            class="inputField"
            type="text"
            placeholder="Password"
            v-model="doctorDetails.password"
          />
        </div>
        <div>
          <label for="inputField">Specialization</label>
          <input
            class="inputField"
            v-model="doctorDetails.specialization"
            type="text"
            placeholder="specialization"
          />
        </div>
        <div class="d-flex gap-3">
          <div>
            <label for="inputField">Room no</label>
            <input
              class="inputField"
              v-model="doctorDetails.room_no"
              type="text"
              placeholder="Room no"
            />
          </div>
          <div>
            <label for="inputField">Consultation fee</label>
            <input
              class="inputField"
              v-model="doctorDetails.consultation_fee"
              type="text"
              placeholder="Consultation fee"
            />
          </div>
        </div>

        <div class="d-flex gap-3">
          <div>
            <label for="inputField">Lab share</label>
            <input
              class="inputField"
              v-model="doctorDetails.lab_share"
              type="text"
              placeholder="Lab share"
            />
          </div>

          <div>
            <label for="inputField">OPD share</label>
            <input
              class="inputField"
              v-model="doctorDetails.opd_share"
              type="text"
              placeholder="OPD share"
            />
          </div>
        </div>
        <!-- <div>
          <label for="inputField">Role</label>
          <select class="inputField" v-model="doctorDetails.role">
            <option value="" selected>Select Role</option>
            <option
              class="dropdownOptions"
              v-for="role in roles"
              :key="role.id"
              :value="role.value"
            >
              {{ role.name }}
            </option>
          </select>
        </div> -->
      </form>
      <template v-slot:actions>
        <soft-button-vue :loading="loading" form="worker-form" type="submit">
          {{ this.doctorDetails.id ? "Update Doctor" : "Add Doctor" }}
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
      managersData: [
        {
          id: 2,
          first_name: "mohsin",
          last_name: "mumtaz",
          profile_image: null,
          specialization: "surgone",
          room_no: "1",
          consultation_fee: 1000.0,
          lab_share: 20.0,
          opd_share: 30.0,
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
      doctorDetails: {
        email: "",
        profile_image: "",
        first_name: "",
        last_name: "",
        phoneNo: "",
        role: "",
        specialization: "",
        room_no: "",
        consultation_fee: 0,
        lab_share: 0,
        opd_share: 0,
        user: 0,
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
      (this.doctorDetails.username = ""),
        (this.doctorDetails.email = ""),
        (this.doctorDetails.password = ""),
        (this.doctorDetails.status = ""),
        (this.doctorDetails.role = "");
    },

    openCustomModal(id = "") {
      this.getDoctorDetailHandler(id);
      this.closeUserModalHandler();
      this.$refs.customModal.openModal();
    },

    saveAndClose() {
      this.$refs.customModal.closeModal();
    },

    handleFileChange(event) {
      this.doctorDetails.profile_image = event.target.files[0];
    },

    async getDoctorDetailHandler(id = "") {
      try {
        const response = await api.get(`/api/doctors/${id}/`, {});
        this.doctorDetails = response.data;
        console.log("doctors data", this.doctorDetails);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async getDoctorsHandler() {
      try {
        const response = await api.get("/api/doctors/", {});
        this.managersData = response.data;
        console.log("doctors data", this.managersData);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async addDoctorManger() {
      try {
        this.loading = true;
        this.doctorDetails.role = "doctor";
        let formData = convertToFormData(this.doctorDetails, ["profile_image"]);
        if (this.doctorDetails.id) {
          const response = await api.patch(
            `/api/doctors/${this.doctorDetails.id}/`,
            formData
          );
          this.$notify({
            type: "success",
            title: "Doctor updated",
            text: "Doctor updated successfully",
          });
        } else {
          const response = await api.post("/api/doctors/", formData);
          this.$notify({
            type: "success",
            title: "Doctor Added",
            text: "Doctor added successfully",
          });
        }
        this.saveAndClose();
        this.getDoctorsHandler();
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
    this.getDoctorsHandler();
  },
  computed: {
    filteredWorkers() {
      return this.managersData.filter((item) => item.role === "worker");
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
