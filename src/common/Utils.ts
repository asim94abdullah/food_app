import React from "react";
import { AxiosResponse } from "axios"
import { Alert } from "react-native"
import Analytics from 'appcenter-analytics';
import { Constants } from "./Constants";
import { TypeDropdownItem } from "./Type";
import moment from 'moment';
import reactotron from "reactotron-react-native";

export const getDataFrom = (response: AxiosResponse<any, any>) => {
        // console.log('response', JSON.stringify (response));
    const { data } = response
       
    if (data.success) {
        // console.log('data calledddd');
        return data.data
    }
    else {
        return undefined
    }
}
export const getDataFrom1 = (response: AxiosResponse<any, any>) => {
        // console.log('response', JSON.stringify (response));
    const { data } = response
       
    if (data.success) {
        // console.log('data calledddd');
        return data
    }
    else {
        return undefined
    }
}

export const handleError = (error: any, silent?: boolean) => {
    try {
        //  console.log('errorHandle', error.response.data);
        const { data } = error?.response || {}
        // console.log('err-resp', error.response);

        if (!silent) {
            Alert.alert("Error", data?.message || "Network Error, Please try again!")
        }
    } catch (error) {
        if (!silent) {
            Alert.alert("Error", "Unable to process error")
        }
    }
}

export const formatDropdownData = (data: any): TypeDropdownItem[] => Object.entries(data).map(i => { return { id: i[0], title: i[1] } })

export const getCode = (data: any) => {
    //  console.log('Data tracking',data);
     
    return data?.tracking_url
}

export const TrackEvent = (eventName: string, data?: { [name: string]: string; } | undefined) => {
    try {
        Analytics.trackEvent(eventName, data)
    } catch (error) {
        console.log('error', error);
        // Analytics.trackEvent(eventName)
    }
}

export const formatDateForServer = (date: Date) => moment(date).format("YYYY-MM-DD")
export const formatDateTimeForServer = (date: Date) => moment(date).format("YYYY-MM-DD hh:mm:ss a")

export const Log = (...args: any) => {
    __DEV__ && reactotron.log?.(args)
}