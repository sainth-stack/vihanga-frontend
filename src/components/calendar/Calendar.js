import React, { Component } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";

import { defaultProfilePic } from "utilities";


const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  },

};

class Calendar extends Component {
  constructor(props) {
    console.log(props,'sdfoasidj')
    super(props);
    this.calendarRef = React.createRef();

    this.state = {
      viewType: this.props.viewType === "Monthly" ? "Month" : "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async args => {
        //this.props.showEditPopup(args.data.id);
        const dp = this.calendar;
        // const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        dp.clearSelection();
        // if (!modal.result) { return; }
        // dp.events.add({
        //   start: args.start,
        //   end: args.end,
        //   id: DayPilot.guid(),
        //   text: modal.result
        // });

        this.props.setOrderModalShow(true);
        this.props.showEditPopup(false);



      },
      eventDeleteHandling: "Update",
      onEventClick: async args => {
        this.props.showEditPopup(args.e.data.id);
        // const dp = this.calendar;
        //const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text());
        //if (!modal.result) { return; }
        //const e = args.e;
        //e.data.text = modal.result;
        //dp.events.update(e);
      },
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  componentDidMount() {
    const events = this.props.tasks.map((item) => {
      const start = window.moment(item.startDate ? item.startDate : new Date())
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const end = window.moment(item.dueDate ? item.dueDate : new Date())
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm:ss");
      const text = `${item.title}${item.owner ? ` - ${item.owner}` : ""}`;
      return {
        id: item.id,
        start,
        end,
        text,
        completionDate: window.moment(item.actualCompletionDate ? item.actualCompletionDate : new Date()).format("YYYY-MM-DDTHH:mm:ss"),
        backColor:
          item.status === "completed"
            ? "#2A7A7B"
            : item.status === "inprogress"
            ? "orange"
            : "#FF0000",
      };
    });
    // [
    //  {
    //    id: 1,
    //    text: "Event 1",
    //    start: "2022-10-07T10:30:00",
    //    end: "2022-10-07T13:00:00"
    //  },
    //  {
    //    id: 2,
    //    text: "Event 2",
    //    start: "2022-10-08T09:30:00",
    //    end: "2022-10-08T11:30:00",
    //    backColor: "#6aa84f"
    //  },
    //  {
    //    id: 3,
    //    text: "Event 3",
    //    start: "2022-10-08T12:00:00",
    //    end: "2022-10-08T15:00:00",
    //    backColor: "#f1c232"
    //  },
    //  {
    //    id: 4,
    //    text: "Event 4",
    //    start: "2022-10-06T11:30:00",
    //    end: "2022-10-06T14:30:00",
    //    backColor: "#cc4125"
    //  },
    //];

    const startDate = window.moment(new Date()).format("YYYY-MM-DD");

    this.calendar.update({ startDate, events });

  }


  render() {
    return (
      <div style={styles.wrap} className="mt-5 mb-5">
        <div style={styles.left}>
          <DayPilotNavigator
            selectMode={this.props.viewType === "Monthly" ? "month" : "week"}
            showMonths={1}
            skipMonths={1}
            startDate={this.props.viewType === "Monthly" ? window.moment(new Date()).startOf("month").format("YYYY-MM-DD") : window.moment(new Date()).format("YYYY-MM-DD")}
            selectionDay={window.moment(new Date()).format("YYYY-MM-DD")}

            onTimeRangeSelected={args => {
              this.calendar.update({
                startDate: args.day
              });
            }}
          />
        </div>

        <div style={styles.main}>

          {this.props.viewType === "Weekly" ? <DayPilotCalendar
            {...this.state}
            ref={this.calendarRef}
          /> :
            <DayPilotMonth
              {...this.state}
              ref={this.calendarRef}
            />}

        </div>
      </div>
    );
  }
}

export default Calendar;
