import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async(file) => {
    try {
        const params = {
          Bucket: "cloudshelfstorage",
          Key: `uploads/${Date.now()}_${file.originalname}`,
          Body: fs.createReadStream(file.path),
          ContentType: file.mimetype, // <- DYNAMIC MIME TYPE
        };

        const result = await s3.send(new PutObjectCommand(params));
        if (result.$metadata.httpStatusCode === 200) {
          const fileURL = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
          console.log("✅ File uploaded at:", fileURL);
          return fileURL;
        }
        else return null;
    } catch (error) {
        console.error("❌ Error uploading:", err);
    }
};

export default uploadToS3;