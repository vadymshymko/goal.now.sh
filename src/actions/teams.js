import { teams as types } from 'types';
import { callApi } from 'utils';
import { getTeam } from 'selectors';

export const fetchTeamRequest = id => ({
  type: types.FETCH_TEAM_REQUEST,
  payload: {
    id,
  },
});

export const fetchTeamSuccess = payload => ({
  type: types.FETCH_TEAM_SUCCESS,
  payload,
});

export const fetchTeamFailure = id => ({
  type: types.FETCH_TEAM_FAILURE,
  payload: {
    id,
  },
});

export const fetchTeam = teamId => (dispatch, getState) => {
  if (!teamId) {
    throw new Error('Invalid team id');
  }

  const currentState = getTeam(getState(), teamId);

  if (currentState && (currentState.isInitialized || currentState.isFetching)) {
    return Promise.resolve();
  }

  dispatch(fetchTeamRequest(teamId));

  return callApi(`teams/${teamId}`).then((json) => {
    dispatch(fetchTeamSuccess({
      ...json,
      crestUrl: (json.crestUrl || '').replace('http://', 'https://'),
    }));
  }).catch((error) => {
    dispatch(fetchTeamFailure(teamId));
    throw error;
  });
};

export default fetchTeam;
