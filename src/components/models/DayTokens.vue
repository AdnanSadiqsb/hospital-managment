<template>
    <div>
      <div class="card mb-4">
        <div class="card-header p-3" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
          <h2>OPD</h2>
          <div class="">
            <input type="date" class="inputField"  v-model="selectedDate" @change="getOPDS">
          </div>
        </div>
        <div class="table-responsive p-0">
      <table class="table align-items-center mb-0">
        <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">#</th>
            <th v-for="doctor in doctors" :key="doctor.id" class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
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
              <div v-if="getPatientByDoctorAndRow(doctor.id, rowNumber)" class="cu-data-box">
                <p class="text-lg mb-0 pt-2 font-weight-bold">
                  {{ getPatientByDoctorAndRow(doctor.id, rowNumber).patient.first_name }} {{ getPatientByDoctorAndRow(doctor.id, rowNumber).patient.last_name }}
                </p>
              </div>
              <div v-else>
                <div @click="openCustomModal(doctor.id, rowNumber, doctor.consultation_fee)"  class="cu-empty-box" >
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
         
          <div>
            <label for="inputField">Select Patient</label>
            <select class="inputField"  required v-model="userData.patient">
              <option value="" selected disabled >Select Patient</option>
              <option
                class="dropdownOptions"
                v-for="role in patients"
                :key="role.id"
                :value="role.id"
              >
                {{ role.first_name }} {{ role.last_name }}
              </option>
            </select>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="inputField">Fees</label>
              <input class="inputField" readonly  v-model="userData.fee" type="number" placeholder="Fee" />
            </div>
            <div class="col-md-6">
              <label for="inputField">Discount</label>
              <input class="inputField"  v-model="userData.diccount" type="number" placeholder="Discount" />
            </div>
          </div>
         
        </form>
        <template v-slot:actions>
          <soft-button-vue :loading="loading" form="worker-form" type="submit">
            Add OPD
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
            "id": 2,
            "email": "talha1@gmail.com",
            "first_name": "mohsin",
            "last_name": "mumtaz",
            "profile_image": null,
            "role": "doctor",
            "phoneNo": null,
            "specialization": "surgone",
            "room_no": "1",
            "consultation_fee": 1000,
            "lab_share": 20,
            "opd_share": 30,
            "user": 3
          },
          {
            "id": 3,
            "email": "talha12@gmail.com",
            "first_name": "aslam",
            "last_name": "iqbal",
            "profile_image": null,
            "role": "doctor",
            "phoneNo": null,
            "specialization": "surgone",
            "room_no": "2",
            "consultation_fee": 1200,
            "lab_share": 20,
            "opd_share": 30,
            "user": 4
          }
        ],
        opds: [
          {
            "id": 3,
            "patient": {
              "id": 3,
              "first_name": "arslan",
              "last_name": "rao",
              "mr_no": "mc-2411001",
              "age": 27,
              "date_of_birth": "1998-01-20",
              "gender": "male",
              "address": null,
              "phone_no": null,
              "id_card_no": null,
              "blood_group": null
            },
            "doctor_id": 2,
            "number": 5,
            "consultation_date": "2024-11-01",
            "diccount": null,
            "diccount_by": null,
            "created_at": "2024-11-01T17:30:27.402771Z",
            "doctor": 2
          },
          {
            "id": 2,
            "patient": {
              "id": 2,
              "first_name": "adnan",
              "last_name": "sadiq",
              "mr_no": "mc-2411001",
              "age": 27,
              "date_of_birth": "1998-01-20",
              "gender": "male",
              "address": null,
              "phone_no": null,
              "id_card_no": null,
              "blood_group": null
            },
            "doctor_id": 3,
            "number": 5,
            "consultation_date": "2024-11-01",
            "diccount": null,
            "diccount_by": null,
            "created_at": "2024-11-01T17:30:27.402771Z",
            "doctor": 2
          }],

          patients:[],
          currentDoc :'',
          currentToken:'',
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
        selectedDate:new Date().toISOString().split('T')[0],
        userData: {
          "number": null,
          "consultation_date": this.selectedDate,
          "diccount": null,
          "patient": 0,
          "fee":0,
          "doctor": 0

        },
      };
    },
    components: {
      CustomModal,
      SoftButtonVue,
    },
    methods: {
      getPatientByDoctorAndRow(doctorId, rowNumber) {
        return this.opds.find((opd) => opd.doctor === doctorId && opd.number === rowNumber) || null;
      },
      closeUserModalHandler() {
      },
      resetUserData() {
        this.userData= {
          "number": null,
          "consultation_date": this.selectedDate,
          "diccount": null,
          "patient": 0,
          "fee":0,
          "doctor": 0

        }
      },
      openCustomModal(doctor, rowNo,consultation_fee) {
        this.resetUserData()
        this.userData.fee=consultation_fee;
        this.userData.number=rowNo;
        this.userData.doctor=doctor;
        console.log(doctor, rowNo)
        this.closeUserModalHandler();
        this.$refs.customModal.openModal();
      },
      saveAndClose() {
        this.$refs.customModal.closeModal();
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
          const response = await api.get(`/api/opds/opd-by-date/?date=${this.selectedDate}`, {});
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
          this.getOPDS()
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
      Promise.all([this.getDoctors(), this.getOPDS()])
      this.getPatients()
    },
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
    border: 2px solid #82D616;
    /* Change the border color when in focus */
    outline: none;
    /* Remove the default focus outline */
    box-shadow: 0 0 5px #82d61670;
  }
  .inputField:active {
    background-color: #F8F9FA;
  }
  .dropdownOptions {
    border-radius: 8px;
  }
  .cu-empty-box{
    background-color: #e9e9e9;
    height: 50px;
    cursor: pointer;
    border-radius: 16px;
    text-align: center;
  }
  .cu-data-box{
    background-color: #91f8778c;
    height: 50px;
    cursor: pointer;
    border-radius: 16px;
    text-align: center;
    color: #368215;
  }
  </style>