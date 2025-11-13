import AWS from 'aws-sdk';
import { logger } from '../utils/logger.js';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export const uploadToS3 = async (fileKey, buffer, mimetype) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'private', // or 'public-read' for public files
    };

    const result = await s3.upload(params).promise();
    logger.info(`File uploaded to S3: ${fileKey}`);
    return result;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw error;
  }
};

export const deleteFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };

    await s3.deleteObject(params).promise();
    logger.info(`File deleted from S3: ${fileKey}`);
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw error;
  }
};

export const getS3Url = async (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn,
    };

    const url = s3.getSignedUrl('getObject', params);
    return url;
  } catch (error) {
    logger.error('S3 URL generation error:', error);
    throw error;
  }
};

// Alternative: DigitalOcean Spaces
export const uploadToSpaces = async (fileKey, buffer, mimetype) => {
  try {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
    const s3Spaces = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'private',
    };

    const result = await s3Spaces.upload(params).promise();
    logger.info(`File uploaded to Spaces: ${fileKey}`);
    return result;
  } catch (error) {
    logger.error('Spaces upload error:', error);
    throw error;
  }
};

