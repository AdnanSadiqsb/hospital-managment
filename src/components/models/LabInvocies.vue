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
        <h6>Lab Invoices</h6>

        <div class="d-flex" style="width: max-content">
          <input
            type="date"
            class="inputField"
            v-model="selectedDate"
            @change="getInvoicesHandler"
          />
          <soft-button-vue
            class="ml-4"
            style="text-wrap: nowrap"
            @click="openCustomModal()"
            ><slot>Add Invoice</slot></soft-button-vue
          >
        </div>
      </div>

      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Dr. Name
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                >
                  Patient Name
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  MR No#
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Discount
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Discount By
                </th>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                >
                  Paid
                </th>

                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in invoicesData" :key="item.id">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">
                        {{ item?.doctor_name ? item?.doctor_name : "N/A" }}
                      </h6>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.patient_name ? item.patient_name : "N/A" }}
                  </p>
                </td>
                <td class="align-middle text-center text-sm">
                  <soft-badge color="success" variant="gradient" size="sm">{{
                    item.mrno ? item.mrno.replace("-", " ") : "N/A"
                  }}</soft-badge>
                </td>
                <td class="align-middle text-center text-sm">
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.discount ? item.discount : "N/A" }}
                  </p>
                </td>
                <td class="align-middle text-center text-sm">
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.discount_by ? item.discount_by : "N/A" }}
                  </p>
                </td>
                <td class="align-middle text-center text-sm">
                  <p class="text-xs font-weight-bold mb-0">
                    {{ item.amount_paid ? item.amount_paid : "N/A" }}
                  </p>
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

    <custom-modal ref="invoiceModal" :title="modalTitle">
      <form id="test-form" @submit.prevent="addNewInvoice">
        <div>
          <label for="inputField">Select Doctor</label>
          <div class="dropdown-container" style="max-width: 500px">
            <div class="dropdown-header" @click="toggleDocDropDown">
              {{ selectedDoctor ? selectedDoctorName : "Select Doctor" }}
            </div>
            <div v-if="isDoctorDropdownOpen" class="dropdown-menu">
              <input
                type="text"
                class="search-input"
                v-model="searchQueryDoc"
                placeholder="Search doctor..."
                @click.stop
              />
              <ul class="dropdown-options">
                <li
                  v-for="doctor in filteredDoctors"
                  :key="doctor.id"
                  @click="selectDoctor(doctor)"
                  class="dropdown-option"
                >
                  {{ doctor.first_name }}
                  {{ doctor.last_name ? doctor.last_name : "" }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label for="inputField">Select Patient</label>
          <div class="dropdown-container" style="max-width: 500px">
            <div class="dropdown-header" @click="togglePatientDropdown">
              {{ selectedPatient ? selectedPatientName : "Select Patient" }}
            </div>
            <div v-if="isPatientDropdownOpen" class="dropdown-menu">
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
        <div>
          <SoftBadge
            class="m-2"
            v-for="(test, index) in selectedTestList.testNames"
            :key="index"
            @click="this.removeTest(test)"
            style="cursor: pointer"
          >
            {{ test.test_name }}
            <span style="color: red; margin-left: 4px">X</span>
          </SoftBadge>
        </div>

        <div>
          <label for="inputField">Select Test</label>
          <div class="dropdown-container" style="max-width: 500px">
            <div class="dropdown-header" @click="toggleTestsDropdown">
              {{ selectedTest ? selectedTestName : "Select Test(s)" }}
            </div>
            <div v-if="isTestDropdownOpen" class="dropdown-menu">
              <input
                type="text"
                class="search-input"
                v-model="searchQueryTest"
                placeholder="Search test..."
                @click.stop
              />
              <ul class="dropdown-options">
                <li
                  v-for="test in filteredTests"
                  :key="test.id"
                  @click="selectTest(test)"
                  class="dropdown-option"
                >
                  {{ test.test_name }}
                  {{ test.type ? test.type : "" }}
                </li>
              </ul>
            </div>
          </div>
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
          Add Invoice
        </soft-button-vue>
      </template>
    </custom-modal>
  </div>
</template>

<script>
import CustomModal from "@/views/components/CustomModal.vue";
import SoftBadge from "@/components/SoftBadge.vue";

import useApi from "../../supportElements/useAPI";
import SoftButtonVue from "../SoftButton.vue";
const api = useApi();
export default {
  name: "authors-table",
  data() {
    return {
      modalTitle: "Create Invoice",
      searchQueryDoc: "",
      searchQuery: "",
      searchQueryTest: "",
      isDropdownOpen: false,
      // selectedTestList: [],
      isTestDropdownOpen: false,
      isDoctorDropdownOpen: false,
      isPatientDropdownOpen: false,
      selectedPatient: null,
      selectedDoctor: null,
      selectedTest: null,
      inputFieldValue: "",
      loading: false,
      selectedDate: new Date().toISOString().split("T")[0],
      selectedDocId: "",
      patients: [],
      doctors: [],
      selectedTestList: {
        tests: [], // Array for selected test IDs
        testNames: [], // Array for selected test names
      },
      tests: [
        {
          id: 0,
          test_name: "",
          price: 0,
          type: "",
          created_at: "",
        },
      ],
      invoiceFormData: {
        doctor: 0,
        patient: 0,
        discount: 0,
        discount_by: "",
        tests: [],
      },
      invoicesData: [
        {
          bill_number: null,
          created_at: "2024-11-01T19:24:51.074302Z",
          amount_paid: 1000.0,
          discount: null,
          discount_by: null,
          doctor_name: "Dr Mohsin Mumtaz ",
          patient_name: "Khalid Abbas  ",
          mrno: "mc-2411001",
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
  watch: {
    // Watch for changes in searchQuery and update filteredPatients accordingly
    // searchQuery(newQuery) {
    //   if (newQuery.length >= 3) {
    //     // Start searching after 3 characters
    //     this.getPatients();
    //   } else {
    //     this.filteredPatients = [];
    //   }
    // },
  },
  computed: {
    filteredPatients() {
      if (this.searchQuery.length > 0) {
        const query = this.searchQuery.toLowerCase();
        return this.patients.filter((patient) => {
          const firstName = patient?.first_name?.toLowerCase() || "";
          const idCardNo = patient?.id_card_no?.toLowerCase() || "";
          const mrNo = patient?.mr_no?.toLowerCase() || "";
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
    filteredDoctors() {
      if (this.searchQueryDoc.length > 0) {
        const query = this.searchQueryDoc.toLowerCase();
        return this.doctors.filter((doctor) => {
          const firstName = doctor?.first_name?.toLowerCase() || "";
          const lastName = doctor?.last_name?.toLowerCase() || "";
          return firstName.includes(query) || lastName.includes(query);
        });
      }
      console.log("doctors list", this.doctors);
      return this.doctors;
    },

    filteredTests() {
      if (this.searchQueryTest.length > 0) {
        const query = this.searchQueryTest.toLowerCase();
        return this.tests.filter((test) => {
          const testName = test?.test_name?.toLowerCase() || "";
          const type = test?.type?.toLowerCase() || "";

          return testName.includes(query) || type.includes(query);
        });
      }
      // console.log("patients list", this.tests);
      return this.tests;
    },

    selectedDoctorName() {
      if (this.selectedDoctor) {
        return `${this.selectedDoctor.first_name} ${
          this.selectedDoctor.last_name ? this.selectedDoctor.last_name : ""
        }`;
      }
      return "";
    },

    selectedPatientName() {
      if (this.selectedPatient) {
        return `${this.selectedPatient.first_name} ${
          this.selectedPatient.last_name ? this.selectedPatient.last_name : ""
        }`;
      }
      return "";
    },

    selectedTestName() {
      if (this.selectedTest) {
        return `${this.selectedTest.test_name} (${
          this.selectedTest.type ? this.selectedTest.type : ""
        })`;
      }

      return "";
    },
  },
  components: {
    SoftBadge,
    CustomModal,
    SoftButtonVue,
  },
  methods: {
    toggleDocDropDown() {
      this.isDoctorDropdownOpen = !this.isDoctorDropdownOpen;
      console.log("calling", this.isDoctorDropdownOpen);
    },
    togglePatientDropdown() {
      this.isPatientDropdownOpen = !this.isPatientDropdownOpen;
      console.log("calling", this.isPatientDropdownOpen);
    },

    toggleTestsDropdown() {
      this.isTestDropdownOpen = !this.isTestDropdownOpen;
      console.log("calling", this.isTestDropdownOpen);
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.invoiceFormData.patient = patient.id;
      this.searchQuery = `${patient.first_name} ${patient.last_name}`; // Set the selected patient's name
      this.isPatientDropdownOpen = false; //
    },
    selectDoctor(doctor) {
      this.selectedDoctor = doctor;
      this.invoiceFormData.doctor = doctor.id;
      this.searchQueryDoc = `${doctor.first_name} ${doctor.last_name}`; // Set the selected patient's name
      this.isDoctorDropdownOpen = false; //
    },
    selectTest(test) {
      const testIndex = this.selectedTestList.tests.indexOf(test.id);

      // Toggle the test ID in selectedTestList.tests
      if (testIndex === -1) {
        // Add the test ID and name if it doesn’t exist
        this.selectedTestList.tests.push(test.id);
        this.invoiceFormData.tests.push(test.id);
        this.selectedTestList.testNames.push(test);
      } else {
        // Remove the test ID and name if it already exists
        this.selectedTestList.tests.splice(testIndex, 1);
        this.invoiceFormData.tests.push(testIndex, 1);
        this.selectedTestList.testNames.splice(testIndex, 1);
      }

      // Update search query and close the dropdown
      this.searchQueryTest = ``;
      // this.isTestDropdownOpen = false;
    },

    removeTest(test) {
      const testIndex = this.selectedTestList.tests.indexOf(test.id);
      if (testIndex !== -1) {
        // Remove test ID and name from both arrays
        this.selectedTestList.tests.splice(testIndex, 1);
        this.selectedTestList.testNames.splice(testIndex, 1);
      }
    },

    closeUserModalHandler() {
      (this.testData.test_name = ""),
        (this.testData.price = ""),
        (this.testData.created_at = ""),
        (this.testData.type = "");
    },

    openCustomModal(id = "") {
      //   this.getTestDetailHandler(id);
      //   this.closeUserModalHandler();
      this.$refs.invoiceModal.openModal();
      this.getPatients();
      this.getDoctors();
    },

    saveAndClose() {
      this.$refs.invoiceModal.closeModal();
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

    async addNewInvoice() {
      try {
        this.loading = true;
        const formData = new FormData();

        // Append other fields
        formData.append("doctor", this.invoiceFormData.doctor);
        formData.append("patient", this.invoiceFormData.patient);
        formData.append("discount", this.invoiceFormData.discount);
        formData.append("discount_by", this.invoiceFormData.discount_by);

        // Append each test ID separately
        this.selectedTestList.tests.forEach((testId) => {
          formData.append("tests", testId);
        });

        const resp = await api.post(`/api/lab-bills/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Notify the user upon success
        this.$notify({
          type: "success",
          title: "Invoice added",
          text: "Invoice added successfully",
        });
        this.getInvoicesHandler();
        this.$refs.invoiceModal.closeModal();
      } catch (err) {
        console.log("Error adding invoice:", err);
      } finally {
        this.loading = false;
      }
    },
    async getInvoicesHandler() {
      try {
        const response = await api.get(
          `/api/lab-bills/get-lab-by-date/?date=${this.selectedDate}`,
          {}
        );
        this.invoicesData = response.data;
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
        this.getInvoicesHandler();
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
    async getTests() {
      try {
        const response = await api.get("/api/tests/", {});
        this.tests = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getInvoicesHandler();
    this.getDoctors();
    this.getPatients();
    this.getTests();
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
