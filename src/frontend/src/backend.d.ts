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
}
export type Time = bigint;
export enum ProgramType {
    socialGathering = "socialGathering",
    exercise = "exercise",
    taskAllocation = "taskAllocation",
    meetup = "meetup"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSession(title: string, description: string, programType: ProgramType, dateTime: bigint, maxParticipants: bigint): Promise<bigint>;
    createTask(sessionId: bigint, title: string, description: string, assignedTo: Principal | null): Promise<bigint>;
    deleteSession(sessionId: bigint): Promise<void>;
    getAllSessions(): Promise<Array<Session>>;
    getAllTasks(): Promise<Array<Task>>;
    getCallerUserRole(): Promise<UserRole>;
    getMySessions(): Promise<[Array<Session>, Array<Session>]>;
    getSession(sessionId: bigint): Promise<Session>;
    getSessionsByProgramType(programType: ProgramType): Promise<Array<Session>>;
    getTask(taskId: bigint): Promise<Task>;
    getTasksBySession(sessionId: bigint): Promise<Array<Task>>;
    isCallerAdmin(): Promise<boolean>;
    joinSession(sessionId: bigint): Promise<void>;
    leaveSession(sessionId: bigint): Promise<void>;
    markTaskComplete(taskId: bigint): Promise<void>;
}
