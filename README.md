# YSPOTTER | In the context of Assessment

Build a Full-stack app using Django and React.

Objective:

- Build an app that takes trip details as inputs and outputs route instructions and draws ELD logs as outputs
- Build an app that takes in the following inputs:

  - Current location
  - Pickup location
  - Dropoff location
  - Current Cycle Used (Hrs)

- Outputs:

  - Map showing route and information regarding stops and rests -- find and use a free map API
  - Daily Log Sheets filled out -- need to draw on the log and fill out the sheet, multiple log sheets will be needed for longer trips

- Assumptions:
  - Property-carrying driver, 70hrs/8days, no adverse driving conditions
  - Fueling at least once every 1,000 miles
  - 1 hour for pickup and drop-off

## Main challenges I had to overcome

- Configure PostGIS after install Postgresql
- Redeploy another project with now Dockerfile
