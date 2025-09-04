<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-blue-10">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="ontoggleLeftDrawer"
        />

        <q-toolbar-title
          @click="redirectToAnnouncements()"
          style="cursor: pointer"
        >
          {{ app_name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer style="position: relative" v-model="leftDrawerOpen" show-if-above>
      <q-btn
        flat
        round
        dense
        size="md"
        icon="close"
        class="drawer-close-btn"
        @click="ontoggleLeftDrawer"
      />

      <div
        class="q-pa-none text-center drawerStyle"
        style="
          position: absolute;
          inset: 10px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: calc(100% - 20px);
        "
      >
        <!-- Avatar Section (Fixed) -->
        <div style="position: sticky; top: 0">
          <q-card-section style="margin: 75px 0">
            <div class="avatar-container">
              <q-avatar size="160px" class="absolute-center">
                <img :src="image_rest_api + employeeID" alt="avatar" />
              </q-avatar>
            </div>
          </q-card-section>

          <div header class="text-center q-pb-lg">
            <span class="text-subtitle2 text-grey-8 q-pa-none">
              {{ employeeID }}
            </span>
            <div class="text-subtitle1 text-bold q-pa-none">
              {{ employeeFullName }}
            </div>
          </div>
        </div>

        <!-- Scrollable Menu Items -->
        <div
          class="drawerScroll q-pa-none"
          style="
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          "
        >
          <q-list style="flex: 1">
            <q-item to="/announcements">
              <q-item-section avatar>
                <q-icon name="message" />
              </q-item-section>
              <q-item-section class="custom-expansion-item">
                <q-item-label>Announcements</q-item-label>
              </q-item-section>
            </q-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="info"
              label="Personnel Information System"
              v-if="hasPISAccess"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in essentialLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              class="custom-expansion-item"
              icon="event_busy"
              label="Leave Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in filterLeaveChildren"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <!-- <q-expansion-item
              class="custom-expansion-item"
              icon="manage_history"
              label="Overtime Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in overtimeManagement"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item> -->

            <q-expansion-item
              class="custom-expansion-item"
              icon="schedule"
              label="DTR Management"
            >
              <q-card class="q-pa-none q-ma-none">
                <q-card-section class="q-pl-md q-pt-none q-pb-none q-pr-none">
                  <EssentialLink
                    v-for="link in DTRLinks"
                    :key="link.title"
                    v-bind="link"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <div class="custom-expansion-item" v-if="facultyAccess">
              <EssentialLink
                v-for="link in facultyLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div
              class="custom-expansion-item"
              v-if="employeeDeptCode === '5040'"
            >
              <EssentialLink
                v-for="link in departmentLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>

            <div class="custom-expansion-item" v-if="dutyRosterAccess">
              <EssentialLink
                v-for="link in dutyRosterLinks"
                :key="link.title"
                v-bind="link"
              />
            </div>
          </q-list>
          <div>
            <q-btn
              style="width: 90%"
              class="bg-negative text-white"
              icon="logout"
              name="logout"
              label="logout"
              @click="onLogout()"
            />
            <div
              style="display: flex; justify-content: center; margin-top: 10px"
            >
              <img
                src="../assets/images/uerm-hospital-logo.png"
                alt="logo"
                style="width: 60%; height: auto; max-height: 100px"
              />
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import helperMethods from "../helperMethods.js";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  computed: {
    hasAllValues() {
      return this.$store.getters["user_module/has_all_values"];
    },
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    employeeFullName() {
      return this.$store.getters["user_module/employee_full_name"];
    },
    employeeDeptCode() {
      return this.$store.getters["user_module/employeeDeptCode"];
    },
    isHR() {
      return this.$store.getters["user_module/is_hr"];
    },
    isPISApprover() {
      return this.$store.getters["user_module/is_pis_approver"];
    },
    isLicense() {
      return this.$store.getters["user_module/is_license"];
    },
    hasWorkExperience() {
      return this.$store.getters["user_module/has_work_experience"];
    },
    hasPISAccess() {
      return this.$store.getters["user_module/has_pis_access"];
    },
    mainLinks() {
      return this.$store.getters["helpers/mainLinks"];
    },
    // DTRLinks() {
    //   const dtrLinks = this.$store.getters["helpers/DTRLinks"];
    //   return dtrLinks.length > 0 ? dtrLinks[0].children : [];
    // },
    DTRLinks() {
      const dtrLinks = this.$store.getters["helpers/DTRLinks"];

      const filteredDtrLinks = dtrLinks[0].children;
      if (!this.employeeLeaveDetailsAccess) {
        return filteredDtrLinks.filter(
          (child) => child.title !== "Employee Search DTR",
        );
      }

      return filteredDtrLinks;
    },
    facultyAccess() {
      return this.$store.getters["user_module/facultyAccess"];
    },
    facultyLinks() {
      const facLinks = this.$store.getters["helpers/facLinks"];
      return facLinks?.[0]?.children ?? [];
    },
    departmentLinks() {
      const deptLinks = this.$store.getters["helpers/departmentHiearchy"];
      return deptLinks?.[0]?.children ?? [];
    },
    dutyRosterLinks() {
      const dutyLinks = this.$store.getters["helpers/dutyRoster"];
      return dutyLinks?.[0]?.children ?? [];
    },
    dutyRosterAccess() {
      return (
        this.$store.getters["user_module/dutyRosterManage"] ||
        this.$store.getters["user_module/dutyRosterCreate"] ||
        this.$store.getters["user_module/dutyRosterView"]
      );
    },
    approverDetailsAccess() {
      return this.$store.getters["user_module/approverDetailsAccess"];
    },
    employeeMangementLinks() {
      const links = this.$store.getters["helpers/employeeManagement"];
      return links?.[0]?.children ?? [];
    },
    overtimeManagement() {
      const links = this.$store.getters["helpers/overtimeManagement"];
      return links?.[0]?.children ?? [];
    },
    // filterLeaveChildren() {
    //   if (this.isLeaveApprover) {
    //     return this.mainLinks[0].children;
    //   } else {
    //     return this.mainLinks[0].children.filter(child => child.title !== 'Leave Authorization' && child.title !== 'Canceled Leave Authorization');
    //   }
    // },

    // filterLeaveChildren() {
    //   let children = this.mainLinks[0].children;

    //   const isApproverDetailsVisible = this.employeeDeptCode === 5040;

    //   if (this.isLeaveApprover) {
    //     return this.employeeLeaveDetailsAccess
    //       ? children.filter((child) =>
    //           [
    //             "My Leaves",
    //             "Leave Authorization",
    //             "Canceled Leave Authorization",
    //             isApproverDetailsVisible ? "Approver Details" : null,
    //             "Employee Leave Details",
    //           ]
    //             .filter(Boolean) // Remove null/undefined values
    //             .includes(child.title),
    //         )
    //       : children.filter((child) =>
    //           [
    //             "My Leaves",
    //             "Leave Authorization",
    //             "Canceled Leave Authorization",
    //             isApproverDetailsVisible ? "Approver Details" : null,
    //           ]
    //             .filter(Boolean) // Remove null/undefined values
    //             .includes(child.title),
    //         );
    //   }

    //   if (this.isPISApprover) {
    //     return children.filter(
    //       (child) =>
    //         child.title !== "Leave Authorization" &&
    //         child.title !== "Canceled Leave Authorization",
    //     );
    //   }

    //   return this.employeeLeaveDetailsAccess
    //     ? children.filter((child) =>
    //         ["My Leaves", isApproverDetailsVisible ? "Approver Details" : null]
    //           .filter(Boolean)
    //           .includes(child.title),
    //       )
    //     : children.filter((child) => child.title === "My Leaves");
    // },

    filterLeaveChildren() {
      let children = this.mainLinks[0].children;
      // const isApproverDetailsVisible = this.employeeDeptCode === "5040";

      let allowedLinks = ["My Leaves"];

      if (this.isLeaveApprover) {
        allowedLinks.push(
          "Leave Authorization",
          "Canceled Leave Authorization",
        );
      }

      if (this.approverDetailsAccess) {
        allowedLinks.push("Approver Details");
      }

      if (this.employeeLeaveDetailsAccess) {
        allowedLinks.push("Employee Leave Details");
      }

      return children.filter((child) => allowedLinks.includes(child.title));
    },

    isLeaveApprover() {
      return this.$store.getters["user_module/is_leave_approver"];
    },

    employeeLeaveDetailsAccess() {
      return this.$store.getters["user_module/employeeLeaveDetailsAccess"];
    },
  },

  data: function () {
    return {
      app_name: process.env.APP_NAME,
      app_version: process.env.APP_VERSION,
      image_rest_api: process.env.IMAGE_REST_API_URL,
      essentialLinks: this.getLinkLists(),
      leftDrawerOpen: false,
    };
  },
  created: function () {
    if (this.isPISApprover === false) {
      this.removeTab("Other Request");
      this.removeTab("Attachment Archive");
      this.removeTab("Export Personal Information");
      this.removeTab("Maintenance");
      this.removeTab("Employee Dependent");
      this.removeTab("Accumulated Discounts Summary");
    }

    // User is not license
    if (this.isLicense === false) {
      this.removeTab("License");
    }

    // Check if there is no previous work experiences
    if (this.hasWorkExperience === false) {
      this.removeTab("Work Experience");
    }
  },
  methods: {
    redirectToAnnouncements: function () {
      // Redirect to the announcements page
      this.$router.push("/announcements");
    },
    redirect: function () {
      helperMethods.redirect("/");
    },
    ontoggleLeftDrawer: function () {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    onLogout: async function () {
      await this.$store.dispatch("user_module/logout", this.employeeID);
      helperMethods.refreshPage();
      localStorage.clear();
    },
    getLinkLists: function () {
      let linksList = [
        {
          title: "Other Request",
          icon: "mail",
          link: "/other-request",
        },
        {
          title: "My Request",
          icon: "notes",
          link: "/my-request",
        },

        {
          title: "Personal Information",
          icon: "person",
          link: "/personal-information",
        },
        {
          title: "Family Background",
          icon: "favorite",
          link: "/family-background",
        },
        {
          title: "Educational Background",
          icon: "school",
          link: "/educational-background",
        },
        {
          title: "Work Experience",
          icon: "work",
          link: "/work-experience",
        },
        {
          title: "License",
          icon: "newspaper",
          link: "/license",
        },
        {
          title: "Training/Seminar",
          icon: "event",
          link: "/training-or-seminar",
        },
        {
          title: "Attachment Archive",
          icon: "upload",
          link: "/attachment-archive",
        },
        {
          title: "Export Personal Information",
          icon: "download",
          link: "/export-personal-information",
        },
        {
          title: "Maintenance",
          icon: "settings",
          link: "/maintenance",
        },
        {
          title: "My Employee Dependent",
          icon: "family_restroom",
          link: "/my-employee-dependent",
        },
        {
          title: "Employee Dependent",
          icon: "account_tree",
          link: "/employee-dependent",
        },
        {
          title: "Accumulated Discounts Summary",
          icon: "summarize",
          link: "/accumulated-discounts-summary",
        },
      ];
      return linksList;
    },

    // DTRLinks: function () {
    //   let DTRList = [
    //     {
    //       title: "Daily Time Record",
    //       icon: "mail",
    //       link: "/other-request",
    //     },
    //     {
    //       title: "Time Adjustment",
    //       icon: "upload",
    //       link: "/attachment-archive",
    //     },
    //   ];
    //   return DTRList;
    // },
    removeTab: function (title) {
      const itemToBeRemoved = { title: title };
      let index = this.essentialLinks.findIndex(
        (x) => x.title === itemToBeRemoved.title,
      );
      this.essentialLinks.splice(index, 1);
    },
  },
});
</script>
