import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { dataService } from 'src/services';

export const getAllUserData = createAsyncThunk(
  'data/get-all-user-data',
  async ({ userId, userToken }, { rejectWithValue }) => {
    try {
      const result = await dataService.getAllUserData(userId, userToken);

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createDatasource = createAsyncThunk(
  'data/create-datasource',
  async ({ userId, userToken, formData }, { rejectWithValue }) => {
    try {
      const result = await dataService.createDatasource(userId, userToken, formData);

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateDatasource = createAsyncThunk(
  'data/update-datasource',
  async ({ userId, userToken, datasourceId, formData }, { rejectWithValue }) => {
    try {
      const result = await dataService.updateDatasource(userId, userToken, datasourceId, formData);

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteDatasource = createAsyncThunk(
  'data/delete-datasource',
  async ({ userId, userToken, datasourceId }, { rejectWithValue }) => {
    try {
      await dataService.deleteDatasource(userId, userToken, datasourceId);

      return datasourceId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const setActiveDatasource = createAction('data/set-active-datasource', (datasourceId) => ({
  payload: datasourceId,
}));

export const getQuestionData = createAsyncThunk(
  'data/get-question-data',
  async ({ userId, userToken, datasourceId, questionId, formData }, { rejectWithValue }) => {
    try {
      const result = await dataService.getQuestionData(
        userId,
        userToken,
        datasourceId,
        questionId,
        formData,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createQuestion = createAsyncThunk(
  'data/create-question',
  async ({ userId, userToken, datasourceId, formData }, { rejectWithValue }) => {
    try {
      const result = await dataService.createQuestion(userId, userToken, datasourceId, formData);

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateQuestion = createAsyncThunk(
  'data/update-question',
  async ({ userId, userToken, datasourceId, questionId, formData }, { rejectWithValue }) => {
    try {
      const result = await dataService.updateQuestion(
        userId,
        userToken,
        datasourceId,
        questionId,
        formData,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteQuestion = createAsyncThunk(
  'data/delete-question',
  async ({ userId, userToken, datasourceId, questionId }, { rejectWithValue }) => {
    try {
      await dataService.deleteQuestion(userId, userToken, datasourceId, questionId);

      return questionId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const setQuestionData = createAction('data/set-question-data', (data) => ({
  payload: data,
}));
