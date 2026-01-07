import axios, { AxiosInstance } from "axios";
import { AnyAction, Dispatch } from "redux";
import { Constants } from "../common/Constants";
import { UserProfile } from "../common/Type";

export default class Api {
    api: AxiosInstance

    constructor(session?: UserProfile, dispatch: Dispatch<AnyAction>) {
        this.api = this.init(session);

    }

    private init(session?: UserProfile) {

        return axios.create({
            baseURL: `${Constants.BASE_URL}/api`,
            headers: {
                Authorization: `Bearer ${session?.token}`,
                'Content-Type': 'multipart/form-data',
                Accept: "application/json"
            },
            // timeout: 2000,
        });
    }

    login(data: FormData) {
        return this.api.post('/settings/login', data);
    }

    forgotPassword(data: FormData) {
        return this.api.post('/settings/forgot-password', data);
    }

    changePassword(data: FormData) {
        return this.api.post('/settings/change-password', data);
    }

    getShipmentData() {
        return this.api.get('/supplychain/shipment-list');
    }

    shipmentStore(data: FormData, prToPr?: boolean) {
        return this.api.post(prToPr ? '/supplychain/shipment-prc-store' : '/supplychain/shipment-store', data);
    }

    shipmentDetails(data: FormData) {
        return this.api.post('/supplychain/shipment-detail-store', data);
    }

    getInspectionData() {
        return this.api.get('/mill-inspections/common');
    }

    sendStep1Data(data: FormData) {
        return this.api.post('/mill-inspections/step1', data);
    }

    uploadInspectionAttachment(data: FormData, onUploadProgress: ((progressEvent: any) => void)) {
        return this.api.post('/mill-inspections/attachments', data, {
            onUploadProgress: onUploadProgress,
        })
    }

    uploadShopAttachment(data: FormData, onUploadProgress: ((progressEvent: any) => void)) {
        return this.api.post('/shop-inspections/attachments', data, {
            onUploadProgress: onUploadProgress,
        })
    }

    sendStep2Data(data: FormData) {
        return this.api.post('/mill-inspections/step2', data);
    }

    getEChallan(data: FormData) {
        return this.api.post('/mill-inspections/echallan', data);
    }

    getShopInspectionData() {
        return this.api.get('/shop-inspections/common');
    }

    sendShopStep1Data(data: FormData) {
        return this.api.post('/shop-inspections/step1', data);
    }

    sendShopStep2Data(data: FormData) {
        return this.api.post('/shop-inspections/step2', data);
    }

    sendDealerStep1Data(data: FormData) {
        return this.api.post('/dealer-inspections/step1', data);
    }

    getDealerInspectionData() {
        return this.api.get('/dealer-inspections/common');
    }

    sendDealerStep2Data(data: FormData) {
        return this.api.post('/dealer-inspections/step2', data);
    }

    getShopEChallan(data: FormData) {
        return this.api.post('/shop-inspections/echallan', data);
    }

    getDealerEChallan(data: FormData) {
        return this.api.post('/dealer-inspections/echallan', data);
    }

    getPSID(data: FormData) {
        return this.api.post(`/get-psid-by-tracking-id`, data);
    }

    getDealerCommonData(isSilent?: boolean) {
        // console.log(`/supplychain/atta-common?background=${isSilent ? "1" : "0"}`);
        return this.api.get(`/supplychain/atta-common?background=${isSilent ? "1" : "0"}`);
        // return this.api.get('/supplychain/atta-common');
    }

    updateLocation(data: FormData) {
        //{latitude, longitude}
        return this.api.post('/supplychain/location-update', data);
    }

    saveShop(data: FormData) {
        return this.api.post('/shop-inspections/save_shop', data);
    }

    saveDealerSell(data: FormData) {
        return this.api.post('/supplychain/citizen-dealer-post', data);
    }

    getDealerSellHistory(userType: string, fromDate?: string, toDate?: string) {
        if (fromDate && toDate && fromDate?.trim() != "" && toDate?.trim() != "") {
            return this.api.get('/supplychain/atta-issued-list/' + userType + '/' + fromDate + '/' + toDate);
        }
        return this.api.get('/supplychain/atta-issued-list/' + userType);
    }

    getPendingStock() {
        return this.api.get('/supplychain/atta-received-list');
    }

    getRecievedStock() {
        return this.api.get('/supplychain/atta-mill-received-list');
    }

    receiveStock(data: FormData) {
        return this.api.post('/supplychain/atta-received-update', data);
    }

    getShopInspectionHistory() {
        return this.api.post('/shop-inspections/user_inspections');
    }

    getMillInspectionHistory() {
        return this.api.post('/mill-inspections/user_inspections');
    }

    getSubcentersList(data: object) {
        return this.api.post('/supplychain/subcenter-list' , data);
    }

    getMillStats(data: FormData) {
        return this.api.post('/mill-inspections/mill_statistics', data);
    }

    getPR_NotificationsList() {
        return this.api.get('/supplychain/pr-notification-list');
    }

    businessSearch(data: FormData) {
        return this.api.post('/hfa-inspections/business_search', data);
    }

    hfaInspectionStep1(data: FormData) {
        return this.api.post('/hfa-inspections/step1', data);
    }

    hfaInspectionStep2(data: FormData) {
        return this.api.post('/hfa-inspections/step2', data);
    }

    hfaInspectionStep3(data: FormData) {
        return this.api.post('/hfa-inspections/step3', data);
    }

    hfaInspectionStep4(data: FormData) {
        return this.api.post('/hfa-inspections/step4', data);
    }

    getHFACommenData() {
        return this.api.get('/hfa-inspections/common');
    }

    sendMobileLabSample(data: FormData) {
        return this.api.post('/hfa-inspections/ml_sample_store', data);
    }

    sendStatisLabSample(data: FormData) {
        return this.api.post('/hfa-inspections/sl_sample_store', data);
    }

    getSlItems(data: FormData) {
        return this.api.post('/hfa-inspections/sl_item_by_category', data);
    }

    addOpeningBags(data: FormData) {
        return this.api.post('/supplychain/add_bisp_bags', data);
    }

    addClosingBags(data: FormData) {
        return this.api.post('/supplychain/bisp_closing_bags', data);
    }

    verifyCitizen(data: FormData) {
        return this.api.post('/supplychain/bisp-verification', data);
    }

    addSellBags(data: FormData) {
        return this.api.post('/supplychain/sell_bisp_bags', data);
    }

    getDistricts(provinceId: string) {
        return this.api.get('/supplychain/district-list/' + provinceId);
    }

    getMillDealers(distrId: string) {
        return this.api.get('/supplychain/mill-dealer-list/' + distrId);
    }

    saveMillStock(data: FormData) {
        return this.api.post('/supplychain/mill_private_stock_save', data);
    }

    saveDealerStock(data: FormData) {
        return this.api.post('/supplychain/dealer_private_stock_save', data);
    }

    addDealerConcilation(data: FormData) {
        return this.api.post('/supplychain/dealer_private_conciliation_save', data);
    }

    addDealerReceiving(data: FormData) {
        return this.api.post('/supplychain/dealer_private_stock_receive_save', data);
    }

    checkpostSummary() {
        return this.api.get('/supplychain/checkpost_summary');
    }

    getDealerAttaActiveList() {
        return this.api.get('/supplychain/dealer_atta_active_list');
    }

    dealerMarkAttaReceive(id: string) {
        return this.api.get('/supplychain/dealer_atta_active_post/' + id);
    }

    getCheckpostWheatActiveList() {
        return this.api.get('/supplychain/checkpost_wheat_active_list');
    }

    getCheckpostAttaActiveList() {
        return this.api.get('/supplychain/checkpost_atta_active_list');
    }

    checkpostMarkWheatReceive(id: string) {
        return this.api.get('/supplychain/checkpost_wheat_track_post/' + id);
    }

    checkpostMarkAttaReceive(id: string) {
        return this.api.get('/supplychain/checkpost_atta_track_post/' + id);
    }
    getInspectionActions() {
        return this.api.get('/shop-inspections/inspection-actions');
    }
    getInspectionPending(id: Number) {
        return this.api.get('/shop-inspections/pending?user_id='+id);
    }
    getShopStats(id: String) {
        return this.api.get('/shop-inspections/history?shop_id='+ id);
    }
    getShopbyCategory(id: String) {
        // console.log('Id', id);
        
        return this.api.get('/shop-inspections/shop-types-wise-shops?shop_type_id='+ id);
    }
    deleteInspection(id: String) {
        // console.log('Id', id);
        
        return this.api.delete('/shop-inspections/delete?inspection_id='+ id);
    }
}
