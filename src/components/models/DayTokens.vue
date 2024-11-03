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
        <h2>OPD</h2>
        <div class="">
          <input
            type="date"
            class="inputField"
            v-model="selectedDate"
            @change="getOPDS"
          />
        </div>
      </div>
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                #
              </th>
              <th
                v-for="doctor in doctors"
                :key="doctor.id"
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                {{ doctor.first_name }} {{ doctor.last_name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rowNumber in 100" :key="rowNumber">
              <td>
                <p class="text-lg text-secondary mb-0 ml-3">{{ rowNumber }}</p>
              </td>
              <td v-for="doctor in doctors" :key="doctor.id">
                <div
                  v-if="getPatientByDoctorAndRow(doctor.id, rowNumber)"
                  @click="
                    openCustomModal(
                      doctor.id,
                      rowNumber,
                      doctor.consultation_fee
                    )
                  "
                  class="cu-data-box"
                >
                  <p class="text-lg mb-0 pt-2 font-weight-bold">
                    {{
                      getPatientByDoctorAndRow(doctor.id, rowNumber).patient
                        .first_name
                    }}
                    {{
                      getPatientByDoctorAndRow(doctor.id, rowNumber).patient
                        .last_name
                    }}
                  </p>
                </div>
                <div v-else>
                  <div
                    @click="
                      openCustomModal(
                        doctor.id,
                        rowNumber,
                        doctor.consultation_fee
                      )
                    "
                    class="cu-empty-box"
                  >
                    <p class="text-lg mb-0 pt-2 font-weight-bold">N/A</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- add manager modal -->
    <custom-modal ref="customModal" :title="modalTitle">
      <!-- Custom content for the modal -->
      <form id="worker-form" @submit.prevent="addDayToken">
        <div
          class="row d-flex justify-center"
          style="align-items: last baseline"
        >
          <div class="col-md-6">
            <label for="inputField">Select Patient</label>
            <div class="dropdown-container">
              <div class="dropdown-header" @click="toggleDropdown">
                {{ selectedPatient ? selectedPatientName : "Select Patient" }}
              </div>
              <!-- v-if="isDropdownOpen" -->
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <input
                  type="text"
                  class="search-input"
                  v-model="searchQuery"
                  placeholder="Search patient..."
                  @click.stop
                />
                <ul class="dropdown-options">
                  <li
                    v-for="patient in filteredPatients"
                    :key="patient.id"
                    @click="selectPatient(patient)"
                    class="dropdown-option"
                  >
                    {{ patient.first_name }}
                    {{ patient.last_name ? patient.last_name : "" }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <soft-button-vue
              size="small"
              :loading="loading"
              @click="openPatientModal"
            >
              Add Patient
            </soft-button-vue>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="inputField">Fees</label>
            <input
              class="inputField"
              readonly
              v-model="userData.fee"
              type="number"
              placeholder="Fee"
            />
          </div>
          <div class="col-md-6">
            <label for="inputField">Discount</label>
            <input
              class="inputField"
              v-model="userData.diccount"
              type="number"
              placeholder="Discount"
            />
          </div>
        </div>
      </form>
      <template v-slot:actions>
        <soft-button-vue :loading="loading" form="worker-form" type="submit">
          Add OPD
        </soft-button-vue>
      </template>
    </custom-modal>
    <custom-modal ref="patientModal" :title="modalTitle">
      <!-- Custom content for the modal -->
      <form id="patient-form" @submit.prevent="addNewPatient" class="container">
        <div class="row">
          <div class="col-md-6">
            <label for="firstName">First Name</label>
            <input
              class="form-control"
              type="text"
              required
              id="firstName"
              placeholder="First name"
              v-model="patientData.first_name"
            />
          </div>

          <div class="col-md-6">
            <label for="lastName">Last Name</label>
            <input
              class="form-control"
              type="text"
              id="lastName"
              placeholder="Last name"
              v-model="patientData.last_name"
            />
          </div>

          <div class="col-md-6">
            <label for="age">Age</label>
            <input
              class="form-control"
              type="number"
              id="age"
              placeholder="Age"
              v-model="patientData.age"
            />
          </div>

          <div class="col-md-6">
            <label for="dob">Date of Birth</label>
            <input
              class="form-control"
              type="date"
              id="dob"
              v-model="patientData.date_of_birth"
            />
          </div>

          <div class="col-md-6">
            <label for="gender">Gender</label>
            <select
              class="form-control"
              required
              id="gender"
              v-model="patientData.gender"
            >
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
              v-model="patientData.address"
            />
          </div>

          <div class="col-md-6">
            <label for="phoneNo">Phone No.</label>
            <input
              class="form-control"
              type="tel"
              id="phoneNo"
              placeholder="Phone No."
              v-model="patientData.phone_no"
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
              v-model="patientData.id_card_no"
            />
          </div>

          <div class="col-md-6">
            <label for="bloodGroup">Blood Group</label>
            <input
              class="form-control"
              type="text"
              id="bloodGroup"
              placeholder="Blood Group"
              v-model="patientData.blood_group"
            />
          </div>
        </div>
      </form>
      <template v-slot:actions>
        <soft-button-vue :loading="loading" form="patient-form" type="submit">
          Add Patient
        </soft-button-vue>
      </template>
    </custom-modal>
  </div>
</template>
<script>
// import axios from "axios";
import CustomModal from "@/views/components/CustomModal.vue";
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
      doctors: [
        {
          id: 2,
          email: "talha1@gmail.com",
          first_name: "mohsin",
          last_name: "mumtaz",
          profile_image: null,
          role: "doctor",
          phoneNo: null,
          specialization: "surgone",
          room_no: "1",
          consultation_fee: 1000,
          lab_share: 20,
          opd_share: 30,
          user: 3,
        },
        {
          id: 3,
          email: "talha12@gmail.com",
          first_name: "aslam",
          last_name: "iqbal",
          profile_image: null,
          role: "doctor",
          phoneNo: null,
          specialization: "surgone",
          room_no: "2",
          consultation_fee: 1200,
          lab_share: 20,
          opd_share: 30,
          user: 4,
        },
      ],
      opds: [
        {
          id: 3,
          patient: {
            id: 3,
            first_name: "arslan",
            last_name: "rao",
            mr_no: "mc-2411001",
            age: 27,
            date_of_birth: "1998-01-20",
            gender: "male",
            address: null,
            phone_no: null,
            id_card_no: null,
            blood_group: null,
          },
          doctor_id: 2,
          number: 5,
          consultation_date: "2024-11-01",
          diccount: null,
          diccount_by: null,
          created_at: "2024-11-01T17:30:27.402771Z",
          doctor: 2,
        },
        {
          id: 2,
          patient: {
            id: 2,
            first_name: "adnan",
            last_name: "sadiq",
            mr_no: "mc-2411001",
            age: 27,
            date_of_birth: "1998-01-20",
            gender: "male",
            address: null,
            phone_no: null,
            id_card_no: null,
            blood_group: null,
          },
          doctor_id: 3,
          number: 5,
          consultation_date: "2024-11-01",
          diccount: null,
          diccount_by: null,
          created_at: "2024-11-01T17:30:27.402771Z",
          doctor: 2,
        },
      ],
      searchQuery: "",
      isDropdownOpen: false,
      selectedPatient: null,
      patients: [],
      currentDoc: "",
      currentToken: "",
      modalTitle: "Add New OPD",
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      inputFieldValue: "",
      loading: false,
      managersData: [],
      selectedDate: new Date().toISOString().split("T")[0],
      userData: {
        number: null,
        consultation_date: this.selectedDate,
        diccount: null,
        patient: 0,
        fee: 0,
        doctor: 0,
      },
      patientData: {
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
    CustomModal,
    SoftButtonVue,
  },
  computed: {
    filteredPatients() {
      if (this.searchQuery.length > 0) {
        const query = this.searchQuery.toLowerCase();
        return this.patients.filter((patient) => {
          const firstName = patient?.first_name?.toLowerCase() || "";
          const idCardNo = patient?.id_card_no?.toLowerCase() || "";
          const mrNo = patient?.mr_no?.toLowerCase() || "";

          // Check if any of the fields contain the search query
          return (
            firstName.includes(query) ||
            idCardNo.includes(query) ||
            mrNo.includes(query)
          );
        });
      }
      console.log("patiens list", this.patients);
      return this.patients;
    },

    selectedPatientName() {
      if (this.selectedPatient) {
        return `${this.selectedPatient.first_name} ${
          this.selectedPatient.last_name ? this.selectedPatient.last_name : ""
        }`;
      }
      return "";
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      console.log("calling", this.isDropdownOpen);
      // this.searchQuery = ""; // Clear search when dropdown opens
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.isDropdownOpen = false;
    },
    getPatientByDoctorAndRow(doctorId, rowNumber) {
      return (
        this.opds.find(
          (opd) => opd.doctor === doctorId && opd.number === rowNumber
        ) || null
      );
    },
    openPatientModal() {
      // this.resetForm();
      this.modalTitle = "Add Patient";
      this.$refs.patientModal.openModal();
    },
    closeUserModalHandler() {},
    resetUserData() {
      this.userData = {
        number: null,
        consultation_date: this.selectedDate,
        diccount: null,
        patient: 0,
        fee: 0,
        doctor: 0,
      };
    },
    openCustomModal(doctor, rowNo, consultation_fee) {
      this.resetUserData();
      this.userData.fee = consultation_fee;
      this.userData.number = rowNo;
      this.userData.doctor = doctor;
      this.closeUserModalHandler();
      this.$refs.customModal.openModal();
    },
    saveAndClose() {
      this.$refs.customModal.closeModal();
    },
    async addNewPatient() {
      try {
        this.loading = true;
        delete this.patientData.mr_no;
        const response = await api.post("/api/patients/", this.patientData);
        this.$notify({
          type: "success",
          title: "Patient Added",
          text: "Patient added successfully",
        });
        this.$refs.patientModal.closeModal();
        this.getPatients();
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
    async getDoctors() {
      try {
        const response = await api.get("/api/doctors/", {});
        this.doctors = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async getPatients() {
      try {
        const response = await api.get("/api/patients/", {});
        this.patients = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async getOPDS() {
      try {
        const response = await api.get(
          `/api/opds/opd-by-date/?date=${this.selectedDate}`,
          {}
        );
        this.opds = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async addDayToken() {
      try {
        this.loading = true;
        const response = await api.post("/api/opds/", this.userData);
        this.$notify({
          type: "success",
          title: "Token Added",
          text: "Token added successfuly",
        });
        this.saveAndClose();
        this.getOPDS();
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
    Promise.all([this.getDoctors(), this.getOPDS()]);
    this.getPatients();
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
  border: 2px solid #82d616;
  /* Change the border color when in focus */
  outline: none;
  /* Remove the default focus outline */
  box-shadow: 0 0 5px #82d61670;
}
.inputField:active {
  background-color: #f8f9fa;
}
.dropdownOptions {
  border-radius: 8px;
}
.cu-empty-box {
  background-color: #e9e9e9;
  height: 50px;
  cursor: pointer;
  border-radius: 16px;
  text-align: center;
}
.cu-data-box {
  background-color: #91f8778c;
  height: 50px;
  cursor: pointer;
  border-radius: 16px;
  text-align: center;
  color: #368215;
}

.dropdown-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
}

.dropdown-header {
  border: 1px solid #ccc;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  background-color: #fff;
}

.dropdown-menu {
  position: absolute;
  top: 100%; /* Positions the dropdown directly below the header */
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  z-index: 1000;
  max-height: 200px; /* Restricts height with scroll */
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: none; /* Start hidden */
}

/* Displays the menu when dropdown is open */
.dropdown-container .dropdown-header + .dropdown-menu {
  display: block;
}

/* Search input at the top of the dropdown */
.search-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
  outline: none;
  box-sizing: border-box;
}

/* Styles for dropdown options */
.dropdown-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-option {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}
</style>
