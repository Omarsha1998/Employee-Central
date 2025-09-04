export default {
  SET_HIEARCHY(
    state,
    {
      corporateOfficer1,
      corporateOfficer2,
      division1,
      division2,
      group,
      department,
      section,
      area,
      hierarchyData,
      rawData,
    },
  ) {
    state.rawData = rawData;
    state.hiearchy = hierarchyData;
    state.corporateOfficer1 = corporateOfficer1;
    state.corporateOfficer2 = corporateOfficer2;
    state.division1 = division1;
    state.division2 = division2;
    state.groups = group;
    state.departments = department;
    state.sections = section;
    state.areas = area;
  },

  SET_DEPARTMENTS(state, departments) {
    state.allDepartments = departments;
  },
};
