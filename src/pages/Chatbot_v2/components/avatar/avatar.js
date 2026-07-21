import React from "react";

const Avatar = (props) => {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', opacity: props.visible ? 1 : 1, zIndex: 3 }}>
      <div className="d-flex">
        <div className="chatbotIcon text-center" id="chatbotIcon" style={{ animation: props.visible ? "rotateIconAnim 0.2s 1" : '' }} onClick={() => props.onClick && props.onClick()}>
          <i className="fa fa-comments-o fs-30 text-white pt-2" />
        </div>
      </div>
    </div>
  )
}

export default Avatar