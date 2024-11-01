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
    <h6>Patients</h6>
    <div class="d-flex">
       <div class="px-4">
        <input 
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Search patient... "
        />
       </div>
      <soft-button-vue @click="openCustomModal" color="info" class="text-nowrap">
      <slot>
        <i class="fas fa-plus"></i>
        Add Patient
      </slot>
    </soft-button-vue>
    </div>
  
  </div>

  <div class="card-body px-0 pt-0 pb-2">
    <!-- Search bar -->
    
    <div class="table-responsive p-0">
      <table class="table align-items-center mb-0">
        <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Full Name</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">MR No.</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Age</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">DOB</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Gender</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Address</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Phone No.</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">ID Card No.</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Blood Group</th>
            <th class="text-secondary opacity-7"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredPatients.length === 0">
            <td colspan="10" class="text-center text-secondary font-weight-bold">
              No patients found.
            </td>
          </tr>
          <tr v-for="item in filteredPatients" :key="item.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">{{ item?.first_name }} {{ item?.last_name }}</h6>
                </div>
              </div>
            </td>
            <td><p class="text-xs font-weight-bold mb-0">{{ item?.mr_no || 'N/A' }}</p></td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.age || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.date_of_birth || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.gender || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.address || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.phone_no || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.id_card_no || 'N/A' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ item?.blood_group || 'N/A' }}</span>
            </td>
            <td class="align-middle">
              <soft-button-vue size="sm" @click="openEditWorkerModal(item)">Edit</soft-button-vue>
              <soft-button-vue size="sm" class="ml-3" @click="confirmDelete(item.id)" color="danger">Delete</soft-button-vue>
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
      <form id="worker-form" @submit.prevent="addNewPatient" class="container">
    <div class="row">
      <div class="col-md-6">
        <label for="firstName">First Name</label>
        <input
          class="form-control"
          type="text"
          required
          id="firstName"
          placeholder="First name"
          v-model="userData.first_name"
        />
      </div>

      <div class="col-md-6">
        <label for="lastName">Last Name</label>
        <input
          class="form-control"
          type="text"
          id="lastName"
          placeholder="Last name"
          v-model="userData.last_name"
        />
      </div>

      <!-- <div class="col-md-6">
        <label for="mrNo">MR No.</label>
        <input
          class="form-control"
          type="text"
          id="mrNo"
          placeholder="MR No."
          v-model="userData.mr_no"
        />
      </div> -->

      <div class="col-md-6">
        <label for="age">Age</label>
        <input
          class="form-control"
          type="number"
          id="age"
          placeholder="Age"
          v-model="userData.age"
        />
      </div>

      <div class="col-md-6">
        <label for="dob">Date of Birth</label>
        <input
          class="form-control"
          type="date"
          id="dob"
          v-model="userData.date_of_birth"
        />
      </div>

      <div class="col-md-6">
        <label for="gender">Gender</label>
        <select class="form-control" required id="gender" v-model="userData.gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="col-md-6">
        <label for="address">Address</label>
        <input
          class="form-control"
          type="text"
          id="address"
          placeholder="Address"
          v-model="userData.address"
        />
      </div>

      <div class="col-md-6">
        <label for="phoneNo">Phone No.</label>
        <input
          class="form-control"
          type="tel"
          id="phoneNo"
          placeholder="Phone No."
          v-model="userData.phone_no"
        />
      </div>

      <div class="col-md-6">
        <label for="idCardNo">ID Card No.</label>
        <input
          class="form-control"
          type="text"
          maxlength="13"
          id="idCardNo"
          placeholder="ID Card No."
          v-model="userData.id_card_no"
        />
      </div>

      <div class="col-md-6">
        <label for="bloodGroup">Blood Group</label>
        <input
          class="form-control"
          type="text"
          id="bloodGroup"
          placeholder="Blood Group"
        
          v-model="userData.blood_group"
        />
      </div>

     
    </div>
  </form>
      <template v-slot:actions>
        <soft-button-vue :loading="loading" form="worker-form" type="submit">
          Add Patient
        </soft-button-vue>
      </template>
    </custom-modal>

     <!-- Delete Confirmation Modal -->
     <custom-modal ref="deleteModal" title="Confirm Deletion">
      <p>Are you sure you want to delete this Patient?</p>
      <template v-slot:actions>
        <soft-button-vue @click="deletePatient" :loading="loading" type="button">Delete</soft-button-vue>
        <soft-button-vue @click="closeDeleteModal" type="button">Cancel</soft-button-vue>
      </template>
    </custom-modal>
  </div>
</template>

<script>
// import axios from "axios";
import CustomModal from "@/views/components/CustomModal.vue";
// import SoftAvatar from "@/components/SoftAvatar.vue";
// import SoftBadge from "@/components/SoftBadge.vue";
// import img1 from "@/assets/img/team-2.jpg";
import img1 from "@/assets/img/team-1.jpg";
import img2 from "@/assets/img/team-3.jpg";
import img3 from "@/assets/img/team-4.jpg";
import img4 from "@/assets/img/team-3.jpg";
import img5 from "@/assets/img/team-2.jpg";
import img6 from "@/assets/img/team-4.jpg";
import useApi from "../../supportElements/useAPI";
import SoftButtonVue from "../SoftButton.vue";
import { convertTouserData } from "../../supportElements/common";
const api = useApi();
export default {
  name: "authors-table",
  data() {
    return {
      modalTitle: "Add New Patient",
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      inputFieldValue: "",
      loading: false,
      searchQuery: '',
      patientData: [],
      userData: {
        first_name: "",
        last_name: "",
        mr_no: "",
        age: null,
        date_of_birth: "",
        gender: "male",
        address: "",
        phone_no: "",
        id_card_no: "",
        blood_group: "",
      },
    };
  },
  components: {
    // SoftAvatar,
    // SoftBadge,
    CustomModal,
    SoftButtonVue,
  },
  methods: {
    closeUserModalHandler() {
      this.resetForm();
      this.isEditMode = false;
      this.modalTitle = "Add New Worker";
    },
    resetForm() {
      this.userData = {
        first_name: "",
        last_name: "",
        mr_no: "",
        age: null,
        date_of_birth: "",
        gender: "male",
        address: "",
        phone_no: "",
        id_card_no: "",
        blood_group: "",
      };
      this.selectedPatientId = null;
    },

    openCustomModal() {
      this.resetForm();
      this.isEditMode = false;
      this.modalTitle = "Add New Worker";
      this.$refs.customModal.openModal();
    },
    saveAndClose() {
      this.$refs.customModal.closeModal();
    },

    handleFileChange(event) {
      this.userData.avatar = event.target.files[0];
    },

    openEditWorkerModal(worker) {
      this.userData = { ...worker };
      this.isEditMode = true;
      this.modalTitle = "Edit Patient";
      this.selectedPatientId = worker.id;
      this.$refs.customModal.openModal();
    },
    async getAllPatient() {
      try {
        const response = await api.get("/api/patients/", {});
        this.patientData = response.data;
        console.log("data", this.patientData);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async addNewPatient() {
      try {
        this.loading = true;
        delete  this.userData.mr_no
        const response = await api.post("/api/patients/", this.userData);
        this.$notify({
          type: "success",
          title: "Patient Added",
          text: "Patient added successfuly",
        });
        this.saveAndClose();
        this.getAllPatient();
        this.loading = false;
        console.log(response);
      } catch (err) {
        this.loading = false;
        console.log(err);
        this.$notify({
          type: "error",
          title: "Something went wrong",
          text: "Enter the information carefuly and try again",
        });
      } finally {
        this.loading = false;
      }
    },

    confirmDelete(workerId) {
      this.selectedPatientId = workerId;
      this.$refs.deleteModal.openModal();
    },
    async deletePatient() {
      this.loading = true;
      try {
        const response = await api.delete(`/api/patients/${this.selectedPatientId}/`);
        console.log(response)
        this.getAllPatient();
        this.$refs.deleteModal.closeModal();
        this.$notify({ type: "success", title: "Patient Deleted" });
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    closeDeleteModal() {
      this.$refs.deleteModal.closeModal();
    },
  
  },
  mounted() {
    this.getAllPatient();
  },
  computed: {
    filteredPatients() {
      return this.patientData.filter((item) => {
        const fullName = `${item?.first_name || ''} ${item?.last_name || ''}`.toLowerCase();
        return fullName.includes(this.searchQuery.toLowerCase());
      });
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
