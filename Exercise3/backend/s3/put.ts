import { busboy } from "busboy";
import { s3Client } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3-node/commands/PutObjectCommand";
import { success, failure } from "../response";

// From https://stackoverflow.com/a/47431526
const parseForm = (body, headers) =>
  new Promise((resolve, reject) => {
    const contentType = headers["Content-Type"] || headers["content-type"];
    const bb = new busboy({ headers: { "content-type": contentType } });

    var data = {};

    bb.on("field", (fieldname, val) => {
      data[fieldname] = val;
    })
      .on("finish", () => {
        resolve(data);
      })
      .on("error", err => {
        reject(err);
      });

    bb.end(body);
  });

export async function main(event) {
  try {
    console.log("HOLA!");
    console.log(JSON.stringify(event.body));
    const parsed = await parseForm(event.body, event.headers);
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
