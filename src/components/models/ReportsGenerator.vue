<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12 col-md-6 mb-md-0 mb-4">
        <div class="card mb-4">
          <div
            class="card-header pb-0"
            style="display: flex; justify-content: space-between; gap: 6px"
          >
            <input type="date" class="inputField" v-model="reportData.from" />
            <input type="date" class="inputField" v-model="reportData.to" />
            <SoftButtonVue @click="generateReport()" style="text-wrap: nowrap"
              ><slot>Generate Reports</slot></SoftButtonVue
            >
            <SoftButtonVue @click="printDiv()" style="text-wrap: nowrap"
              ><slot>Download Reports</slot></SoftButtonVue
            >
          </div>
          <div
            class="card-header pb-0"
            style="display: flex; justify-content: space-between; gap: 6px"
          >
            <input
              type="date"
              class="inputField"
              v-model="reportOPDData.from"
            />
            <input type="date" class="inputField" v-model="reportOPDData.to" />
            <SoftButtonVue
              @click="generateOPDReport()"
              style="text-wrap: nowrap"
              ><slot>Generate OPD Reports</slot></SoftButtonVue
            >
            <SoftButtonVue @click="printOPDDiv()" style="text-wrap: nowrap"
              ><slot>Download Reports</slot></SoftButtonVue
            >
          </div>
          <div class="card-body px-0 pb-2">
            <div
              id="printableDiv"
              v-if="htmlContent"
              v-html="htmlContent"
            ></div>
            <div
              id="printableDivOPD"
              v-if="htmlContentOPD"
              v-html="htmlContentOPD"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAPI } from "@/supportElements/useAPI.js";
import html2pdf from "html2pdf.js";
import { mapState } from "vuex";
import SoftButtonVue from "../SoftButton.vue";
import { convertToFormData } from "../../supportElements/common";
import useApi from "../../supportElements/useAPI";
const api = useApi();
export default {
  name: "projects-card",
  data() {
    return {
      useAPI,
      modalTitle: "Add New Project",
      inputFieldValue: "",
      selectedFromDate: "",
      selectedToDate: "",
      loading: false,
      htmlContent: "",
      htmlContentOPD: "",
      projects: [],
      reportData: {
        from: new Date().toISOString().split("T")[0],
        to: "",
      },
      reportOPDData: {
        from: new Date().toISOString().split("T")[0],
        to: "",
      },
      managers: [{ id: 0, username: "" }],
    };
  },
  components: {
    SoftButtonVue,
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    closeProjectModalHandler() {
      this.project.title = "";
      this.project.description = "";
      this.project.image = null;
      this.project.startDate = "";
      this.project.endDate = "";
      this.project.managers = [];
    },

    printDiv() {
      // Get the content of the div using its ID
      const content = document.getElementById("printableDiv").innerHTML;

      // Open a new window to print
      const printWindow = window.open("", "_blank");

      // Write the content to the new window
      printWindow.document.write(
        `<html><head><title>Report from ${this.reportData.from} to ${this.reportData.to}</title></head><body>`
      );
      printWindow.document.write(content);
      printWindow.document.write("</body></html>");

      // Close the document and trigger the print dialog
      printWindow.document.close();
      printWindow.print();
    },
    printOPDDiv() {
      // Get the content of the div using its ID
      const content = document.getElementById("printableDivOPD").innerHTML;

      // Open a new window to print
      const printWindow = window.open("", "_blank");

      // Write the content to the new window
      printWindow.document.write(
        `<html><head><title>Report from ${this.reportData.from} to ${this.reportData.to}</title></head><body>`
      );
      printWindow.document.write(content);
      printWindow.document.write("</body></html>");

      // Close the document and trigger the print dialog
      printWindow.document.close();
      printWindow.print();
    },

    async generateReport() {
      try {
        this.loading = true;
        const resp = await api.get(
          `api/lab-bills/report-pdf/?start_date=${this.reportData.from}&end_date=${this.reportData.to}`
        );
        this.htmlContent = resp.data;
        this.$notify({
          type: "success",
          title: "Report generated",
          text: "Report generated succesfuly",
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async generateOPDReport() {
      try {
        this.loading = true;
        const resp = await api.get(
          `/api/opds/opd-report/?start_date=${this.reportOPDData.from}&end_date=${this.reportOPDData.to}`
        );
        this.htmlContentOPD = resp.data;
        this.$notify({
          type: "success",
          title: "OPD  generated",
          text: "OPD report generated succesfuly",
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    openCustomModal() {
      this.closeProjectModalHandler();
      this.$refs.customModal.openModal();
    },

    saveAndClose() {
      console.log("Input Field Value:", this.inputFieldValue);
      this.$refs.customModal.closeModal();
    },

    handleFileChange(event) {
      this.project.image = event.target.files[0];
    },

    async addNewProject() {
      try {
        this.loading = true;
        let formData = convertToFormData(this.project, ["image"]);
        Object.keys(this.project).forEach((key) => {
          formData.append(key, this.project[key]);
        });
        const response = await api.post("/api/project/", formData);
        this.$notify({
          type: "success",
          title: "Project added",
          text: "Project added succesfuly",
        });
        this.getProjectHandler();
        console.log(response);
        this.loading = false;
        this.saveAndClose();
      } catch (err) {
        this.loading = false;
        this.$notify({
          type: "error",
          title: "Something went wrong",
          text: err,
        });
      } finally {
        this.loading = false;
      }
    },

    async getProjectHandler() {
      try {
        const response = await api.get("/api/project/", {});
        this.projects = response.data;
        console.log(this.projects);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("");
      }
    },

    async getMangersHandler() {
      try {
        const response = await api.get("/api/users/by-role/manager/", {});
        this.managers = response.data;
        console.log(this.managers);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("");
      }
    },
  },
  mounted() {},
};
</script>
<style scoped>
.custom-checkbox input:checked + .checkmark {
  background-color: #4caf50;
  border-color: #4caf50;
}
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
  padding: 4px 24px;
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
