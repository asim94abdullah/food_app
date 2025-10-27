import { TypeDropdownItem } from "./Type"

export const Routes = {
    Splash: "Splash",
    Login: "Login",
    Home: "Home",
    SendStock: "SendStock",
    ShipmentDetails: "ShipmentDetails",
    VehiclesList: "VehiclesList",
    DriversList: "DriversList",
    MillsInspection: "MillsInspection",
    ShopsInspection: "ShopsInspection",
    HFA_Inspection: "HFA_Inspection",
    Echallan: "Echallan",
    AddShop: "AddShop",
    DealersInspection: "DealersInspection",
    CourtNotice: "CourtNotice",
    DealerSellForm: "DealerSellForm",
    MyInspections: "MyInspections",
    SellHsitory: "SellHsitory",
    PendingStock: "PendingStock",
    RecievedStock: "RecievedStock",
    RecievingForm: "RecievingForm",
    PrNotificationsList: "PrNotificationsList",
    HFAInspection: "HFAInspection",
    AddMobileLabSample: "AddMobileLabSample",
    AddStaticLabSample: "AddStaticLabSample",
    AddBags: "AddBags",
    CloseBalance: "CloseBalance",
    ShopSellForm: "ShopSellForm",
    NIC_Scanner: "NIC_Scanner",
    ScanScreen: "ScanScreen",
    ChangePassword: "ChangePassword",
    ForgotPassword: "ForgotPassword",

    WheatClosing: "WheatClosing",
    AttaClosing: "AttaClosing",
    TrackWheat: "TrackWheat",
    TrackAtta: "TrackAtta",
    AttaReceiving: "AttaReceiving",
    CheckpostSummary: "CheckpostSummary",
    DealerAttaActiveList: "DealerAttaActiveList",
    CheckPostActiveList: "CheckPostActiveList",
    PendingShopList:'PendingShopList',
}

export const Constants = {
    // main liver server
    // BASE_URL: "http://175.107.63.106",

    // test server
    // BASE_URL: "http://175.107.59.78",
    BASE_URL: "http://175.107.59.120",
    // BASE_URL: "https://591af808a208.ngrok-free.app",
}

export const Color = {
    Green: '#56AD4C',
    textDark: '#414141',
    textLight: '#656565',
    Blue: '#014365',
    White: '#fff',
    Orange: '#ff7043',
    Yellow: '#E49335',
    Red: '#DD2F21',
    RedTransparent: '#fde1df',
}

export const InputType = {
    TextField: "Short Text",
    Paragraph: "Paragraph",
    Number: "Number",
    RadioButton: "Radio Buttons",
    Label: "label",
    Title: "title",
    Dropdown: "Dropdown",
    File: "File",
    MultipleItemTxtQtyTxt: "MultipleItemTxtQtyTxt",
    MultipleItemDropDownQtyTxt: "MultipleItemDropDownQtyTxt",
}

export const Fonts = {
    UniNeueBlack: "UniNeue-Trial-Black",
    UniNeueBook: "UniNeue-Trial-Book",
    UniNeueLight: "UniNeue-Trial-Light",
    UniNeueThin: "UniNeue-Trial-Thin",
    UniNeueBlackItalic: "UniNeue-Trial-BlackItalic",
    UniNeueBookItalic: "UniNeue-Trial-BookItalic",
    UniNeueLightItalic: "UniNeue-Trial-LightItalic",
    UniNeueThinItalic: "UniNeue-Trial-ThinItalic",
    UniNeueBold: "UniNeue-Trial-Bold",
    UniNeueHeavy: "UniNeue-Trial-Heavy",
    UniNeueRegular: "UniNeue-Trial-Regular",
    UniNeueBoldItalic: "UniNeue-Trial-BoldItalic",
    UniNeueHeavyItalic: "UniNeue-Trial-HeavyItalic",
    UniNeueRegularItalic: "UniNeue-Trial-RegularItalic",
    Urdu: "Alvi Nastaleeq Regular"
}

export const StatusText=[
    {id:1, title:'Warning'},
    {id:2, title:'Fine'},
    {id:3, title:'Imprison'},
    {id:4, title:'Marasla'},
]

export const DummyItem: TypeDropdownItem[] = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
    { id: "5", title: "Item 5" },
    { id: "6", title: "Item 6" },
    { id: "7", title: "Item 7" },
    { id: "8", title: "Item 8" },
    { id: "9", title: "Item 9" },
]

export const BagsQty: TypeDropdownItem[] = [
    { id: "1", title: "1 Bag" },
    { id: "2", title: "2 Bags" },
    { id: "3", title: "3 Bags" },
    { id: "4", title: "4 Bags" },
    { id: "5", title: "5 Bags" },
]


export const BusinessIdTypes: TypeDropdownItem[] = [
    { id: "licno", title: "License" },
    { id: "application", title: "Application" },
    { id: "cnic", title: "CNIC" },
    { id: "other", title: "Other" },
]

export const UserType = {
    Officer: "officer",
    Contractor: "contractor",
    Dealer: "dealer",
    HFA_Officer: "hfa_officer",
    Shop_Seller: "mobile",
    Checkpost: "checkpost",
}

export const CurrentAppVersion = 251

// Officer: 12
// cotractor: 13

export const userTypes = [
    { id: UserType.Dealer, title: "Atta Dealer" },
    { id: UserType.Officer, title: "Officer" },
    { id: UserType.Contractor, title: "Contractor" },
    { id: UserType.Checkpost, title: "Checkpost" },
]

export const DummyForm = [
    // {
    //     "id": 1,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 3,
    //     "title": "Milling Capacity (24 Hours) Average Actual working hours",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:48:51.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 3,
    //         "title": "Number",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    // {
    //     "id": 5,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 1,
    //     "title": "Indicate the result of inspection of stocks of wheat/wheat products.",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:48:51.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 1,
    //         "title": "Short Text",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    // {
    //     "id": 6,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 1,
    //     "title": "What is the blending ration of wheat purchased from the open market and Provincial Reserve?",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:48:51.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 1,
    //         "title": "Short Text",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    // {
    //     "id": 7,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 1,
    //     "title": "What are the extraction percentage of Atta, FInes & Bran?",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:48:51.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 1,
    //         "title": "Short Text",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    // {
    //     "id": 8,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 2,
    //     "title": "Are the prescribed instructions being strictly followed in respect if (a( blending of wheat of the Handies and (b) filling/stenciling of atta bags. Give details",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:48:51.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 2,
    //         "title": "Paragraph",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:09:55.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    {
        "id": 9,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Was any sample of atta drawn for analysis?",
        "description": null,
        "created_at": "2019-12-03T10:43:53.000000Z",
        "updated_at": "2019-12-03T10:48:51.000000Z",
        "deleted_at": null,
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 10,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Are the premises of the mills including godowns clean & in hygeinic condition?",
        "description": null,
        "created_at": "2019-12-03T10:43:53.000000Z",
        "updated_at": "2019-12-03T10:48:51.000000Z",
        "deleted_at": null,
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 125,
                "data_point_id": 10,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 126,
                "data_point_id": 10,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    // {
    //     "id": 11,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 3,
    //     "title": "Wheat Moisture Level ",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:43:53.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 3,
    //         "title": "Number",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    // {
    //     "id": 12,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 3,
    //     "title": "Flour Moisture Level ",
    //     "description": null,
    //     "created_at": "2019-12-03T10:43:53.000000Z",
    //     "updated_at": "2019-12-03T10:43:53.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 3,
    //         "title": "Number",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:08:48.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // },
    {
        "id": 2,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Is the record being maintained in the Appendix I to III & V as prescribed by the Governement?",
        "description": null,
        "created_at": "2019-12-03T10:49:48.000000Z",
        "updated_at": "2019-12-03T10:49:48.000000Z",
        "deleted_at": null,
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 1,
                "data_point_id": 2,
                "title": "Yes",
                "created_at": "2022-07-17T08:42:31.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 2,
                "data_point_id": 2,
                "title": "No",
                "created_at": "2022-07-17T08:42:38.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 3,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Is the statement in APpendix IV being submitted regularly and on the due dates?",
        "description": null,
        "created_at": "2019-12-03T10:50:58.000000Z",
        "updated_at": "2019-12-03T10:50:58.000000Z",
        "deleted_at": null,
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 3,
                "data_point_id": 3,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 120,
                "data_point_id": 3,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 4,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Are the documents required under West-Pakistan Food grains (Licensing Control) Order, 1956 being maintained properly and statement in Form D submitted regularly to the Licensing Authority?",
        "description": null,
        "created_at": "2019-12-03T10:50:58.000000Z",
        "updated_at": "2019-12-03T10:50:58.000000Z",
        "deleted_at": null,
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 121,
                "data_point_id": 4,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 122,
                "data_point_id": 4,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    // {
    //     "id": 14,
    //     "inspection_type_id": 1,
    //     "data_point_type_id": 2,
    //     "title": "Remarks",
    //     "description": null,
    //     "created_at": "2022-12-03T11:43:53.000000Z",
    //     "updated_at": "2022-12-03T11:43:53.000000Z",
    //     "deleted_at": null,
    //     "type": {
    //         "id": 2,
    //         "title": "Paragraph",
    //         "has_options": "no",
    //         "created_at": "2019-04-14T01:09:55.000000Z",
    //         "updated_at": null,
    //         "deleted_at": null
    //     },
    //     "options": []
    // }
]

export const HfaActionsQuestions = [
    {
        "id": "notice",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Improvement Notice Issued",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
            }
        ],
        expected_value: "yes",
    },
    {
        "id": "notice_desc",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Please describe (Optional)",
        "type": {
            "id": 3,
            "title": "Paragraph",
            "has_options": "no",
        },
    },
    {
        "id": "fir",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "FIR Registered",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ],
        expected_value: "no",
    },
    {
        "id": "discarded",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Discarded/Disposed",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ],
        expected_value: "no",
    },
    {
        "id": "discarded_item[]",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "",
        "type": {
            "id": 3,
            "title": "MultipleItemTxtQtyTxt",
            "has_options": "no",
        },
    },
    {
        "id": "sealed",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Sealing",
        "type": {
            "id": "sealed",
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ],
        expected_value: "no",
    },
    {
        "id": "sealed_desc",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Please describe (Optional)",
        "type": {
            "id": 3,
            "title": "Paragraph",
            "has_options": "no",
        },
    },
    {
        "id": "seazed",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Seizing",
        "type": {
            "id": "seazed",
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ],
        expected_value: "no",
    },
    {
        "id": "seized_item[]",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Please describe (Optional)",
        "type": {
            "id": 3,
            "title": "MultipleItemDropDownQtyTxt",
            "has_options": "no",
        },
    },
    {
        "id": "fined",
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Fine",
        "type": {
            "id": "fined",
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": "yes",
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": "no",
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ],
        expected_value: "no",
    },
    {
        "id": "fine",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Amount",
        "type": {
            "id": 3,
            "title": "Number",
            "has_options": "no",
        },
    },
    {
        "id": "fine_desc",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Please describe (Optional)",
        "type": {
            "id": 3,
            "title": "Paragraph",
            "has_options": "no",
        },
    },
    {
        "id": "attachment_ids",
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "name": "Receipts/Attachments (Optional)",
        "type": {
            "id": 3,
            "title": "File",
            "has_options": "no",
        },
    },
]


export const HFA_Inspection_Questions = [
    {
        "id": 9,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Check list 1 / Personnel",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
            }
        ]
    },
    {
        "id": 10,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Check list 2 / Hygiene Standards",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 11,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Check list 3 / Quality/Halal/Safety Standards",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 12,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Check list 4 / Premises",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 13,
        "inspection_type_id": 1,
        "data_point_type_id": 11,
        "title": "Check list 5 / Other",
        "type": {
            "id": 11,
            "title": "Radio Buttons",
            "has_options": "yes",
            "created_at": "2019-04-14T01:10:06.000000Z",
            "updated_at": null,
            "deleted_at": null
        },
        "options": [
            {
                "id": 123,
                "data_point_id": 9,
                "title": "Yes",
                "created_at": "2022-07-17T08:43:16.000000Z",
                "updated_at": null,
                "deleted_at": null
            },
            {
                "id": 124,
                "data_point_id": 9,
                "title": "No",
                "created_at": "2022-07-17T08:43:32.000000Z",
                "updated_at": null,
                "deleted_at": null
            }
        ]
    },
    {
        "id": 14,
        "inspection_type_id": 1,
        "data_point_type_id": 3,
        "title": "Amount",
        "type": {
            "id": 3,
            "title": "Number",
            "has_options": "no",
        },
    },
]