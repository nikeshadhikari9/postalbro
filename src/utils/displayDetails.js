import logger from "./logger.js";
export default async (apis) => {

    try {

        let count = 1;
        for (const api of apis) {
            logger.info(`🔹 API ${count}/${apis.length}`);
            logger.info(`   ▶ ID   : ${api.id}`);
            logger.info(`   ▶ Method   : ${api.method.toUpperCase()}`);
            logger.info(`   ▶ URL      : ${api.url}`);

            if (api.query && Object.keys(api.query).length > 0) {
                logger.info(`   ▶ Query Params: ${JSON.stringify(api.query, null, 2)}`);
            }

            if (api.header && Object.keys(api.header).length > 0) {
                logger.info(`   ▶ Headers: ${JSON.stringify(api.header, null, 2)}`);
            }

            if (api.data && Object.keys(api.data).length > 0) {
                logger.info(`   ▶ Data: ${JSON.stringify(api.data, null, 2)}`);
            }

            if (api.file && api.file.length > 0) {
                logger.info(`   ▶ Files:`);
                api.file.flat().forEach((fileObj, idx) => {
                    logger.info(`      • File ${idx + 1}`);
                    logger.info(`        - Filename : ${fileObj.filename}`);
                    logger.info(`        - Path     : ${fileObj.filePath}`);
                });
            }

            logger.info("------------------------------------------------------------------------\n");
            count++;
        }
    } catch (error) {
        logger.error("An error occurred while displaying details of API(s):", e);
        process.exit(1);
    }
}