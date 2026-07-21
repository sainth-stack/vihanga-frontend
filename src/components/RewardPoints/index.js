import React from 'react'

export default function RewardPointsComponent({ rewardPoints, approvalRequired }) {
  return (
    <div>
      {approvalRequired && <h3>You are eligible for {rewardPoints} reward points.</h3>}
      {!approvalRequired && <h3>You have earned {rewardPoints} reward points</h3>}
    </div>
  )
}
