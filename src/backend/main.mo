import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  type ProgramType = {
    #meetup;
    #exercise;
    #socialGathering;
    #taskAllocation;
    #boxCricket;
    #pickleball;
    #badminton;
    #tennis;
  };

  // Internal stored type — unchanged from v1 for backward compatibility
  type StoredSession = {
    id : Nat;
    creator : Principal;
    title : Text;
    description : Text;
    programType : ProgramType;
    dateTime : Int;
    maxParticipants : Nat;
    participants : [Principal];
    createdAt : Time.Time;
  };

  // Public-facing session type — includes optional new fields
  type Session = {
    id : Nat;
    creator : Principal;
    title : Text;
    description : Text;
    programType : ProgramType;
    dateTime : Int;
    maxParticipants : Nat;
    participants : [Principal];
    createdAt : Time.Time;
    spaceName : ?Text;
    location : ?Text;
  };

  type Task = {
    id : Nat;
    sessionId : Nat;
    title : Text;
    description : Text;
    assignedTo : ?Principal;
    completed : Bool;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module StoredSession {
    public func compare(a : StoredSession, b : StoredSession) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // sessions uses the OLD StoredSession type — backward compatible with existing stable data
  let sessions = Map.empty<Nat, StoredSession>();
  // New stable maps for the new optional fields — start empty, fully backward compatible
  let sessionSpaceNames = Map.empty<Nat, Text>();
  let sessionLocations = Map.empty<Nat, Text>();

  let tasks = Map.empty<Nat, Task>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextSessionId = 0;
  var nextTaskId = 0;

  // Helper: compose a full Session from stored parts
  func toSession(s : StoredSession) : Session {
    {
      id = s.id;
      creator = s.creator;
      title = s.title;
      description = s.description;
      programType = s.programType;
      dateTime = s.dateTime;
      maxParticipants = s.maxParticipants;
      participants = s.participants;
      createdAt = s.createdAt;
      spaceName = sessionSpaceNames.get(s.id);
      location = sessionLocations.get(s.id);
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Session Functions
  public shared ({ caller }) func createSession(
    title : Text,
    description : Text,
    programType : ProgramType,
    dateTime : Int,
    maxParticipants : Nat,
    spaceName : ?Text,
    location : ?Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    let newSession : StoredSession = {
      id = sessionId;
      creator = caller;
      title;
      description;
      programType;
      dateTime;
      maxParticipants;
      participants = [caller];
      createdAt = Time.now();
    };

    sessions.add(sessionId, newSession);

    switch (spaceName) {
      case (?name) { sessionSpaceNames.add(sessionId, name) };
      case (null) {};
    };
    switch (location) {
      case (?loc) { sessionLocations.add(sessionId, loc) };
      case (null) {};
    };

    sessionId;
  };

  public shared ({ caller }) func joinSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.participants.size() >= session.maxParticipants) {
          Runtime.trap("Session is full");
        };

        if (session.participants.values().any(func(p) { p == caller })) {
          Runtime.trap("Already joined this session");
        };

        sessions.add(sessionId, {
          session with
          participants = session.participants.concat([caller])
        });
      };
    };
  };

  public shared ({ caller }) func leaveSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let participantsIter = session.participants.values().filter(func(p) { p != caller });
        let participantsArray = participantsIter.toArray();
        if (participantsArray.size() == session.participants.size()) {
          Runtime.trap("Not a participant of this session");
        };

        sessions.add(sessionId, {
          session with
          participants = participantsArray;
        });
      };
    };
  };

  public shared ({ caller }) func deleteSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.creator != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Not session owner or admin");
        };
        sessions.remove(sessionId);
        sessionSpaceNames.remove(sessionId);
        sessionLocations.remove(sessionId);
      };
    };
  };

  public query ({ caller }) func getMySessions() : async ([Session], [Session]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    let created = sessions.values().filter(
      func(s) { s.creator == caller }
    ).toArray().sort().map(toSession);

    let joined = sessions.values().filter(
      func(s) { s.participants.values().any(func(p) { p == caller }) }
    ).toArray().sort().map(toSession);

    (created, joined);
  };

  public query ({ caller }) func getSessionsByProgramType(programType : ProgramType) : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    sessions.values().filter(
      func(s) { s.programType == programType }
    ).toArray().sort().map(toSession);
  };

  public query ({ caller }) func getSession(sessionId : Nat) : async Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?s) { toSession(s) };
    };
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    sessions.values().toArray().sort().map(toSession);
  };

  // Task Functions
  public shared ({ caller }) func createTask(
    sessionId : Nat,
    title : Text,
    description : Text,
    assignedTo : ?Principal,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        switch (session.programType) {
          case (#taskAllocation) {};
          case (_) { Runtime.trap("Task can only be created under Task Allocation sessions") };
        };

        let taskId = nextTaskId;
        nextTaskId += 1;

        let newTask : Task = {
          id = taskId;
          sessionId;
          title;
          description;
          assignedTo;
          completed = false;
          createdAt = Time.now();
        };

        tasks.add(taskId, newTask);
        taskId;
      };
    };
  };

  public shared ({ caller }) func markTaskComplete(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tasks complete");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        switch (task.assignedTo) {
          case (?assignedTo) {
            if (assignedTo != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
              Runtime.trap("Unauthorized: Not task assignee or admin");
            };
          };
          case (null) {};
        };

        tasks.add(taskId, {
          task with
          completed = true;
        });
      };
    };
  };

  public query ({ caller }) func getTasksBySession(sessionId : Nat) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    tasks.values().filter(
      func(t) { t.sessionId == sessionId }
    ).toArray().sort();
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?task) { task };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    tasks.values().toArray().sort();
  };

  public type AdminStats = {
    totalSessions : Nat;
    totalUsers : Nat;
    totalTasks : Nat;
    completedTasks : Nat;
    sessionsByType : [(Text, Nat)];
  };

  public type UserProfileEntry = {
    principal : Principal;
    name : Text;
    sessionsCreated : Nat;
    sessionsJoined : Nat;
  };

  public query ({ caller }) func getAdminStats() : async AdminStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view admin stats");
    };

    let allSessions = sessions.values().toArray();
    let allTasks = tasks.values().toArray();

    let meetupCount = allSessions.values().filter(func(s) { s.programType == #meetup }).toArray().size();
    let exerciseCount = allSessions.values().filter(func(s) { s.programType == #exercise }).toArray().size();
    let socialCount = allSessions.values().filter(func(s) { s.programType == #socialGathering }).toArray().size();
    let taskCount = allSessions.values().filter(func(s) { s.programType == #taskAllocation }).toArray().size();

    {
      totalSessions = allSessions.size();
      totalUsers = accessControlState.userRoles.size();
      totalTasks = allTasks.size();
      completedTasks = allTasks.values().filter(func(t) { t.completed }).toArray().size();
      sessionsByType = [
        ("Meetup", meetupCount),
        ("Exercise", exerciseCount),
        ("Social Gathering", socialCount),
        ("Task Allocation", taskCount),
      ];
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfileEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };

    let allSessions = sessions.values().toArray();

    userProfiles.entries().map(func((p, profile)) {
      let created = allSessions.values().filter(func(s) { s.creator == p }).toArray().size();
      let joined = allSessions.values().filter(func(s) { s.participants.values().any(func(part) { part == p }) }).toArray().size();
      {
        principal = p;
        name = profile.name;
        sessionsCreated = created;
        sessionsJoined = joined;
      };
    }).toArray();
  };
};
