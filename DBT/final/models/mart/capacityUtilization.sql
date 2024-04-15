{{ config(
    tags=['main', 'mart']
) }}

WITH stg_event AS (
    SELECT
        *
    FROM {{ ref('stg_event') }}
),

event_utilization AS (
    SELECT
        eventName,
        SUM(openings) AS openings,
        SUM(registrations) AS registrations,
        CASE
            WHEN SUM(openings) > 0 THEN (SUM(registrations) / SUM(openings)) * 100
            ELSE 0
        END AS capacity_utilization_percentage
    FROM
        stg_event
    GROUP BY
        eventName
)

SELECT * FROM event_utilization
