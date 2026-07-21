import React from 'react'
import attachmentIcon from "assets/svg/attachmentIcon.svg";
import attachmentIconPlain from "assets/svg/attachment-plain.svg";
import useWindowSize from 'components/UseWindowSize';

export default function AttachmentComponent({ row }) {
  const isMobile = useWindowSize();
  return (
    <div className="d-flex flex-wrap">
      <div className="dropdown actionDropdown">
        <a
          href={
            row.feedAttachment && row.feedAttachment.length > 0
              ? row.feedAttachment
              : "!#"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="dropdown-hide d-toggle">
            <img
              src={isMobile ? attachmentIconPlain : attachmentIcon}
              alt={"attachment"}
              style={{ height: 25 }}
            />
          </button>
        </a>
      </div>
    </div>
  )
}
