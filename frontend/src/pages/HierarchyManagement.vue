<template>
  <q-layout>
    <q-page>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <div v-if="loadingSkeleton" class="col-12">
              <q-skeleton class="q-mt-sm" style="height: 540px; width: 100%">
              </q-skeleton>
            </div>
            <div v-else class="full-width">
              <q-card class="shadowcard">
                <q-card-section>
                  <q-tabs
                    v-model="tab"
                    indicator-color="primary"
                    active-bg-color="positive text-white"
                    class="bg-primary text-white shadow-2 row"
                  >
                    <q-tab
                      class="col-6"
                      name="Manage Hierarchy Structure"
                      icon="menu"
                      label="Manage Hierarchy Structure"
                    />
                    <q-tab
                      class="col-6"
                      name="Hierarchy Structure"
                      icon="menu"
                      label="Hierarchy Structure"
                    />
                  </q-tabs>
                </q-card-section>

                <q-card-section class="q-pa-none">
                  <q-tab-panels
                    v-model="tab"
                    animated
                    transition-prev="slide-right"
                    transition-next="slide-left"
                  >
                    <q-tab-panel name="Manage Hierarchy Structure">
                      <div>
                        <q-select
                          v-model="selectedDepartment"
                          use-input
                          hide-selected
                          outlined
                          input-debounce="0"
                          label="Department"
                          behavior="menu"
                          fill-input
                          class="hoverable-item"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                          clearable
                        />

                        <q-select
                          fill-input
                          hide-selected
                          input-debounce="0"
                          use-input
                          class="q-mt-xs hoverable-item"
                          v-model="selectedLevel"
                          outlined
                          label="Level"
                          behavior="menu"
                          clearable
                          @filter="filterFn"
                          :options="levels"
                          option-value="value"
                          option-label="label"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentCorporateOne"
                          :disable="selectOption('corporate1')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Corporate Officer"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentCorporateTwo"
                          :disable="selectOption('division1')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Corporate Officer"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentDivisionOne"
                          :disable="selectOption('division2')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Division One"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          use-input
                          hide-selected
                          fill-input
                          v-model="selectedParentDivisionTwo"
                          :disable="selectOption('group')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Division Two"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          fill-input
                          hide-selected
                          use-input
                          v-model="selectedParentGroup"
                          :disable="selectOption('department')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Group"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />
                        <q-select
                          fill-input
                          hide-selected
                          use-input
                          v-model="selectedParentDepartment"
                          :disable="selectOption('section')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Department"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />

                        <q-select
                          fill-input
                          hide-selected
                          use-input
                          v-model="selectedParentSection"
                          :disable="selectOption('area')"
                          class="q-mt-xs hoverable-item"
                          outlined
                          input-debounce="0"
                          clearable
                          label="Parent Section"
                          @filter="filterFn"
                          :options="departmentOptions"
                          option-value="code"
                          option-label="deptDescription"
                        />
                      </div>

                      <div class="q-pt-md text-center">
                        <q-btn
                          class="bg-primary text-white text-bold"
                          push
                          label="Submit"
                          @click="submitHierarchy"
                        ></q-btn>
                      </div>
                    </q-tab-panel>
                    <q-tab-panel class="q-pa-none" name="Hierarchy Structure">
                      <div class="q-pl-md q-pr-md q-pb-sm">
                        <q-input
                          class="bg-grey-4 full-width"
                          v-model="searchText"
                          placeholder="Search"
                          outlined
                          dense
                          standout
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          input-style="color: #1565c0;"
                          @clear="clearSearchText"
                        />
                        <q-card class="q-pb-md">
                          <q-card-section class="virtual-scroll">
                            <q-tree
                              v-if="computedHierarchy.length > 0"
                              style="max-height: 600px"
                              v-model="selectedTree"
                              class="q-[pb-lg tree-with-outline"
                              :nodes="computedHierarchy"
                              node-key="id"
                              no-connectors
                              accordion
                            />

                            <div v-else>
                              <p class="text-subtitle1 text-bold q-pa-none">
                                No Hierarchy Tree Structure
                              </p>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card-section>
                <q-card-section
                  v-if="tab === 'Hierarchy Structure'"
                  class="text-right"
                >
                  <q-btn
                    push
                    class="bg-positive text-white text-bold"
                    label="Print Excel"
                    @click="printExcel"
                  ></q-btn>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page-container>
    </q-page>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import helperMethods from "src/helperMethods";
import { QSpinnerIos } from "quasar";

const levelOptions = [
  { label: "Corporate Officer One", value: 1 },
  { label: "Corporate Officer Two", value: 2 },
  { label: "Division One", value: 3 },
  { label: "Division Two", value: 4 },
  { label: "Group", value: 5 },
  { label: "Department", value: 6 },
  { label: "Section", value: 7 },
  { label: "Area", value: 8 },
];

// const levelOptions = [
//   { label: "Division Two", value: 1 },
//   { label: "Group", value: 2 },
//   { label: "Department", value: 3 },
//   { label: "Section", value: 4 },
//   { label: "Area", value: 5 },
// ];

export default {
  data() {
    return {
      searchText: "",
      hiearchyData: [],
      selectedTree: null,
      selectedDepartment: null,
      departmentOptions: [],
      selectedLevel: null,
      levels: [],
      selectedParentCorporateOne: null,
      selectedParentCorporateTwo: null,
      selectedParentDivisionOne: null,
      selectedParentDivisionTwo: null,
      selectedParentGroup: null,
      selectedParentDepartment: null,
      selectedParentSection: null,
      tab: "Manage Hierarchy Structure",
      loadingSkeleton: false,
      loadingCounter: null,
      rawData: [],
      loader: false,
    };
  },

  computed: {
    ...mapGetters({
      hiearchy: "hierarchyModule/getHiearchy",
      allDepartmentsGetter: "hierarchyModule/getAllDepartments",
      getRawData: "hierarchyModule/getRawData",
    }),

    computedHierarchy() {
      const query = this.searchText.toLowerCase();

      const searchNode = (node) => {
        const matches =
          node.label && node.label.toString().toLowerCase().includes(query);
        if (node.children) {
          node.children = node.children
            .map((child) => searchNode(child))
            .filter((child) => child !== null);
        }

        return matches || (node.children && node.children.length > 0)
          ? node
          : null;
      };

      const tree = this.hiearchyData
        .map((item) => searchNode(item))
        .filter((item) => item !== null);

      this.organizationalTree = tree;
      return tree;

      // return this.hiearchyData
      //   .map((item) => searchNode(item))
      //   .filter((item) => item !== null);

      // return this.hiearchyData.filter((item) => {
      //   return (
      //     item.label && item.label.toString().toLowerCase().includes(query)
      //   );
      // });
    },
  },

  methods: {
    selectOption(option) {
      const levelMap = {
        corporate1: [2, 3, 4, 5, 6, 7, 8],
        division1: [3, 4, 5, 6, 7, 8],
        division2: [4, 5, 6, 7, 8],
        group: [5, 6, 7, 8],
        department: [6, 7, 8],
        section: [7, 8],
        area: [8],
      };

      const levelValue = this.selectedLevel?.value;

      if (levelMap[option]) {
        return !levelMap[option].includes(levelValue);
      }

      return true;
    },

    clearSearchText() {
      this.searchText = "";
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.departmentOptions = this.allDepartmentsGetter;
          this.levels = levelOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departmentOptions = this.allDepartmentsGetter.filter(
          (option) => option.deptDescription.toLowerCase().indexOf(needle) > -1,
        );
        this.levels = levelOptions.filter(
          (option) => option.label.toLowerCase().indexOf(needle) > -1,
        );
      });
    },

    async getHiearchy() {
      try {
        await this.$store.dispatch("hierarchyModule/getHiearchy");
        this.hiearchyData = this.formatHierarchy(this.hiearchy);
        this.rawData = this.getRawData;
      } catch (error) {
        console.error("Error fetching hierarchy data:", error);
      }
    },

    async getHiearchyWithLoading() {
      try {
        this.loadingSkeleton = true;
        await helperMethods.delay(500);
        await this.getHiearchy;
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error("Error fetching hierarchy data:", error);
      }
    },

    formatHierarchy(hierarchy) {
      const formatNode = (node) => {
        const formattedNode = {
          label: node.name,
          id: node.code,
          ...node,
        };

        if (node.children && Object.keys(node.children).length > 0) {
          formattedNode.children = Object.values(node.children).map(formatNode);
        } else {
          formattedNode.children = [];
        }

        return formattedNode;
      };

      return Object.values(hierarchy)
        .map(formatNode)
        .sort((a, b) => a.label.localeCompare(b.label));
    },

    async getDepartments() {
      try {
        this.loadingSkeleton = true;
        await helperMethods.delay(500);
        await this.$store.dispatch("hierarchyModule/getDepartments");
        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loadingSkeleton = false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async submitHierarchy() {
      let missingParents = [];

      if (!this.selectedDepartment || !this.selectedLevel) {
        missingParents.push("department, level and the appropriate parent");
      }

      if (missingParents.length > 0) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `Please choose a ${missingParents.join(" and ")}`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      helperMethods.disablePointerEvents();
      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Checking for the chosen department data",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      await helperMethods.delay(500);
      const data = {
        selectedDepartment: this.selectedDepartment?.code,
        selectedLevel: this.selectedLevel?.value,
        parentCorporate1: this.selectedParentCorporateOne?.code,
        parentCorporate2: this.selectedParentCorporateTwo?.code,
        parentDivision2: this.selectedParentDivisionTwo?.code,
        parentDivision1: this.selectedParentDivisionOne?.code,
        parentGroup: this.selectedParentGroup?.code,
        parentDepartment: this.selectedParentDepartment?.code,
        parentSection: this.selectedParentSection?.code,
      };

      const request = await this.$store.dispatch(
        "hierarchyModule/checkDeptData",
        data.selectedDepartment,
      );
      this.$q.loading.hide();
      helperMethods.enablePointerEvents();
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to set the parent tree for ${this.selectedDepartment?.code} - ${this.selectedDepartment?.deptDescription}?
          Please note that it currently has ${request.body}. If you are unsure about these changes, please check the departmental tree hierarchy for reference.
          If any changes or updates are needed, please proceed with the confirmation.`,
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          try {
            helperMethods.disablePointerEvents();
            this.$q.loading.show({
              spinner: QSpinnerIos,
              message: "Setting new hierchy / departamental tree",
              messageColor: "primary",
              backgroundColor: "grey-1",
              spinnerColor: "primary",
              customClass: "custom-loading-style",
              spinnerSize: "7em",
            });
            await helperMethods.delay(500);
            await this.$store.dispatch("hierarchyModule/setNewHierarchy", data);
            this.$q.loading.hide();
            this.$q.notify({
              color: "green-8",
              position: "center",
              message: "Success setting new hierchy / departamental tree",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            await this.getHiearchy();
            this.selectedParentCorporateOne = null;
            this.selectedParentCorporateTwo = null;
            this.selectedDepartment = null;
            this.selectedLevel = null;
            this.selectedParentDivision = null;
            this.selectedParentGroup = null;
            this.selectedParentDepartment = null;
            this.selectedParentSection = null;
          } catch (error) {
            this.$q.loading.hide();
            this.$q.notify({
              color: "negative",
              position: "center",
              message: "Error setting new hierchy / departamental tree",
              icon: "report_problem",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
            console.error(error);
          }
        });
    },

    async printExcel() {
      const notify = this.$q.notify;

      const data = await JSON.parse(JSON.stringify(this.rawData));

      this.$q.loading.show({
        spinner: QSpinnerIos,
        message: "Loading ... fetching data",
        messageColor: "primary",
        backgroundColor: "grey-1",
        spinnerColor: "primary",
        customClass: "custom-loading-style",
        spinnerSize: "7em",
      });
      await helperMethods.delay(500);
      if (typeof Worker !== "undefined") {
        if (typeof this.w === "undefined") {
          this.w = new Worker(new URL("../store/worker.js", import.meta.url));
        }

        this.w.postMessage({ data });

        this.w.onmessage = (event) => {
          this.$q.loading.hide();
          if (event.data.success) {
            const blob = event.data.result;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Organizational_Tree.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            notify({
              color: "green-8",
              position: "center",
              message:
                "Success Generating Report, Please do check your download file and do save it.",
              icon: "check",
              iconColor: "white",
              timeout: 1500,
              progress: true,
            });
            this.step = 1;
            this.selectedFormat = null;
            this.selectedBuilding = null;
            this.selectedDepartment = null;
            this.selectedRoom = null;
            this.dateRange = null;
          } else {
            this.loader = false;
            notify({
              color: "warning",
              position: "center",
              message: "Failed on generating report",
              icon: "check",
              iconColor: "white",
              timeout: 1500,
              progress: true,
            });
          }
        };
      }
    },

    // async printExcel() {
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("Organizational Tree");

    //   const headers = [
    //     "Department Code",
    //     "Department Name",
    //     "Reportorial",
    //     "Division",
    //     "Group",
    //     "Department",
    //     "Section/Unit/Ward",
    //     "Area of Assignment",
    //   ];

    //   const headerRow = worksheet.addRow(headers);

    //   for (const cell of headerRow._cells) {
    //     if (cell) {
    //       cell.font = { bold: true };
    //       cell.alignment = { horizontal: "center" };
    //       cell.fill = {
    //         type: "pattern",
    //         pattern: "solid",
    //         fgColor: { argb: "D9D9D9" },
    //       };
    //       cell.border = {
    //         top: { style: "thin", color: { argb: "000000" } },
    //         left: { style: "thin", color: { argb: "000000" } },
    //         bottom: { style: "thin", color: { argb: "000000" } },
    //         right: { style: "thin", color: { argb: "000000" } },
    //       };
    //     }
    //   }

    //   let columnWidths = [];
    //   for (const header of headers) {
    //     columnWidths.push(header.length);
    //   }

    //   for (const item of this.rawData) {
    //     const rowData = [
    //       item.code || "",
    //       item.codeDescription || "",
    //       item.division && item.divisionDescription
    //         ? `(${item.division}) - ${item.divisionDescription}`
    //         : "",
    //       item.division && item.divisionDescription
    //         ? `(${item.division}) - ${item.divisionDescription}`
    //         : "",
    //       item.group && item.groupDescription
    //         ? `(${item.group}) - ${item.groupDescription}`
    //         : "",
    //       item.department && item.departmentDescription
    //         ? `(${item.department}) - ${item.departmentDescription}`
    //         : "",
    //       item.section && item.sectionDescription
    //         ? `(${item.section}) - ${item.sectionDescription}`
    //         : "",
    //       item.area && item.areaOfAssignment
    //         ? `(${item.area}) - ${item.areaOfAssignment}`
    //         : "",
    //     ];

    //     const row = worksheet.addRow(rowData);

    //     for (const cell of row._cells) {
    //       if (cell) {
    //         cell.alignment = { vertical: "middle", horizontal: "center" };
    //         cell.border = {
    //           top: { style: "thin", color: { argb: "000000" } },
    //           left: { style: "thin", color: { argb: "000000" } },
    //           bottom: { style: "thin", color: { argb: "000000" } },
    //           right: { style: "thin", color: { argb: "000000" } },
    //         };
    //       }
    //     }

    //     for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
    //       columnWidths[colIndex] = Math.max(
    //         columnWidths[colIndex],
    //         rowData[colIndex].length,
    //       );
    //     }
    //   }

    //   for (let i = 0; i < columnWidths.length; i++) {
    //     worksheet.getColumn(i + 1).width = columnWidths[i] + 2; // Add padding for better readability
    //   }

    //   const blob = await workbook.xlsx.writeBuffer().then(
    //     (data) =>
    //       new Blob([data], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //       }),
    //   );

    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = "OrganizationalTree.xlsx";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // },
  },

  created() {
    this.getHiearchyWithLoading();
    this.getDepartments();
  },
};
</script>
