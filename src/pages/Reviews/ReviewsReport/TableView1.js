import React from 'react'

export default function TableView1() {
  return (
    <div className="mt-5 text-center">
      <table class="">
        <thead>
          <tr className='thead text-center'>
            <th scope="col" style={{ width: '40%', textAlign: 'start' }} className="p-2 bg-green text-white border-left-radius-10">Individual Elements Breakdown</th>
            <th scope="col" className="p-2 text-white bg-green">Self</th>
            <th scope="col" className="p-2 text-white bg-green">Manager</th>
            <th scope="col" className="p-2 text-white bg-green">Peers</th>
            <th scope="col" className="p-2 text-white bg-green border-right-radius-10">Average</th>

          </tr>
        </thead>
        <tbody>
          <tr className='row1'>
            <th scope="row" style={{ textAlign: 'start' }} className="p-2 ">Allocate time and resources for individual and team objectives and achieve effective levels of productivity targets</th>
            <td className="p-2 text-center">4.00</td>
            <td className="p-2 text-center">3.33</td>
            <td className="p-2 text-center">3.33 </td>

            <td className="p-3 text-center d-flex justify-content-center align-items-center">
              <div className="green-circle">4.00</div>
            </td>
          </tr>
          <tr className='row2'>
            <th scope="row" style={{ textAlign: 'start' }} className="p-2 ">Proactively take initiative towards responsibilities as well as tasks and involve ideas and feedback from others in planning the execution of those responsibilities</th>
            <td className="p-2 text-center">4.00</td>
            <td className="p-2 text-center">3.33</td>
            <td className="p-2 text-center">3.33 </td>
            <td className="p-3 text-center d-flex justify-content-center align-items-center">
              <div className="red-circle">3.56</div>
            </td>

          </tr>
          <tr className='row1'>
            <th scope="row" style={{ textAlign: 'start' }} className="p-2 border-left-bottom-radius-10">Set as well as achieve high standards of outcome and take into account the bigger picture when making decisions</th>
            <td className="p-2 text-center">4.00</td>
            <td className="p-2 text-center">3.33</td>
            <td className="p-2 text-center">3.33 </td>
            <td className="p-3 text-center d-flex justify-content-center align-items-center border-right-bottom-radius-10">
              <div className="green-circle">4.00</div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  )
}
