import React from "react";
import "./style1.scss";
import SelectInput from "components/Company/SelectInput";
import Button from "components/Company/Button";
export default function Toolcard({ reward: { _id, status, rewardName, rewardIcon, rewardDescription, rewardCode, rewardStatus, rewardPoints, rewardAmount, rewardApprover }, handleSelect, handleUpdate, role, userPoints }) {
  let rewardPointsOptions = [
    { key: "USD " + rewardAmount + " " + rewardName + " (" + rewardPoints + " Points)", value: rewardPoints }
  ]
  return (
    <div className="toolContainer">
      <img src={rewardIcon} alt="reward logo" className="toolRewardLogo" />
      <h1 className="toolRewardTitle">{rewardName}</h1>
      <h2 className="toolDescription">Description</h2>
      <h3 className="toolRewardDescription">
        {rewardDescription}
      </h3>
      <div className="selectInput">
        <SelectInput
          label=""
          placeholder="$20 Papa Johns Gift Card (200 Points)"
          name="rewardPoint"
          options={rewardPointsOptions}
          value={rewardPoints}
        />
      </div>
      <div className="toolButtons">
        {role !== null && (role === rewardApprover || role === "Super Admin") && <div>
          <Button
            text="Approve"
            className={`${(status === "approved" || status === "rejected") ? 'bg-light-primary text-dark' : 'bg-success'} border text-white`}
            handleClick={() => handleUpdate(_id, "approved")}
            disabled={(status === "approved" || status === "rejected")}
          />
          <Button
            text="Reject"
            className={`${(status === "approved" || status === "rejected") ? 'bg-light-primary text-dark' : 'bg-danger'} border text-white`}
            handleClick={() => handleUpdate(_id, "rejected")}
            disabled={(status === "approved" || status === "rejected")}
          />
        </div>}
        {role !== null && role !== rewardApprover && <Button
          text="Redeem"
          className={`${(userPoints < rewardPoints || (status !== "pending" && status !== "rejected")) ? 'bg-light-primary text-dark' : 'bg-green'} border text-white`}
          handleClick={() => handleSelect(rewardPoints, rewardAmount, _id)}
          disabled={(userPoints < rewardPoints || (status !== "pending" && status !== "rejected"))}
        />}
      </div>
    </div>
  );
}
