(function() {
    "use strict";
    adminapp.factory("ConstantKeyValueService", [
        function() {
            var factory = {
                token: '',
                apiBaseUrl: 'http://api.wholdus.com/',
                apiUrl: {
                    login: 'admin/login',
                    internaluser: 'users/internaluser',
                    users: 'users',
                    buyers: 'users/buyer',
                    buyerInterest: 'users/buyer/buyerinterest',
                    sellers: 'users/seller',
                    orders: 'orders',
                    shipments: 'shipments',
                    buyerproducts: 'buyer/buyerproducts',
                    sellerpayment: 'sellerpayment',
                    buyerpayment: 'buyerpayment',
                    products: 'products',
                    sellerLogin: 'users/seller/login',
                    internalUserLogin: 'users/internaluser/login',
                    buyerLeads:'leads/buyer',
                    contactusLeads:'leads/contactus',
                    sellerLeads:'leads/seller',
                    orderitem:'orderitem',
                    ordershipment:'ordershipment',
                    suborder:'suborder',
                    category: 'category',
                    states: 'address/state',
                    buyerinterest: 'users/buyer/buyerinterest',
                    buyerproduct: 'users/buyer/buyerproducts',
                    buyersharedproduct: '/users/buyer/buyersharedproductid',
                    blogarticle: '/blog/articles'
                },
                accessTokenKey: 'randomData',
                loggedInUserKey: 'loggedInUser',
                sellerSignup: [
                    {
                        label: 'Personal Details',
                        formItems: {
                            name: {
                                label: 'Full Name',
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            email: {
                                label: 'Email ID',
                                type: 'email',
                                required: true,
                                value: ''
                            },
                            mobile_number: {
                                label: 'Mobile No.',
                                type: 'number',
                                required: true,
                                value: ''
                            },
                            alternate_phone_number: {
                                label: 'Alt. Phone No.',
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            password: {
                                label: 'Password',
                                type: 'password',
                                required: true,
                                value: ''
                            }
                        }
                    },
                    {
                        label: 'Company Details',
                        formItems: {
                            company_name: {
                                label: 'Store/Company Name',
                                type: 'text',
                                required: true,
                                value: '',
                            },
                            company_profile: {
                                label: 'Company Profile',
                                type: 'textarea',
                                required: false,
                                value: '',
                            },
                            pan: {
                                label: 'PAN',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            name_on_pan: {
                                label: 'Nam on PAN',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            dob_on_pan: {
                                label: 'DOB on pan',
                                type: 'date',
                                required: false,
                                value: '',
                            },
                            vat_tin: {
                                label: 'VAT / TINs',
                                type: 'text',
                                required: true,
                                value: '',
                            },
                            cst: {
                                label: 'CST',
                                type: 'text',
                                required: false,
                                value: '',
                            }
                        }
                    },
                    {
                        label: 'Pickup Address',
                        formItems: {
                            address: {
                                label: 'Address',
                                type: 'textarea',
                                required: true,
                                value: '',
                            },
                            pincode: {
                                label: 'Pincode',
                                type: 'text',
                                required: true,
                                value: '',
                            },
                            landmark: {
                                label: 'Landmark',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            state: {
                                label: 'State',
                                type: 'text',
                                required: true,
                                value: '',
                            },
                            city: {
                                label: 'City',
                                type: 'text',
                                required: true,
                                value: '',
                            }
                        }
                    },
                    {
                        label: 'Bank Account Details',
                        formItems: {
                            account_holders_name: {
                                label: "Account Holders Name",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            account_number: {
                                label: "Account Number",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            bank_name: {
                                label: "Bank Name",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            branch: {
                                label: "Bank Branch",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            branch_pincode: {
                                label: "branch pincode",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            ifsc: {
                                label: "IFSC",
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            branch_city: {
                                label: "Branch City",
                                type: 'text',
                                required: false,
                                value: ''
                            }
                        }
                    }
                ]
            };

            factory.getSellerSignupFormItems = function() {
                return angular.copy(factory.sellerSignup);
            };

            return factory;
        }
    ]);
})();
