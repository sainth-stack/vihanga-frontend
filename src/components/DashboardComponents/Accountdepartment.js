import React from "react";
import "./styles.scss";
import rupee1 from "assets/svg/rupee1.svg";
import rupee2 from "assets/svg/rupee2.svg";
import rupee3 from "assets/svg/rupee3.svg";
import rupee4 from "assets/svg/rupee4.svg";
import rupee5 from "assets/svg/rupee5.svg";
import coin from "assets/svg/coin.svg";
import { defaultProfilePic } from "utilities";

const getProfilePic = (data) => {
  return data.personalInformation.profilePicture ? data.personalInformation.profilePicture : defaultProfilePic;
}
export default function Accountdepartment({ data }) {
  return (
    <>
      <div className="mt-4 pb-4">
        {
          data.length > 0 && data[0].rewardPoints > 0 && <Card
            data={data}
            title={data[0].personalInformation.firstName + " " + data[0].personalInformation.lastName}
            color="primary"
            amount={data[0].rewardPoints}
            profile={getProfilePic(data[0])}
            rupee={rupee1}
            background="linear-gradient(90deg, #FFD949 50%, #FFEC7B 100%), #E1F5FF"
          />
        }

        {data.length > 1 && data[0].rewardPoints > 0 && <Card
          data={data}
          title={data[1].personalInformation.firstName + " " + data[1].personalInformation.lastName}
          color="primary"
          amount={data[1].rewardPoints}
          profile={getProfilePic(data[1])}
          rupee={rupee2}
          background="linear-gradient(90deg, #D8D8C7 50%, #E0E0D0 100%)"
        />}

        {data.length > 2 && data[0].rewardPoints > 0 &&
          <Card
            data={data}
            title={data[2].personalInformation.firstName + " " + data[2].personalInformation.lastName}
            color="primary"
            amount={data[2].rewardPoints}
            profile={getProfilePic(data[2])}
            rupee={rupee3}
            background="linear-gradient(90deg, #F4AA6A 50%, #F5B47C 100%)"
          />}

        {data.length > 3 && data[0].rewardPoints > 0 && <Card
          data={data}
          title={data[3].personalInformation.firstName + " " + data[3].personalInformation.lastName}
          color="primary"
          amount={data[3].rewardPoints}
          profile={getProfilePic(data[3])}
          rupee={rupee4}
          background="#EBEBEB"
        />}

        {data.length > 4 && data[0].rewardPoints > 0 && <Card
          data={data}
          title={data[4].personalInformation.firstName + " " + data[4].personalInformation.lastName}
          color="primary"
          amount={data[4].rewardPoints}
          profile={getProfilePic(data[4])}
          rupee={rupee5}
          background="#EBEBEB"
        />}

      </div>
    </>
  );
}

function Card({ data, title = "", rupee, color, profile = "", amount, background }) {
  return (
    <div className="events-list m-1 mt-1 mb-1">
      <div className="account-card" style={{ background }}>
        <div className="account-row">
          <div className="d-flex">
            <div className="account-icon">
              <span className="rupee">
                <div className="rupee-icon">
                  <img src={rupee} alt="rupee" />
                </div>
              </span>
              <img src={profile} alt="profiler" className="profilelogo2" />
            </div>
            <div className="pl-2 col-12">
              <p className="p-0 m-0 text-black">{title}</p>
            </div>
          </div>
          <div className="coin-icon">
            <img src={coin} alt="coin" /><span className="ml-2 mr-2">{amount}</span>
          </div>
        </div>
      </div>
      {/* <div className="account-card m-1 p-0"> */}

      {/* <h className="titleh">{title}</h>
        <span>
          <img src={rupee} alt="rupee" />
        </span>
        <img src={profile} alt="profiler" />
        <div>
          <img src={coin} alt="coin" />
        </div> */}
      {/* </div> */}
    </div>
  );
}
