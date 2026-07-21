import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import Grid from "@material-ui/core/Grid";
import { getTasks } from "action/TasksAct";
import { useDispatch } from "react-redux";
import SubTask from "./Subtask";
import { createTask } from "action/TasksAct";
import { updateNotificationTask } from "action/NotificationAct";
import { t } from "i18next";

export default function ScheduleCalendar() {
  const dispatch = useDispatch();
  const [date, setDate] = React.useState(
    dayjs(window.moment(new Date()).format("YYYY-MM-DD"))
  );
  const [date2, setDate2] = React.useState(
    dayjs(
      window
        .moment(new Date(date))
        .add(1, "month")
        .endOf("month")
        .format("YYYY-MM-DD")
    )
  );
  const [tasks, setTasks] = React.useState([]);
  const [, setLoading] = React.useState(false);
  const [, setError] = useState(false);
  const [orderModalShow, setOrderModalShow] = useState(false);
  const handleCreate = () => {
    setOrderModalShow(true);
  };
  const handleCallback2 = (childData, callback) => {
    try {
      setLoading(true);
      const data = {
        title: childData.title,
        description: childData.description,
        startDate: childData.startDate,
        dueDate: childData.dueDate,
        actualCompletionDate: childData.actualCompletionDate,
        linkToKR: childData.linkToKr,
        assignTo: childData.assignTo,
        priority: childData.priority,
        comments: childData.comments,
        attachments: childData.attachments,
        krReferenceId: childData.krReferenceId,
        estimationEffort: childData.estimationEffort,
        actualEffort: childData.actualEffort,
        recurrence: childData.recurrence ? childData.recurrence : false,
        recurrenceDetails: childData.recurrenceDetails
          ? childData.recurrenceDetails
          : null,
        progressStatus: childData.progressStatus,
        mainTask: childData.mainTask,
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
        userId: childData.userId,
      };
      let response = dispatch(createTask(data));
      response.then(({ data, message }) => {
        if (data !== undefined) {
          let user =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Create",
              row: { ...data, employeeReferenceId: user.ownerId },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId,
              },
            };
            let response2 = dispatch(
              updateNotificationTask(data._id, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              if (success) {
                setOrderModalShow(false);
                getTask();
                setLoading(false);
                setError("");
                callback();
              }
            });
          }
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const getTask = () => {
    try {
      setLoading(true);
      let response = dispatch(getTasks());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((task) => {
            return {
              dueDate: task.dueDate,
              title: task.title,
              actualCompletionDate: task.actualCompletionDate,
              assignTo: task.assignTo,
              description: task.description,
              startDate: task.startDate,
              id: task._id,
              status: task.status,
            };
          });
          setTasks(updatedData);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          setTasks([]);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    getTask();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    //set previous month date
    setDate2(
      dayjs(
        window
          .moment(new Date(date))
          .add(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD")
      )
    );
  }, [date]);
  return (
    <div className="rounded shadow m-2 mt-5  bg-white">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h4>{t("Dashboard.taskView")}</h4>
        <button className="btn btn-success bg-green" onClick={handleCreate}>
          {t("Dashboard.createTask")}
        </button>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <CalendarPicker
              date={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CalendarPicker
              date={date2}
              onChange={(newDate) => setDate2(newDate)}
            />
          </Grid>
        </Grid>
        <div className="m-4">
          {tasks &&
            tasks.length > 0 &&
            tasks
              .filter(
                (item) =>
                  dayjs(item.dueDate).format("YYYY-MM-DD") >=
                    dayjs(date).format("YYYY-MM-DD") &&
                  dayjs(item.dueDate).format("YYYY-MM-DD") <=
                    dayjs(date2).format("YYYY-MM-DD")
              )
              .map((task, index) => (
                <>
                  <div className="d-flex" key={index}>
                    <p>{dayjs(task?.dueDate).format("YYYY-MM-DD")}</p>
                    &nbsp;&nbsp;
                    <p> - {task?.title}</p>
                  </div>
                  <hr />
                </>
              ))}
        </div>
      </LocalizationProvider>
      {orderModalShow && (
        <SubTask
          show={orderModalShow}
          onHide={() => setOrderModalShow(false)}
          handlecallback={(data, callback) => handleCallback2(data, callback)}
          tasks={tasks}
        />
      )}
    </div>
  );
}
