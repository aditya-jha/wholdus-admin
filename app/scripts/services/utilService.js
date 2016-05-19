(function() {
    "use strict";

    adminapp.factory('UtilService', [
        '$rootScope',
        '$log',
        '$location',
        function($rootScope, $log, $location) {
            var factory = {};

            factory.formatSellerDataToPost = function(data) {
                var seller = {
                    sellerID: data[0].sellerID,
                    name: data[0].formItems.name.value,
                    mobile_number: data[0].formItems.mobile_number.value,
                    mobile_verification: false,
                    alternate_phone_number: data[0].formItems.mobile_number.value,
                    email: data[0].formItems.email.value,
                    email_verification: false,
                    password: data[0].formItems.password.value,
                    company_name: data[1].formItems.company_name.value,
                    company_profile: data[1].formItems.company_profile.value,
                    address: {
                        addressID: data[2].addressID,
                        address: data[2].formItems.address.value,
                        pincode: data[2].formItems.pincode.value,
                        landmark: data[2].formItems.landmark.value,
                        state: data[2].formItems.state.value,
                        city: data[2].formItems.city.value,
                    },
                    details: {
                        detailsID: data[1].detailsID,
                        vat_tin: data[1].formItems.vat_tin.value,
                        tin_verification: false,
                        cst: data[1].formItems.cst.value,
                        pan: data[1].formItems.pan.value,
                        pan_verification: false,
                        name_on_pan: data[1].formItems.name_on_pan.value,
                        dob_on_pan: data[1].formItems.dob_on_pan.value,
                    },
                    bank_details: {
                        bank_detailsID: data[3].bank_detailsID,
                        account_holders_name: data[3].formItems.account_holders_name.value,
                        account_number: data[3].formItems.account_number.value,
                        bank_name: data[3].formItems.bank_name.value,
                        branch: data[3].formItems.branch.value,
                        branch_pincode: data[3].formItems.branch_pincode.value,
                        ifsc: data[3].formItems.ifsc.value,
                        branch_city: data[3].formItems.branch_city.value,
                    }
                };
                return seller;
            };

            factory.assignSellerValues = function(obj, values) {
                if(values.bankdetails) {
                    values.bank_details = values.bankdetails;
                    if(values.bankdetails.length) {
                        values.bank_details[0].bank_detailsID = values.bankdetails[0].bankdetailsID;
                    }
                }
                obj[0].sellerID = values.sellerID;
                obj[2].addressID = values.address[0].addressID;
                obj[1].detailsID = values.details.detailsID;
                obj[3].bank_detailsID = values.bank_details.length ? values.bank_details[0].bank_detailsID : null;

                obj[0].formItems.alternate_phone_number.value = values.alternate_phone_number;
                obj[0].formItems.email.value = values.email;
                obj[0].formItems.name.value = values.name;
                obj[0].formItems.password.value = values.password;
                obj[0].formItems.mobile_number.value = parseInt(values.mobile_number);

                obj[1].formItems.company_name.value = values.company_name;
                obj[1].formItems.company_profile.value = values.company_profile;
                obj[1].formItems.cst.value = values.details.cst;
                obj[1].formItems.dob_on_pan.value = new Date(values.details.dob_on_pan);
                obj[1].formItems.pan.value = values.details.pan;
                obj[1].formItems.name_on_pan.value = values.details.name_on_pan;
                obj[1].formItems.vat_tin.value = values.details.vat_tin;

                obj[2].formItems.address.value = values.address[0].address;
                obj[2].formItems.city.value = values.address[0].city;
                obj[2].formItems.landmark.value = values.address[0].landmark;
                obj[2].formItems.pincode.value = values.address[0].pincode;
                obj[2].formItems.state.value = values.address[0].state;

                obj[3].formItems.account_holders_name.value = values.bank_details.length ? values.bank_details[0].account_holders_name : null;
                obj[3].formItems.account_number.value = values.bank_details.length ? values.bank_details[0].account_number : null;
                obj[3].formItems.branch_city.value = values.bank_details.length ? values.bank_details[0].branch_city : null;
                obj[3].formItems.bank_name.value = values.bank_details.length ? values.bank_details[0].bank_name : null;
                obj[3].formItems.branch.value = values.bank_details.length ? values.bank_details[0].branch : null;
                obj[3].formItems.branch_pincode.value = values.bank_details.length ? values.bank_details[0].branch_pincode : null;
                obj[3].formItems.ifsc.value = values.bank_details.length ? values.bank_details[0].ifsc : null;
            };

            factory.redirectTo = function(to) {
                $location.url(to);
            };

            return factory;
        }
    ]);
})();
