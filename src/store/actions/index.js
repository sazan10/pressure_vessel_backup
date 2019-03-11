export {
    clickMenu,
    importModel,
    returnModel,
    loadNext,
    loadPrevious,
    updateNum
} from './navigation';

export {
    auth,
    logout,
    importAuthModel,
    setAuthRedirectPath,
    authCheckState
} from './auth';

export {
    onDataSend,
    onDataSendFail,
    dataUpdate,
    onSubmitAndUpdate,
    axiosDataSend,
    requestReport,
    axiosReport,
    downloadReport,
    requestFail,
    onReportIDReceive
} from './componentData';

// export {
//     requestReport,
//     axiosReport,
//     requestFail,
//     onReportIDReceive
// } from './report';