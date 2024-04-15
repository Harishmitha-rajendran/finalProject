{{
    config(
        tags=['main', 'staging']
    )
}}

WITH stg_events AS(
    SELECT
     id AS eventId,
     eventname AS eventName,
     description,
     startDate,
     endDate,
     location,
     trainer,
     openings,
     registrations,
     status,
     nextEvent
     FROM {{source('elp', 'eventdetails1') }}
)

SELECT * FROM stg_events