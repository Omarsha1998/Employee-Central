<template>
  <div>
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <div class="col-12">
              <q-card class="rounded q-mb-xl">
                <q-skeleton v-if="loading" :style="{ height: '65px' }" />
                <q-card-section
                  v-else
                  class="bg-primary text-white text-center"
                  style="height: 70px"
                  :class="['bold-text', $q.screen.name + '-text']"
                >
                  Employee Search Details
                </q-card-section>
                <template v-if="loading">
                  <SkeletonLoader :row-count="1" :column-count="5" />
                </template>
                <q-card-section v-else>
                  <div class="row items-center">
                    <div class="col q-mr-xs">
                      <q-input
                        dense
                        label-color="blue-10"
                        outlined
                        v-model="empId"
                        label="Employee Code"
                      />
                    </div>
                    <div class="col q-mr-xs">
                      <q-input
                        dense
                        label-color="blue-10"
                        outlined
                        v-model="firstName"
                        label="First Name"
                      />
                    </div>
                    <div class="col q-mr-xs">
                      <q-input
                        dense
                        label-color="blue-10"
                        outlined
                        v-model="lastName"
                        label="Last Name"
                      />
                    </div>
                    <div class="col-2 q-mr-xs">
                      <q-select
                        dense
                        outlined
                        v-model="activeValue"
                        use-input
                        input-debounce="0"
                        label="Active"
                        label-color="blue-10"
                        :options="dropValue"
                        behavior="menu"
                        fill-input
                        hide-selected
                      />
                    </div>
                    <q-btn
                      class="bg-primary text-white"
                      icon="search"
                      label="SEARCH"
                      @click="fetchEmpDetails()"
                    ></q-btn>
                  </div>
                </q-card-section>
                <template v-if="loading">
                  <q-card-section class="row items-center">
                    <div class="col-auto q-ml-md">
                      <q-skeleton type="circle" size="150px" />
                    </div>
                    <div class="col q-ml-md">
                      <q-skeleton
                        class="q-mb-xs"
                        type="rect"
                        width="300px"
                        height="30px"
                      />
                      <q-skeleton
                        class="q-mb-xs"
                        type="rect"
                        width="300px"
                        height="30px"
                      />
                      <q-skeleton
                        class="q-mb-xs"
                        type="rect"
                        width="300px"
                        height="30px"
                      />
                      <q-skeleton
                        class="q-mb-xs"
                        type="rect"
                        width="300px"
                        height="30px"
                      />
                    </div>
                  </q-card-section>
                </template>
                <template v-else>
                  <q-card-section
                    v-if="leaveDetails.length > 0 || leaveDetails.length > 0"
                    class="q-pt-md"
                  >
                    <div class="row items-center">
                      <div class="col-auto q-ml-md">
                        <q-avatar size="150px" class="text-left">
                          <img
                            :src="image + this.searchEmployeeId"
                            alt="avatar"
                          />
                        </q-avatar>
                      </div>
                      <div class="col q-ml-md">
                        <div class="row no-wrap q-mb-xs">
                          <div class="text-subtitle2">Employee Name:</div>
                          <div
                            class="text-left text-subtitle2 text-bold q-ml-sm"
                          >
                            {{ this.fullName }}
                          </div>
                        </div>
                        <div class="row no-wrap q-mb-xs">
                          <div class="text-subtitle2">Employee ID:</div>
                          <div
                            class="text-left text-subtitle2 text-bold q-ml-sm"
                          >
                            {{ this.searchEmployeeId }}
                          </div>
                        </div>
                        <div class="row no-wrap q-mb-xs">
                          <div class="text-subtitle2">Position:</div>
                          <div
                            class="text-left text-subtitle2 text-bold q-ml-sm"
                          >
                            {{ this.position }}
                          </div>
                        </div>
                        <div class="row no-wrap">
                          <div class="text-subtitle2">Department:</div>
                          <div
                            class="text-left text-subtitle2 text-bold q-ml-sm"
                          >
                            {{ this.deptDescription }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </template>
              </q-card>

              <q-card v-if="showLeaveDetails" class="rounded">
                <q-skeleton v-if="loading" :style="{ height: '65px' }" />
                <q-card-section
                  v-else
                  class="bg-primary text-white"
                  style="height: 70px"
                  :class="['bold-text', $q.screen.name + '-text']"
                >
                  <div class="row">
                    <div class="col-4">
                      <dropdown1
                        @leave-details="
                          handleApprove('leaveDetails', leaveBalance)
                        "
                        @pending-leave="
                          handleApprove('pendingLeave', leaveDetails)
                        "
                        :empDetails="true"
                        :sortedApproversDetails="sortedApproversDetails"
                      />
                    </div>
                    <div class="col-4 text-center">Leave Details</div>
                    <div class="col-4 text-right">
                      <q-input
                        class="bg-white"
                        v-model="searchTextBalance"
                        placeholder="Search"
                        dense
                        outlined
                        clearable
                        :style="{ width: '200px', marginLeft: 'auto' }"
                        :class="[$q.screen.name + '-text2']"
                        @clear="clearSearchText"
                      />
                    </div>
                  </div>
                </q-card-section>
                <template v-if="loading">
                  <SkeletonLoader :row-count="10" :column-count="3" />
                </template>
                <template v-else>
                  <viewDetails
                    :items="sortedLeaveBalance"
                    :columns="balancecolumns"
                    :LeaveTypeLabels="LeaveTypeLabels"
                    :desktop="true"
                  />
                  <div
                    v-if="sortedLeaveBalance.length === 0"
                    class="text-center"
                  >
                    <q-icon name="warning" style="font-size: 30px" />
                    No data available
                  </div>
                  <div style="flex: 1"></div>
                  <q-card-section
                    v-if="sortedLeaveBalance.length > 0"
                    class="bg-blue-2 text-left"
                  >
                    <span class="text-italic"
                      >Total Vacation Leave Remaining:
                    </span>
                    <span class="text-bold">{{ totalVl }}</span>
                  </q-card-section>
                </template>
              </q-card>

              <q-card v-if="showPendingDetails" class="rounded">
                <q-skeleton v-if="loading" :style="{ height: '65px' }" />
                <q-card-section
                  v-else
                  class="bg-primary text-white"
                  style="height: 70px"
                  :class="['bold-text', $q.screen.name + '-text']"
                >
                  <div class="row">
                    <div class="col-4">
                      <dropdown1
                        @leave-details="
                          handleApprove('leaveDetails', leaveBalance)
                        "
                        @pending-leave="
                          handleApprove('pendingLeave', leaveDetails)
                        "
                        :empDetails="true"
                        :sortedApproversDetails="sortedApproversDetails"
                      />
                    </div>
                    <div class="col-4 text-center">Filed Leaves</div>
                    <div class="col-4 text-right">
                      <q-input
                        class="bg-white"
                        v-model="searchTextDetails"
                        placeholder="Search"
                        dense
                        outlined
                        clearable
                        :style="{ width: '200px', marginLeft: 'auto' }"
                        :class="[$q.screen.name + '-text2']"
                        @clear="clearSearchText"
                      />
                    </div>
                  </div>
                </q-card-section>
                <template v-if="loading">
                  <SkeletonLoader :row-count="10" :column-count="3" />
                </template>
                <template v-else>
                  <viewLeaveDetails
                    :itemDetails="leaveDetails"
                    :itemApprover="approversDetails"
                    :LeaveTypeLabels="LeaveTypeLabels"
                    :searchTextDetails="searchTextDetails"
                    :hrModule="true"
                    :mobileView="false"
                    @emitSuccessEditing="fetchEmpDetails"
                  />
                  <!-- <q-virtual-scroll
                    class="virtual-scroll"
                    type="table"
                    style="max-height: 450px"
                    :virtual-scroll-item-size="48"
                    :virtual-scroll-sticky-size-start="48"
                    :virtual-scroll-sticky-size-end="32"
                    :items="sortedLeaveDetails"
                  >
                    <template v-slot:before>
                      <thead class="sticky-thead">
                        <tr>
                          <th v-for="col in leavecolumns" :key="col.name">
                            {{ col.name }}
                          </th>
                        </tr>
                      </thead>
                    </template>

                    <template v-slot="{ item: row, leaveId }">
                      <q-tr :key="leaveId">
                        <q-td
                          v-for="col in leavecolumns"
                          :key="col.leaveId"
                          class="text-center"
                          :style="{ width: col.width }"
                        >
                          {{ getFormattedCellValue(row, col) }}
                          <template v-if="col.name === 'Reason'">
                            <q-btn
                              push
                              @click="reasonLeave(row.reasonForLeave)"
                              icon="article"
                              color="primary"
                              style="width: 50%"
                            />
                          </template>
                          <template v-if="col.name === 'Status'">
                            <template
                              v-if="
                                row.status === 'Approved' ||
                                row.status === 'RejectedByLevel1' ||
                                row.status === 'RejectedByLevel2'
                              "
                            >
                              <template
                                v-if="
                                  row.status === 'Approved' &&
                                  row.cancelledStatusOrig === null
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-green-8 text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    LEAVE APPROVED
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-else-if="row.status === 'RejectedByLevel1'"
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    REJECTED BY LEVEL 1
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-else-if="row.status === 'RejectedByLevel2'"
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    REJECTED BY LEVEL 2
                                  </q-card-section>
                                </q-card>
                              </template>
                            </template>
                            <template
                              v-else-if="
                                (row.status === 'Pending' ||
                                  row.status === 'PendingLevel2') &&
                                row.cancelledStatusOrig === null
                              "
                            >
                              <div
                                style="display: block; justify-content: center"
                              >
                                <div
                                  class="q-pb-xs"
                                  v-if="
                                    approversDetails &&
                                    approversDetails.some(
                                      (item) => item.lvl === 1,
                                    )
                                  "
                                >
                                  <template
                                    v-if="row.status === 'PendingLevel2'"
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-green-8 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        LEVEL 1 APPROVED
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                  <template
                                    v-else-if="row.status === 'Pending'"
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-yellow-10 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        PENDING LEVEL 1
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                </div>
                                <div
                                  class="q-pb-xs"
                                  v-if="
                                    approversDetails &&
                                    approversDetails.some(
                                      (item) => item.lvl === 2,
                                    )
                                  "
                                >
                                  <template
                                    v-if="row.approvedByLevel2 === null"
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-yellow-10 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        PENDING LEVEL 2
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                </div>
                              </div>
                            </template>
                            <template
                              v-if="
                                row.iDCode === 'TempLeave' &&
                                row.status === 'CANCELLED'
                              "
                            >
                              <q-card style="width: 100%">
                                <q-card-section
                                  class="bg-negative text-white text-bold text-center"
                                  style="line-height: 25%"
                                >
                                  CANCELED APPROVED
                                </q-card-section>
                              </q-card>
                            </template>
                            <template
                              v-if="
                                row.cancelledStatusOrig === 'Approved' ||
                                row.cancelledStatusOrig ===
                                  'RejectedByLevel1' ||
                                row.cancelledStatusOrig === 'RejectedByLevel2'
                              "
                            >
                              <template
                                v-if="
                                  (row.cancelledStatusOrig === 'Approved' &&
                                    row.approvedByLevel1 !== null &&
                                    row.approvedByLevel2 === null) ||
                                  (row.cancelledStatusOrig === 'Approved' &&
                                    row.approvedByLevel1 === null &&
                                    row.approvedByLevel2 === null)
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    CANCELED
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-if="
                                  row.cancelledStatusOrig === 'Approved' &&
                                  row.approvedByLevel1 !== null &&
                                  row.approvedByLevel2 !== null
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    CANCELED APPROVED
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-else-if="
                                  row.cancelledStatusOrig === 'RejectedByLevel1'
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    CANCEL REJECTED BY LEVEL 1
                                  </q-card-section>
                                </q-card>
                              </template>
                              <template
                                v-else-if="
                                  row.cancelledStatusOrig === 'RejectedByLevel2'
                                "
                              >
                                <q-card style="width: 100%">
                                  <q-card-section
                                    class="bg-negative text-white text-bold text-center"
                                    style="line-height: 25%"
                                  >
                                    CANCEL REJECTED BY LEVEL 2
                                  </q-card-section>
                                </q-card>
                              </template>
                            </template>
                            <template
                              v-else-if="
                                row.cancelledStatusOrig === 'Pending' ||
                                row.cancelledStatusOrig === 'PendingLevel2'
                              "
                            >
                              <div
                                style="display: block; justify-content: center"
                              >
                                <div
                                  class="q-pb-xs"
                                  v-if="
                                    approversDetails &&
                                    approversDetails.some(
                                      (item) => item.lvl === 1,
                                    )
                                  "
                                >
                                  <template
                                    v-if="
                                      row.cancelledStatusOrig ===
                                      'PendingLevel2'
                                    "
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-green-8 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        LEVEL 1 CANCEL APPROVED
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                  <template
                                    v-else-if="
                                      row.cancelledStatusOrig === 'Pending'
                                    "
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-yellow-10 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        PENDING CANCEL LEVEL 1
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                </div>
                                <div
                                  class="q-pb-xs"
                                  v-if="
                                    approversDetails &&
                                    approversDetails.some(
                                      (item) => item.lvl === 2,
                                    )
                                  "
                                >
                                  <template
                                    v-if="row.cancelledByLevel2 === null"
                                  >
                                    <q-card style="width: 100%">
                                      <q-card-section
                                        class="bg-yellow-10 text-white text-bold text-center"
                                        style="line-height: 25%"
                                      >
                                        PENDING CANCEL LEVEL 2
                                      </q-card-section>
                                    </q-card>
                                  </template>
                                </div>
                              </div>
                            </template>
                          </template>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-virtual-scroll> -->
                </template>
                <!-- <q-card-section
                  v-if="sortedLeaveDetails.length > 0"
                  class="text-right q-mt-xs"
                >
                  <q-btn
                    class="bg-primary text-white"
                    push
                    label="Submit Manual Leave"
                    @click="manual = true"
                  />
                </q-card-section>

                <div v-if="sortedLeaveDetails.length === 0" class="text-center">
                  <q-icon name="warning" style="font-size: 30px" />
                  No data available
                </div> -->
                <q-card-section class="text-right q-mt-xs">
                  <q-btn
                    class="bg-primary text-white"
                    push
                    label="Submit Manual Leave"
                    @click="manual = true"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- <q-dialog v-model="reasonDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-h6 text-white text-bold">
                Leave Request Reason
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="q-pt-xm text-justify text-subtitle1">
              {{ reasonForLeave }}
            </q-card-section>
          </q-card>
        </q-dialog> -->

        <q-dialog v-model="manual">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-sm">
              <div class="text-h6 text-white text-bold">Leave Request Form</div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                padding="xs"
                @click="manual = false"
              ></q-btn>
            </q-card-section>
            <q-card-section
              class="q-pa-none q-pt-xm text-justify text-subtitle1"
            >
              <filingForm
                :LeaveTypesOptions="leaveTypes"
                :employeeCode="searchEmployeeId"
                :hrModule="true"
                @success-filing="successFiling"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helperMethods from "../helperMethods.js";
import viewDetails from "../components/viewDetails.vue";
import dropdown1 from "../components/DropdownMenuLeaveOps1.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import filingForm from "src/components/filingForm.vue";
import viewLeaveDetails from "src/components/viewLeaveDetails.vue";

export default {
  data() {
    return {
      totalVl: "",
      loading: true,
      loadingCounter: null,
      searchEmployeeId: "",
      searchEmployeeId: "",
      deptDescription: "",
      position: "",
      image: process.env.IMAGE_REST_API_URL,
      showLeaveDetails: true,
      showPendingDetails: false,
      dropValue: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
      empId: null,
      firstName: null,
      lastName: null,
      leaveDetails: [],
      // leavecolumns: [
      //   {
      //     name: "Created",
      //     label: "Created",
      //     align: "center",
      //     field: "transDate",
      //     width: "130px",
      //   },
      //   {
      //     name: "Days",
      //     label: "Days",
      //     align: "center",
      //     field: "daysOfLeave",
      //     sortable: false,
      //     width: "90px",
      //   },
      //   {
      //     name: "Time From",
      //     label: "Time From",
      //     align: "center",
      //     field: "timeFrom",
      //     sortable: false,
      //     width: "118px",
      //   },
      //   {
      //     name: "Time To",
      //     label: "Time To",
      //     align: "center",
      //     field: "timeTo",
      //     sortable: false,
      //     width: "118px",
      //   },
      //   {
      //     name: "Date From",
      //     label: "Date From",
      //     align: "center",
      //     field: "dateLeavedFrom",
      //     sortable: false,
      //     width: "138px",
      //   },
      //   {
      //     name: "Date To",
      //     label: "Date To",
      //     align: "center",
      //     field: "dateLeavedTo",
      //     sortable: false,
      //     width: "138px",
      //   },
      //   {
      //     name: "Leave Type",
      //     label: "Leave Type",
      //     align: "center",
      //     field: "leaveType",
      //     sortable: false,
      //     width: "150px",
      //   },
      //   {
      //     name: "Reason",
      //     label: "Reason",
      //     align: "left",
      //     sortable: false,
      //     width: "80px",
      //   },
      //   {
      //     name: "Status",
      //     label: "Status",
      //     align: "center",
      //     field: "Status",
      //     sortable: false,
      //     width: "110px",
      //   },
      // ],
      leaveBalance: [],
      balancecolumns: [
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
        },
        {
          name: "Year",
          label: "Year",
          align: "center",
          field: "year",
          sortable: false,
        },
        {
          name: "Balance",
          label: "Balance",
          align: "center",
          field: "remaining",
          sortable: false,
        },
      ],
      activeValue: { label: "Yes", value: 1 },
      searchTextBalance: "",
      searchTextDetails: "",

      // reasonDialog: false,
      // reasonForLeave: "",
      approversDetails: [],
      manual: false,
    };
  },

  components: {
    viewDetails,
    dropdown1,
    SkeletonLoader,
    filingForm,
    viewLeaveDetails,
  },

  computed: {
    ...mapGetters({
      empDetails: "leaveModule/empDetails",
      leaveTypes: "leaveModule/leaveTypes",
      appDetails: "leaveModule/approversDetails",
    }),

    sortedApproversDetails() {
      if (!this.approversDetails || this.approversDetails.length === 0) {
        return [];
      }

      const mappedDetails = this.approversDetails.map((row) => ({
        ...row,
        EmployeeName: `${row.firstName} ${row.middleInitial}. ${row.lastName}`,
        Level: `${row.lvl}`,
      }));

      const groupedByLevel = mappedDetails.reduce((acc, curr) => {
        const { Level, EmployeeName, ...rest } = curr;
        if (!acc[Level]) {
          acc[Level] = { ...rest, Level, EmployeeName };
        } else {
          acc[Level].EmployeeName += `, ${EmployeeName}`;
        }
        return acc;
      }, {});

      return Object.values(groupedByLevel);
    },

    sortedLeaveBalance() {
      if (!Array.isArray(this.leaveBalance)) {
        return [];
      }

      const query = this.searchTextBalance.toLowerCase();

      const sortedBalances = this.leaveBalance
        .filter(
          (row) =>
            row.year.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query),
        )
        .sort((a, b) => {
          const leaveTypeOrder = { VL: 1, SL: 2 };
          // Get the order of leave types
          const orderA = leaveTypeOrder[a.leaveType] || 3;
          const orderB = leaveTypeOrder[b.leaveType] || 3;
          if (orderA === orderB) {
            return b.year - a.year;
          }
          return orderA - orderB;
        });

      return sortedBalances.map((row) => ({
        ...row,
        remaining: Number.isInteger(row.remaining)
          ? row.remaining
          : row.remaining.toFixed(2),
      }));
    },

    // sortedLeaveDetails() {
    //   if (Array.isArray(this.leaveDetails)) {
    //     const query = this.searchTextDetails.toLowerCase();
    //     return this.leaveDetails
    //       .filter((row) => {
    //         return (
    //           row.leaveId.toString().toLowerCase().includes(query) ||
    //           this.formatDateTime(row.transDate)
    //             .toLowerCase()
    //             .includes(query) ||
    //           this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
    //         );
    //       })
    //       .map((row) => ({
    //         ...row,
    //         transDate: row.transDate.split("T")[0].replace(/-/g, "/"),
    //       }))
    //       .sort((a, b) => b.leaveId - a.leaveId);
    //   } else {
    //     return [];
    //   }
    // },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },

  methods: {
    async fetchApprovers() {
      const data = {
        employeeId: this.empId,
      };
      try {
        await this.$store.dispatch("leaveModule/fetchApprovers", data);
        this.approversDetails = this.appDetails;
      } catch (error) {
        console.error("Faile getting approvers details");
      }
    },

    // reasonLeave(reasonForLeave) {
    //   this.reasonDialog = true;
    //   this.reasonForLeave = reasonForLeave;
    // },
    async fetchEmpDetails() {
      if (
        this.empId === null &&
        this.firstName === null &&
        this.lastName === null
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Input the Required Field",
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }

      await this.fetchApprovers();

      const dataSelect = {
        activeStatus: this.activeValue ? this.activeValue.value : null,
        employeeId: this.empId,
        firstName: this.firstName,
        lastName: this.lastName,
      };
      try {
        this.loading = true;
        await helperMethods.delay(500);
        helperMethods.disablePointerEvents(2000);
        await this.$store.dispatch("leaveModule/fetchEmpDetails", dataSelect);
        this.leaveDetails = this.empDetails.leaveDetails;
        this.leaveBalance = this.empDetails.leaveLedgerDetails;
        let sumVL = 0;
        for (const balance of this.leaveBalance) {
          if (balance.leaveType === "VL") {
            sumVL += balance.remaining;
          }
        }
        this.totalVl = sumVL;

        this.searchEmployeeId =
          this.empDetails.leaveLedgerDetails[0]?.employeeCode ??
          this.empDetails.leaveDetails[0]?.iDCode;
        this.fullName =
          this.empDetails.leaveLedgerDetails[0]?.fullName ??
          this.empDetails.leaveDetails[0]?.fullName;
        this.position =
          this.empDetails.leaveLedgerDetails[0]?.position ??
          this.empDetails.leaveDetails[0]?.position;
        this.deptDescription =
          this.empDetails.leaveLedgerDetails[0]?.deptDescr ??
          this.empDetails.leaveDetails[0]?.dESCRIPTION;

        this.loadingCounter++;
        if (this.loadingCounter === 2) {
          this.loading = false;
          this.loadingCounter--;
        }
        helperMethods.enablePointerEvents();
      } catch (error) {
        console.error(error, "ERROR");
      }
    },

    async fetchLeaveTypes() {
      try {
        await helperMethods.delay(500);
        await this.$store.dispatch("leaveModule/fetchLeaveTypes");
        this.loadingCounter++;
        if (this.loadingCounter === 1) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get the leave types");
      }
    },

    handleApprove(cardType, dataList) {
      this.showLeaveDetails = cardType === "leaveDetails";
      this.showPendingDetails = cardType === "pendingLeave";

      localStorage.setItem("showLeaveDetails", cardType === "headApprove");
      localStorage.setItem("showPendingDetails", cardType === "supervisor");
    },

    clearSearchText() {
      this.searchTextDetails = "";
      this.searchTextForfeited = "";
      this.searchTextBalance = "";
    },

    // getFormattedCellValue(row, col) {
    //   if (col.field === "leaveType") {
    //     return this.LeaveTypeLabels[row[col.field]];
    //   } else if (
    //     col.field === "dateLeavedFrom" ||
    //     col.field === "dateLeavedTo" ||
    //     col.field === "transDate"
    //   ) {
    //     return this.formatDateTime(row[col.field]);
    //   } else if (col.field === "tIME_FROM" || col.field === "tIME_TO") {
    //     return this.formatTimeTo12Hours(row[col.field]);
    //   } else {
    //     return row[col.field];
    //   }
    // },

    formatTimeTo12Hours(Time) {
      return Time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        timeZone: "Asia/Manila",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    async successFiling() {
      await this.fetchEmpDetails();
    },

    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.fetchEmpDetails();
      }
    },
  },

  created() {
    this.fetchLeaveTypes();
  },

  mounted() {
    document.addEventListener("keydown", this.handleEnterKey);
  },

  beforeMount() {
    document.removeEventListener("keydown", this.handleEnterKey);
  },
};
</script>

<style>
.rounded {
  border-radius: 10px;
  margin-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  max-height: 580px;
  display: flex;
  flex-direction: column;
}
</style>
