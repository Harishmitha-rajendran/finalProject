
{{ config(
    tags=['main', 'mart']
) }}

WITH 
stg_event AS (
    SELECT
        *
    FROM {{ ref('stg_event') }}
),

stg_registration AS (
    SELECT
        *
    FROM {{ ref('stg_registration') }}
),

userParticipation AS (
    SELECT
        r.userId,
        COUNT(e.eventName) AS num_events_attended
    FROM
        stg_registration r
    INNER JOIN
        stg_event e ON r.eventId = e.eventId
    GROUP BY
        r.userId
),

totalEvents AS (
    SELECT
        COUNT(*) AS total_events
    FROM
        stg_event
),

userParticipationPercentage AS (
    SELECT
        up.userId,
        (up.num_events_attended / te.total_events) * 100 AS participation_percentage
    FROM
        userParticipation up
    JOIN
        totalEvents te
)

SELECT * FROM userParticipationPercentage
