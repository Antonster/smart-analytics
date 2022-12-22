import { api } from 'src/api';

export const getAllUserData = async (userId, userToken) => {
  const result = await api.get(`/users/${userId}/all_data`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: userToken,
    },
  });

  return result;
};

export const createDatasource = async (userId, userToken, formData) => {
  const result = await api.post(`/users/${userId}/datasources/`, formData, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: userToken,
    },
  });

  return result;
};

export const updateDatasource = async (userId, userToken, datasourceId, formData) => {
  const result = await api.patch(`/users/${userId}/datasources/${datasourceId}`, formData, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: userToken,
    },
  });

  return result;
};

export const deleteDatasource = async (userId, userToken, datasourceId) => {
  const result = await api.delete(`/users/${userId}/datasources/${datasourceId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: userToken,
    },
  });

  return result;
};

export const getQuestionData = async (userId, userToken, datasourceId, questionId, formData) => {
  const result = await api.post(
    `https://human-software.herokuapp.com/users/${userId}/datasources/${datasourceId}/questions/${questionId}/fetch_data`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userToken,
      },
    },
  );

  return result;
};

export const createQuestion = async (userId, userToken, datasourceId, formData) => {
  const result = await api.post(
    `/users/${userId}/datasources/${datasourceId}/questions/`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userToken,
      },
    },
  );

  return result;
};

export const updateQuestion = async (userId, userToken, datasourceId, questionId, formData) => {
  const result = await api.patch(
    `/users/${userId}/datasources/${datasourceId}/questions/${questionId}`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userToken,
      },
    },
  );

  return result;
};

export const deleteQuestion = async (userId, userToken, datasourceId, questionId) => {
  const result = await api.delete(
    `/users/${userId}/datasources/${datasourceId}/questions/${questionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userToken,
      },
    },
  );

  return result;
};
