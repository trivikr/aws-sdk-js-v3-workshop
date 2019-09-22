import busboy from "busboy";
import { s3Client } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3-node/commands/PutObjectCommand";
import { success, failure } from "../response";

const getContentType = event => {
  const contentType = event.headers["content-type"];
  if (!contentType) {
    return event.headers["Content-Type"];
  }
  return contentType;
};

// From https://medium.com/@flpdniel/2183c6a748d1
const parser = event => {
  console.log("INSIDE PROMISE");
  return new Promise((resolve, reject) => {
    const bb = new busboy({
      headers: {
        "content-type": getContentType(event)
      }
    });
    console.log("CREATED");

    const result = {
      file: undefined,
      filename: undefined,
      contentType: undefined
    };

    bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log("FILE RECEIVED");
      file.on("data", data => {
        console.log("FILE DATA POPULATED");
        result.file = data;
      });

      file.on("end", () => {
        console.log("FILE END");
        result.filename = filename;
        result.contentType = mimetype;
      });
    });

    bb.on("field", (fieldname, value) => {
      result[fieldname] = value;
    });

    bb.on("error", error => {
      console.log("ERROR: " + error);
      reject(error);
    });
    bb.on("finish", () => {
      console.log("FINISHED");
      resolve(result);
    });

    bb.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    bb.end();
  });
};

export async function main(event) {
  try {
    console.log("HOLA!");
    console.log(JSON.stringify(event.body));
    const parsed = await parser(event);
    console.log("parsed: " + JSON.stringify(parsed));
    const { file } = JSON.parse(event.body);
    const Key = `${Date.now()}-${file.name}`;
    await s3Client.send(
      new PutObjectCommand({
        Key,
        Body: file,
        Bucket: process.env.bucketName || "",
        ACL: "public-read"
      })
    );
    return success(Key);
  } catch (e) {
    console.log(JSON.stringify(e));
    return failure({ status: false });
  }
}
