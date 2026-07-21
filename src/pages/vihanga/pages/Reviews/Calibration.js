import { updateReviewForm } from 'action/ReviewFormAct';
import React from 'react'
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { defaultProfilePic } from 'utilities';
import './styles.scss'

export default function Calibration({ employeesData, ratingLabels = [], setRefreshed, status,setRefreshData }) {
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [employees, setEmployees] = useState(employeesData.length > 0 ? employeesData : [
    {
      _id: 1,
      name: 'Venkatesh Mogili',
      overallRating: 1,
    },
    {
      _id: 11,
      name: 'Venkatesh Mogili 2',
      overallRating: 1,
    },
    {
      _id: 2,
      name: 'Aneel',
      overallRating: 2,
    },
    {
      _id: 3,
      name: 'Sainath',
      overallRating: 3,
    },
    {
      _id: 4,
      name: 'Vamshi',
      overallRating: 4,
    },
    {
      _id: 5,
      name: 'Prasanth',
      overallRating: 5,
    }
  ])
  const onDragEnd = (result) => {
    let id = result.draggableId;
    let desitnationIndex = result.destination.index;
    let itemIndex = employees.findIndex(item => item._id === id.toString());
    let employeeData = employees.find(item => item._id === id.toString());
    let updatedEmployees = [...employees];
    let item = updatedEmployees[itemIndex];
    let updatedRating = parseInt(result.destination.droppableId);
    item.overallRating = updatedRating;
    updatedEmployees.splice(itemIndex, 1);
    updatedEmployees.splice(desitnationIndex, 0, item);
    setLoading(true);
    setRefreshed(false);
    let reviewId = employeeData._id;
    let response = dispatch(updateReviewForm(reviewId, { managersRating: Number(updatedRating).toFixed(2), overallRating: Number(updatedRating).toFixed(2) }));
    response.then(({ success, message, data }) => {
      if (success) {
        setEmployees(updatedEmployees);
        setLoading(false);
        setRefreshed(true);
        setRefreshData((prev)=>!prev)
      } else {
        setLoading(false);
        setRefreshed(true);
      }
    });
  }
  const Ratings = ratingLabels ? ratingLabels.map((item, index) => {
    return {
      rating: index + 1,
      ratingLabel: item
    }
  }) : [
    {
      rating: 1,
      ratingLabel: 'Ineffective',
    },
    {
      rating: 2,
      ratingLabel: 'Somewhat Achieved',
    },
    {
      rating: 3,
      ratingLabel: 'Achieved',
    },
    {
      rating: 4,
      ratingLabel: 'OverPerformed',
    },
    {
      rating: 5,
      ratingLabel: 'Outstanding'
    }]
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='d-flex justify-content-center'>
          {Ratings.map((rating, index) => (
            <Droppable isDropDisabled={status === "Manager SignOff"} droppableId={`${rating.rating.toString().toLowerCase().replace(/ /g, "")}`} key={index}>
              {(provided) => (
                <div
                  className="boxWidth shadow rounded bg-white mt-2 mb-2 m-2 p-2 boxHeight"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <small>{rating.rating} - {rating.ratingLabel}</small>
                  <hr />
                  {employees.filter(item => item.overallRating === rating.rating).map((employee, index2) => (
                    <Draggable isDragDisabled={status === "Manager SignOff"} draggableId={`${employee._id.toString().toLowerCase().replace(/ /g, "")}`} index={index2} >
                      {(provided, snapshot) => (
                        <div className='shadow rounded bg-white mt-2 mb-2 p-2' {...provided.draggableProps} {...provided.dragHandleProps} snapshot={snapshot} ref={provided.innerRef}  >
                          <img src={defaultProfilePic} alt="profile" className='user-pic2' />
                          <small>{employee.name}</small>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
