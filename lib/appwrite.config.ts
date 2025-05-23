import * as SDK from 'node-appwrite';

export const {PROJECT_ID,
    API_KEY,
    DATABASE_ID, PATIENT_COLLECTION_ID,DOCTOR_ID,APPOINTMENT_ID,
    NEXT_BUCKET_ID:BUCKETID,NEXT_ENDPOINT:ENDPOINT
} = process.env;

const client = new SDK.Client();

client  
    .setEndpoint(ENDPOINT!) 
    .setProject(PROJECT_ID!) 
    .setKey(API_KEY!); 

export const databases = new SDK.Databases(client);
export const storage = new SDK.Storage(client);
export const users = new SDK.Users(client);
export const Messaging = new SDK.Messaging(client);