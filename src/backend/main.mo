import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Automatic migration with persistent actor

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

  public type ProviderType = {
    #psychologist;
    #sportsCompany;
  };

  public type ProviderApplication = {
    id : Nat;
    providerType : ProviderType;
    name : Text;
    description : Text;
    submittedAt : Time.Time;
    isApproved : Bool;
    isRejected : Bool;
  };

  public type ProviderBooking = {
    id : Nat;
    user : Principal;
    providerId : Nat;
    bookingTime : Time.Time;
    createdAt : Time.Time;
    isConfirmed : Bool;
  };

  public type ActivityLogType = {
    #sessionCreated;
    #sessionJoined;
    #sessionLeft;
    #taskCreated;
    #taskCompleted;
    #providerBooked;
  };

  public type ActivityLog = {
    id : Nat;
    user : Principal;
    activityType : ActivityLogType;
    activityTime : Time.Time;
    createdAt : Time.Time;
    relatedId : Nat;
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

  // New persistent types for v2
  let providerApplications = Map.empty<Nat, ProviderApplication>();
  let providerBookings = Map.empty<Nat, ProviderBooking>();
  let activityLogs = Map.empty<Nat, ActivityLog>();
  var nextProviderId = 0;
  var nextBookingId = 0;
  var nextLogId = 0;

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

  // Log new activity
  func logActivity(caller : Principal, activityType : ActivityLogType, relatedId : Nat) {
    let logId = nextLogId;
    nextLogId += 1;
    let newLog : ActivityLog = {
      id = logId;
      user = caller;
      activityType;
      activityTime = Time.now();
      createdAt = Time.now();
      relatedId;
    };
    activityLogs.add(logId, newLog);
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

    if (title.size() > 100) {
      Runtime.trap("Title is too long, must be under 100 characters");
    };

    if (maxParticipants > 500) {
      Runtime.trap("Maximum participants cannot exceed 500");
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

    logActivity(caller, #sessionCreated, sessionId);

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

        logActivity(caller, #sessionJoined, sessionId);
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

        logActivity(caller, #sessionLeft, sessionId);
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

  public shared ({ caller }) func updateSession(
    sessionId : Nat,
    title : ?Text,
    description : ?Text,
    dateTime : ?Int,
    maxParticipants : ?Nat,
    spaceName : ?Text,
    location : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sessions");
    };
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?existingSession) {
        if (existingSession.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not session owner or admin");
        };

        switch (spaceName) {
          case (?name) { sessionSpaceNames.add(sessionId, name) };
          case (null) {};
        };
        switch (location) {
          case (?loc) { sessionLocations.add(sessionId, loc) };
          case (null) {};
        };

        sessions.add(
          sessionId,
          {
            existingSession with
            title = switch (title) {
              case (null) { existingSession.title };
              case (?t) { t };
            };
            description = switch (description) {
              case (null) { existingSession.description };
              case (?d) { d };
            };
            dateTime = switch (dateTime) {
              case (null) { existingSession.dateTime };
              case (?dt) { dt };
            };
            maxParticipants = switch (maxParticipants) {
              case (null) { existingSession.maxParticipants };
              case (?mp) { mp };
            };
          },
        );
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

        logActivity(caller, #taskCreated, taskId);

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

        logActivity(caller, #taskCompleted, taskId);
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

  public query ({ caller }) func getTasksForUser(user : Principal) : async [Task] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tasks");
    };

    tasks.values().filter(
      func(t) {
        switch (t.assignedTo) {
          case (?assignedTo) { assignedTo == user };
          case (null) { false };
        };
      }
    ).toArray().sort();
  };

  public type AdminStats = {
    totalSessions : Nat;
    totalUsers : Nat;
    totalTasks : Nat;
    completedTasks : Nat;
    sessionsByType : [(Text, Nat)];
    totalBookings : Nat;
    totalProviders : Nat;
    approvedProviders : Nat;
    rejectedProviders : Nat;
    pendingProviders : Nat;
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

    let allProviders = providerApplications.values().toArray();
    let approvedCount = allProviders.values().filter(func(p) { p.isApproved }).toArray().size();
    let rejectedCount = allProviders.values().filter(func(p) { p.isRejected }).toArray().size();
    let pendingCount = allProviders.values().filter(func(p) { not p.isApproved and not p.isRejected }).toArray().size();

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
      totalBookings = providerBookings.size();
      totalProviders = allProviders.size();
      approvedProviders = approvedCount;
      rejectedProviders = rejectedCount;
      pendingProviders = pendingCount;
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

  // New Provider-related functions
  public shared ({ caller }) func submitProviderApplication(
    providerType : ProviderType,
    name : Text,
    description : Text,
  ) : async Nat {
    // No auth required - anyone including guests can submit provider applications
    let providerId = nextProviderId;
    nextProviderId += 1;
    let newProvider : ProviderApplication = {
      id = providerId;
      providerType;
      name;
      description;
      submittedAt = Time.now();
      isApproved = false;
      isRejected = false;
    };
    providerApplications.add(providerId, newProvider);
    providerId;
  };

  public query ({ caller }) func getProvider(providerId : Nat) : async ProviderApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view provider details");
    };

    switch (providerApplications.get(providerId)) {
      case (null) { Runtime.trap("Provider does not exist") };
      case (?p) { p };
    };
  };

  public query ({ caller }) func getAllProviders() : async [ProviderApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view providers");
    };

    // Non-admins can only see approved providers
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return providerApplications.values().filter(
        func(p) { p.isApproved }
      ).toArray();
    };

    // Admins can see all providers
    providerApplications.values().toArray();
  };

  public query ({ caller }) func getApprovedProviders() : async [ProviderApplication] {
    // Public endpoint - no auth required, only shows approved providers
    providerApplications.values().filter(
      func(p) { p.isApproved }
    ).toArray();
  };

  public query ({ caller }) func getPendingProviders() : async [ProviderApplication] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending providers");
    };
    providerApplications.values().filter(
      func(p) { not p.isApproved and not p.isRejected }
    ).toArray();
  };

  public shared ({ caller }) func approveProvider(providerId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve providers");
    };

    switch (providerApplications.get(providerId)) {
      case (null) { Runtime.trap("Provider not found") };
      case (?provider) {
        if (provider.isApproved) {
          Runtime.trap("Provider is already approved");
        };
        if (provider.isRejected) {
          Runtime.trap("Provider is already rejected");
        };
        providerApplications.add(providerId, {
          provider with
          isApproved = true;
        });
      };
    };
  };

  public shared ({ caller }) func rejectProvider(providerId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject providers");
    };

    switch (providerApplications.get(providerId)) {
      case (null) { Runtime.trap("Provider not found") };
      case (?provider) {
        if (provider.isRejected) {
          Runtime.trap("Provider is already rejected");
        };
        if (provider.isApproved) {
          Runtime.trap("Provider is already approved");
        };
        providerApplications.add(providerId, {
          provider with
          isRejected = true;
        });
      };
    };
  };

  public shared ({ caller }) func bookProvider(
    providerId : Nat,
    bookingTime : Time.Time,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book providers");
    };

    switch (providerApplications.get(providerId)) {
      case (null) { Runtime.trap("Provider does not exist") };
      case (?provider) {
        if (not provider.isApproved) {
          Runtime.trap("Cannot book a provider that is not approved");
        };
      };
    };

    let bookingId = nextBookingId;
    nextBookingId += 1;
    let newBooking : ProviderBooking = {
      id = bookingId;
      user = caller;
      providerId;
      bookingTime;
      createdAt = Time.now();
      isConfirmed = true;
    };
    providerBookings.add(bookingId, newBooking);

    logActivity(caller, #providerBooked, bookingId);

    bookingId;
  };

  public query ({ caller }) func getBooking(bookingId : Nat) : async ProviderBooking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };

    switch (providerBookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?b) {
        // Users can only view their own bookings, admins can view all
        if (b.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        b;
      };
    };
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel bookings");
    };

    switch (providerBookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?existingBooking) {
        if (existingBooking.user != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Cannot cancel someone else's booking unless you are admin");
        };
        providerBookings.remove(bookingId);
      };
    };
  };

  public query ({ caller }) func getBookingsForUser(user : Principal) : async [ProviderBooking] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view someone else's bookings unless you are admin");
    };

    providerBookings.values().filter(
      func(b) { b.user == user }
    ).toArray();
  };

  public query ({ caller }) func getBookingsForProvider(providerId : Nat) : async [ProviderBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view provider bookings");
    };

    providerBookings.values().filter(
      func(b) { b.providerId == providerId }
    ).toArray();
  };

  public query ({ caller }) func getAllBookings() : async [ProviderBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    providerBookings.values().toArray();
  };

  public query ({ caller }) func getAllActivityLogs() : async [ActivityLog] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all activity logs");
    };
    activityLogs.values().toArray();
  };

  public query ({ caller }) func getActivityLogsForUser(user : Principal) : async [ActivityLog] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view someone else's logs unless you are admin");
    };

    activityLogs.values().filter(
      func(log) { log.user == user }
    ).toArray();
  };
};

