export type USER_ROLE = 'admin' | 'coach' | 'club';
export type CAN_SKATE_EXCELLENCE = 'Engaged' | 'Achieved' | 'Exceeded';

export interface iError extends Error {
    statusCode?: number;
}
