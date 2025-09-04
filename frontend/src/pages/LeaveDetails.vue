<template>
  <div>
    <q-layout>
      <q-page-container>
        <div class="containermainn">
          <div class="row" style="width: 95%">
            <!-- Leave Request Form -->
            <div :class="$q.screen.gt.md ? 'col-4 q-pr-lg' : 'col-12'">
              <div>
                <q-card class="filingForm">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Request Form
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <filingForm
                    v-if="!loading"
                    :LeaveTypesOptions="leaveTypes"
                    :hrModule="false"
                    :editView="false"
                    @successFiling="successFiling"
                  />

                  <q-card-section v-else>
                    <SkeletonLoader :formDetails="true" />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Leave Details / Leave Balance -->
            <div :class="$q.screen.gt.md ? 'col-8' : 'col-12'">
              <q-card class="roundedd">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4"></div>
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
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
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
                      <q-icon
                        name="warning"
                        style="font-size: 30px; color: red"
                      />

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
                </template>

                <template v-else>
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Details
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :detailsSkel="true" />
                  </template>

                  <template v-else>
                    <q-input
                      class="col-12"
                      v-model="searchTextBalance"
                      placeholder="Search"
                      dense
                      outlined
                      clearable
                      :class="[$q.screen.name + '-text2']"
                      @clear="clearSearchText"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>

                    <viewDetails
                      :items2="sortedLeaveBalance"
                      :columns2="balancecolumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile="true"
                    />
                    <template> </template>
                    <div
                      v-if="sortedLeaveBalance.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Leave History -->
            <div class="col-12">
              <q-card
                v-show="showLeaveHistory"
                class="roundedd1"
                :class="`card-${$q.screen.name}`"
              >
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Leave History</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          style="font-size: 15px"
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
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>
                  <template v-else>
                    <viewLeaveDetails
                      :itemDetails="LeaveDetailsDirect"
                      :itemApprover="approversDetails"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveTypesOptions="leaveTypes"
                      :searchTextDetails="searchTextDetails"
                      :hrModule="false"
                      :mobileView="false"
                      @emitSuccessEditing="emitSuccessEditing()"
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
                            <template v-if="col.label === 'Actions'">
                              <div
                                v-if="
                                  (row.approvedByLevel1 === 0 &&
                                    row.status === 'PendingLevel2' &&
                                    row.iDCode !== 'TempLeave') ||
                                  (row.status === 'Pending' &&
                                    row.iDCode !== 'TempLeave')
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown bg-grey-3"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="editLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label>Edit Leave</q-item-label>
                                      </q-item-section>
                                    </q-item>
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="cancelLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Cancel Leave</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                    <PrintPDF :entry="row" />
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div
                                v-else-if="
                                  (row.status === 'Approved' &&
                                    row.iDCode !== 'TempLeave') ||
                                  (row.approvedByLevel1 !== null &&
                                    row.status === 'PendingLevel2' &&
                                    row.iDCode !== 'TempLeave')
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown bg-grey-3"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="cancelLeave(row.leaveId)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Cancel Leave</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                    <PrintPDF :entry="row" />
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div
                                v-if="
                                  row.status === 'RejectedByLevel1' ||
                                  row.status === 'RejectedByLevel2'
                                "
                              >
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold bg-grey-3">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="reason(row.reasonForRejection)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Reason of Rejection</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                    <PrintPDF :entry="row" />
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                              <div v-if="row.cancelledStatusOrig !== null">
                                <q-btn-dropdown
                                  push
                                  icon="settings"
                                  class="no-dropdown"
                                  style="width: 40px"
                                >
                                  <q-list class="text-bold bg-grey-3">
                                    <q-item
                                      class="hoverable-item"
                                      clickable
                                      v-close-popup
                                      @click="reasonCancel(row.reasonForCancel)"
                                    >
                                      <q-item-section>
                                        <q-item-label
                                          >Reason of Cancelation</q-item-label
                                        >
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                              </div>
                            </template>
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
                                  style="
                                    display: block;
                                    justify-content: center;
                                  "
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
                                    row.cancelledStatusOrig ===
                                    'RejectedByLevel1'
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
                                    row.cancelledStatusOrig ===
                                    'RejectedByLevel2'
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
                                  style="
                                    display: block;
                                    justify-content: center;
                                  "
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
                    <!-- <div
                      v-if="sortedLeaveDetails.length === 0"
                      class="text-center"
                    >
                      <q-icon
                        name="warning"
                        style="font-size: 30px; color: red"
                      />

                      No data available
                    </div> -->
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave History
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <SkeletonLoader :mobile="true" />
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <viewLeaveDetails
                      :itemDetails="LeaveDetailsDirect"
                      :itemApprover="approversDetails"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :leaveTypesOptions="leaveTypes"
                      :searchTextDetails="searchTextDetails"
                      :hrModule="false"
                      :mobileView="true"
                      @emitSuccessEditing="emitSuccessEditing()"
                    />
                    <!-- <q-table
                      v-if="sortedLeaveDetails.length > 0"
                      grid
                      flat
                      bordered
                      card-class="bg-primary text-white"
                      :rows="sortedLeaveDetails"
                      :columns="leavecolumns"
                      row-key="leaveId"
                      hide-bottom
                      style="max-height: 450px; overflow-y: auto"
                      class="virtual-scroll"
                      :pagination="{ rowsPerPage: 0 }"
                      hide-pagination
                    >
                      <template v-slot:item="props">
                        <div class="q-pa-xs col-12 grid-style-transition">
                          <q-card
                            bordered
                            flat
                            :class="{
                              'bg-blue-1 text-black': props.rowIndex % 2 !== 0,
                            }"
                          >
                            <q-list dense>
                              <q-item
                                v-for="col in props.cols.filter(
                                  (col) => col.name !== 'desc',
                                )"
                                :key="col.name"
                              >
                                <q-item-section>
                                  <q-item-label>{{
                                    col.label + ":"
                                  }}</q-item-label>
                                </q-item-section>
                                <template v-if="col.label === 'Actions'">
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      (props.row.approvedByLevel1 === 0 &&
                                        props.row.status === 'PendingLevel2') ||
                                      props.row.status === 'Pending'
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown bg-grey-3"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="editLeave(props.row.leaveId)"
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Edit Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            cancelLeave(props.row.leaveId)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Cancel Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                        <PrintPDF :entry="row" />

                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-else-if="
                                      props.row.status === 'Approved' ||
                                      (props.row.approvedByLevel1 !== null &&
                                        props.row.approvedByLevel2 === null)
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown bg-grey-3"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            cancelLeave(props.row.leaveId)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Cancel Leave</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                        <PrintPDF :entry="props.row" />

                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      props.row.status === 'RejectedByLevel1' ||
                                      props.row.status === 'RejectedByLevel2'
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold bg-grey-3">
                                        <q-item
                                          class="hoverable-item"
                                          v-if="
                                            props.row.status ===
                                              'RejectedByLevel1' ||
                                            props.row.status ===
                                              'RejectedByLevel2'
                                          "
                                          clickable
                                          v-close-popup
                                          @click="
                                            reason(props.row.reasonForRejection)
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Reason of Rejection</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                        <PrintPDF :entry="props.row" />

                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                  <div
                                    class="q-pt-xs"
                                    v-if="
                                      props.row.cancelledStatusOrig !== null
                                    "
                                  >
                                    <q-btn-dropdown
                                      push
                                      icon="settings"
                                      class="no-dropdown"
                                      style="width: 40px"
                                    >
                                      <q-list class="text-bold bg-grey-3">
                                        <q-item
                                          class="hoverable-item"
                                          clickable
                                          v-close-popup
                                          @click="
                                            reasonCancel(
                                              props.row.reasonForCancel,
                                            )
                                          "
                                        >
                                          <q-item-section>
                                            <q-item-label
                                              >Reason of
                                              Cancellation</q-item-label
                                            >
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-btn-dropdown>
                                  </div>
                                </template>
                                <template v-if="col.name === 'Status'">
                                  <template
                                    v-if="
                                      props.row.status === 'Approved' ||
                                      props.row.status === 'RejectedByLevel1' ||
                                      props.row.status === 'RejectedByLevel2'
                                    "
                                  >
                                    <div class="q-pt-xs">
                                      <template
                                        v-if="
                                          props.row.status === 'Approved' &&
                                          props.row.cancelledStatusOrig === null
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
                                        v-else-if="
                                          props.row.status ===
                                          'RejectedByLevel1'
                                        "
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
                                        v-else-if="
                                          props.row.status ===
                                          'RejectedByLevel2'
                                        "
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
                                    </div>
                                  </template>
                                  <template
                                    v-else-if="
                                      (props.row.status === 'Pending' ||
                                        props.row.status === 'PendingLevel2') &&
                                      props.row.cancelledStatusOrig === null
                                    "
                                  >
                                    <div
                                      style="
                                        display: block;
                                        justify-content: center;
                                      "
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
                                            props.row.status === 'PendingLevel2'
                                          "
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
                                          v-else-if="
                                            props.row.status === 'Pending'
                                          "
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
                                          v-if="
                                            props.row.approvedByLevel2 === null
                                          "
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
                                      props.row.cancelledStatusOrig ===
                                        'Approved' ||
                                      props.row.cancelledStatusOrig ===
                                        'RejectedByLevel1' ||
                                      props.row.cancelledStatusOrig ===
                                        'RejectedByLevel2'
                                    "
                                  >
                                    <template
                                      v-if="
                                        props.row.cancelledStatusOrig ===
                                        'Approved'
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
                                        props.row.cancelledStatusOrig ===
                                        'RejectedByLevel1'
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
                                        props.row.cancelledStatusOrig ===
                                        'RejectedByLevel2'
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
                                      props.row.cancelledStatusOrig ===
                                        'Pending' ||
                                      props.row.cancelledStatusOrig ===
                                        'PendingLevel2'
                                    "
                                  >
                                    <div
                                      style="
                                        display: block;
                                        justify-content: center;
                                      "
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
                                            props.row.cancelledStatusOrig ===
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
                                            props.row.cancelledStatusOrig ===
                                            'Pending'
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
                                          v-if="
                                            props.row.cancelledByLevel2 === null
                                          "
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
                                <template v-else>
                                  <q-item-label
                                    class="text-bold text-black"
                                    caption
                                    style="padding-top: 7px"
                                  >
                                    {{ getFormattedCellValue(props.row, col) }}
                                  </q-item-label>
                                </template>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </template>
                    </q-table>
                    <div
                      v-if="sortedLeaveDetails.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div> -->
                  </template>
                </template>
              </q-card>
            </div>

            <!-- Leave Ledger -->
            <div class="col-12">
              <q-card v-show="!showLeaveHistory" class="roundedd1">
                <template v-if="$q.screen.width > 900">
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    style="height: 70px"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    <div class="row">
                      <div class="col-4 text-left">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-4 text-center">Leave Ledger</div>
                      <div class="col-4 text-right">
                        <q-input
                          class="bg-white"
                          style="font-size: 15px"
                          v-model="searchTextForfeited"
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
                  <q-skeleton v-else :style="{ height: '55px' }" />

                  <template v-if="loading">
                    <!-- Q-Skeleton Loading -->
                    <SkeletonLoader :row-count="10" :column-count="9" />
                  </template>

                  <template v-else>
                    <viewDetails
                      :items="sortedLeaveLedger"
                      :columns="leaveLedgerColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :desktop="true"
                    />
                    <div
                      v-if="sortedLeaveLedger.length === 0"
                      class="text-center"
                    >
                      <q-icon
                        name="warning"
                        style="font-size: 30px; color: red"
                      />

                      No data available
                    </div>
                  </template>
                </template>

                <!-- Q-table for Q-Card responsive -->
                <template v-else>
                  <!-- Q-Skeleton Loading -->
                  <q-card-section
                    v-if="!loading"
                    class="bg-primary text-white text-center"
                    :class="['bold-text', $q.screen.name + '-text']"
                  >
                    Leave Ledger
                  </q-card-section>
                  <q-skeleton v-else :style="{ height: '55px' }" />
                  <template v-if="loading">
                    <SkeletonLoader :mobileApproved="true" />
                  </template>

                  <template v-else>
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <DropdownMenu
                          @show-leave-history="showLeaveHistory = true"
                          @show-leave-ledger="showLeaveHistory = false"
                          @show-leave-approvers="approverDialog = true"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="searchTextDetails"
                          placeholder="Search"
                          dense
                          outlined
                          clearable
                          :class="[$q.screen.name + '-text2']"
                          @clear="clearSearchText"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <viewDetails
                      :items="sortedLeaveLedger"
                      :columns="leaveLedgerColumns"
                      :LeaveTypeLabels="LeaveTypeLabels"
                      :tableMobile2="true"
                    />
                    <div
                      v-if="sortedLeaveLedger.length === 0"
                      class="text-center"
                    >
                      <q-icon name="warning" style="font-size: 25px" />
                      No data available
                    </div>
                  </template>
                </template>
              </q-card>
            </div>
          </div>
        </div>

        <!-- dialong for cancelation -->
        <!-- <q-dialog v-model="cancelDialog">
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
              <div class="text-white text-bold">Reason For Canceling Leave</div>
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
            <q-card-section class="q-pt-xm">
              <q-input
                filled
                v-model="reasonForCancelation"
                placeholder="Type here"
                type="textarea"
              ></q-input>
            </q-card-section>
            <q-card-actions
              style="display: flex; justify-content: right"
              class="q-pr-md"
            >
              <div style="display: flex; justify-content: center; gap: 10px">
                <q-btn
                  class="bg-negative text-white text-subtitle1"
                  push
                  label="cancel"
                  @click="cancelCancelation"
                />
                <q-btn
                  class="bg-primary text-white text-subtitle1"
                  push
                  label="confirm"
                  @click="confirmCancel"
                />
              </div>
            </q-card-actions>
          </q-card>
        </q-dialog> -->

        <!-- Approver Dialog -->
        <q-dialog v-model="approverDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-min-height',
              $q.screen.name + '-min-width',
            ]"
            class="rounded"
          >
            <q-card-section
              class="bg-primary row items-center q-pb-md"
              style="min-width: 400px"
            >
              <div class="bg-primary text-white text-bold">
                Approvers by Level
              </div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-subtitle1">
              <q-table
                flat
                bordered
                :rows="sortedApproversDetails"
                :columns="approversCol"
                row-key="Level"
                hide-bottom
                style="max-height: 400px; overflow-y: auto"
                class="virtual-scroll"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
              >
              </q-table>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Reason Dialog -->
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
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="text-white">Reason for Rejection</div>
              <q-space></q-space>
              <q-btn
                class="bg-white"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>

            <q-card-section class="text-subtitle2">
              {{ this.reasonForRejection }}
            </q-card-section>
          </q-card>
        </q-dialog> -->

        <!-- reason for cancel dialong -->
        <!-- <q-dialog v-model="reasonDialogCancel">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section class="bg-primary row items-center q-pb-md">
              <div class="text-h6 text-white">Reason for Cancellation</div>
              <q-space></q-space>
              <q-btn
                class="bg-grey-3"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>

            <q-card-section class="text-subtitle2">
              {{ this.reasonForCancelation }}
            </q-card-section>
          </q-card>
        </q-dialog> -->

        <!-- Edit / Delete Dialog -->
        <!-- <q-dialog v-model="editDialog">
          <q-card
            :class="[
              'bold-text',
              $q.screen.name + '-text',
              $q.screen.name + '-width',
              $q.screen.name + '-min-height',
            ]"
            class="rounded"
          >
            <q-card-section
              rd-section
              class="bg-primary text-white text-center"
              horizontal:class="['bold-text', $q.screen.name + '-text']"
            >
              Edit Leave Form
            </q-card-section>

            <q-card-section>
              <filingForm
                :LeaveTypesOptions="leaveTypes"
                :editView="true"
                :editLeaveID="editLeaveID"
                @cancelEditEmit="cancelEditEmit"
                @successEditEmit="successEditEmit"
              />
            </q-card-section>
          </q-card>
        </q-dialog> -->

        <q-dialog v-model="reasonDialog">
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
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import helperMethods from "../helperMethods.js";
import DropdownMenu from "../components/DropdownMenuLeaveDetails.vue";
import SkeletonLoader from "../components/loadingSkeleton.vue";
import viewDetails from "../components/viewDetails.vue";
import { mapGetters } from "vuex";
import PrintPDF from "../components/GeneratePDF.vue";
import filingForm from "src/components/filingForm.vue";
import viewLeaveDetails from "src/components/viewLeaveDetails.vue";

let LeaveTypesOptions = [];

const originalOptions = [
  { label: "Google", value: "GL" },
  { label: "Facebook", value: "FB" },
  { label: "Twitter", value: "TW" },
  { label: "Apple", value: "AP" },
  { label: "Oracle", value: "OR" },
];

export default {
  data() {
    return {
      totalVl: "",
      searchTextDetails: "",
      searchTextForfeited: "",
      searchTextBalance: "",
      skeletonAnimations: ["wave", "fade", "fade", "none"],
      approverDialog: false,
      showLeaveHistory: true,
      loadingCounter: null,
      loading: true,
      reasonForCancelation: "",
      cancelId: "",
      cancelDialog: false,
      approversDetails: [],
      approversCol: [
        { name: "Level", label: "Level", align: "center", field: "Level" },
        {
          name: "Approver Name",
          label: "Approver Name",
          align: "center",
          field: "EmployeeName",
          width: "130px",
        },
      ],
      LeaveTypes: LeaveTypesOptions,
      LeaveDetails: [],
      // leavecolumns: [
      //   {
      //     name: "",
      //     label: "Actions",
      //     align: "center",
      //     field: "action",
      //     width: "8px",
      //   },
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
      editDialog: false,
      editLeaveID: null,
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
      leaveLedger: [],
      leaveLedgerColumns: [
        {
          name: "Remarks",
          label: "Remarks",
          align: "center",
          field: "remarks",
          sortable: false,
          width: "300px",
        },
        {
          name: "Leave Type",
          label: "Leave Type",
          align: "center",
          field: "leaveType",
          sortable: false,
          width: "150px",
        },
        {
          name: "Item Type",
          label: "Item Type",
          align: "center",
          field: "iTEMTYPE",
          sortable: false,
          width: "150px",
        },
        {
          name: "Debit",
          label: "Debit",
          align: "center",
          field: "debit",
          sortable: false,
          width: "50px",
        },
        {
          name: "Credit",
          label: "Credit",
          align: "center",
          field: "credit",
          sortable: false,
          width: "50px",
        },
        {
          name: "Year Effectivity",
          label: "Year Effectivity",
          align: "center",
          field: "yearEffectivity",
          sortable: false,
          width: "100px",
        },
        {
          name: "Year Attributed",
          label: "Year Attributed",
          align: "center",
          field: "yearAttributed",
          sortable: false,
          width: "100px",
        },
        {
          name: "Transaction Date",
          label: "Transaction Date",
          align: "center",
          field: "transDate",
          sortable: false,
          width: "100px",
        },
      ],
      reasonDialog: false,
      reasonForRejection: "",
      reasonDialogCancel: false,
      daysExceedsBalance: false,
      model: null,
      options: originalOptions,
      reasonDialog: false,
      reasonForLeave: "",
    };
  },

  components: {
    DropdownMenu,
    SkeletonLoader,
    viewDetails,
    PrintPDF,
    filingForm,
    viewLeaveDetails,
  },

  computed: {
    ...mapGetters({
      leaveTypes: "leaveModule/leaveTypes",
      leaveDetails: "leaveModule/leaveDetails",
      appDetails: "leaveModule/approversDetails",
      leaveBal: "leaveModule/balanceDetails",
      leaveLedgerGetter: "leaveModule/leaveLedgerDetails",
    }),

    LeaveDetailsDirect() {
      return this.$store.state.leaveModule.leaveDetails;
    },

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

      const filteredLeaves = this.leaveBalance.filter(
        (item) => item.leaveType !== "OL" && item.leaveType !== "OBL",
      );

      const sortedBalances = filteredLeaves
        .filter(
          (row) =>
            row.year.toString().toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query),
        )
        .sort((a, b) => {
          const leaveTypeOrder = { VL: 1, SL: 2 };
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

    sortedLeaveDetails() {
      if (Array.isArray(this.LeaveDetails)) {
        const query = this.searchTextDetails.toLowerCase();
        return this.LeaveDetails.filter((row) => {
          return (
            row.leaveId.toString().toLowerCase().includes(query) ||
            this.formatDateTime(row.transDate).toLowerCase().includes(query) ||
            this.LeaveTypeLabels[row.leaveType].toLowerCase().includes(query)
          );
        }).sort((a, b) => b.transDate - a.transDate);
      } else {
        return [];
      }
    },

    sortedLeaveLedger() {
      if (Array.isArray(this.leaveLedger)) {
        const query = this.searchTextForfeited.toLowerCase();
        return this.leaveLedger
          .filter((row) => {
            const remarks = row.remarks
              ? row.remarks.toString().toLowerCase()
              : "";
            const itemType = row.iTEMTYPE
              ? row.iTEMTYPE.toString().toLowerCase()
              : "";
            const leaveTypeLabel =
              this.LeaveTypeLabels[row.leaveType]?.toLowerCase() || "";
            const formattedDate =
              this.formatDateTime(row.transDate)?.toLowerCase() || "";

            return (
              remarks.includes(query) ||
              itemType.includes(query) ||
              leaveTypeLabel.includes(query) ||
              formattedDate.includes(query)
            );
          })
          .sort((a, b) => b.id - a.id);
      } else {
        return [];
      }
    },

    LeaveTypeLabels() {
      return this.leaveTypes.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
      }, {});
    },
  },

  methods: {
    // cancelLeave(leaveId) {
    //   this.cancelDialog = true;
    //   this.cancelId = leaveId;
    // },

    // cancelCancelation() {
    //   this.reasonForRejection = "";
    //   this.cancelDialog = false;
    //   this.cancelId = "";
    // },

    // reasonLeave(reasonForLeave) {
    //   this.reasonDialog = true;
    //   this.reasonForLeave = reasonForLeave;
    // },

    clearSearchText() {
      this.searchTextDetails = "";
      this.searchTextForfeited = "";
      this.searchTextBalance = "";
    },

    // reason(reasonForRejection) {
    //   this.reasonDialog = true;
    //   this.reasonForRejection = reasonForRejection;
    // },

    // reasonCancel(reasonForCancel) {
    //   this.reasonDialogCancel = true;
    //   this.reasonForCancelation = reasonForCancel;
    // },

    // async confirmCancel() {
    //   if (this.reasonForCancelation.length === 0) {
    //     this.$q.notify({
    //       color: "negative",
    //       position: "center",
    //       message: "Input the Required Field (Reason)",
    //       icon: "report_problem",
    //       iconColor: "white",
    //       timeout: 1000,
    //       progress: true,
    //     });
    //     return;
    //   }

    //   this.$q
    //     .dialog({
    //       title: "Warning",
    //       message: "Are you sure you want to cancel your leave?",
    //       cancel: true,
    //       persistent: true,
    //       ok: {
    //         push: true,
    //         color: "primary",
    //         label: "Confirm",
    //         class: "text-subtitle1",
    //       },
    //       cancel: {
    //         push: true,
    //         color: "negative",
    //         label: "Cancel",
    //         class: "text-subtitle1",
    //       },
    //     })
    //     .onOk(async () => {
    //       const cancelData = {
    //         LeaveID: this.cancelId,
    //         reason: this.reasonForCancelation,
    //       };
    //       this.cancelDialog = false;
    //       this.reasonDialogCancel = false;

    //       this.$q.loading.show({
    //         spinner: QSpinnerIos,
    //         message: "Cancelling Leave Request",
    //         messageColor: "primary",
    //         backgroundColor: "grey-1",
    //         spinnerColor: "primary",
    //         customClass: "custom-loading-style",
    //         spinnerSize: "7em",
    //       });

    //       try {
    //         await helperMethods.delay(500);
    //         await this.$store.dispatch("leaveModule/cancelLeave", cancelData);
    //         this.cancelId = "";
    //         await this.fetchLeaves();
    //         this.$q.loading.hide();
    //         this.cancelDialog = false;
    //         this.reasonForCancelation = "";
    //         this.cancelId = "";
    //         this.$q.notify({
    //           color: "green-8",
    //           position: "center",
    //           message: "Success Cancel of Leave Request, Wait For The Approval",
    //           icon: "check",
    //           iconColor: "white",
    //           timeout: 1000,
    //           progress: true,
    //         });
    //         helperMethods.disablePointerEvents(2000);
    //       } catch (error) {
    //         this.cancelId = "";
    //         this.$q.loading.hide();
    //         this.reasonForCancelation = "";
    //         this.cancelDialog = false;
    //         this.$q.notify({
    //           color: "negative",
    //           position: "center",
    //           message: "Error cancel of leave request",
    //           icon: "report_problem",
    //           iconColor: "white",
    //           timeout: 1000,
    //           progress: true,
    //         });
    //       }
    //     })
    //     .onDismiss(() => {});
    // },

    // editLeave(leaveId) {
    //   this.editDialog = true;
    //   this.editLeaveID = leaveId;
    // },

    // cancelEditEmit() {
    //   this.editDialog = false;
    // },

    async successFiling() {
      await this.fetchLeaves();
    },

    async emitSuccessEditing() {
      await this.fetchLeaves();
    },

    async fetchLeaves() {
      await helperMethods.delay(500);
      try {
        await this.$store.dispatch("leaveModule/fetchLeaves");
        this.LeaveDetails = this.leaveDetails;
        // this.LeaveDetails = [...this.$store.state.leaveModule.leaveDetails];
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed getting Leave Details");
      }
    },

    async fetchApprovers() {
      await helperMethods.delay(500);
      try {
        await this.$store.dispatch("leaveModule/fetchApprovers");
        this.approversDetails = this.appDetails;

        console.log(this.approversDetails);
      } catch (error) {
        console.error("Faile getting approvers details");
      }
    },

    async fetchleaveBalance() {
      try {
        await this.$store.dispatch("leaveModule/fetchleaveBalances");
        this.leaveBalance = this.leaveBal;
        let sumVL = 0;
        for (const balance of this.leaveBalance) {
          if (balance.leaveType === "VL") {
            sumVL += balance.remaining;
          }
        }
        this.totalVl = sumVL;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed Getting User Leave Balance");
      }
    },

    async fetchLeaveLedger() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveLedger");
        this.leaveLedger = this.leaveLedgerGetter;
        this.loadingCounter++;
        if (this.loadingCounter === 3) {
          this.loading = false;
        }
      } catch (error) {
        console.error("Failed to get the leave ledger");
      }
    },

    async fetchLeaveTypes() {
      try {
        await this.$store.dispatch("leaveModule/fetchLeaveTypes");
        LeaveTypesOptions = this.leaveTypes;
      } catch (error) {
        console.error("Failed to get the leave types");
      }
    },

    formatDateTime(dateTimeString) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString("en-PH", options);
    },

    formatTimeTo12Hours(Time) {
      return Time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },

    getFormattedCellValue(row, col) {
      if (col.field === "leaveType") {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (
        col.field === "dateLeavedFrom" ||
        col.field === "dateLeavedTo" ||
        col.field === "transDate"
      ) {
        return this.formatDateTime(row[col.field]);
      } else {
        return row[col.field];
      }
    },
  },

  created() {
    this.fetchLeaves();
    this.fetchleaveBalance();
    this.fetchLeaveLedger();
    this.fetchApprovers();
    this.fetchLeaveTypes();
  },
};
</script>

<style>
.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 580px;
  display: flex;
  flex-direction: column;
}

.roundedd1 {
  border-radius: 10px;
  padding-bottom: 10px;
}
</style>
