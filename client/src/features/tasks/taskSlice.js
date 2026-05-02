import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

const initialState = {
  tasks: [],
  stats: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const getTasks = createAsyncThunk('tasks/getTasks', async (projectId, thunkAPI) => {
  try {
    return await taskService.getTasks(projectId);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const getDashboardStats = createAsyncThunk('tasks/getStats', async (projectId, thunkAPI) => {
  try {
    return await taskService.getDashboardStats(projectId);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, thunkAPI) => {
  try {
    return await taskService.createTask(taskData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async (data, thunkAPI) => {
  try {
    return await taskService.updateTaskStatus(data);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, thunkAPI) => {
  try {
    await taskService.deleteTask(taskId);
    return taskId;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // We add an optimistic update reducer we can call directly before the API finishes
    optimisticUpdateStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find(t => t._id === taskId);
      if (task) {
        task.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Tasks
      .addCase(getTasks.pending, (state) => { state.isLoading = true; })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Stats
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        // Find and replace the task in the array with the updated one from backend
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export const { optimisticUpdateStatus } = taskSlice.actions;
export default taskSlice.reducer;
