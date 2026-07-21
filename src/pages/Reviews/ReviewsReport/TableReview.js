import React from "react";
import numbercircle from "assets/svg/numbercircle.svg";
export default function TableReview() {
  return (
    <div>
      <table class="table table-success table-striped">
        <thead>
          <tr className="thead ">
            <th scope="col"></th>
            <th scope="col">self</th>
            <th scope="col">manager</th>
            <th scope="col">peers</th>
            <th scope="col">average</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row1">
            <th scope="row">Accountability</th>
            <td>4.00</td>
            <td>3.33</td>
            <td>3.33 </td>

            <td>
              <img src={numbercircle} alt="none" />
            </td>
          </tr>
          <tr className="row2">
            <th scope="row">Cooperation</th>
            <td>4.00</td>
            <td>3.33</td>
            <td>3.33 </td>
            <td>
              <img src={numbercircle} alt="none" />
            </td>
          </tr>
          <tr className="row1">
            <th scope="row">Conscientiousness</th>
            <td>4.00</td>
            <td>3.33</td>
            <td>3.33 </td>
            <td>
              <img src={numbercircle} alt="none" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
