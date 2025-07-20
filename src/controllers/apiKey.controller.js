import { asyncHandler } from "../utils/async-handler.util";

const generateKey = asyncHandler(async (req, res) => {});

const revokeKey = asyncHandler(async (req, res) => {});

const getUserKeys = asyncHandler(async (req, res) => {});

export { generateKey, getUserKeys, revokeKey };
