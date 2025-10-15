import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Constants } from "../../common/Constants";
import { TypeDropdownItem, UserProfile } from "../../common/Type";

interface StoreType {
    user?: UserProfile,
    bardanaTypes: TypeDropdownItem[],
    staticLabCategories: TypeDropdownItem[],
    mobileLabCategories: TypeDropdownItem[],
    mobileLabItems: TypeDropdownItem[],
    mobileLabs: TypeDropdownItem[],
    samplePackingOptions: TypeDropdownItem[],
    stockTotal: number,
    stockIn: number,
    stockOut: number,
    allowedQty: number,
    notifiedQty: number,
    shipedQty: number,
    districtList: TypeDropdownItem[],
    provinceList: TypeDropdownItem[],
}
const initialState: StoreType = {
    user: undefined,
    bardanaTypes: [],
    staticLabCategories: [],
    mobileLabCategories: [],
    mobileLabItems: [],
    mobileLabs: [],
    samplePackingOptions: [],
    stockTotal: 0,
    stockIn: 0,
    stockOut: 0,
    allowedQty: 0,
    notifiedQty: 0,
    shipedQty: 0,
    districtList: [],
    provinceList: [],
}
export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // might not use this method
        saveUser: (state, action: PayloadAction<UserProfile | undefined>) => {
            state.user = action.payload
        },
        setBardanaTypes: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.bardanaTypes = action.payload
        },
        setStockTotal: (state, action: PayloadAction<number>) => {
            state.stockTotal = action.payload
        },
        setStockIn: (state, action: PayloadAction<number>) => {
            state.stockIn = action.payload
        },
        setStockOut: (state, action: PayloadAction<number>) => {
            state.stockOut = action.payload
        },
        setAllowedQty: (state, action: PayloadAction<number>) => {
            state.allowedQty = action.payload
        },
        setNotifiedQty: (state, action: PayloadAction<number>) => {
            state.notifiedQty = action.payload
        },
        setShipedQty: (state, action: PayloadAction<number>) => {
            state.shipedQty = action.payload
        },
        setStaticLabCategories: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.staticLabCategories = action.payload
        },
        setMobileLabCategories: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.mobileLabCategories = action.payload
        },
        setMobileLabItems: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.mobileLabItems = action.payload
        },
        setMobileLabs: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.mobileLabs = action.payload
        },
        setSamplePackingOptions: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.samplePackingOptions = action.payload
        },
        setDistrictsList: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.districtList = action.payload
        },
        setProvinceList: (state, action: PayloadAction<TypeDropdownItem[]>) => {
            state.provinceList = action.payload
        },
        resetDataSlice: (state, action: PayloadAction<undefined>) => {
            state = initialState
        },
    },
})

export const {
    saveUser,
    setBardanaTypes,
    setStockTotal,
    setStockIn,
    setStockOut,
    setAllowedQty,
    setNotifiedQty,
    setShipedQty,
    setStaticLabCategories,
    setMobileLabCategories,
    setMobileLabItems,
    setMobileLabs,
    setSamplePackingOptions,
    setDistrictsList,
    setProvinceList,
    resetDataSlice,
} = dataSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default dataSlice.reducer