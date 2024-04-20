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

module.exports = router;