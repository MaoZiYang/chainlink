import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Title from 'components/Title'
import Button from '@material-ui/core/Button'
import {
  fetchJobs,
  fetchAccountBalance,
  fetchRecentlyCreatedJobs
} from 'actions'
import jobsSelector from 'selectors/jobs'
import recentlyCreatedJobsSelector from 'selectors/recentlyCreatedJobs'
import ReactStaticLinkComponent from 'components/ReactStaticLinkComponent'
import JobList from 'components/JobList'
import TokenBalance from 'components/TokenBalance'
import RecentlyCreatedJobs from 'components/Jobs/RecentlyCreated'
import Footer from 'components/Footer'
import matchRouteAndMapDispatchToProps from 'utils/matchRouteAndMapDispatchToProps'

const styles = theme => ({
  index: {
    paddingBottom: theme.spacing.unit * 5
  }
})

export class Index extends Component {
  componentDidMount () {
    const {props} = this
    props.fetchAccountBalance()
    props.fetchRecentlyCreatedJobs(props.recentlyCreatedPageSize)
  }

  render () {
    const {props} = this
    return (
      <div className={this.props.classes.index}>
        <Grid container alignItems='center' >
          <Grid item xs={9}>
            <Title>Jobs</Title>
          </Grid>
          <Grid item xs={3}>
            <Grid container justify='flex-end' >
              <Grid item>
                <Button variant='outlined' color='primary' component={ReactStaticLinkComponent} to={'/jobs/new'}>
                  New Job
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={40}>
          <Grid item xs={9}>
            <JobList
              jobs={props.jobs}
              jobCount={props.jobCount}
              pageSize={props.pageSize}
              error={props.jobsError}
              fetchJobs={props.fetchJobs}
              history={props.history}
              match={props.match}
            />
          </Grid>
          <Grid item xs={3}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TokenBalance
                  title='Link Balance'
                  value={props.linkBalance}
                  error={props.accountBalanceError}
                />
              </Grid>
              <Grid item xs={12}>
                <TokenBalance
                  title='Ether Balance'
                  value={props.ethBalance}
                  error={props.accountBalanceError}
                />
              </Grid>
              <Grid item xs={12}>
                <RecentlyCreatedJobs jobs={props.recentlyCreatedJobs} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Footer />
      </div>
    )
  }
}

Index.propTypes = {
  ethBalance: PropTypes.string,
  linkBalance: PropTypes.string,
  accountBalanceError: PropTypes.string,
  jobCount: PropTypes.number.isRequired,
  jobs: PropTypes.array.isRequired,
  recentlyCreatedJobs: PropTypes.array,
  jobsError: PropTypes.string,
  pageSize: PropTypes.number,
  recentlyCreatedPageSize: PropTypes.number
}

Index.defaultProps = {
  pageSize: 10,
  recentlyCreatedPageSize: 2
}

const mapStateToProps = state => {
  let accountBalanceError
  if (state.accountBalance.networkError) {
    accountBalanceError = 'error fetching balance'
  }
  let jobsError
  if (state.jobs.networkError) {
    jobsError = 'There was an error fetching the jobs. Please reload the page.'
  }

  return {
    ethBalance: state.accountBalance.eth,
    linkBalance: state.accountBalance.link,
    accountBalanceError: accountBalanceError,
    jobCount: state.jobs.count,
    jobs: jobsSelector(state),
    recentlyCreatedJobs: recentlyCreatedJobsSelector(state),
    jobsError: jobsError
  }
}

export const ConnectedIndex = connect(
  mapStateToProps,
  matchRouteAndMapDispatchToProps({fetchAccountBalance, fetchJobs, fetchRecentlyCreatedJobs})
)(Index)

export default withStyles(styles)(ConnectedIndex)
