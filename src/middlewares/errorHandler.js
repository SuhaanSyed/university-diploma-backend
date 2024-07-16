// middlewares/errorHandler.js
const { MoralisError } = require('@moralisweb3/common-core');

const makeMoralisErrorMessage = (error) => {
    let message = error.message || 'Unknown error';
    const errorResponse = error.details?.response;

    const errorResponseData = typeof errorResponse === 'object' ? error.details?.response.data : null;

    if (errorResponseData) {
        if (errorResponseData && errorResponseData?.message) {
            message = `${errorResponseData?.name ? `${errorResponseData.name}: ` : ''}${errorResponseData.message}`;
        } else if (errorResponseData.error) {
            message = errorResponseData.error;
        }
    }

    return message;
};

exports.errorHandler = (error, req, res, _next) => {
    if (error instanceof MoralisError) {
        const status = typeof error.details?.status === 'number' ? error.details?.status : 500;
        const errorMessage = makeMoralisErrorMessage(error);
        res.status(status).json({ error: errorMessage });
    } else {
        res.status(500).json({ error: error.message });
    }
};
