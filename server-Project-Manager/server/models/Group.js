class Group {
  constructor(title, description, members, endDate) {
    this.title = title;
    this.description = description;
    this.members = members;
    this.startDate = Date.now();
    this.endDate = endDate;
    this.meetingsDone = [];
    this.meetingsPlanned = [];
  }

  addMember(member) {
    this.members.push(member);
  }
}

module.exports.Group = Group;
