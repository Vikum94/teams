import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  createProject,
  updateProject,
  deleteProject
} from "../../../../actions/projectsActions";
import {
  createTask,
  deleteTask,
  updateTask
} from "../../../../actions/taskActions";

import moment from "moment";

import "./Modal.scss";

class Modal extends Component {
  state = {
    projectName: "",
    members: [{ name: "", email: "" }],
    startDate: "",
    endDate: "",
    fee: "",
    hoursPerDay: "",
    taskName: "",
    assignee: "",
    paymentDate: "",
    // dayDue: "",
    taskId: ""
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit) {
      this.setState({
        projectName: nextProps.name,
        members: nextProps.members,
        fee: nextProps.fee,
        startDate: nextProps.startDate,
        endDate: nextProps.endDate
      });
    } else if (nextProps.editTask) {
      this.setState({
        taskName: nextProps.taskName,
        paymentDate: nextProps.paymentDate,
        assignee: nextProps.assignee
      });
    }
  }

  onChange = e => {
    if (["name", "email"].includes(e.target.name)) {
      let members = [...this.state.members];
      members[e.target.dataset.id][e.target.name] = e.target.value;
      this.setState({ members });
    } else {
      this.setState({ [e.target.id]: e.target.value });
      console.log('date', e.target.id, e.target.value)
    }
  };

  addMember = e => {
    this.setState(prevState => ({
      members: [...prevState.members, { name: "", email: "" }]
    }));
  };

  deleteMember = index => {
    let array = [...this.state.members];
    array.splice(index, 1);
    this.setState({ members: array });
  };

  createProject = () => {
    let project = {
      projectName: this.state.projectName,
      members: this.state.members,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      hoursPerDay: this.state.hoursPerDay,
      fee: this.state.fee
    };

    this.props.createProject(project);
    this.onClose();
  };

  updateProject = async id => {
    let project = {
      id: this.props.id,
      projectName: this.state.projectName,
      members: this.state.members,
      fee: this.state.fee,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    await this.props.updateProject(project);

    this.onClose();
    window.location.reload();
  };

  deleteProject = id => {
    this.props.deleteProject(id, this.props.history);
    this.onClose();
  };

  deleteTask = id => {
    this.props.deleteTask(id);
    this.onClose();
  };

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      projectName: "",
      taskName: "",
      assignee: "",
      paymentDate: "",
      // dayDue: "",
      members: [{ name: "", email: "" }]
    });
  };

  onSelectChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createTask = e => {
    e.preventDefault();

    // let fullDate =
    //   this.state.monthDue +
    //   "-" +
    //   this.state.dayDue +
    //   "-" +
    //   Date().split(" ")[3];

    // let momentDate = moment(fullDate, "MM-DD-YYYY")
    //   ._d.toString()
    //   .split(" ");

    // let finalDate = momentDate[1] + " " + momentDate[2];

    const data = {
      project: this.props.projects.project._id,
      taskName: this.state.taskName,
      assignee: this.state.assignee,
      paymentDate: this.state.paymentDate
    };

    this.props.createTask(data);

    this.onClose();
  };

  updateTask = id => {
    // let finalDate = '';
    // if /*(!this.state.paym && !this.state.dayDue)*/ (!this.state.paymentDate) {
    //   finalDate = this.props.paymentDate;
    // } else finalDate = this.state.paymentDate
    let task = {
      id: id,
      taskName: this.state.taskName,
      // dateDue: finalDate,
      paymentDate: this.state.paymentDate,
      assignee: this.state.assignee || this.props.assignee
    };

    this.props.updateTask(task);

    this.onClose();
  };

  render() {
    if (!this.props.modal) {
      return null;
    }

    document.onkeyup = e => {
      if (e.keyCode === 27 && this.props.modal) {
        this.onClose();
      }
    };

    let { members } = this.state;

    // Create task modal
    if (this.props.task) {
      const { teamMembers } = this.props.projects.project;
      const { name, email } = this.props.auth.user;

      // Assignee dropdown in Modal
      // let membersOptions = teamMembers.map((member, index) => (
      //   <option key={index} value={member.email}>
      //     {member.name}
      //   </option>
      // ));

      // Due date dropdown in Modal
      // const MONTHS = new Array(12).fill(1);
      // const DAYS = new Array(31).fill(1);

      // let monthsOptions = MONTHS.map((month, i) => (
      //   <option key={i} value={i + 1}>
      //     {i < 9 && "0"}
      //     {i + 1}
      //   </option>
      // ));

      // let daysOptions = DAYS.map((day, i) => (
      //   <option key={i} value={i + 1}>
      //     {i < 9 && "0"}
      //     {i + 1}
      //   </option>
      // ));

      return (
        <form onSubmit={this.createTask} className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Create task</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Payment Reference</div>
              <input
                required
                onChange={this.onChange}
                value={this.state.taskName}
                id="taskName"
                type="text"
                placeholder={this.props.auth.user.userID + 'JAN'}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <div className="split">
              <label>
                <div className="form-label">Payee</div>
                <select
                  onChange={this.onSelectChange}
                  value={this.state.assignee}
                  id="assignee"
                  type="text"
                  className="form-input task-input-split"
                >
                  <option disabled value="">
                    Assigned to
                  </option>
                  <option value={email} selected>{name + ""}</option>
                  {/* {membersOptions} */}
                </select>
              </label>
              <label>
                {/* <div className="form-label">Payment Date</div> */}
                <div className="split">
                  <label>
                    <div className="form-date">Payment Date</div>
                    <input
                      onChange={this.onChange}
                      value={moment(this.state.paymentDate).format('YYYY-MM-DD')}
                      id="paymentDate"
                      type="date"
                      className="form-input"
                    />
                  </label>
                  {/*<
                  
                  <select
                    required={this.state.dayDue ? true : false}
                    onChange={this.onSelectChange}
                    value={this.state.monthDue}
                    id="monthDue"
                    type="text"
                    className="form-input task-input-split month-due"
                  >
                    <option disabled value="">
                      Month
                    </option>
                    {monthsOptions}
                  </select>
                  <select
                    required={this.state.monthDue ? true : false}
                    onChange={this.onSelectChange}
                    value={this.state.dayDue}
                    id="dayDue"
                    type="text"
                    className="form-input task-input-split"
                  >
                    <option disabled value="">
                      Day
                    </option>
                    {daysOptions}
                  </select>
                  */}
                </div>
              </label>
            </div>
          </div>
          <div>
            <button className="main-btn update-project" type="submit">
              Create Task
            </button>
          </div>
        </form>
      );
    }

    // Edit Task Modal
    else if (this.props.editTask) {
      const { teamMembers } = this.props.projects.project;
      const { name, email } = this.props.auth.user;

      const { assignee, paymentDate, taskId } = this.props;
      let assigneeName;

      // let assignedMonth = moment(dateDue).month() + 1;
      // let assignedDay = dateDue.split(" ")[1];

      // Find name from email
      teamMembers.forEach(member => {
        if (member.email === assignee) {
          assigneeName = member.name;
        } else if (assignee) {
          assigneeName = name + "";
        }
      });

      // Assignee dropdown in Modal
      let membersOptions = teamMembers.map((member, index) => {
        if (member.name !== assigneeName) {
          return (
            <option key={member._id} value={member.email}>
              {member.name}
            </option>
          );
        }
        return null;
      });

      // Due date dropdown in Modal
      // const MONTHS = new Array(12).fill(1);
      // const DAYS = new Array(31).fill(1);

      // let monthsOptions = MONTHS.map((month, i) => {
      //   return (
      //     <option key={i} value={i + 1}>
      //       {i < 9 && "0"}
      //       {i + 1}
      //     </option>
      //   );
      // });

      // let daysOptions = DAYS.map((day, i) => (
      //   <option key={i} value={i + 1}>
      //     {i < 9 && "0"}
      //     {i + 1}
      //   </option>
      // ));

      return (
        <form className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Edit task</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Task Name (required)</div>
              <input
                required
                onChange={this.onChange}
                value={this.state.taskName}
                id="taskName"
                type="text"
                placeholder={"What is the task?"}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <div className="split">
              <label>
                <div className="form-label">Payee</div>
                <select
                  onChange={this.onSelectChange}
                  value={this.state.assignee}
                  id="assignee"
                  type="text"
                  className="form-input task-input-split"
                >
                  {!assignee && (
                    <option disabled value="">
                      Assign to
                    </option>
                  )}
                  {assignee && <option value={assignee}>{assigneeName}</option>}
                  {assigneeName !== name + "" && (
                    <option value={email}>{name + ""}</option>
                  )}
                  {/* {membersOptions} */}
                </select>
              </label>
              <label>
                <div className="split">
                  <label>
                    <div className="form-date">Payment Date</div>
                    <input
                      onChange={this.onChange}
                      value={moment(this.state.paymentDate).format('YYYY-MM-DD')}
                      id="paymentDate"
                      type="date"
                      className="form-input"
                    />
                  </label>
                  {/*<select
                    required={this.state.dayDue ? true : false}
                    onChange={this.onSelectChange}
                    value={
                      this.state.monthDue || parseInt(assignedMonth).toString()
                    }
                    id="monthDue"
                    type="text"
                    className="form-input task-input-split month-due"
                  >
                    {!dateDue && (
                      <option disabled value="">
                        Month
                      </option>
                    )}
                    {monthsOptions}
                  </select>
                  <select
                    required={this.state.monthDue ? true : false}
                    onChange={this.onSelectChange}
                    value={
                      this.state.dayDue || parseInt(assignedDay).toString()
                    }
                    id="dayDue"
                    type="text"
                    className="form-input task-input-split"
                  >
                    {!dateDue && (
                      <option disabled value="">
                        Day
                      </option>
                    )}
                    {daysOptions}
                    </select>*/}
                </div>
              </label>
            </div>
          </div>
          <div>
            <button
              className="main-btn update-project"
              type="button"
              onClick={this.updateTask.bind(this, taskId)}
            >
              Update Task
            </button>
            <button
              className="main-btn delete-project"
              onClick={this.deleteTask.bind(this, taskId)}
            >
              Delete Task
            </button>
          </div>
        </form>
      );
    }

    // Edit project modal
    else if (this.props.edit) {
      return (
        <div className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Edit Class Info</h1>
          <p className="created-by">
            Created by {this.props.owner.name} ({this.props.owner.email})
          </p>
          <div className="form-group">
            <label>
              <div className="form-label">Class Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder={"Class Name"}
                className="form-input"
              />
            </label>
          </div>
          <div className="split">
            <label>
              <div className="form-date">Start Date</div>
              <input
                onChange={this.onChange}
                value={moment(this.state.startDate).format('YYYY-MM-DD')}
                id="startDate"
                type="date"
                className="form-input"
              />
            </label>
            <label style={{ display: "inline-block" }} className="split-email">
              <div className="form-date">End Date</div>
              <input
                onChange={this.onChange}
                value={moment(this.state.endDate).format('YYYY-MM-DD')}
                id="endDate"
                type="date"
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>
              <div className="form-label">Class fee</div>
              <span>Rs. </span>
              <input
                onChange={this.onChange}
                value={this.state.fee}
                id="fee"
                type="text"
                placeholder="400"
                className="form-input"
              />
            </label>
          </div>
          <div className="form-label">Add team members (optional)</div>
          <button className="main-btn add-members" onClick={this.addMember}>
            Add another member
          </button>
          <div className="members-edit">
            {members.map((val, id) => {
              let memberId = `member-${id}`,
                emailId = `email-${id}`;
              return (
                <div className="split" key={id}>
                  <label className="form-label" htmlFor={memberId}>
                    Name (required for teams)
                    <input
                      type="text"
                      name="name"
                      data-id={id}
                      id={memberId}
                      value={members[id].name}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <label className="form-label split-email" htmlFor={emailId}>
                    Email (required for teams)
                    <input
                      type="text"
                      name="email"
                      data-id={id}
                      id={emailId}
                      value={members[id].email}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <span
                    className="delete"
                    onClick={this.deleteMember.bind(this, id)}
                  >
                    REMOVE
                  </span>
                </div>
              );
            })}
          </div>
          <div className="split">
            <button
              className="main-btn update-project"
              onClick={this.updateProject.bind(this, this.props.id)}
            >
              Update Project
            </button>
            {this.props.owner.id === this.props.auth.user.id ? (
              <button
                className="main-btn delete-project split-email"
                onClick={this.deleteProject.bind(this, this.props.id)}
              >
                Delete Project
              </button>
            ) : null}
          </div>
        </div>
      );
    }

    // Create project modal
    else
      return (
        <div className="modal">
          <span className="close-modal" onClick={this.onClose}>
            &times;
          </span>
          <h1 className="header">Create a class</h1>
          <div className="form-group">
            <label>
              <div className="form-label">Class Name (required)</div>
              <input
                onChange={this.onChange}
                value={this.state.projectName}
                id="projectName"
                type="text"
                placeholder="Mathematics class - May"
                className="form-input"
              />
            </label>
          </div>
          <div className="split">
            <label>
              <div className="form-date">Start Date</div>
              <input
                onChange={this.onChange}
                value={this.state.startDate}
                id="startDate"
                type="date"
                placeholder={Date.now.toString()}
                className="form-input"
              />
            </label>
            <label style={{ display: "inline-block" }} className="split-email">
              <div className="form-date">End Date</div>
              <input
                onChange={this.onChange}
                value={this.state.endDate}
                id="endDate"
                type="date"
                placeholder={Date.now.toString()}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>
              <div className="form-label">Class fee</div>
              <span>Rs. </span>
              <input
                onChange={this.onChange}
                value={this.state.fee}
                id="fee"
                type="text"
                placeholder="400"
                className="form-input"
              />
            </label>
          </div>
          <div className="form-label">Add team members (optional)</div>
          <button className="main-btn add-members" onClick={this.addMember}>
            Add another member
          </button>
          <div className="members">
            {members.map((val, id) => {
              let memberId = `member-${id}`,
                emailId = `email-${id}`;
              return (
                <div className="split" key={id}>
                  <label className="form-label" htmlFor={memberId}>
                    Name (required for teams)
                    <input
                      type="text"
                      name="name"
                      data-id={id}
                      id={memberId}
                      value={members[id].name}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <label className="form-label split-email" htmlFor={emailId}>
                    Email (required for teams)
                    <input
                      type="text"
                      name="email"
                      data-id={id}
                      id={emailId}
                      value={members[id].email}
                      className="form-input"
                      onChange={this.onChange}
                    />
                  </label>
                  <span
                    className="delete"
                    onClick={this.deleteMember.bind(this, id)}
                  >
                    REMOVE
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            <button
              className="main-btn create-project"
              onClick={this.createProject}
            >
              Create Project
            </button>
          </div>
        </div>
      );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects,
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  {
    createProject,
    updateProject,
    deleteProject,
    createTask,
    deleteTask,
    updateTask
  }
)(withRouter(Modal));
