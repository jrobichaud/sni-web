import { PutFileRequest } from "./sni-client/sni_pb";
import { get } from "svelte/store";
import { device, fileSystemClient } from "./store";

export async function saveFile(path, bytes) {
  let request = new PutFileRequest();
  request.setUri(get(device).uri);
  request.setPath(path);
  request.setData(new Uint8Array(bytes));
  await new Promise((resolve) => {
    get(fileSystemClient).putFile(request, (err, res) => {
      resolve();
    });
  });
}

async function streamToArrayBuffer(stream) {
  let result = new Uint8Array(0);
  const reader = stream.getReader();
  while (true) {
    // eslint-disable-line no-constant-condition
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const newResult = new Uint8Array(result.length + value.length);
    newResult.set(result);
    newResult.set(value, result.length);
    result = newResult;
  }
  return result;
}

export async function downloadAndSaveFile(url, body, outputDirectory) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const filename = response.headers
    .get("content-disposition")
    .split(";")
    .find((n) => n.includes("filename="))
    .replace("filename=", "")
    .replaceAll('"', "")
    .trim();
  let data = await streamToArrayBuffer(await response.body);
  let destination = outputDirectory + "/" + filename;
  await saveFile(destination, data);
}
