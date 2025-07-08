import { createAction } from "@reduxjs/toolkit";

export const fetchUser = createAction<{
    id: string
}>("users/fetchUser");