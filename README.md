# BCIT SSD Industry Project (Standups)

## Team Members

* Dhanji	Armaan
* MacNeil	Liam
* Tumtaweetikul	Cha
* Edgar Zapeka

## Technologies

* ReactJS
* Material-UI
* WebRTC
* AWS Amplify

## Setting up infrastructure resources in AWS

1. Create amazonConfig.json file | We'll need it for our Client application
```javascript
export const API_GATEWAY_NAME = 
export const INPUT_STORAGE = {
    bucket: , 
    region: ,
}
export const OUTPUT_STORAGE = {
    bucket: , 
    region: ,
}

export const YOUR_THUMBNAILS_BUCKET = {
    bucket: , 
    region: ,
}

export const configuration = {
    Auth: {
        identityPoolId: ,
        region: , 
        userPoolId: , 
        userPoolWebClientId: ,
    },
    API: {
        endpoints: [
            {
                name: API_GATEWAY_NAME,
                endpoint: 
            }
        ]
    }
}
```
2. Create UserPool
    1. Save `Pool Id` as `identityPoolId` in `amazonConfig.json`
    1. Set attribute to `Email address or phone number`
    2. Create App Client
    3. Save `App client id` as `userPoolWebClientId` in `amazonConfig.json`
3. Create new identity pool
    1. Set `User Pool ID` and `App client id` for Cognito Authentication Provider
    2. Save `Identity pool ID` as userPoolId in `amazonConfig.json`
4. Create S3 Buckets for input and output videos
    1. Create both buckets and save their names under `INPUT_STORAGE`, `OUTPUT_STORAGE` and `YOUR_THUMBNAILS_BUCKET` with the region accordingly
    2. Set CORS configuration to all buckets

```XML
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
    <ExposeHeader>x-amz-request-id</ExposeHeader>
    <ExposeHeader>x-amz-id-2</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```
5. Setting up Elastic Transcoder
    1. Create `Transcoding Pipeline`
        1. Specify input, output and thumbnails buckets
        2. Under `IAM Role` select `Elastic_Transcoder_Default_Role`
        3. Safe pipeline id

6. Set up IAM policies
    1. Create `UserBucketPolicy` and replace `YOUR_INPUT_BUCKET` & `YOUR_OUTPUT_BUCKET` with the appropriate values 
    ```javascript
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "s3:*"
                ],
                "Resource": [
                    "arn:aws:s3:::YOUR_INPUT_BUCKET/*",
                    "arn:aws:s3:::YOUR_OUTPUT_BUCKET/*",
                    "arn:aws:s3:::YOUR_THUMBNAILS_BUCKET/*"
                ]
            }
        ]
    }
    ```
    2. Create `ElasticTranscoderPolicy`
    ```javascript
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "elastictranscoder:Read*",
                    "elastictranscoder:List*",
                    "elastictranscoder:*Job",
                    "elastictranscoder:*Preset",
                    "s3:List*",
                    "sns:List*"
                ],
                "Resource": "*"
            }
        ]
    }
    ```

6. Set up lambda for video transcoding
    1. Go to Lambda configuration panel
    2. In the panel `Add triggers` select `S3` and configure it to you input bucket
    3. Under `Environment variables` create `PIPELINE_ID` and set it to pipeline id
    4. Under `Execution role` select lambda transcoded role


6. Set up IAM roles
    1. Select Cognito role for Authenticated User and add `UserBucketPolicy` with `ElasticTranscoderPolicy`
    2. Select Elastic Transcoder Default Role and add `ElasticTranscoderPolicy`
    3. Select role for lambda and add `UserBucketPolicy` with `ElasticTranscoderPolicy`

7. Setup labdas and get `endpoint` URL
    1. under root folder run `serverless deploy`
    2. Save endpoint into `amazonConfig.json` file under `endpoint`

8. Setup is complete!
