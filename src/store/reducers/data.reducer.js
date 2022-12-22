import { createSlice } from '@reduxjs/toolkit';

import { dataActions } from '../actions';

const { reducer } = createSlice({
  name: 'data',
  initialState: {
    datasourceList: undefined,
    activeDatasource: undefined,
    questionList: undefined,
    activeQuestionData: undefined,
    error: undefined,
    waiter: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(dataActions.getAllUserData.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.getAllUserData.fulfilled, (state, action) => {
        state.waiter = false;
        state.datasourceList = action.payload.datasources;
        state.questionList = action.payload.questions;
      })
      .addCase(dataActions.getAllUserData.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.createDatasource.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.createDatasource.fulfilled, (state, action) => {
        state.waiter = false;
        state.datasourceList = [...state.datasourceList, action.payload];
      })
      .addCase(dataActions.createDatasource.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.updateDatasource.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.updateDatasource.fulfilled, (state, action) => {
        state.waiter = false;
        state.datasourceList = state.datasourceList.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        });
      })
      .addCase(dataActions.updateDatasource.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.deleteDatasource.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.deleteDatasource.fulfilled, (state, action) => {
        state.waiter = false;
        state.datasourceList = state.datasourceList.filter((item) => item.id !== action.payload);
      })
      .addCase(dataActions.deleteDatasource.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder.addCase(dataActions.setActiveDatasource, (state, action) => {
      state.activeDatasource = state.datasourceList?.find((item) => item.id === action.payload);
    });

    builder
      .addCase(dataActions.getQuestionData.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.getQuestionData.fulfilled, (state, action) => {
        state.waiter = false;
        state.activeQuestionData = action.payload;
      })
      .addCase(dataActions.getQuestionData.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.createQuestion.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.createQuestion.fulfilled, (state, action) => {
        state.waiter = false;
        state.questionList = state?.questionList
          ? [...state.questionList, action.payload]
          : [action.payload];
      })
      .addCase(dataActions.createQuestion.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.updateQuestion.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.updateQuestion.fulfilled, (state, action) => {
        state.waiter = false;
        state.questionList = state.questionList.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        });
      })
      .addCase(dataActions.updateQuestion.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder
      .addCase(dataActions.deleteQuestion.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(dataActions.deleteQuestion.fulfilled, (state, action) => {
        state.waiter = false;
        state.questionList = state.questionList.filter((item) => item.id !== action.payload);
      })
      .addCase(dataActions.deleteQuestion.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error;
      });

    builder.addCase(dataActions.setQuestionData, (state, action) => {
      state.activeQuestionData = action.payload;
    });
  },
});

export default reducer;
