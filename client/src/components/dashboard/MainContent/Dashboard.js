import React, { Component } from "react";
import "./MainContent.scss";
import "./Dashboard.scss";

import { connect } from "react-redux";

import Modal from "./Modal/Modal";

class Dashboard extends Component {
  state = {
    modal: false,
    edit: false,
    name: "",
    members: [],
    id: "",
    owner: {}
  };

  toggleModal = e => {
    this.setState({ modal: !this.state.modal, edit: false });
  };

  toggleEditModal = (name, members, id, owner, fee, startDate, endDate, e) => {
    e.stopPropagation();

    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      name: name,
      members: members,
      id: id,
      owner: owner,
      fee: fee,
      startDate: startDate,
      endDate: endDate
    });
  };

  render() {
    const { projects } = this.props.projects;

    let content;

    let projectData = projects.sort().map(project => (
      <div
        key={project._id}
        className="project-icon"
        onClick={() => this.props.history.push(`/projects/${project._id}`)}
      >
        <div className="project-name">{project.name}</div>
        <div
          className="project-info-button"
          onClick={this.toggleEditModal.bind(
            this,
            project.name,
            project.teamMembers,
            project._id,
            project.owner,
            project.fee,
            project.startDate,
            project.endDate
          )}
          style={{ visibility: (this.props.auth.user.userType === "admin") ? "visible" : "hidden" }}
        >
          Edit project
        </div>
        <div className="project-info-button">Go to class</div>
      </div>
    ));

    if (projects.length > 0) {
      // At least one project
      content = (
        <>
          <button
            className="main-btn" onClick={this.toggleModal}
            style = {{visibility:(this.props.auth.user.userType === "admin") ? "visible": "hidden"}}
          >
            Create another class
          </button>
          <div className="modal-wrapper">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              name={this.state.name}
              members={this.state.members}
              id={this.state.id}
              owner={this.state.owner}
              fee={this.state.fee}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
          </div>
          <div className="projects-wrapper">{projectData}</div>
        </>
      );
    } else {
      // No projects
      content = (
        <>
          <div className="projects">
            <div className="no-projects">
              <h1 className="header">You have no classes</h1>
              <button className="main-btn" onClick={this.toggleModal}>
                Create your first class
              </button>
              <div className="modal-wrapper">
                <Modal onClose={this.toggleModal} modal={this.state.modal} />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="main-content">
        <h1 className="header">Classes</h1>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);
