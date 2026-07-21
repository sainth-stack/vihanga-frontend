import React from 'react'

export default function TableView2({ report }) {
  return (
    <div className="mt-5 text-center">
      <table className="table">
        <thead>
          <tr className='thead text-center'>
            <th scope="col" style={{ width: '40%', textAlign: 'start' }} className="p-2 bg-green text-white border-left-radius-10"></th>
            <th scope="col" className="p-2 text-white bg-green">Self</th>
            <th scope="col" className="p-2 text-white bg-green">Manager</th>
            <th scope="col" className="p-2 text-white bg-green border-right-radius-10">Average</th>

          </tr>
        </thead>
        <tbody>
          {report.report.scoreSelf.length > 0 && report.report.scoreSelf.filter(item => item.averageScore > 2).length > 0 ? report.report.scoreSelf.map((item, index) => (
            <tr className='row1'>
              <th scope="row" style={{ textAlign: 'start' }} className={`p-2 ${index === report.report.scoreSelf.length - 1 ? 'border-left-bottom-radius-10' : ''}`}>{item.category}</th>
              <td className="p-2 text-center">{item.averageScore}</td>
              <td className="p-2 text-center">{report.report.scoreManager.length > 0 ? report.report.scoreManager[index].averageScore : ""}</td>
              <td className="p-3 text-center d-flex justify-content-center align-items-center">
                <div className="green-circle">{report.report.averageScores[index].averageScore}</div>
              </td>
            </tr>
          )) : <h1>No Data Found!</h1>}
        </tbody>
      </table>
    </div>
  )
}
