import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getTeam,
  getSquad,
} from 'selectors';
import {
  fetchTeam,
  fetchSquad,
} from 'actions';

import AppPage from 'components/AppPage';
import AppPageHeader from 'components/AppPageHeader';
import AppPageTitle from 'components/AppPageTitle';
import AppPageContent from 'components/AppPageContent';
import SquadTable from 'components/SquadTable';

class TeamPage extends Component {
  static propTypes = {
    fetchTeam: PropTypes.func.isRequired,
    fetchSquad: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    teamInfo: PropTypes.shape({
      name: PropTypes.string,
    }),
    teamSquad: PropTypes.shape({
      players: PropTypes.arrayOf(PropTypes.object),
    }),
  }

  static defaultProps = {
    teamInfo: {},
    teamSquad: {},
  }

  componentDidMount() {
    this.props.fetchTeam(this.props.id);
    this.props.fetchSquad(this.props.id);
  }

  render() {
    const {
      teamInfo: {
        name = '',
      },
      teamSquad: {
        players = [],
      },
    } = this.props;

    return (
      <AppPage
        title={name}
        className="TeamPage"
      >
        <AppPageHeader>
          <AppPageTitle>
            {name}
          </AppPageTitle>
        </AppPageHeader>

        <AppPageContent>
          <SquadTable players={players} />
        </AppPageContent>
      </AppPage>
    );
  }
}

const mapStateToProps = (state, {
  match: {
    params: {
      id,
    },
  },
}) => ({
  id: parseInt(id, 10),
  teamInfo: getTeam(state, id),
  teamSquad: getSquad(state, id),
});

const actions = {
  fetchTeam,
  fetchSquad,
};

export default connect(mapStateToProps, actions)(TeamPage);
