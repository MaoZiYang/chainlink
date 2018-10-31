import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-static'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Breadcrumb from 'components/Breadcrumb'
import BreadcrumbItem from 'components/BreadcrumbItem'
import Title from 'components/Title'
import PaddedCard from 'components/PaddedCard'
import Form from 'components/Jobs/Form'
import { submitJobSpec } from 'actions'
import matchRouteAndMapDispatchToProps from 'utils/matchRouteAndMapDispatchToProps'

const styles = theme => ({
  breadcrumb: {
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5
  }
})

const successNotification = ({name}) => (<>
  Successfully created <Link to={`/bridges/${name}`}>{name}</Link>
</>)

const errorNotification = ({name}) => (
  <>Error creating {name}</>
)

const New = props => (
  <>
    <Breadcrumb className={props.classes.breadcrumb}>
      <BreadcrumbItem href='/'>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>></BreadcrumbItem>
      <BreadcrumbItem href='/jobs'>Jobs</BreadcrumbItem>
      <BreadcrumbItem>></BreadcrumbItem>
      <BreadcrumbItem>New</BreadcrumbItem>
    </Breadcrumb>
    <Title>New Job</Title>

    <Grid container spacing={40}>
      <Grid item xs={12}>
        <PaddedCard>
          <Form
            actionText='Create Job'
            onSubmit={props.submitJobSpec}
            onSuccess={successNotification}
            onError={errorNotification}
            {...(props.location && props.location.state)}
          />
        </PaddedCard>
      </Grid>
    </Grid>
  </>
)

New.propTypes = {
  classes: PropTypes.object.isRequired
}

export const ConnectedNew = connect(
  null,
  matchRouteAndMapDispatchToProps({submitJobSpec})
)(New)

export default withStyles(styles)(ConnectedNew)
