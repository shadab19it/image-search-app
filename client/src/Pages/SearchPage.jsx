import React, { useState, useRef } from "react";
import FileUploader from "../components/UploadFile";
import "./SearchPage.scss";
import SearchInput from "../components/SearchInput/SearchInput";
import Header from "../components/Header/Header";
import UtilityOptions from "../components/UtilityOptions/UtilityOptions";
import {
  getBlobFromUrl,
  downloadImagesAsZip,
  downloadImagesAsZip2,
  convertIndRupee,
  addLabelToImage,
  base64ToBlobImg,
} from "../services/utils";
import { getImages, searchByImage, searchByText } from "../services/searchService";
import { Button } from "semantic-ui-react";
import { IMG_BASE_URL, BL_BaseUrl } from "../services/webApi";

const SearchPage = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [b64File, setB64File] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [binaryFile, setBinaryFile] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState([]);
  const [searchType, setSearchType] = useState("text");
  const [dbType, setDBType] = useState("Master");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [ratePer, setRatePer] = useState("0");
  const [totalCount, setTotalCount] = useState(0);
  const [isFromModel, setIsFromModel] = useState(false);
  const [downLoader, setDownLoader] = useState(false);
  const [shareLoader, setShareLoader] = useState(false);

  // ********************************************
  // SHARE FILES
  const shareSelectedFiles = async () => {
    if (!selectedImgIndex.length) return;
    let files;

    if (navigator.share === undefined) {
      console.log("Unsupported share feature");
      alert("Unsupported share feature");
      return;
    }

    // Handle files conversion
    if (resultData && resultData.length > 0) {
      const filesGetter = selectedImgIndex.map(async (imgIndex, i) => {
        return new Promise(async (resolve, reject) => {
          if (resultData[imgIndex]?.path) {
            let url = resultData[imgIndex].path;
            const imgLabel = `${resultData[imgIndex]?.code}-${convertIndRupee(resultData[imgIndex]?.totalPrice)}`;
            const fileName = `${imgLabel}.png`;
            const b64String = await getBlobFromUrl(url);
            const withLabel = await addLabelToImage(b64String, imgLabel);
            const blob = await base64ToBlobImg(withLabel, fileName);
            resolve(blob);
          } else {
            const withLabel = await addLabelToImage(resultData[imgIndex].img_str, `${imgIndex}_image`);
            const blob = await base64ToBlobImg(withLabel, `${imgIndex}_image.png`);
            resolve(blob);
          }
        });
      });
      setShareLoader(true);
      const newFiles = await Promise.all(filesGetter);
      setShareLoader(false);

      if (!navigator.canShare || !navigator.canShare({ files: newFiles })) {
        console.log("Unsupported share feature");
        alert("Unsupported share feature");
        return;
      }
      files = newFiles;
    }
    try {
      await navigator.share({ text: "", files: files });
    } catch (error) {
      console.log(`Error while sharing: ${error}`);
    }
  };

  // ON CLICK TO DOWNLOAD
  const onDownloadImg = async () => {
    if (selectedImgIndex.length === 0) return;
    if (searchType === "text" && isFromModel) {
      setDownLoader(true);
      await downloadImagesAsZip2(resultData, selectedImgIndex);
      setDownLoader(false);
    } else {
      setDownLoader(true);
      await downloadImagesAsZip(resultData, selectedImgIndex);
      setDownLoader(false);
    }
  };
  // ********************************************

  // ON UPLOAD FILES
  const onUploadFile = (b64, file, filename) => {
    setsearchQuery("");
    setBinaryFile(file);
    setPageNo(1);
    setFileName(filename);
    setB64File(b64);
  };

  // ON CHANGE DB TYPE
  const onChangeDBType = (val, index) => {
    setDBType(val);
  };

  // ON CHANGE SEARCH TYPE
  const onChangeSearchType = (val, index) => {
    setB64File("");
    setBinaryFile(null);
    setFileName("");
    setsearchQuery("");
    setSearchType(val);
  };

  // ON CHANGE SEARCH TEXT
  const onChangeQuery = (e) => {
    setsearchQuery(e.target.value);
  };

  // ON Get DB Images
  const onGetDBImges = async () => {
    try {
      setLoading(true);
      setSelectedImgIndex([]);
      setResultData([]);
      setPageNo(1);
      const res = await getImages(dbType, pageSize, pageNo, ratePer);
      setTotalCount(res.tolal_count);
      setResultData(res.result);
      setLoading(false);
    } catch (err) {
      console.log("Search Error ", err);
    }
  };

  // ON HIT ENTER TO SEARCH
  const onEnterGetData = (e) => {
    if (e.key === "Enter") {
      onGetSearchData();
    }
  };

  // ON GET IMAGE SEARCH DATA
  const onGetSearchData = async () => {
    setLoading(true);
    setSelectedImgIndex([]);
    setResultData([]);
    try {
      if (searchQuery) {
        setResultData([]);
        const result = await searchByText(searchQuery, pageSize, ratePer, dbType);
        setResultData(result.result);
        setIsFromModel(true);
        setLoading(false);
      } else if (b64File) {
        const result = await searchByImage(binaryFile, pageSize, ratePer, dbType);
        setResultData(result.result);
        setIsFromModel(true);
        setLoading(false);
      } else {
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Search Error ", err);
    }
  };

  // ON SELECT IMAGE FOR DOWNLOAD AND SHARE FILE
  const onSelectImg = (index) => {
    if (selectedImgIndex.includes(index)) {
      const newData = selectedImgIndex.filter((id, i) => id !== index);
      setSelectedImgIndex(newData);
    } else {
      setSelectedImgIndex((prv) => [...prv, index]);
    }
  };

  // RESTART TO INTIAL STAGE
  const onRefresh = () => {
    setB64File(null);
    setFileName("");
    setPageNo(1);
    setResultData([]);
    setSelectedImgIndex([]);
    setIsFromModel(false);
    onGetDBImges();
  };

  // ON SELECT IMAGE
  const onSelectAll = () => {
    if (resultData.length) {
      if (selectedImgIndex.length > 0) {
        setSelectedImgIndex([]);
      } else {
        resultData.map((v, i) => setSelectedImgIndex((prv) => [...prv, i]));
      }
    }
  };

  // ON PAGE RENDER GET DB IMAGES
  React.useEffect(() => {
    if (isFromModel) return;
    onGetDBImges();
  }, [dbType, ratePer]);

  // RENDER SEARCH TYPE
  const SearchComp = {
    text: (
      <SearchInput
        searchQuery={searchQuery}
        onChangeQuery={onChangeQuery}
        onEnterGetData={onEnterGetData}
        onGetSearchData={onGetSearchData}
      />
    ),
    image: <FileUploader onUploadFile={onUploadFile} />,
  };

  // ON RATE CHANGE
  const onRateChange = (e) => {
    if (e.target.value === 0) return;
    if (!e.target.value) {
      setRatePer(0);
    } else {
      setRatePer(e.target.value);
    }
  };

  // ON LOAD MORE
  const onLoadMore = async () => {
    if (totalCount === resultData.length) return;
    try {
      let currentPage = pageNo + 1;
      setPageNo(currentPage);
      setLoading(true);
      const res = await getImages(dbType, pageSize, currentPage, ratePer);
      setResultData((prv) => [...prv, ...res.result]);
      setLoading(false);
    } catch (err) {
      console.log("Search Error ", err);
    }
  };
  return (
    <main className='search-page-wrapper'>
      <Header
        onChangeFileType={onChangeDBType}
        dbType={dbType}
        onChangeSearchType={onChangeSearchType}
        ratePer={ratePer}
        onRateChange={onRateChange}
      />
      <div className='page-container'>
        <section className='search-image-container'>
          {SearchComp[searchType]}
          <button className='up-search-btn' onClick={onGetSearchData}>
            Search
          </button>
        </section>
        <UtilityOptions
          downLoader={downLoader}
          shareLoader={shareLoader}
          onRefresh={onRefresh}
          isAllSelected={resultData.length > 0 && resultData.length === selectedImgIndex.length}
          onDownloadImg={onDownloadImg}
          onSelectAll={onSelectAll}
          shareSelectedFiles={shareSelectedFiles}
          selectedImg={selectedImgIndex.length}
        />
        {b64File && (
          <>
            <p title='View Image' className='up-file-name'>
              Uploaded file : {fileName}
            </p>
            <div>
              <img height={200} width={200} src={`data:image/png;base64,${b64File}`} alt='Upload image' />
            </div>
          </>
        )}

        {resultData.length > 0 && !isFromModel && (
          <h3 style={{ color: "#fff" }}>
            Total Images : {resultData.length} / {totalCount}
          </h3>
        )}
        {isFromModel && <h3 style={{ color: "#fff" }}>Similar Images</h3>}
        {loading && <h4 style={{ color: "#fff" }}>Loading...</h4>}

        <section className='search-result-container'>
          {resultData.length > 0 &&
            resultData.map((file, i) => {
              return (
                <div key={i} onClick={() => onSelectImg(i)} className={`image-box ${selectedImgIndex.includes(i) && "selected"}`}>
                  {file.img_str && <img key={i} src={`data:image/jpeg;base64,${file.img_str}`} alt='image' />}
                  {file.path && <img key={i} src={`${BL_BaseUrl}/${file.path}`} alt='image' />}
                  {file?.name && (
                    <p>
                      {file?.name} {file?.totalPrice > 0 && <span style={{ color: "orange" }}> : {convertIndRupee(file?.totalPrice)}</span>}
                    </p>
                  )}
                </div>
              );
            })}
        </section>
        {!isFromModel && (
          <Button primary onClick={onLoadMore} loading={loading}>
            {totalCount === resultData.length ? "All Loaded" : "Load More"}
          </Button>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
