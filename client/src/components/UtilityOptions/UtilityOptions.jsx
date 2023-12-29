import React from "react";
import "./UtilityOptions.scss";
import DownloadIcon from "../SvgIcons/Download";
import SelectAllIcon from "../SvgIcons/SelectAll";
import ShareIcon from "../SvgIcons/Share";
import Refresh from "../SvgIcons/Refresh";
import { Loader } from "semantic-ui-react";

const UtilityOptions = ({
  shareLoader,
  downLoader,
  isAllSelected,
  selectedImg,
  shareSelectedFiles,
  onSelectAll,
  onDownloadImg,
  onRefresh,
}) => {
  return (
    <section className='utility-options'>
      <section className='left-side'>
        <ul className='action-icons'>
          <li title='Download' onClick={onDownloadImg}>
            {downLoader ? <Loader size='mini' active inline /> : <DownloadIcon />}
          </li>
          <li title='Share' onClick={shareSelectedFiles}>
            {shareLoader ? <Loader size='mini' active inline /> : <ShareIcon />}
          </li>
          <li title='Select All' onClick={onSelectAll}>
            <SelectAllIcon isSelectAll={isAllSelected} />
          </li>
          <li title='Re-Start' onClick={onRefresh}>
            <Refresh />
          </li>
        </ul>
      </section>
      <section className='right-side'>
        <div className='cout-selected-img'>{selectedImg > 0 && `Selected : ${selectedImg}`}</div>
      </section>
    </section>
  );
};

export default UtilityOptions;
