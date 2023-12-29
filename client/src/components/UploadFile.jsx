import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["image/*"];

const DragDrop = ({ onUploadFile }) => {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // event.target.result contains the Base64 encoded image
        const base64String = event.target.result.split(",")[1];
        onUploadFile(base64String, file, file.name);
      };
      // Read the file as a data URL, which will give you a Base64 encoded string
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <FileUploader classes='upload-input' handleChange={handleChange} name='file' accept='image/*' />
    </>
  );
};

export default DragDrop;
