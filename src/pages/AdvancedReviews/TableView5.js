import React from 'react'
import neutralEmoji from '../../assets/svg/neutralEmoji.svg'

export default function TableView5() {
  return (
    <div className="mt-5 text-center">
      <table className="table">
        <thead>
          <tr className='thead text-center'>
            <th scope="col" className="p-2 bg-green text-white border-left-radius-10">Neutral</th>
          </tr>
        </thead>
        <tbody>
          <tr className='row1'>
            <td className="p-2 text-center">
              <img src={neutralEmoji} className="col-md-1" alt='expression' />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
