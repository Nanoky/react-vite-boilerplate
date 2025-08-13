import { createAction } from "@reduxjs/toolkit";

export type FetchUserPayload = {
    id: string
}
export const fetchUser = createAction<FetchUserPayload>("users/fetchUser");