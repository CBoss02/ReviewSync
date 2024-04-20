const express = require('express');
const {createCompany, getCompanyID, addOrUpdateRoles,
    modifyPendingListAndEditRoles, getEmailsAndRoles, getRoles, addEmployee
} = require("../controllers/companyController");

const router = express.Router();

router.post('/createCompany', createCompany);
router.get('/getCompanyID', getCompanyID);
router.put('/modifyPendingListAndEditRoles', modifyPendingListAndEditRoles);
router.put('/addEmployee', addEmployee);
router.get('/getRoles', getRoles);
router.put('/addOrUpdateRoles', addOrUpdateRoles);
router.get('/getEmailsAndRoles', getEmailsAndRoles);
router.post("/getEmployees", getEmployees);
router.put("/modifyPendingListAndEditRoles", modifyPendingListAndEditRoles);
router.put("/addEmployeeToCompany", addEmployeeToCompany);
router.post("/getRoles", getRoles);
router.put("/addOrUpdateRoles", addOrUpdateRoles);
router.post("/getEmailsAndRoles", getEmailsAndRoles);
router.post("/getEUpdatedFlag", getEUpdatedFlag);
router.put("/resetEUpdatedFlag", resetEUpdatedFlag);
router.post("/getRUpdatedFlag", getRolesUpdatedFlag);
router.put("/resetRUpdatedFlag", resetRolesUpdatedFlag);

module.exports = router;