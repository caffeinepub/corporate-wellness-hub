import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    title: string;
    assignedTo?: Principal;
    createdAt: Time;
    completed: boolean;
    description: string;
    sessionId: bigint;
}
export interface Session {
    id: bigint;
    title: string;
    creator: Principal;
    participants: Array<Principal>;
    createdAt: Time;
    description: string;
    maxParticipants: bigint;
    programType: ProgramType;
    dateTime: bigint;
    spaceName?: string;
    location?: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface AdminStats {
    totalSessions: bigint;
    totalUsers: bigint;
    totalTasks: bigint;
    completedTasks: bigint;
    sessionsByType: Array<[string, bigint]>;
}
export interface UserProfileEntry {
    principal: Principal;
    name: string;
    sessionsCreated: bigint;
    sessionsJoined: bigint;
}
export enum ProgramType {
    boxCricket = "boxCricket",
    socialGathering = "socialGathering",
    exercise = "exercise",
    pickleball = "pickleball",
    taskAllocation = "taskAllocation",
    tennis = "tennis",
    badminton = "badminton",
    meetup = "meetup"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSession(title: string, description: string, programType: ProgramType, dateTime: bigint, maxParticipants: bigint, spaceName: string | null, location: string | null): Promise<bigint>;
    createTask(sessionId: bigint, title: string, description: string, assignedTo: Principal | null): Promise<bigint>;
    deleteSession(sessionId: bigint): Promise<void>;
    getAllSessions(): Promise<Array<Session>>;
    getAllTasks(): Promise<Array<Task>>;
    getAdminStats(): Promise<AdminStats>;
    getAllUserProfiles(): Promise<Array<UserProfileEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMySessions(): Promise<[Array<Session>, Array<Session>]>;
    getSession(sessionId: bigint): Promise<Session>;
    getSessionsByProgramType(programType: ProgramType): Promise<Array<Session>>;
    getTask(taskId: bigint): Promise<Task>;
    getTasksBySession(sessionId: bigint): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinSession(sessionId: bigint): Promise<void>;
    leaveSession(sessionId: bigint): Promise<void>;
    markTaskComplete(taskId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
