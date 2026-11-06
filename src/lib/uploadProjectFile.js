export function uploadProjectFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    request.open("POST", "/api/upload");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("load", () => {
      let response;
      try {
        response = JSON.parse(request.responseText);
      } catch {
        reject(new Error("The upload service returned an invalid response."));
        return;
      }

      if (request.status < 200 || request.status >= 300 || !response.url) {
        reject(new Error(response.error || "Image upload failed."));
        return;
      }

      resolve(response.url);
    });
    request.addEventListener("error", () =>
      reject(new Error("Image upload failed. Check your connection and try again."))
    );
    request.addEventListener("abort", () =>
      reject(new Error("Image upload was cancelled."))
    );
    request.send(formData);
  });
}
