import appConstant from "./appConstant";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { IMG_BASE_URL, BL_BaseUrl } from "./webApi";

export const base64ToBlobImg = (base64String, filename) => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: appConstant.imgDownType });
  return new File([blob], filename, { type: appConstant.imgDownType });
};

export const downloadImagesAsZip = async (images, selectedIndex) => {
  if (!images.length && !selectedIndex.length) return;
  if (selectedIndex.length === 1) {
    const imgLabel = `${images[selectedIndex[0]]?.code}-${convertIndRupee(images[selectedIndex[0]]?.totalPrice)}`;
    const b64String = await getBlobFromUrl(images[selectedIndex[0]].path);
    const withLabel = await addLabelToImage(b64String, imgLabel);
    saveAs(`data:image/png;base64,${withLabel}`, `${imgLabel}.png`);
  } else {
    const zip = new JSZip();
    const promiseArr = await selectedIndex.map(async (index, i) => {
      const imgLabel = `${images[index]?.code}-${convertIndRupee(images[index]?.totalPrice)}`;
      const base64Data = await getBlobFromUrl(images[index].path);
      const withLabel = await addLabelToImage(base64Data, imgLabel);
      zip.file(`${imgLabel}.png`, withLabel, { base64: true });
    });
    await Promise.all(promiseArr);
    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${appConstant.downZipName}.zip`);
    } catch (error) {
      console.error("Error creating and downloading zip file:", error);
    }
  }
};

export const downloadImagesAsZip2 = async (images, selectedIndex) => {
  if (!images.length && !selectedIndex.length) return;
  if (selectedIndex.length === 1) {
    const imgName = `image.png`;
    const withLabel = await addLabelToImage(images[selectedIndex[0]].img_str, imgName);
    saveAs(`data:image/png;base64,${withLabel}`, imgName);
  } else {
    const zip = new JSZip();
    selectedIndex.map(async (index, i) => {
      const base64Data = images[index].img_str;
      const fileName = `${index}_image.png`;
      const withLabel = await addLabelToImage(base64Data, fileName);
      zip.file(fileName, withLabel, { base64: true });
    });

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${appConstant.downZipName}.zip`);
    } catch (error) {
      console.error("Error creating and downloading zip file:", error);
    }
  }
};

export const getBlobFromUrl = async (path) => {
  const response = await fetch(`${BL_BaseUrl}/get-image`, {
    method: "POST",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
};

export const addLabelToImage = async (imagePath, labelText) => {
  return new Promise((resolve, reject) => {
    // Create a new image
    let img = new Image();

    // Set the source of the image
    img.src = `data:image/png;base64,${imagePath}`;
    // Once the image is loaded, perform the drawing operations
    img.onload = function () {
      // Create a canvas element
      let canvas = document.createElement("canvas");
      // Set the canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height + 40; // Extra height for the label
      // Get the 2D context of the canvas
      let ctx = canvas.getContext("2d");
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      // Add the label background
      ctx.fillStyle = "#5465ff";
      ctx.fillRect(0, img.height, canvas.width, 40);

      // Add the label text
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(labelText, 20, img.height + 25); // Adjust position within the label

      // Convert the canvas to a data URL
      let dataURL = canvas.toDataURL("image/png");
      // Execute the callback with the data URL
      resolve(dataURL.split(",")[1]);
    };

    // Handle image loading error
    img.onerror = function (err) {
      console.log("add label err", err);
      reject(new Error("Error loading image."));
    };
  });
};

// Options for formatting as a price
const options = {
  style: "currency",
  currency: "INR", // Change this to your desired currency code (e.g., 'EUR', 'JPY')
  minimumFractionDigits: 0, // Minimum number of decimal places
  maximumFractionDigits: 0, // Maximum number of decimal places
};

// Format the number as a price
export const convertIndRupee = (number = 0) => {
  let currency = Number(number);
  if (currency === 0) return "";
  return new Intl.NumberFormat("en-US", options).format(currency);
};
