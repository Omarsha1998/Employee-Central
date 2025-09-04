<template>
  <q-input
    v-if="employeeModule === false"
    class="bg-white"
    style="font-size: 15px"
    v-model="searchTextDetails"
    dense
    label="Search"
    label-color="blue-10"
    outlined
    clearable
    :class="[$q.screen.name + '-text2']"
    @clear="clearSearchText"
  />
  <q-virtual-scroll
    type="table"
    style="max-height: 700px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="computedDTRDetails"
    class="virtual-scroll"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th
            v-for="col in dynamicDtrColumns"
            :key="col.name"
            class="text-center"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row }">
      <q-tr
        :key="row.Day"
        :class="{
          'bg-green-1':
            (row.calendar !== 'ABSENT' && row.calendar !== null) ||
            row.onLeave === true,
          'bg-red-1': row.iN === null || row.calendar === 'ABSENT',
        }"
        class="text-center"
      >
        <q-td
          v-for="col in dynamicDtrColumns"
          :key="col.Day"
          :style="{ width: col.width || 'auto' }"
          class="text-center text-subtitle1"
        >
          <template v-if="col.field === 'iN' && employeeNoDtr === 0">
            <q-card v-if="row.late > 1 && row.late <= 14" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-yellow-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <q-card v-else-if="row.late > 14" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-red-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <q-card v-else-if="row.iN !== null" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template
            v-else-if="
              (col.field === 'iN' &&
                employeeNoDtr === 1 &&
                officer === false) ||
              (col.field === 'iN' && employeeNoDtr === 0 && officer === true) ||
              (col.field === 'iN' && employeeNoDtr === 1 && officer === true)
            "
          >
            <q-card v-if="row.iN !== null" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'oUT'">
            <q-card v-if="row[col.field] !== null" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'oT - IN'">
            <q-card v-if="row['oT - IN'] !== null">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'oT - OUT'">
            <q-card v-if="row['oT - OUT'] !== null">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'late'">
            <q-card v-if="row.late > 1 && row.late <= 14" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-yellow-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <q-card v-else-if="row.late > 14" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-red-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'undertime'">
            <q-card
              v-if="row.undertime > 1 && row.undertime <= 14"
              style="width: 100%"
            >
              <q-card-section
                class="text-white text-bold text-center bg-yellow-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <q-card v-else-if="row.undertime > 14" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-red-10"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'otHours'">
            <q-card v-if="row.otHours > 1" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'holidayPay'">
            <q-card v-if="row.holidayPay > 1" style="width: 100%">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else-if="col.field === 'workHours'">
            <q-card v-if="row.workHours !== '-'">
              <q-card-section
                class="text-white text-bold text-center bg-green-8"
                style="line-height: 25%"
              >
                {{ row[col.field] }}
              </q-card-section>
            </q-card>
            <div v-else>-</div>
          </template>
          <template v-else>
            {{ row[col.field] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>

  <div
    v-if="DTRDetails.length > 0 && this.employeeModule === true"
    class="bg-blue-2 text-left q-pa-md"
  >
    <span class="text-italic">Total work hours this month: </span>
    <span class="text-bold">{{ totalWorkHoursMonth }}</span>
  </div>

  <div
    v-if="DTRDetails.length > 0 && this.employeeModule === false"
    class="q-pt-md text-right"
  >
    <q-btn
      label="Print PDF"
      class="text-white text-left"
      push
      color="primary"
      @click="generatePdf(DTRDetails)"
    />
  </div>
  <!-- <q-card class="roundedDtr">
        <template>
          <q-virtual-scroll
            type="table"
            style="max-height: 850px"
            :virtual-scroll-item-size="48"
            :virtual-scroll-sticky-size-start="48"
            :virtual-scroll-sticky-size-end="32"
            :items="computedDTRDetails"
            class="virtual-scroll"
          >
            <template v-slot:before>
              <thead class="sticky-thead">
                <tr>
                  <th
                    v-for="col in dynamicDtrColumns"
                    :key="col.name"
                    class="text-center"
                  >
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot="{ item: row }">
              <q-tr
                :key="row.Day"
                :class="{
                  'bg-green-1':
                    (row.calendar !== 'ABSENT' && row.calendar !== null) ||
                    row.onLeave === true,
                  'bg-red-1': row.iN === null || row.calendar === 'ABSENT',
                }"
                class="text-center"
              >
                <q-td
                  v-for="col in dynamicDtrColumns"
                  :key="col.Day"
                  :style="{ width: col.width || 'auto' }"
                  class="text-center text-subtitle1"
                >
                  <template
                    v-if="
                      (col.field === 'iN' && noDtr === 0) ||
                      (col.field === 'iN' && noDtr === 0)
                    "
                  >
                    <q-card
                      v-if="row.late > 1 && row.late <= 14"
                      style="width: 100%"
                    >
                      <q-card-section
                        class="text-white text-bold text-center bg-yellow-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <q-card v-else-if="row.late > 14" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-red-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <q-card v-else-if="row.iN !== null" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template
                    v-else-if="
                      (col.field === 'iN' &&
                        noDtr === 1 &&
                        officer === false) ||
                      (col.field === 'iN' && noDtr === 0 && officer === true) ||
                      (col.field === 'iN' && noDtr === 1 && officer === true)
                    "
                  >
                    <q-card v-if="row.iN !== null" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'oUT'">
                    <q-card v-if="row[col.field] !== null" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'oT - IN'">
                    <q-card v-if="row['oT - IN'] !== null">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'oT - OUT'">
                    <q-card v-if="row['oT - OUT'] !== null">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'late'">
                    <q-card
                      v-if="row.late > 1 && row.late <= 14"
                      style="width: 100%"
                    >
                      <q-card-section
                        class="text-white text-bold text-center bg-yellow-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <q-card v-else-if="row.late > 14" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-red-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'undertime'">
                    <q-card
                      v-if="row.undertime > 1 && row.undertime <= 14"
                      style="width: 100%"
                    >
                      <q-card-section
                        class="text-white text-bold text-center bg-yellow-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <q-card v-else-if="row.undertime > 14" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-red-10"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'otHours'">
                    <q-card v-if="row.otHours > 1" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'holidayPay'">
                    <q-card v-if="row.holidayPay > 1" style="width: 100%">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else-if="col.field === 'workHours'">
                    <q-card v-if="row.workHours !== '-'">
                      <q-card-section
                        class="text-white text-bold text-center bg-green-8"
                        style="line-height: 25%"
                      >
                        {{ row[col.field] }}
                      </q-card-section>
                    </q-card>
                    <div v-else>-</div>
                  </template>
                  <template v-else>
                    {{ row[col.field] }}
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-virtual-scroll>
          <div v-if="DTRDetails.length === 0" class="text-center">
            <q-icon name="warning" style="font-size: 25px" />
            No data available
          </div>
        </template>
        <q-card-section
          v-if="DTRDetails.length > 0"
          class="bg-blue-2 text-left"
        >
          <span class="text-italic">Total work hours this month: </span>
          <span class="text-bold">{{ totalWorkHoursMonth }}</span>
        </q-card-section>
      </q-card> -->
</template>

<script>
import employeeModule from "src/store/modules/employeeModule";
import { mapGetters } from "vuex";

export default {
  props: {
    employeeModule: Boolean,
    employeeNoDtr: Number,
    DTRDetails: Array,
  },

  data() {
    return {
      // DTRDetails: [],
      dtrColumns: [
        {
          name: "EmployeeName",
          label: "Employee Name",
          align: "center",
          field: "name",
          sortable: false,
          width: "80px",
        },
        {
          name: "EmployeeCode",
          label: "Code",
          align: "center",
          field: "code",
          sortable: false,
          width: "80px",
        },
        {
          name: "Day",
          label: "Day",
          align: "center",
          field: "dayOfWeek",
          sortable: false,
          width: "80px",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "transDateFormat",
          sortable: false,
          width: "80px",
        },
        {
          name: "Calendar",
          label: "Calendar",
          align: "center",
          field: "calendar",
          sortable: false,
          width: "100px",
        },
        {
          name: "Schedule",
          label: "Schedule",
          align: "center",
          field: "schedule",
          sortable: false,
          width: "100px",
        },
        {
          name: "IN",
          label: "IN",
          align: "center",
          field: "iN",
          sortable: false,
          width: "80px",
        },
        {
          name: "OUT",
          label: "OUT",
          align: "center",
          field: "oUT",
          sortable: false,
          width: "80px",
        },
        {
          name: "OT IN",
          label: "OT IN",
          align: "center",
          field: "oT - IN",
          sortable: false,
          width: "80px",
        },
        {
          name: "OT OUT",
          label: "OT OUT",
          align: "center",
          field: "oT - OUT",
          sortable: false,
          width: "80px",
        },
        {
          name: "Late",
          label: "Late",
          align: "center",
          field: "late",
          sortable: false,
          width: "80px",
        },
        {
          name: "Undertime",
          label: "Undertime",
          align: "center",
          field: "undertime",
          sortable: false,
          width: "80px",
        },
        {
          name: "Overtime",
          label: "Overtime",
          align: "center",
          field: "otHours",
          sortable: false,
          width: "80px",
        },
        {
          name: "Work Hours",
          label: "Work Hours",
          align: "center",
          field: "workHours",
          sortable: false,
          width: "80px",
        },
      ],
      LeaveTypes: [
        { label: "Vacation Leave", value: "VL" },
        { label: "Sick Leave", value: "SL" },
        { label: "Emergency Leave", value: "EL" },
        { label: "Birthday Leave", value: "BL" },
        { label: "Leave Without Pay", value: "LWOP" },
        { label: "Magna Carta", value: "MC" },
        { label: "Maternity Leave", value: "ML" },
        { label: "Official Leave", value: "OL" },
        { label: "Parental Leave", value: "PARENTL" },
        { label: "Paternity Leave", value: "PL" },
        { label: "Sabbatical Leave", value: "SABL" },
        { label: "Study Leave", value: "STUDL" },
        { label: "Union Leave", value: "UL" },
      ],
      searchTextDetails: "",
      noDtr: "",
      officer: false,
    };
  },

  computed: {
    ...mapGetters({
      dtrDetails: "DTRModule/getdtrdetails",
      position: "user_module/position",
      employeeId: "user_module/employee_id",
    }),

    dynamicDtrColumns() {
      const baseColumnNames = [
        "Day",
        "Date",
        "Calendar",
        "Schedule",
        "IN",
        "OUT",
        "Work Hours",
      ];

      let columns;

      if (this.employeeNoDtr === 1) {
        // Only show base columns
        columns = this.dtrColumns.filter((col) =>
          baseColumnNames.includes(col.name),
        );
      } else {
        // Show all columns
        columns = [...this.dtrColumns];

        // If in employeeModule, remove EmployeeName
        if (this.employeeModule) {
          columns = columns.filter(
            (col) => col.name !== "EmployeeName" && col.name !== "EmployeeCode",
          );
        }
      }

      return columns;
    },

    computedDTRDetails() {
      const dtrArray = this.DTRDetails;
      const query = this.searchTextDetails
        ? this.searchTextDetails.toLocaleLowerCase()
        : "";
      const filteredDetails = dtrArray.filter((row) => {
        return row.name.toString().toLowerCase().includes(query);
      });
      return filteredDetails.map((row) => {
        // const hasMatch = this.noDtrPositionCodes.includes(
        //   this.employeePosition,
        // );
        const schedule = this.employeeNoDtr ? "-" : row.schedule;
        const checkIn = row.iN
          ? row.iN.split(":").map((num) => parseInt(num, 10))
          : null;
        const checkOut = row.oUT
          ? row.oUT.split(":").map((num) => parseInt(num, 10))
          : null;
        let workHours = "-";
        if (checkIn && checkOut) {
          let checkInDecimal =
            parseInt(checkIn[0], 10) + parseInt(checkIn[1], 10) / 60;
          let checkOutDecimal =
            parseInt(checkOut[0], 10) + parseInt(checkOut[1], 10) / 60;
          if (checkOutDecimal < checkInDecimal) {
            checkOutDecimal += 24;
          }

          let totalHours = checkOutDecimal - checkInDecimal;

          const [startTimeStr, endTimeStr] = row.schedule.split(" - ");
          const startTime = new Date("1970-01-01T" + startTimeStr + "Z");
          const endTime = new Date("1970-01-01T" + endTimeStr + "Z");
          let timeDifferenceMs = endTime - startTime;
          let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

          if (totalHours > 0) {
            if (timeDifferenceHours >= 9 && row.isHalfDay === false) {
              totalHours -= 1;
            } else {
              totalHours;
            }
            workHours = totalHours > 0 ? totalHours.toFixed(2) : "-";
          } else {
            workHours = "-";
          }
        } else {
          const [startTimeStr, endTimeStr] = row.schedule.split(" - ");
          const startTime = new Date("1970-01-01T" + startTimeStr + "Z");
          const endTime = new Date("1970-01-01T" + endTimeStr + "Z");
          let timeDifferenceMs = endTime - startTime;
          let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
          const currentDate = new Date();
          const schedToDate = new Date(row.schedTo);
          if (currentDate < schedToDate) {
            const currentDecimal =
              currentDate.getHours() + currentDate.getMinutes() / 60;
            const checkInDecimal = checkIn ? checkIn[0] + checkIn[1] / 60 : 0;
            let hoursDiff = currentDecimal - checkInDecimal;

            if (hoursDiff > 0) {
              if (timeDifferenceHours >= 9 && row.isHalfDay === false) {
                hoursDiff -= 1;
              } else {
                hoursDiff;
              }
              workHours = hoursDiff.toFixed(2);
            } else {
              workHours = hoursDiff.toFixed(2);
            }
          }
        }

        return {
          ...row,
          undertime: row.undertime === 0 ? null : row.undertime,
          late: row.late === 0 ? null : row.late,
          otHours: row.otHours === 0 ? null : row.otHours,
          holidayPay: row.holidayPay === 0 ? null : row.holidayPay,
          schedule:
            row.onLeave === true
              ? "ON LEAVE"
              : row.calendar === "REST DAY"
              ? "REST DAY"
              : row.calendar === "DAY OFF"
              ? "DAY OFF"
              : row.calendar && row.calendar.toUpperCase().includes("HOLIDAY")
              ? "HOLIDAY"
              : schedule,
          calendar:
            row.onLeave === true
              ? this.LeaveTypes.find(
                  (leave) => leave.value === row.leaveType,
                )?.label.toUpperCase()
              : row.absent === true && new Date(row.transDate) < new Date()
              ? "ABSENT"
              : row.calendar,
          workHours: !row.iN && !row.oUT ? "-" : workHours,
        };
      });
    },

    totalWorkHoursMonth() {
      let totalHours = 0;
      this.computedDTRDetails.forEach((row) => {
        if (row.workHours && row.workHours !== "-") {
          totalHours += parseFloat(row.workHours);
        }
      });
      return totalHours.toFixed(2);
    },

    getLeaveTypeLabel(leaveTypeValue) {
      const leaveType = this.LeaveTypes.find(
        (leave) => leave.value === leaveTypeValue,
      );
      return leaveType ? leaveType.label : "";
    },
  },

  methods: {
    clearSearchText() {
      this.searchTextDetails = "";
    },

    async generatePdf(items) {
      const data = await JSON.parse(JSON.stringify(items));
      const headers = this.dynamicDtrColumns
        .map((col) => col.label)
        .filter((label) => label !== "Work Hours");

      if (typeof Worker !== "undefined") {
        if (typeof this.w === "undefined") {
          this.w = new Worker(new URL("../store/worker.js", import.meta.url));
        }
        this.w.postMessage({
          data,
          dtr: true,
          headers: headers,
        });
        this.w.onmessage = (event) => {
          this.$q.loading.hide();
          if (event.data.success) {
            const blob = event.data.result;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Employee_Dtr.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.$q.notify({
              color: "green-8",
              position: "center",
              message:
                "Success Generating Employee DTR, Please do check your download file and do save it.",
              icon: "check",
              iconColor: "white",
              timeout: 1500,
              progress: true,
            });
          } else {
            this.loader = false;
            this.$q.notify({
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
  },
};
</script>

<style>
.containerDtr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.containerDtr.show-scrollbar::-webkit-scrollbar {
  width: 10px; /* Show scrollbar on hover */
}

.q-menu {
  max-height: 300px !important;
  overflow-y: auto !important;
}
</style>
